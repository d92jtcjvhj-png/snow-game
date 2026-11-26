# Budget di rendering per three.js (r187) WebGL su telefoni di fascia media a 60 fps

> Note di metodo: in questa sessione la rete ha bloccato il fetch di developer.playcanvas.com, discourse.threejs.org, developer.arm.com e cdn.jsdelivr.net (ENOTFOUND). Per quelle fonti le affermazioni vengono dagli snippet di ricerca, non dalla pagina intera. raw.githubusercontent.com funzionava. Ho verificato direttamente nel sorgente three r187 in `node_modules/three` (compileAsync, multi-draw). Il punto di partenza attuale del progetto è `src/render/quality.ts`: low = DPR 1 senza ombre; medium = DPR 1,5 senza ombre; high = DPR 2 con ombre a 2048. Il frame si giudica lento sopra 20 ms per 2 s e veloce sotto 12 ms per 5 s.

## 1. Budget sicuro a 60 fps su un telefono medio (draw call, triangoli, ombre, pixel ratio)

### Takeaway
Le fonti dei produttori e dei motori concordano su queste cifre:
- **Draw call:** circa 100–200 per i telefoni bassi o medi. Arm cita ~500 come tetto per "la maggior parte dei dispositivi", ma i contenuti 3D mobile di fascia alta stanno intorno a ~100 per render target.
- **Ombre:** shadow map da 512 a 1024 su mobile, 2048 come tetto.
- **Pixel ratio:** limite a 1,5 sul telefono (2 al massimo).

Non ho trovato nessun budget ufficiale di triangoli o vertici per frame, né da Arm né da Qualcomm. Il conteggio dei triangoli va misurato sul dispositivo.

### Cited Findings
**Draw call**
- PlayCanvas indica 100–200 draw call come "rough target" per i dispositivi mobile di fascia bassa (solo snippet, host bloccato) — [PlayCanvas optimization guidelines](https://developer.playcanvas.com/user-manual/optimization/guidelines/)
- Lo staff Arm suggerisce di puntare a ~500 draw call per frame "per la maggior parte dei dispositivi mobile", e di più sui modelli di fascia alta a spese di CPU ed energia. Il costo dipende dal numero di vertici, perché ogni draw call ha un costo fisso indipendente dai vertici: meglio poche draw call grandi — [Arm forum: overhead of the driver](https://community.arm.com/support-forums/f/graphics-gaming-and-vr-forum/48848/overhead-of-the-driver); [Mali performance 5](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/mali-performance-5-an-application-s-performance-responsibilities)
- Fonte Arm: "most high-end 3D content on mobile today uses around 100 draw calls per render target"; i giochi 2D stanno intorno a 20–30 (snippet; pagina datata) — [Arm Community, Mali performance 4](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/mali-performance-4-principles-of-high-performance-rendering)
- Il documento di performance di NotBlox, un gioco multiplayer three.js open source, dà come target "<200" draw call per i web game. Ricorda che ogni mesh aggiunge una draw call per ogni luce direzionale o spot che proietta ombre, e 6 per ogni luce puntiforme con ombre — [NotBlox PERFORMANCE.md](https://raw.githubusercontent.com/iErcann/NotBlox/main/PERFORMANCE.md)

**Casi misurati**
- Visualizzazione three.js: unendo e istanziando le geometrie, le draw call sono scese da 387 a 42 e il frame rate mobile è salito da ~10 a ~30 fps (aneddoto, articolo dietro paywall) — [JavaScript in Plain English](https://javascript.plainenglish.io/how-we-optimized-our-three-js-application-to-run-on-mobile-devices-4a3bc9e572f4)
- Babylon.js su iPhone 6s Plus: 30 fps con ~760 draw call, 60 fps dopo il merge a 4 draw call — [html5gamedevs](https://www.html5gamedevs.com/topic/27656-solved-bjs-mobile-web-browser-performance/)
- Controesempio: un RPG mobile su Babylon con meno di 50 draw call restava sotto 40 fps su iPhone 6. Le draw call da sole non bastano a garantire i 60 fps — [html5gamedevs](https://www.html5gamedevs.com/topic/27656-bjs-mobile-web-browser-performance/)
- Tiki Dash, endless runner three.js: ~57 fps di media (mediana 60) su un Galaxy A41, telefono basso con Mali-G52. Ha un HUD `?hud` con fps, ms, draw call e triangoli — [three.js forum, Tiki Dash](https://discourse.threejs.org/t/tiki-dash-tropical-endless-runner/94620)
- Thread del forum three.js: 20K draw call a 60 fps su desktop. Su desktop il numero di call conta meno del lavoro per call, ma il dato non vale per i telefoni — [three.js forum](https://discourse.threejs.org/t/material-draw-calls-reducer/29211?page=2)

**Ombre**
- Le fonti non sono d'accordo sulla dimensione della shadow map. Una guida dice ≤512 su mobile e 1024–2048 su desktop. Un'altra dice "2048 o meno su mobile, mai oltre 4096". Raddoppiare `mapSize` quadruplica la memoria — [threejs-impl-shadows skill](https://skills.sh/openaec-foundation/three.js-claude-skill-package/threejs-impl-shadows); [salivity: optimizing shadow map](https://salivity.github.io/three.js/article/optimizing-three-js-shadow-map-properties)
- NotBlox raccomanda 512 di default, CSM a 2 cascate con `maxFar` 500 su mobile e 4 cascate a 2048 su desktop di fascia alta. Raccomanda anche una sola luce direzionale con ombre, `shadow.autoUpdate = false` con `needsUpdate` su richiesta per le scene statiche, ed ombre "baked" per il mondo statico — [NotBlox PERFORMANCE.md](https://raw.githubusercontent.com/iErcann/NotBlox/main/PERFORMANCE.md)
- `PCFSoftShadowMap` ha causato un calo di prestazioni su Android in portrait, che spariva con il filtro di default — [three.js forum: performance drop portrait](https://discourse.threejs.org/t/performance-drop-in-mobile-portrait-mode-android-chrome-firefox/2080)
- Adreno ha una modalità "Z-only" che scrive pixel di sola profondità a velocità doppia, come nelle shadow map — [Qualcomm Adreno vertex best practices](https://developer.qualcomm.com/sites/default/files/docs/adreno-gpu/snapdragon-game-toolkit/gdg/gpu/best_practices_vertex.html)

**Pixel ratio**
- Il pattern più comune è `setPixelRatio(Math.min(devicePixelRatio, 2))`: passare da DPR 3 a 2 taglia di oltre il 55% i pixel shadati — [salivity: limit DPR](https://salivity.github.io/three.js/article/three-js-mobile-performance-limit-device-pixel-ratio); [react-doctor rule](https://www.react.doctor/docs/rules/react-doctor/three-cap-device-pixel-ratio)
- Altre guide usano un limite di 1,5 su mobile e 2 su desktop — [threejs-graphics-optimizer skill](https://skills.sh/ovachiever/droid-tings/threejs-graphics-optimizer)
- Il limite va riapplicato a ogni resize: con lo scaling HiDPI frazionario three.js può finire a disegnare un canvas da 14400 px — [three.js forum: HiDPI fractional scaling](https://discourse.threejs.org/t/hidpi-fractional-scaling-performance-pitfalls-and-best-practices/87114)
- PlayCanvas nota che il DPR nativo dei telefoni porta a frame rate bassi per i limiti di fill-rate — [PlayCanvas runtime DPR](https://developer.playcanvas.com/user-manual/optimization/runtime-devicepixelratio/)
- Arm (SIGGRAPH 2015): "rendering at native resolution is often out of the question, especially if you add post-processing". Arm consiglia il rendering a risoluzione mista e l'upscale — [Arm SIGGRAPH 2015 slides](https://community.arm.com:443/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/siggraph2015_2D00_mmg_2D00_marius_2D00_slides.pdf)

**Ripartizione del frame**
- Una guida suddivide i 16,67 ms in ~5 ms per il render (draw call three.js) e il resto per input, fisica, logica e margine (fonte non primaria) — [threejs-graphics-optimizer skill](https://skills.sh/ovachiever/droid-tings/threejs-graphics-optimizer)
- La cifra "~0,1 ms di CPU per draw call su mobile" circola senza fonte: non è verificata — [hyperyond blog](https://hyperyond-website.pages.dev/blog/webgl-performance-optimization-2025)

### Inferences
- Per Snow Game, che ha una sola pista, un rider e pochi oggetti:
  - **draw call:** low ≤ 60, medium ≤ 120, high ≤ 200, contate *includendo* il passaggio delle ombre. Ogni caster raddoppia le sue draw call.
  - **triangoli:** low ≤ 100k, medium ≤ 250k, high ≤ 500k. Le GPU Adreno 6xx/7xx, Mali-G7x e Apple A13–A16 reggono queste cifre senza problemi se gli shader sono economici. Questa è una stima mia: nessuna fonte la conferma.
  - **ombre:** una sola luce direzionale, area stretta attorno al rider. low = nessuna ombra oppure una "blob shadow" sotto la tavola; medium = 1024 PCF; high = 2048 PCF(Soft).
- Su uno schermo 1080×2400 con DPR 3, il buffer nativo è di ~2,6 Mpx. Con DPR 1,5 scende a ~0,65 Mpx, un quarto: è la leva più forte.
- Il collo di bottiglia più probabile su mobile è il fill-rate e la banda, non la geometria. Lo indicano Arm, il tema del DPR e il caso Lambert/Standard nella sezione 2.

### Gaps
- Nessun budget ufficiale di triangoli o vertici per frame da Arm, Qualcomm o Apple: la guida Arm "GPU Best Practices" (rev 3.4) non era raggiungibile.
- Nessun benchmark diretto three.js su Adreno 6xx/7xx, Mali-G7x o iPhone 11–14 con numeri di draw call o triangoli.
- Nessun caso studio con numeri di Slow Roads, Bruno Simon o Messenger (Abeto).

## 2. Costo di MeshStandardMaterial (PBR) contro Lambert/Phong su mobile; quando usare uno shader custom

### Takeaway
L'ordine di costo è condiviso: Physical > Standard > Phong > Lambert > Basic. Su mobile, nelle scene che riempiono molto lo schermo, il salto da Standard a Lambert può valere ~2× (aneddotico). Per superfici enormi come il pendio di neve conviene un materiale economico (Lambert o shader custom). PBR va riservato a pochi oggetti piccoli, e solo nel livello high.

### Cited Findings
- Sul forum three.js l'ordine di costo indicato è MeshPhysical > MeshStandard > MeshPhong > MeshLambert > MeshBasic. Un utente riferisce che passare *un solo grande oggetto* da Standard a Lambert o Basic ha circa raddoppiato le prestazioni su mobile (aneddoto) — [three.js forum #12259](https://discourse.threejs.org/t/are-there-settings-for-shading-rate-or-shading-precision/12259)
- Da r144 MeshLambertMaterial calcola la luce per frammento e non più per vertice. È più bella e più lenta della versione vecchia, ma resta molto più economica di Standard — [three.js forum](https://discourse.threejs.org/t/spotlight-only-reflects-off-of-wall-when-the-target-wall-is-completely-within-the-lights-frustum/48861)
- Consiglio in stile maintainer: alcune GPU mobile faticano a riempire lo schermo con MeshStandardMaterial, quindi per terreni e superfici grandi conviene un materiale più economico — [three.js forum #60398](https://discourse.threejs.org/t/meshphysicalmaterial-can-i-measure-how-much-more-expensive-it-is/60398)
- Un blog del 2026 dà "Lambert ~60 fps, Standard ~30 fps" su mobile, ma senza fonte né dispositivo: va trattato come illustrativo — [hyperyond blog](https://hyperyond-website.pages.dev/blog/webgl-performance-optimization-2025)
- Qualcomm ha una sezione di best practice per gli shader Adreno (precisione, ramificazioni, ALU) — [Qualcomm Adreno shader best practices](https://developer.qualcomm.com/sites/default/files/docs/adreno-gpu/snapdragon-game-toolkit/gdg/gpu/best_practices_shaders.html)
- NotBlox: usare `MeshBasicMaterial` dove non servono ombre o luci — [NotBlox PERFORMANCE.md](https://raw.githubusercontent.com/iErcann/NotBlox/main/PERFORMANCE.md)

### Inferences
- Lo stile del progetto è low-poly cartoon con flat shading e `flat(color)`. Lambert o Phong con `flatShading` danno già quel look. PBR serve solo per riflessi speculari realistici, come la neve ghiacciata o la tavola lucida.
- **Shader custom:** conviene per la neve, cioè la superficie più grande sullo schermo. Lambert e un rim o uno specular finto ("sparkle") con rumore procedurale costano meno di Standard e danno il look "realistico stilizzato". Si fa con `onBeforeCompile` su MeshLambertMaterial, così restano luci, ombre e nebbia di three. Ogni variante di `#define` è un programma in più da precompilare (sezione 5).
- Tier proposti:
  - **low:** Lambert per tutto, niente sparkle.
  - **medium:** Lambert con lo shader neve custom.
  - **high:** shader neve custom con specular e sparkle; Standard solo su rider e tavola.

### Gaps
- Nessuna misura controllata in ms tra Standard e Lambert su Adreno, Mali o Apple.

## 3. Quali effetti di post-processing sono sostenibili, e a quale risoluzione

### Takeaway
Su GPU a tile (tutte le mobile) ogni pass a schermo intero costa un resolve e una scrittura in memoria esterna, circa ≥1 ms. Un bloom ben fatto, a mezza risoluzione o a mip, costa ~3 ms su un dispositivo di riferimento. Tone mapping e correzione colore vanno fatti *nel materiale*, cioè `renderer.toneMapping`, che è gratis rispetto a un pass. FXAA o SMAA sono un pass in più: sul telefono il DPR ≥1,5 di solito rende l'antialiasing quasi superfluo.

### Cited Findings
- Arm, caso Spellsouls (GDC 2018): il bloom custom costava circa 3 ms del frame — [Arm: post-processing effects for mobile at GDC18](https://community.arm.com/developer/tools-software/graphics/b/blog/posts/post-processing-effects-for-mobile-at-gdc18); [Arm: post-processing on mobile, optimization and alternatives](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives) (solo snippet)
- Studio del 2026 su una GPU mobile a tile (dispositivo non nominato nello snippet), tempo medio del frame: bloom a mipmap 10,29 ms, Kawase+HDR 11,49 ms, gaussiano 14,12 ms. Il bloom a mip usa 4 FBO a mezza risoluzione — [ETASR paper](https://etasr.com/index.php/ETASR/article/download/19101/6940)
- Meta: produrre una seconda immagine causa un altro resolve, che "toglie circa 1 ms" su GPU a tile come Adreno — [Meta: PC rendering techniques to avoid on mobile VR](https://developers.meta.com/horizon/blog/pc-rendering-techniques-to-avoid-when-developing-for-mobile-vr/)
- Arm SIGGRAPH 2015: la risoluzione nativa più il post sono spesso impossibili; meglio la risoluzione mista con upscale — [Arm SIGGRAPH 2015 slides](https://community.arm.com:443/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/siggraph2015_2D00_mmg_2D00_marius_2D00_slides.pdf)
- La cifra "bloom 3,2 ms a piena risoluzione contro 0,8 ms a mezza" è senza fonte e non verificata — [digitalstrategyforce](https://digitalstrategyforce.com/journal/how-do-you-add-post-processing-effects-to-a-webgl-scene/)
- I pass di EffectComposer non vengono compilati da `renderer.compile`: senza un frame di riscaldamento con i pass attivi compilano alla prima interazione — [three.js forum: heavy scene PageSpeed](https://discourse.threejs.org/t/why-a-heavy-three-js-scene-tanks-pagespeed-and-it-is-not-your-javascript/94734)

### Inferences
- Il cambio di tier su `antialias` richiede un nuovo contesto WebGL, come già scritto in `quality.ts`. Le opzioni sono due: MSAA nativo deciso all'avvio solo per il tier iniziale high, oppure FXAA come pass, attivabile al volo.
- Tier proposti:
  - **low:** nessun post. Tone mapping ACES o AgX e nebbia nel materiale.
  - **medium:** nessun post, oppure un solo pass combinato (vignetta e color grade) se serve allo stile.
  - **high:** bloom a mip (UnrealBloomPass o un bloom economico) a ½ o ¼ della risoluzione, più FXAA. Previsti ~3–4 ms complessivi.
- Ogni effetto deve dichiarare il suo livello di qualità (regola 6 del CLAUDE.md).
- Per la neve "luccicante" l'alternativa più economica al bloom è un'emissione o uno sparkle nel materiale, senza nessun pass.

### Gaps
- Nessuna misura di UnrealBloomPass o FXAA di three.js su telefoni specifici. Il blog Arm sulle alternative al post non era raggiungibile per intero.

## 4. Come strutturare i tier adattivi e cosa scalare per primo (rilevamento del dispositivo, adattamento sul frame time, thermal)

### Takeaway
L'ordine consigliato, dal più efficace al meno:
1. pixel ratio (fill-rate);
2. post-processing;
3. ombre (dimensione, poi spegnimento o "blob");
4. densità di oggetti e vegetazione e distanza di vista;
5. complessità degli shader.

Il tier iniziale si decide con il renderer string, cioè la GPU letta con `WEBGL_debug_renderer_info` o la libreria detect-gpu. Poi lo si corregge a runtime con un monitor di fps con isteresi e limite di flip-flop. Serve anche margine termico: i telefoni perdono dal 30 al 70% della GPU in 3–15 minuti.

### Cited Findings
**detect-gpu (pmndrs)**
- I tier sono 0 (WebGL assente, GPU in blocklist o <15 fps), 1 (≥15 fps), 2 (≥30 fps) e 3 (≥60 fps).
- Usa i benchmark di gfxbench.com per mobile e desktop.
- I risultati possono essere FALLBACK (renderer riconosciuto ma nessun benchmark) o BENCHMARK_FETCH_FAILED (CDN o CSP).
- Dalla 4.0 separa i dati Apple da quelli iPad e "deoffusca" i dispositivi iOS.
- Fonti: [npm detect-gpu](https://www.npmjs.com/package/detect-gpu); [detect-gpu README (unpkg)](https://unpkg.com/detect-gpu@5.0.70/README.md); [CHANGELOG](https://raw.githubusercontent.com/pmndrs/detect-gpu/HEAD/CHANGELOG.md)

**iOS Safari**
- In un profilo di terze parti su iPhone 8, `WEBGL_debug_renderer_info` è esposto con il renderer "Apple A11 GPU" (indicativo, non documentazione ufficiale) — [detect-features iPhone 8 data](https://unpkg.com/detect-features@0.1.0/data/Apple-iPhone%208-Safari.json)
- Nota: le versioni recenti di Safari restituiscono spesso solo "Apple GPU". Per questo detect-gpu usa la risoluzione dello schermo e altri euristici per distinguere i modelli. Non sono riuscito a recuperare il README completo per confermare il dettaglio (vedi Gaps).

**drei PerformanceMonitor (React)**
- È il riferimento per un monitor adattivo: misura gli fps medi su `iterations` = 10 campioni, con `threshold` 0,75, `step` 0,1 e `factor` iniziale 0,5.
- I `bounds` dipendono dal refresh: sopra 100 Hz sono [60, 100], altrimenti [40, 60].
- `flipflops` limita le oscillazioni.
- Fonti: [drei PerformanceMonitor docs](https://drei.docs.pmnd.rs/performances/performance-monitor); [sorgente (fork)](https://cdn.jsdelivr.net/npm/glodrei@0.0.2/src/core/PerformanceMonitor.tsx)
- R3F consiglia di partire bassi e salire, con un `factor` continuo invece di tier discreti — [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- `AdaptiveDpr` taglia il pixel ratio durante il "regress" (interazioni costose), e si può affiancare a un filtro "pixelated" — [drei AdaptiveDpr](https://drei.docs.pmnd.rs/performances/adaptive-dpr)
- Cambiare il pixelRatio in base agli fps è una pratica discussa e usata — [three.js forum: changing pixelRatio based on fps](https://discourse.threejs.org/t/changing-pixelratio-based-on-fps-good-or-bad-idea/34563)

**Throttling termico**
- Realme GT 8 Pro: Notebookcheck misura un throttling fino al 70% dopo ~10–15 minuti di Burnout. Android Authority lo vede scendere al 28,6% del picco in Solar Bay e al 38,9% in Wild Life — [Notebookcheck](https://www.notebookcheck.net/Top-smartphone-throttles-to-70-performance-in-test-and-it-seems-to-make-absolutely-no-difference.1240291.0.html); [Android Authority](https://androidauthority.com/realme-gt8-pro-benchmarks-3613186)
- Galaxy S26+ (Exynos 2600): da 113 a 80 fps di media, -29%, in 10 minuti di gioco — [Android Authority](https://www.androidauthority.com/p-3677429/)
- Galaxy S25 Ultra: le prestazioni calano dopo 3–4 minuti di Wild Life Extreme in loop — [PhoneArena](https://www.phonearena.com/news/galaxy-s25-ultra-cooling-vapor-chamber-tested_id166991)
- Studio accademico: col throttling la GPU passa più tempo a frequenze basse e il gioco perde frame. Le temperature divergono solo dopo ~80 s — [arXiv 1904.09814](https://arxiv.org/pdf/1904.09814)
- Non tutti i giochi però caricano la GPU come i benchmark: Genshin Impact teneva 60 fps anche sotto carico — [Notebookcheck](https://www.notebookcheck.net/Top-smartphone-throttles-to-70-performance-in-test-and-it-seems-to-make-absolutely-no-difference.1240291.0.html)

### Inferences
**Struttura proposta, che estende `quality.ts`**
1. **Tier iniziale:**
   - `pointer: coarse` e `hardwareConcurrency`, come oggi;
   - più il renderer string, se disponibile. Adreno 6xx sotto 640 o Mali-G5x → low; Adreno 64x–7xx, Mali-G7x o Apple A13+ → medium; desktop → high.
   - Opzione: detect-gpu, ma richiede il fetch dei benchmark da CDN, quindi serve un fallback offline.
2. **Leva continua sul DPR**, dentro il tier, con passo 0,1 tra un minimo (1,0, oppure 0,75 su low) e il massimo del tier. È la più economica da cambiare, perché basta `setPixelRatio`, senza ricompilare.
3. **Leve discrete per tier** (ombre, post, densità, varianti shader). Si cambiano raramente e con isteresi, perché ogni cambio può ricompilare i programmi e causare scatti. Vanno precompilate tutte le varianti all'avvio (sezione 5).
4. **Soglie:**
   - la finestra attuale (20 ms per scendere, 12 per salire) è sensata a 60 Hz;
   - a 90/120 Hz conviene usare i `bounds` legati al refresh come drei e puntare a 60 fps fissi;
   - limitare i flip-flop, per esempio niente risalita dopo 2 discese.
5. **Margine termico:** puntare a ~10–11 ms di GPU sul tier scelto, non a 16, e lasciare che il monitor scenda dopo qualche minuto.

**Cosa scalare per primo:**
1. DPR;
2. bloom e FXAA;
3. ombre: da 2048 a 1024, poi alla blob;
4. densità di alberi, bandiere, pubblico e particelle di neve;
5. sparkle e specular della neve;
6. distanza di nebbia e far plane (meno geometria).

### Gaps
- Non ho confermato il dettaglio di come detect-gpu distingue i modelli iPhone quando Safari restituisce solo "Apple GPU" (README completo non raggiungibile).
- Nessun dato sul throttling specifico di Safari o Chrome WebGL su iPhone 11–14.

## 5. Specifiche three.js: renderer.info, InstancedMesh, BatchedMesh, merge, frustum culling, condivisione dei materiali, precompilazione degli shader

### Takeaway
Per le copie ripetute di una stessa geometria (alberi, paletti, coni) si usa **InstancedMesh**: una draw call, ma niente culling per istanza. Per geometrie diverse con lo stesso materiale si usa **BatchedMesh**, basato su `WEBGL_multi_draw` e con culling per istanza: va misurato, perché senza l'estensione ricade su un loop. La geometria statica si unisce con `mergeGeometries`.

All'avvio vanno chiamati `renderer.compileAsync(scene, camera)` e un frame di riscaldamento *con il composer*, per tutte le varianti di tier. Il monitoraggio si fa con `renderer.info.render.calls` e `.triangles`.

### Cited Findings
**Instancing e batching**
- InstancedMesh e BatchedMesh usano entrambi un solo materiale e una sola draw call. BatchedMesh usa multiDraw, InstancedMesh l'instanced draw — [three.js forum: choose between InstancedMesh and BatchedMesh](https://discourse.threejs.org/t/how-to-choose-between-instancedmesh-and-batchedmesh/81221); [InstancedMesh vs BatchedMesh](https://discourse.threejs.org/t/instancedmesh-vs-batchedmesh/31243)
- BatchedMesh dipende dall'estensione `WEBGL_multi_draw`; senza ricade su un loop — [three.js forum](https://discourse.threejs.org/t/instancedmesh-vs-batchedmesh/31243)
- Verificato nel sorgente r187: `WebGLBufferRenderer` e `WebGLIndexedBufferRenderer` usano `extensions.get('WEBGL_multi_draw')`; `WebGLPrograms` attiva `extensionMultiDraw` per BatchedMesh solo se l'estensione esiste — `node_modules/three/src/renderers/webgl/WebGLBufferRenderer.js`, `WebGLPrograms.js:391`
- Ci sono segnalazioni di BatchedMesh più lento di Mesh normali in alcune scene, e di miglioramenti inferiori al calo di draw call — [three.js forum: BatchedMesh high CPU](https://discourse.threejs.org/t/significant-performance-drop-and-high-cpu-usage-with-batchedmesh/67324); [_multiDrawInstances worse](https://discourse.threejs.org/t/why-did-the-performance-worsen-significantly-when-i-used-multidrawinstances-in-batchedmesh/78581)
- L'instancing azzera le draw call ma rinuncia al culling per oggetto; BatchedMesh offre il culling per istanza — [Three.js From Zero 09](https://masterallarts.pages.dev/learn/threejs-from-zero/09-performance-instancing-lod/)
- Esiste un benchmark della community (three 0.186.1, piante: InstancedMesh contro BatchedMesh contro Mesh, 240 campioni desktop), ma i numeri non erano leggibili dallo snippet — [three.js forum: plant instancing benchmark](https://discourse.threejs.org/t/three-js-plant-instancing-benchmark-240-desktop-samples-csv-json-and-a-standalone-harness/95719)

**Monitoraggio e ombre**
- Le draw call si monitorano con `renderer.info.render.calls`. Altre pratiche: unire le mesh piccole, istanziare quelle ripetute, mettere `castShadow` solo sugli oggetti essenziali e `shadow.autoUpdate = false` per le scene statiche — [NotBlox PERFORMANCE.md](https://raw.githubusercontent.com/iErcann/NotBlox/main/PERFORMANCE.md)

**Precompilazione degli shader**
- `compileAsync` è verificato nel sorgente r187 (`WebGLRenderer.js:1519`). Chiama `compile()` e poi controlla `program.isReady()` ogni 10 ms. Con `KHR_parallel_shader_compile` il controllo non blocca; senza l'estensione aspetta solo con `setTimeout` — `node_modules/three/src/renderers/WebGLRenderer.js`
- Lo scatto al primo frame nasce perché ogni compilazione è seguita da query bloccanti, come `getProgramParameter` e le uniform location. Lo spazio colore del render target fa parte della chiave del programma: un materiale compilato per lo schermo ricompila quando disegna nel buffer del composer. Un autore riporta un primo frame passato da 656 ms a pochi ms (aneddoto) — [three.js forum: heavy scene PageSpeed](https://discourse.threejs.org/t/why-a-heavy-three-js-scene-tanks-pagespeed-and-it-is-not-your-javascript/94734)
- Un bug WebKit del 2023 dice che `KHR_parallel_shader_compile` su Safari non permetteva una vera compilazione non bloccante — [WebKit bug 251514](https://119184-bug-83566-attachments.webkit.org/show_bug.cgi?id=251514)
- PR originale di compileAsync — [three.js PR #19752](https://github.com/mrdoob/three.js/pull/19752)

**Limiti di WebGL2 e memoria su iOS**
- Safari riporta `MAX_TEXTURE_SIZE` ≥ 8192 nel 100% dei casi e ≥ 16384 nel 99% — [web3dsurvey MAX_TEXTURE_SIZE](https://web3dsurvey.com/webgl2/parameters/MAX_TEXTURE_SIZE)
- iOS ha un limite di memoria per il canvas: "Total canvas memory use exceeds the maximum limit" a 224 MB (iOS 12) o 256 MB. Si mitiga mettendo width e height a 0 sui canvas abbandonati — [Apple forums 112218](https://developer.apple.com/forums/thread/112218); [WebKit bug 195325](https://bugs.webkit.org/show_bug.cgi?id=195325)
- Il processo Safari è stato terminato a ~1,25 GB su iPad Air 3 (iOS 14.2). Il limite non è fisso: dipende dalla RAM e dal carico — [Apple forums 668999](https://developer.apple.com/forums/thread/668999); [Apple forums 741624](https://developer.apple.com/forums/thread/741624)
- Le pagine WebGL pesanti possono finire in un ciclo di reload per pressione di memoria su iOS — [WebKit bug 300782](https://bugs.webkit.org/show_bug.cgi?id=300782)
- iOS Safari dichiara `OES_texture_float_linear` ma non filtra (iPhone 13 Pro, iOS 16.3.1) — [WebKit bug 252359](https://bugs.webkit.org/show_bug.cgi?id=252359)
- Nel 2022 `MAX_UNIFORM_BLOCK_SIZE` era 16384 su Safari, e gli UBO grandi fallivano — [WebKit bug 239116](https://bugs.webkit.org/show_bug.cgi?id=239116)
- Adreno: il rendering è a "bin" su GMEM on-chip. Le draw indirette (ES 3.1) spostano il costo delle draw call sulla GPU, ma non sono disponibili in WebGL2 — [Qualcomm Adreno GPU overview](https://developer.qualcomm.com/sites/default/files/docs/adreno-gpu/snapdragon-game-toolkit/gdg/gpu/gpu.html); [Tiling architecture](https://developer.qualcomm.com/sites/default/files/docs/adreno-gpu/snapdragon-game-toolkit/gdg/gpu/best_practices_tiling.html)

### Inferences
**Mesh e draw call**
- Il pendio e il trimesh nascono già da h(x, z): una sola mesh, una draw call.
- Per gli oggetti di contorno ripetuti (alberi, recinzioni, bandierine, pubblico) usare InstancedMesh per tipo. Così il numero di istanze cambia per tier tramite `mesh.count`, senza ricreare nulla. È il modo più semplice per scalare la "densità di vegetazione".
- Il frustum culling di un InstancedMesh vale per l'intero gruppo, con un bounding volume unico. Conviene dividere le istanze in blocchi spaziali lungo la pista (2–4 chunk) per avere un culling grossolano.
- Rispettare `flat(color)` (materiali condivisi): ogni materiale diverso significa un programma o uno stato in più.

**Precompilazione all'avvio**
- Per ogni tier: attivare la configurazione (ombre, define), poi `await renderer.compileAsync(scene, camera)`, poi un render nel composer se esiste.
- Le ombre on/off e il tipo di shadow map cambiano la chiave del programma: vanno precompilati tutti e due gli stati, oppure i cambi di tier vanno tenuti rari.

**Texture**
- Il gioco usa quasi solo colori flat, quindi la memoria texture è minima.
- Restare sotto ~64–100 MB complessivi di texture e render target per stare lontani dai limiti iOS (stima mia).
- Shadow map 2048 in formato depth: ~16 MB. Render target del composer a piena risoluzione: ~10 MB l'uno per RGBA8 a 2,6 Mpx, il doppio per HalfFloat.

### Gaps
- Nessun benchmark mobile di InstancedMesh contro BatchedMesh.
- Non ho dati sulla disponibilità di `WEBGL_multi_draw` su Safari iOS e Chrome Android (web3dsurvey ce li avrebbe, ma non ho aperto la pagina).
- Non ho confermato lo stato attuale (2025–2026) di `KHR_parallel_shader_compile` su Safari.
