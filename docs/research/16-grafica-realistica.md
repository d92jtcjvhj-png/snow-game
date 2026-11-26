# Luce vera su forme semplici: rifare la neve

Il gioco sembra "a cubotti" per tre motivi. Il primo è il **flat shading ovunque**: ogni triangolo del pendio ha la stessa normale piatta. Il secondo è la **luce piatta**: il sole è alto (circa 58° di elevazione [derivato da `sun.position` (−20, 40, −15) in `src/render/renderer.ts`]) e sta quasi alle spalle della camera laterale. Il terzo è che **mancano tone mapping, cielo a gradiente e prospettiva aerea**. Più poligoni non risolvono nessuno dei tre. I giochi di montagna stilizzati-realistici citati come riferimento non devono il loro aspetto alla geometria ma a **luce credibile su forme semplici**: un sole basso e caldo, ombre azzurre e mai grigie, profondità a strati che sfuma verso il colore del cielo, pochi dettagli di superficie messi dove guarda il giocatore (tracce, scintillii, battitura). Per Snow Game la leva più forte è anche la più economica. La superficie analitica h(x, z) dà già **normali lisce esatte, AO cotta nei vertex color, tinta per pendenza, ombra a blob e particelle "soft" contro il suolo**, tutto deterministico e testabile in Node, a costo zero in esecuzione. Prima di aggiungere effetti va però sistemato un problema di prestazioni che nessuno aveva ancora notato. La scena attuale fa circa **575 draw call sul livello high e circa 315 sul low** [derivato contando le mesh create in `src/world/scene.ts` e `src/main.ts`], contro un budget mobile di 100–200. Alberi e bandierine sono mesh singole, non istanziate. Ci sono poi due cose da decidere subito. La regola 2 di CLAUDE.md ("low-poly cartoon, flat shading, materiali `flat(color)`") va riscritta se si adottano neve liscia e materiali Standard sul rider. `renderer.ts` chiede `THREE.PCFSoftShadowMap`, che **in three r187 non esiste più**: il renderer scrive un avviso e ripiega su `PCFShadowMap`.

> **Come sono stati raccolti i dati: leggere prima.** In questa sessione la rete ha bloccato il fetch diretto di molte pagine: 80.lv, gamedeveloper.com, discourse.threejs.org, threejs.org, developer.arm.com, developer.playcanvas.com, alanzucconi.com, quaternius.com, cdn.jsdelivr.net (errori ENOTFOUND). **Quasi tutte le affermazioni web vengono quindi dagli snippet dei motori di ricerca**, non dal testo completo. Tutto ciò che riguarda three.js è invece **verificato sul sorgente installato** (`node_modules/three`, versione 0.187.0, pinnata). Quelle citazioni puntano al file locale, che per questa versione esatta è una fonte primaria. Etichette dei numeri: **[misurato]** = misurato in sessione o riportato da una fonte come misura; **[derivato]** = calcolato da valori citati o dal codice del progetto; **[STIMA]** = proposta senza fonte, da tarare sul dispositivo.

## Principi: uno stile nostro, ricavato da regole di luce e non da un gioco

Il riferimento dichiarato è Grand Mountain Adventure 2. Dalle recensioni si ricavano solo qualità generali. Una recensione dice che la neve funziona per "la profonda comprensione della neve, sia di come appare sia delle sue proprietà materiali" ([TapSmart](https://www.tapsmart.com/apps/books/review-gma2/)). Un'altra loda la cura "fino alle tracce lasciate nella neve" ([Pocket Gamer](https://www.pocketgamer.com/grand-mountain-adventure-2/app-army-assemble)). Il primo capitolo era lodato per l'"uso superbo di luce, prospettiva e fisica della neve" ([NoobFeed](https://www.noobfeed.com/reviews/grand-mountain-adventure-wonderlands-pc-review)). Toppluva usa un motore proprio ([MobyGames](https://www.mobygames.com/game/143235/grand-mountain-adventure/)) e **non ha pubblicato nulla su shading, ombre o palette**. Non c'è quindi niente di tecnico da "copiare", e va bene così. **Questo documento non riproduce l'aspetto, i personaggi, le palette, i loghi o gli asset di nessun gioco.** Prende principi condivisi da più fonti e li traduce in parametri nostri.

I principi convergono. Firewatch costruisce la profondità con strati di colore decisi, ciascuno più vicino al cielo del precedente. Usa una nebbia di colore custom e un cielo procedurale per controllare il colore con la distanza ([Boing Boing](https://boingboing.net/2015/03/27/how-a-small-art-team-created-f.html); [Thumbsticks GDC15](https://www.thumbsticks.com/gdc-2015-the-art-of-firewatch)), e ha **solo 23 alberi unici** ([Game Developer](https://gamedeveloper.com/design/environmental-artist-jane-ng-only-made-23-unique-trees-for-i-firewatch-i-)). Alto's Odyssey ha cercato di "ridurre la complessità visiva" ([Game Developer](https://www.gamedeveloper.com/business/road-to-the-igf-team-alto-s-i-alto-s-odyssey-i-)) e ottiene profondità con sfondi smorzati in parallasse ([Dice](https://www.dice.com/career-advice/altos-odyssey-winning-mobile-game)). Per Breath of the Wild, Takizawa voleva uno stile in cui fosse "facile mentire": l'arte deve suggerire la fisica in base all'esperienza del giocatore ([Thumbsticks GDC17](https://www.thumbsticks.com/gdc17-designing-zelda-breath-of-the-wild/)). Megagon voleva per Lonely Mountains uno stile "molto leggibile", perché il gioco è veloce ([80.lv](https://80.lv/articles/level-game-production-lonely-mountains-downhill)).

Da queste fonti nascono quattro regole per Snow Game.

**Forma semplice, luce vera.** Un solo sole caldo e basso, a 25–35° di elevazione [STIMA], laterale o di 3/4 rispetto alla camera e mai alle spalle. Un riempimento freddo dal cielo, così le ombre sono tinte e non nere. La prospettiva aerea porta ogni piano verso il colore dell'orizzonte.

**Gerarchia delle faccette.** La neve è morbida e va liscia. Roccia, ghiaccio e alberi sono spigolosi e restano sfaccettati. La differenza tra liscio e sfaccettato diventa così un'informazione di materiale, non un difetto.

**Pochi asset rifiniti**, variati per scala, rotazione e tinta.

**Leggibilità prima di tutto.** Kicker, labbro, landing e sagoma del rider devono emergere per valore e saturazione. Il dettaglio fine va solo vicino al rider.

Un tratto distintivo nostro: ombre ceruleo-lavanda invece del blu puro, rider in colori caldi saturi con una banda diagonale propria sulla giacca, base della tavola con un gradiente nostro, palette pastello di `materials.ts` mantenuta ma messa sotto un tone mapping che la rispetta.

## La neve diventa credibile con quattro toni, scintillii rari e normali analitiche

La neve vera non è "bianco". Al sole è quasi bianca e appena calda. In ombra è **azzurra, perché lì è illuminata solo dal cielo**, che è blu per lo scattering di Rayleigh ([Baird, WTAMU](https://wtamu.edu/~cbaird/sq/2014/02/10/why-doesnt-the-outside-world-appear-blue-even-though-so-much-light-comes-from-the-blue-sky/); [Story of Snow](https://storyofsnow.com/blog1.php/blues-and-whites-of-snow)). Nelle cavità diventa più profonda e blu ([CBS News](https://www.cbsnews.com/boston/news/why-does-snow-sometimes-appear-blue)). L'albedo della neve fresca è **circa 0,9 nel visibile** [misurato, fonte] ([NASA Earthdata](https://earthdata.nasa.gov/topics/land-surface/albedo); [Kokhanovsky 2021](https://frontiersin.org/articles/10.3389/fenvs.2021.757575/full)). Ne segue che il colore base del terreno va a circa 0,85–0,9 e non a 1,0: così sole × albedo resta sotto la spalla del tone mapper e il clip vero resta riservato a scintillii e disco del sole [derivato].

La ricetta ha quattro valori. Luce piena: bianco caldo (circa #FFF8EE). Mezzotono: bianco-lavanda. Ombra: ceruleo desaturato (circa #A9C4E8). Pieghe e occlusione: blu più profondo [STIMA]. I quattro valori non vanno dipinti a mano. Escono da tre ingredienti.

Il primo è l'**ombra legata al cielo**. In `HemisphereLight` il colore del cielo diventa azzurro (circa #9cc4ff) e quello della terra un bianco-azzurro di rimbalzo (circa #dfe8f5). La terra va chiara perché la neve rimanda l'80–90% della luce [derivato dall'albedo]. Oggi il colore di terra è un grigio-blu scuro (0x7f97b2).

Il secondo è il **wrap diffuse**. GPU Gems lo descrive come `max(0, (N·L + w)/(1 + w))`: la luce prosegue oltre il terminatore, imita la luce che "entra" nel materiale ed è un'approssimazione grezza di Oren-Nayar per superfici opache e ruvide ([GPU Gems ch.16](https://developer.nvidia.com/gpugems/gpugems/part-iii-materials/chapter-16-real-time-approximations-subsurface-scattering)). Con w ≈ 0,3–0,5 e una leggera tinta azzurra vicino al terminatore si ottiene un falso subsurface in 2–3 operazioni ALU [STIMA].

Il terzo sono **AO e tinta cotte nei vertex color** a partire da h(x, z).

Lo **scintillio** viene da Journey. Lì il glitter è un termine speculare separato, con riflessi "rari e molto brillanti" generati da normali casuali per granello ([GDC Vault, Sand Rendering in Journey](https://gdcvault.com/play/1017742/Sand-Rendering-in); [Zucconi](https://www.alanzucconi.com/2019/10/08/journey-sand-shader-5/)). Su sabbia e neve vere servono granelli di più dimensioni ([Polycount](https://polycount.com/discussion/comment/2621156)). Con una texture, le mipmap li cancellano a distanza ([Patreon, Interactive Snow](https://www.patreon.com/posts/interactive-snow-25641162)). La nostra versione è procedurale e senza texture:

1. si fa l'hash della posizione world quantizzata a celle di circa 2,5 cm;
2. si perturba la normale con il vettore casuale ottenuto;
3. si calcola `pow(max(dot(reflect(−V, n′), L), 0), 400)` con una soglia alta;
4. il risultato si spegne con la distanza (da 5 a 30 m) e si moltiplica per il fattore d'ombra.

Sono circa 15 ALU per pixel [STIMA]. Il problema delle mipmap non esiste. Al suo posto c'è l'aliasing sotto il pixel, che il fade con la distanza gestisce.

La **battitura** (corduroy) è una modulazione periodica di ±3% di luminosità, o una piccola perturbazione della normale, perpendicolare alla linea di massima pendenza. Si applica solo sulla pista battuta e sfuma oltre circa 20 m per evitare il moiré. Le righe vere distano 2–3 cm (dato senza fonte), cioè meno di un pixel alla distanza della camera, quindi serve un periodo stilizzato di 10–20 cm [STIMA]. Il kicker e il landing, fresati e lisci, vanno distinti dalla neve naturale con un tono più freddo e uno speculare più lucido. Oggi questa distinzione c'è solo come "un tocco di blu" in `terrainMesh()`.

Le **normali** sono il punto in cui la nostra architettura vince. Il terreno nasce da h(x, z), quindi `n = normalize(−∂h/∂x, 1, −∂h/∂z)` si calcola esatta per vertice sulla CPU e si scrive nell'attributo `normal`. La neve diventa liscia senza aumentare la risoluzione della griglia. Oggi la griglia ha **52 824 triangoli e 26 901 vertici** [misurato in sessione con `buildTerrainGrid()` in Vitest], con `computeVertexNormals()` seguito da `flatShading: true`, che butta via le normali e mostra i "terrazzi" sui pendii lunghi. Il collider Rapier non cambia: le normali sono solo render, e il contatto con la neve è già il vincolo analitico della regola 3.

Il **materiale** resta `MeshLambertMaterial`, patchato con `onBeforeCompile`. Il codice nuovo va iniettato dopo `#include <lights_fragment_end>`, oppure si sostituisce `<lights_lambert_pars_fragment>`. Così luci, ombre e nebbia di three restano intatte. Dalla r144 Lambert lavora per frammento ma resta molto più economico di Standard ([three.js forum](https://discourse.threejs.org/t/spotlight-only-reflects-off-of-wall-when-the-target-wall-is-completely-within-the-lights-frustum/48861)). L'ordine di costo è Physical > Standard > Phong > Lambert > Basic. Un utente riferisce di aver **raddoppiato le prestazioni su mobile passando un solo grande oggetto da Standard a Lambert** [misurato, aneddotico] ([three.js forum #12259](https://discourse.threejs.org/t/are-there-settings-for-shading-rate-or-shading-precision/12259)). Il pendio riempie metà dello schermo, quindi **niente PBR sulla neve**.

Per le **tracce** ci sono due strade. Su low e medium si usa un nastro CPU in ring buffer (circa 512 segmenti) posato su h + 1 cm, un po' più scuro e blu, con `polygonOffset`: una draw call, nessun render target, deterministico. Su high si può usare un render target ping-pong 256² ortografico centrato sul rider, campionato dallo shader del terreno. È la tecnica standard dei motori ([Kodeco, Snow Trails UE4](https://www.kodeco.com/196937/creating-snow-trails-in-unreal-engine-4); [GDC 2014, Batman Arkham Origins](https://www.slideshare.net/colinbb/gdc2014-deformable-snow-rendering-in-batman-arkham-origins)). Costa due passaggi piccoli [STIMA].

## Cielo, nebbia, montagne e ombre: la profondità costa quasi niente

Oggi il cielo è un colore piatto (`scene.background = PALETTE.sky`) e la nebbia è lineare da 70 a 320 m. Le montagne sono coni a 5 lati color roccia o picco, piazzati tra circa 140 e 220 m oltre la fine del landing. Molte cadono vicino al limite della nebbia, dove finiscono quasi tutte color nebbia [derivato dalle posizioni in `scenery()`].

L'addon `Sky` di r187 è sconsigliato sul telefono. Usa il modello di Preetham per pixel e adesso esegue anche un **fbm a 4 ottave per le nuvole** quando `cloudCoverage > 0` (default 0,4) (fonte locale: `node_modules/three/examples/jsm/objects/Sky.js`). Al suo posto conviene una **cupola a gradiente**: una sfera 16×8 BackSide, `depthWrite: false`, `fog: false`, con `mix(orizzonte, zenit, pow(dir.y, 0.5))` più alone e disco del sole analitici in HDR. Sono circa 10 ALU per pixel di cielo [STIMA]. Il colore d'orizzonte deve essere **identico a `scene.fog.color`**, così il terreno lontano si fonde senza cucitura.

La nebbia di r187 dipende solo dalla profondità vista e non ha un termine d'altezza (fonte locale: `ShaderChunk/fog_fragment.glsl.js`). Si patcha con `onBeforeCompile` per avere `(1 − exp(−d·dist))·exp(−max(y − base, 0)·falloff)`: foschia a valle, kicker e cima nitidi. La tecnica è documentata dal forum three.js, che consiglia di patchare solo i materiali che ne hanno bisogno ([XZFog](https://discourse.threejs.org/t/xzfog-horizontal-distance-fog-for-three-js-top-down-isometric-games/87619); [Ground Fog](https://discourse.threejs.org/t/high-performance-ground-fog-for-games-three-js/88522)).

Le **montagne lontane** diventano 2–3 anelli di creste, generate da rumore 1D sulla CPU con `ImprovedNoise` o `SimplexNoise` (presenti in `examples/jsm/math`), da 600 a 2000 m, con 64–128 vertici per anello. Ogni strato ha un colore già mescolato verso l'orizzonte: lo strato più lontano è circa all'80% color nebbia. Hanno `fog: false` e cime innevate che prendono il caldo del sole. Sono 1–3 draw call opache [STIMA]. È lo stesso principio a strati di Firewatch e Alto, con geometria nostra nata da dati (regola 7).

Per le **ombre** il codice da sistemare è preciso. In r187 `WebGLShadowMap` contiene `if (this.type === PCFSoftShadowMap) { warn('…PCFSoftShadowMap has been removed. Using PCFShadowMap instead.'); this.type = PCFShadowMap; }` (fonte locale: `src/renderers/webgl/WebGLShadowMap.js` righe 88–103 circa). **`renderer.ts` riga 17 quindi produce un avviso a ogni avvio e ottiene comunque PCF.** La correzione è scrivere `THREE.PCFShadowMap`. Il PCF di r187 usa `sampler2DShadow`, cioè PCF hardware a 4 tap per campione (fonte locale: `shadowmap_pars_fragment.glsl.js`), e `shadow.intensity < 1` schiarisce le ombre gratis. Su un thread del forum `PCFSoftShadowMap` causava un calo di prestazioni su Android in portrait, che spariva con il filtro di default ([three.js forum](https://discourse.threejs.org/t/performance-drop-in-mobile-portrait-mode-android-chrome-firefox/2080)). VSM in r187 fa renderizzare anche i ricevitori nel passaggio d'ombra e aggiunge un blur: va scartata. Le cascate rifanno la geometria N volte ([Arm SIGGRAPH 2016](https://community.arm.com:443/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/3_2D00_mmg_2D00_siggraph2016_2D00_shadows_2D00_marius.pdf)) e per una camera che insegue a media distanza non servono.

La configurazione giusta è una sola direzionale con box ortografico stretto, ±12–20 m attorno al rider (`follow()` lo fa già). Il centro del box va agganciato ai texel per evitare lo sfarfallio. Il terreno non proietta ombre: la sua auto-ombra va nell'AO cotta. Su low, dove le ombre sono spente, serve un'**ombra a blob** posata esattamente su h(x, z) e orientata sulla normale analitica, che rimpicciolisce con l'altezza del rider. È il riferimento più importante per leggere quota e momento dell'atterraggio [STIMA].

L'**AO cotta** si calcola una volta sola. Per ogni vertice si campiona h lungo 8 azimut a 1, 3, 8 e 20 m, si prende l'angolo d'orizzonte massimo e si pone `ao = 1 − media(sin θ)` [STIMA]. È una funzione pura di h, quindi si testa in Vitest.

Per il **tone mapping**, oggi non è impostato: vale il default `NoToneMapping`. In r187 ci sono `AgXToneMapping` (6) e `NeutralToneMapping` (7) (fonte locale: `src/constants.js` righe 423–483). ACES sposta le tinte quando i colori saturano e taglia alcuni blu ([Unity Discussions](https://discussions.unity.com/t/unity-needs-better-tonemappers-especially-for-hdr/1693305)). AgX è meno saturo per scelta ([three.js forum](https://discourse.threejs.org/t/is-agx-tonemapping-implemented-correctly/60609)). Neutral è il Khronos PBR Neutral, introdotto in r162 ([three.js forum](https://discourse.threejs.org/t/tone-mapping-overview/75204)). La raccomandazione è **Neutral**, perché tiene riconoscibili i pastelli di `PALETTE` e ha una spalla morbida solo vicino al bianco. AgX resta un'alternativa da provare in A/B se si vuole un roll-off più "filmico" sul sole. Si usa `toneMappingExposure` come unica manopola globale e `material.dithering = true` (esiste in r187, `src/materials/Material.js`) su cielo e terreno, contro il banding dei gradienti. Nessuna fonte quantifica il clipping del bianco per tone mapper in three.js: la scelta finale va fatta a occhio sulla scena vera.

## Alberi, rocce, particelle e post: istanziare prima di abbellire

Il conto delle draw call è il dato più urgente del rapporto. `scenery()` crea per ogni albero due `Mesh` separate (cono e tronco), e `main.ts` passa 90, 150 o 220 alberi secondo il livello. `markings()` crea **40 posizioni di bandierina** [misurato in sessione], ciascuna con palo e bandiera, quindi 80 mesh. A queste si aggiungono 22 montagne, circa 8 linee di colore, 2 reti, 3 pezzi del cancello, il terreno e circa 20 mesh del rider. Totale: **circa 575 draw call su high, circa 435 su medium, circa 315 su low**, più il passaggio d'ombra dei 220 coni su high [derivato dal codice, da confermare con `renderer.info.render.calls`]. Le fonti di settore mettono il target per i telefoni bassi e medi a **100–200 draw call** ([PlayCanvas](https://developer.playcanvas.com/user-manual/optimization/guidelines/)). Arm scrive che "most high-end 3D content on mobile today uses around 100 draw calls per render target" ([Arm, Mali performance 4](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/mali-performance-4-principles-of-high-performance-rendering)). NotBlox, gioco three.js open source, punta a meno di 200 e ricorda che ogni caster si ridisegna per ogni luce con ombre ([NotBlox PERFORMANCE.md](https://raw.githubusercontent.com/iErcann/NotBlox/main/PERFORMANCE.md)). I casi misurati vanno nella stessa direzione. Una visualizzazione three.js passata da 387 a 42 draw call è salita da circa 10 a circa 30 fps su mobile ([JavaScript in Plain English](https://javascript.plainenglish.io/how-we-optimized-our-three-js-application-to-run-on-mobile-devices-4a3bc9e572f4)). Una scena Babylon è passata da 30 a 60 fps su iPhone 6s Plus scendendo da circa 760 a 4 call ([html5gamedevs](https://www.html5gamedevs.com/topic/27656-solved-bjs-mobile-web-browser-performance/)). Le draw call da sole però non bastano: un RPG con meno di 50 call restava sotto 40 fps ([html5gamedevs](https://www.html5gamedevs.com/topic/27656-bjs-mobile-web-browser-performance/)).

La soluzione è **un `InstancedMesh` per tipo di oggetto**, diviso in 4–8 blocchi spaziali lungo la pista, perché three fa il frustum culling per oggetto e non per istanza ([three.js forum, LOD + Instancing](https://discourse.threejs.org/t/lod-instancing/20524)). La densità si scala per livello con `mesh.count`, senza ricreare nulla. Un pino diventa una sola geometria unita: 3 coni sovrapposti a 6–8 lati più il tronco, circa 60–120 triangoli, con **neve sulle facce rivolte in alto (`normal.y > 0,5`) cotta nei vertex color** e ±5% di tinta per istanza con `setColorAt` [STIMA]. Gli alberi restano `flatShading: true`, coerenti con la gerarchia delle faccette. Le rocce sono icosaedri deformati da rumore (dettaglio 1, 80 triangoli [misurato in sessione per `IcosahedronGeometry(1,1)`]) con cappello di neve, istanziate, e affiorano solo sui pendii fuori pista sopra circa 35–40°. Oltre circa 150 m gli alberi diventano parte dell'anello di creste. Gli impostor ottaedrici usati in progetti di foreste ([three.js forum](https://discourse.threejs.org/t/a-forest-of-octahedral-impostors/85735)) qui sono eccessivi. Il vento su abeti innevati non serve, al massimo un'oscillazione di 3 cm solo su high.

Le **particelle** oggi sono un `PointsMaterial` di taglia fissa 0,2, colore 0xb9d0e6, con `Math.random` nella vita (solo render, quindi non tocca il determinismo). Il salto di qualità viene da quattro cose.

La prima è uno **sprite tondo procedurale** nel fragment, `1 − smoothstep(0,2, 0,5, |gl_PointCoord − 0,5|)`, con dimensione a schermo limitata (≤ 48 px a pixel ratio 1) per contenere il fill.

La seconda è una **tinta per particella** dal lato sole o lato ombra, con gli stessi colori dell'emisfero.

La terza è un'**emissione proporzionale alla potenza d'attrito laterale** `|F_lat·v_lat|`, che la fisica anisotropa calcola già.

La quarta è il **"soft" esatto senza depth pass**: l'alfa sfuma con la quota della particella sopra h(x, z). La versione classica delle soft particles richiede invece un render target con `DepthTexture` ([NVIDIA SoftParticles](https://developer.download.nvidia.com/whitepapers/2007/SDK10/SoftParticles_hi.pdf); [three.js forum](https://discourse.threejs.org/t/soft-particles-rendering-performance/27610)).

All'atterraggio serve uno sbuffo di polvere di 50–150 sprite più grandi, nei primi 0–80 ms, in linea con la finestra d'impatto della ricerca 14. La neve che cade è opzionale: un box di punti attorno alla camera, avvolto con `mod()` nel vertex shader, una draw call ([Soledad Penades](https://soledadpenades.com/articles/three-js-tutorials/rendering-snow-with-shaders/)).

Il **post-processing** è la voce più cara per i telefoni. Su GPU a tile ogni immagine in più costa un resolve, che "toglie circa 1 ms" su Adreno ([Meta](https://developers.meta.com/horizon/blog/pc-rendering-techniques-to-avoid-when-developing-for-mobile-vr/)). Un bloom custom costava circa 3 ms in Spellsouls [misurato, fonte] ([Arm GDC18](https://community.arm.com/developer/tools-software/graphics/b/blog/posts/post-processing-effects-for-mobile-at-gdc18)). Arm consiglia di mettere il bagliore dentro i materiali ([Arm, alternative al post](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives)). In r187 ci sono `UnrealBloomPass`, `FXAAPass`, `SMAAPass` (3 passaggi), `LUTPass`, `OutputPass` e altri (fonte locale: `examples/jsm/postprocessing/`). La conclusione è netta. **Su low e medium niente EffectComposer**: tone mapping nel materiale, alone del sole e scintillii come pixel brillanti nello shader, vignetta come gradiente CSS sopra il canvas. **Su high**, facoltativo: bloom a metà o a un quarto della risoluzione con soglia ≈ 1,0 in HDR (prende solo sole e scintillii), poi `OutputPass` ed eventualmente FXAA. SSAO, SSR, GTAO, DOF e TAA restano esclusi. Attenzione: i passaggi del composer non vengono compilati da `renderer.compile`, quindi serve un frame di riscaldamento con il composer attivo ([three.js forum](https://discourse.threejs.org/t/why-a-heavy-three-js-scene-tanks-pagespeed-and-it-is-not-your-javascript/94734)).

### Tabella 1 — Effetti per livello di qualità

| Effetto | low | medium | high | Costo stimato | Note di implementazione (three r187) |
|---|---|---|---|---|---|
| Tone mapping Neutral + exposure, `outputColorSpace` sRGB | ✓ | ✓ | ✓ | ~0 (nel materiale) | `renderer.toneMapping = THREE.NeutralToneMapping`; A/B con AgX |
| Sole basso caldo + emisfero cielo azzurro / terra chiara | ✓ | ✓ | ✓ | 0 | elevazione 25–35°, 3/4 rispetto alla camera laterale [STIMA] |
| Normali analitiche lisce del terreno | ✓ | ✓ | ✓ | 0 | n da ∂h/∂x, ∂h/∂z sulla CPU; `flatShading: false` solo sul terreno |
| Vertex color cotti: AO d'orizzonte, tinta per pendenza, battuta / fresca / kicker | ✓ | ✓ | ✓ | 0 (all'avvio, ~ms) | funzione pura di h, test Vitest |
| Wrap diffuse + tinta fredda al terminatore | ✓ | ✓ | ✓ | 2–3 ALU/px | `onBeforeCompile` su Lambert dopo `lights_fragment_end` |
| Scintillio procedurale | — | ✓ | ✓ (HDR, prende il bloom) | ~15 ALU/px, solo < 30 m | hash della posizione world; `#define` per livello |
| Battitura (corduroy) | solo albedo | albedo + normale | albedo + normale | 1 sin + 1 noise | periodo 10–20 cm, fade oltre 20 m [STIMA] |
| `dithering` su cielo e terreno | ✓ | ✓ | ✓ | trascurabile | `material.dithering = true` |
| Cupola cielo a gradiente + disco / alone del sole | ✓ | ✓ | ✓ (+1 ottava di cirri) | ~10 ALU/px di cielo | orizzonte = `fog.color`; `renderOrder` per disegnarlo per ultimo |
| Nebbia | lineare di serie | esponenziale + altezza | esponenziale + altezza | +1 exp | patch del chunk fog solo su terreno, oggetti e creste |
| Anelli di creste lontane (2–3) | 2 anelli | 3 | 3 | 1–3 draw call opache | colore premiscelato verso l'orizzonte, `fog: false` |
| Ombra a blob sotto il rider | ✓ | ✓ (sotto la shadow map) | — | 1 draw call trasparente piccola | su h(x, z), orientata sulla normale, scala con la quota |
| Shadow map direzionale PCF | — | 1024 | 2048 | 1 depth pass dei caster | `PCFShadowMap`; box ±12–20 m agganciato ai texel; terreno non caster |
| Pini e rocce istanziati con neve cotta | 90 alberi | 150–400 | 220–1000 | 1 call per tipo per blocco | `InstancedMesh` a blocchi, `mesh.count` per livello |
| Oscillazione degli alberi al vento | — | — | facoltativa | ~5 ALU/vertice | `instanceMatrix` come fase |
| Spruzzo (sprite procedurali, tinta sole/ombra, soft su h) | 60–256 | 150–512 | 260–1024 | fill: ≤ 48 px a DPR 1 | emissione ∝ potenza d'attrito laterale |
| Sbuffo di atterraggio | 50 | 100 | 150 | breve picco di fill | 0–80 ms dopo il contatto |
| Neve che cade | — | 1500 punti | 4000 punti | 1 draw call | `mod()` nel vertex shader, legata al meteo |
| Tracce della tavola | nastro CPU | nastro CPU | render target 256² ping-pong | 1 call / 2 passaggi piccoli | nastro su h + 1 cm, `polygonOffset` |
| Rim light del rider | — | ✓ | ✓ | poche ALU su area piccola | fresnel `pow(1−N·V, 3)` aggiunto prima di `opaque_fragment` |
| Bloom | — | — | ½ o ¼ risoluzione, soglia 1,0 | ~3 ms [misurato, altro gioco] | `UnrealBloomPass` + `OutputPass`; riscaldamento con `compileAsync` |
| FXAA | — | — | se MSAA è spento | 1 passaggio | MSAA del contesto non vale sui target del composer |
| Vignetta | CSS | CSS | CSS o nel passaggio finale | 0 | gradiente radiale sopra il canvas |

## Il rider morbido nasce da una pelle unica skinnata in codice

Il rider attuale (`src/render/rider.ts`, 404 righe) usa `BoxGeometry`, `CylinderGeometry(…, 6, 1)` da **24 triangoli l'uno** [misurato], ginocchia icosaedriche e casco `IcosahedronGeometry(0.13, 1)`. Sono circa 20 mesh e quindi circa 20 draw call, tutte con `flat()`. I giunti si vedono come sfere e i box fanno "robot".

Ci sono quattro strade. **(a)** Primitive lisce e rigide sugli stessi giunti. **(b)** Una `SkinnedMesh` unica generata in codice. **(c)** Un glTF esterno. **(d)** SDF o metaball. La raccomandazione è **(b), con (a) come primo passo a rischio zero e come fallback**.

La (c) è scartata perché un personaggio CC0 di terzi non è un design originale. I personaggi Kenney sono "a blocchi" ([OpenGameArt](https://opengameart.org/content/animated-characters-1)). Mixamo vieta di ridistribuire i file grezzi ([Adobe community](https://community.adobe.com/questions-696/mixamo-faq-licensing-royalties-ownership-eula-and-tos-589400)), e su GitHub Pages il `.glb` è servito in chiaro. I Quaternius Universal Base Characters ([itch.io](https://quaternius.itch.io/universal-base-characters)) possono servire solo come riferimento di proporzioni.

La (d) non entra nei 16,7 ms su un telefono.

La (b) funziona perché in r187 lo skinning legge **sempre una texture delle ossa** (`skeleton.computeBoneTexture()` chiamato dal renderer; `texelFetch` in `skinning_pars_vertex.glsl.js`, fonte locale), quindi il vecchio limite di uniform per numero di ossa non c'è più. Il costo è in un vertex shader su circa 1,5 k vertici: trascurabile. r187 offre anche `LoftGeometry` in `examples/jsm/geometries/` (fonte locale), il caso generale di Lathe e Tube, adatto a busto, giacca imbottita e pantaloni svasati.

Il rig resta compatibile con la ricerca 14. Si usano le stesse lunghezze di Drillis & Contini già in `rider.ts` (THIGH 0,43, SHANK 0,43, SPINE 0,46, UPPER_ARM 0,31, FOREARM 0,25), le stesse key pose G1…L4, le stesse molle e la stessa IK a due ossa. L'IK continua a produrre posizioni di giunti, e per ogni segmento queste si convertiscono in `bone.quaternion` con `setFromUnitVectors(restDir, newDir)` più un roll dato dal pole vector. Lo scheletro minimo ha circa **19–21 ossa**:

- root (= frame della tavola), pelvis, spine, chest, neck, head;
- per lato: thigh, shin, foot, upperArm, forearm, hand;
- opzionali: forearmTwist e clavicle.

Questo sta dentro le 15–20 ossa previste dalla ricerca 14, con al massimo due ossa opzionali in più.

I pesi si danno "per costruzione". Ogni anello del loft conosce il suo segmento e il parametro t. Il peso dell'osso successivo è `smoothstep(1−b, 1+b, t)`, con b ≈ 0,2 a ginocchio e gomito e b ≈ 0,3 a vita e spalla, con massimo due influenze. Agli attacchi tra catene c'è un collare a 3 influenze. È più robusto della pura distanza 3D, che nel tuck A2 (ginocchio a 122°) confonde coscia e busto [STIMA].

Il candy-wrapper è il collasso del linear blend skinning quando un osso ruota sul proprio asse ([SIGGRAPH, Stretchable and Twistable Bones](https://history.siggraph.org/?p=197630)). Si evita tenendo la torsione fuori da avambraccio e tibia, perché i guanti sono mesh rigide figlie di `hand`. Se un grab chiede più di circa 60° di polso si aggiunge un `forearmTwist` al 50% ([Polycount](https://polycount.com/discussion/comment/2681297)). Il dual quaternion skinning non c'è di serie in three.js e ha artefatti propri ([three.js forum](https://discourse.threejs.org/t/having-a-hard-time-figuring-out-tsl-for-webgpu-support-dqs-implementation/84845)): non vale lo sforzo.

L'LBS "sgonfia" le pieghe a 120°. Le contromisure: anelli più fitti attorno ai giunti, sezione +10% al giunto, pantaloni larghi e bind pose già a circa 30° di ginocchio (G1) [STIMA].

Tutto si testa in Node, perché `SkinnedMesh.applyBoneTransform()` non richiede WebGL (fonte locale: `src/objects/SkinnedMesh.js`):

- somma dei pesi pari a 1 ± 1e-6;
- bind pose identica alla geometria originale;
- con il ginocchio a 122° nessun vertice della coscia finisce oltre la tibia;
- due generazioni producono buffer identici byte per byte.

Visto che il rider è sempre al centro dell'inquadratura, conviene `frustumCulled = false`.

Per i **materiali** la proposta è una deroga a `flat()` limitata al personaggio, chiamata `soft(color)`. Su medium e high è un `MeshStandardMaterial` con roughness 0,85–0,95 per il tessuto, metalness 0, vertex color per giacca e pantaloni in **una sola draw call**, e rim di colore cielo con forza circa 0,35. La matematica del fresnel va spostata negli hook di uno Standard, perché `FresnelShader` è uno shader completo ([three.js forum](https://discourse.threejs.org/t/fresnel-shader-or-similar-effect/9997)). Il casco ha roughness circa 0,3. La maschera ha una lente con gradiente nei vertex color e una banda di riflesso dipinta. Su high si aggiunge una envMap statica minuscola (PMREM di un gradiente cielo-neve generata una volta). Su low si torna a Lambert senza rim, con un LOD da circa 1,2 k triangoli. In alternativa la stessa SkinnedMesh con `flatShading: true` dà faccette pulite anche dopo la deformazione, se si vuole restare più vicini alla regola 2.

La **tavola** si genera dai numeri reali. Contorno con sidecut ad arco di raggio `SNOW.SIDECUT_R` = 8 m (già in `config.ts`). Waist circa 0,25 m ([Peter Glenn](https://peterglenn.com/blog/how-to-measure-a-snowboard/); [Bataleon](https://ca.bataleon.com/blogs/buyers-guide/understanding-snowboard-width-and-sidecut)). Profondità del sidecut `R − √(R² − (Le/2)²)` ≈ **2,2 cm per lato** su un effective edge di circa 1,18 m [derivato]. Kick di circa 5–6 cm sugli ultimi 15 cm, camber ibrido piatto tra gli attacchi, spessore circa 1,2 cm con smusso. Lamina come anello scuro, base di un colore saturo diverso dal top, perché in aria e nei flip si vede la base. Sono circa 400–600 triangoli [STIMA]. I parametri vanno in `BOARD` dentro `config.ts`, così mesh ed eventuale collider futuro nascono dagli stessi dati (regola 7).

Per la **leggibilità**: test della sagoma nera nelle pose G1, S1, S4, A2, A5 e L4, casco circa 1,15× la scala reale, muffole grandi, niente capi bianchi o azzurri chiari, rapporto di luminanza giacca/neve ≥ 3:1 [STIMA] ([Game Developer, visual confusion](https://gamedeveloper.com/design/how-to-reduce-visual-confusion-in-your-game)).

### Tabella 2 — Budget del rider per livello

| Voce | low | medium | high | Etichetta |
|---|---|---|---|---|
| Corpo skinnato (loft) | ~1,2 k tri, anelli ridotti | ~1,6–2,2 k tri | ~1,6–2,2 k tri | STIMA |
| Parti rigide (casco ~190, maschera ~100, guanti 2×112, scarponi 2×150, attacchi 2×80, tavola 400–600) | ~1,0 k tri | ~1,2–1,4 k tri | ~1,2–1,4 k tri | derivato da conteggi geometria misurati + STIMA |
| Totale rider | ~2,2 k tri | ~2,5–3,5 k tri | ~2,5–3,5 k tri | STIMA |
| Ossa | ~19 | 19–21 | 19–21 | STIMA (compatibile con ricerca 14) |
| Draw call | 6–8 | 6–8 | 6–8 (+ caster ombra) | STIMA |
| Materiale | Lambert, `flatShading` facoltativo | Standard + rim | Standard + rim + envMap statica | STIMA |

Conteggi misurati in sessione su r187 (script Node): `CapsuleGeometry(r,h,4,8)` 144 triangoli, `(r,h,3,8,1)` 112, `LatheGeometry` 10 × 12 216, `SphereGeometry(1,12,8)` 168, `IcosahedronGeometry(1,1)` 80, `(1,2)` 180, `CylinderGeometry(…,6,1)` 24.

## Budget, piano e decisioni

Il collo di bottiglia probabile sul telefono è il **fill-rate**, non la geometria. Su uno schermo 1080×2400 a DPR 3 il buffer nativo è di circa 2,6 Mpx, che scende a circa 0,65 Mpx a DPR 1,5, cioè un quarto [derivato]. Arm scrive che "rendering at native resolution is often out of the question, especially if you add post-processing" ([Arm SIGGRAPH 2015](https://community.arm.com:443/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/siggraph2015_2D00_mmg_2D00_marius_2D00_slides.pdf)). Gli utenti di GMA2 notano che abbassare la grafica rende l'immagine "molto sfocata" ([Game Brain](https://gamebrain.co/game/grand-mountain-adventure-2)), segno che anche lì la scala passa per la risoluzione. Siccome la neve bianca sfocata si nota molto, il DPR va abbassato a passi di 0,1 dentro il livello, con isteresi.

Vanno anche messi in conto i cali termici: un Realme GT 8 Pro scende fino al 70% dopo 10–15 minuti ([Notebookcheck](https://www.notebookcheck.net/Top-smartphone-throttles-to-70-performance-in-test-and-it-seems-to-make-absolutely-no-difference.1240291.0.html)) e un Galaxy S26+ perde il 29% in 10 minuti ([Android Authority](https://www.androidauthority.com/p-3677429/)) [misurato, fonte]. Conviene quindi puntare a circa 10–11 ms di GPU e non a 16 [STIMA]. Le soglie attuali di `quality.ts` (sopra 20 ms per 2 s si scende, sotto 12 ms per 5 s si sale) vanno bene a 60 Hz. Servono però un limite alle oscillazioni (niente risalita dopo 2 discese) e la precompilazione di tutte le varianti con `renderer.compileAsync` (verificato in `WebGLRenderer.js:1519`, fonte locale), perché ombre on/off e `#define` cambiano il programma e un cambio di livello a metà salto causa uno scatto.

### Tabella 3 — Budget di prestazioni per livello

| Voce | low | medium | high | Oggi (codice attuale) | Etichetta |
|---|---|---|---|---|---|
| Draw call totali (con ombre) | ≤ 60 | ≤ 120 | ≤ 200 | ~315 / ~435 / ~575 | target STIMA da fonti 100–200; "oggi" derivato |
| Triangoli a schermo | ≤ 100 k | ≤ 250 k | ≤ 500 k | terreno 52,8 k + alberi + rider | target STIMA; terreno misurato |
| Pixel ratio massimo (passo dinamico 0,1) | 1,0 (min 0,75) | 1,5 | 2,0 (1,5 sul telefono) | 1 / 1,5 / 2 | fonti: limite 1,5 mobile; STIMA |
| Antialias | no | MSAA del contesto (fisso all'avvio) | MSAA o FXAA | `initial !== 'low'` | derivato |
| Shadow map | nessuna + blob | 1024 PCF | 2048 PCF | solo high, 2048, tipo errato | fonti 512–1024 mobile, 2048 tetto |
| Memoria shadow map | 0 | ~4 MB | ~16 MB | ~16 MB | derivato |
| Post-processing | nessuno | nessuno | bloom ½–¼ + OutputPass (+FXAA) | nessuno | ~3 ms bloom [misurato, altro gioco] |
| Materiale neve | Lambert patch (wrap) | + scintillio, corduroy | + scintillio HDR | Lambert flat | STIMA |
| Particelle spruzzo | 60–256 | 150–512 | 260–1024 | 60 / 150 / 260 | STIMA |
| Alberi istanziati | 90 | 150–400 | 220–1000 | 90 / 150 / 220 non istanziati | STIMA |
| Texture + render target | < 20 MB | < 40 MB | < 64–100 MB | ~16 MB | STIMA (limite canvas iOS 224–256 MB, [Apple forums](https://developer.apple.com/forums/thread/112218)) |
| Tempo GPU obiettivo | ~10 ms | ~10–11 ms | ~11 ms | non misurato | STIMA (margine termico) |

### Tabella 4 — Piano di implementazione in ordine di resa

| Passo | Cosa | Perché in questo ordine | File principali |
|---|---|---|---|
| 1 | Correggere `PCFSoftShadowMap` → `PCFShadowMap`; mostrare `renderer.info.render.calls` e `.triangles` nell'HUD fps; impostare `NeutralToneMapping` ed exposure | sistema un bug, dà la metrica per tutto il resto, cambia subito la resa del bianco | `renderer.ts`, HUD |
| 2 | Istanziare alberi, pali e bandierine (`InstancedMesh` a blocchi); unire cancello e linee | porta le draw call da ~575 a ~40–60 e libera il budget per gli effetti | `scene.ts`, `main.ts` |
| 3 | Luce e palette: sole a 25–35° di 3/4 rispetto alla camera, emisfero azzurro / terra chiara, albedo neve 0,85–0,9, `dithering` | il guadagno visivo più grande a costo zero | `renderer.ts`, `materials.ts` |
| 4 | Terreno: normali analitiche lisce + vertex color cotti (AO d'orizzonte, pendenza, battuta / fresca / kicker), con test Vitest | toglie i "cubotti" dalla superficie più grande | `terrain.ts`, `scene.ts`, `tests/` |
| 5 | Cupola cielo a gradiente con sole, nebbia d'altezza, 2–3 anelli di creste | profondità e scala del big air | nuovo `render/sky.ts`, `scene.ts` |
| 6 | Shader neve (`onBeforeCompile`): wrap, scintillio, corduroy con `#define` per livello; `compileAsync` di tutte le varianti | il "materiale neve" credibile | nuovo `render/snow.ts`, `quality.ts` |
| 7 | Ombre: medium 1024, box agganciato ai texel, terreno non caster; blob su low | lettura della quota in volo | `renderer.ts`, `quality.ts` |
| 8 | Rider passo (a): capsule, lathe e `RoundedBoxGeometry` al posto di box e cilindri da 6 lati | toglie il "robot" in mezza giornata senza rischi | `rider.ts` |
| 9 | Tavola procedurale da `BOARD` (sidecut, kick, camber, base colorata) | segnale di lettura delle rotazioni | `config.ts`, `rider.ts` |
| 10 | Rider passo (b): SkinnedMesh loft con pesi per costruzione e materiale `soft()` + rim | pelle continua nelle pieghe del tuck e del grab | `rider.ts`, nuovo `render/riderMesh.ts`, `tests/` |
| 11 | Pini e rocce nuovi con neve cotta; rocce solo sui ripidi fuori pista | contrasto scuro che fa leggere il bianco | `scene.ts` |
| 12 | Particelle: sprite procedurale, tinta, soft su h, sbuffo d'atterraggio; tracce a nastro | vita e "fisica visibile" | `spray.ts`, nuovo `render/trails.ts` |
| 13 | Solo high: bloom a ½–¼ + OutputPass, envMap statica del casco, neve che cade, tracce con render target | rifinitura dove c'è margine | `renderer.ts` |
| 14 | DPR dinamico a passi di 0,1 con anti-oscillazione; tier iniziale anche dal renderer string | regge il calo termico | `quality.ts` |
| 15 | Aggiornare `FEATURES.md` (✅ / ⚠️ / ❌) a ogni passo visibile; aggiornare la regola 2 di CLAUDE.md prima del passo 4 | regole 8 e 2 | `FEATURES.md`, `CLAUDE.md` |

### Tabella 5 — Decisioni necessarie dall'utente

| # | Decisione | Opzioni | Raccomandazione |
|---|---|---|---|
| 1 | **Regola 2 di CLAUDE.md**: oggi impone "low-poly cartoon, flat shading, materiali `flat(color)`" | (a) tenerla com'è (niente neve liscia, niente Standard sul rider); (b) riscriverla | (b), con un testo del tipo: *"Stile: 3D low-poly stilizzato-realistico, originale. Neve con normali lisce analitiche da h(x, z); rocce, alberi e ghiaccio sfaccettati. Palette pastello (`materials.ts`), niente texture realistiche. Materiali condivisi: `flat(color)` per gli oggetti, `snow` per il terreno, `soft(color)` solo per il rider. Ogni effetto dichiara il suo livello di qualità."* |
| 2 | Materiale del rider | Lambert flat / Lambert liscio / Standard + rim | Standard + rim su medium e high, Lambert su low |
| 3 | Approccio del rider | (a) primitive lisce; (b) SkinnedMesh in codice; (c) glTF originale fatto in Blender | (a) subito, poi (b); (c) solo con un modello originale con lo stesso scheletro |
| 4 | Tone mapper | Neutral / AgX / ACES | Neutral, con A/B contro AgX sulla scena vera |
| 5 | Direzione del sole e ora del giorno | un preset unico / 2–3 preset (mattino limpido, pomeriggio dorato, coperto) | un preset unico per ora; "coperto" solo con più contrasto da alberi e paletti |
| 6 | Ombre su medium | spente (come oggi) / 1024 PCF | 1024 PCF, con discesa automatica a blob |
| 7 | Post-processing su high | nessuno / bloom ½–¼ | bloom solo dopo che i passi 1–12 reggono i 60 fps |
| 8 | Neve che cade | mai / solo high / legata al meteo | legata a un preset meteo, spenta di default |
| 9 | Corduroy e tracce | sì / no | sì: sono i dettagli d'uso citati come segno di cura |
| 10 | Rilevamento GPU | euristica attuale + renderer string / libreria detect-gpu | niente dipendenza nuova (regola 10, fetch dei benchmark da CDN): estendere `guess()` |

### Tabella 6 — Fonti da ricontrollare quando la rete lo permette

| Fonte | Cosa verificare |
|---|---|
| [80.lv, Lonely Mountains Downhill](https://80.lv/articles/level-game-production-lonely-mountains-downhill) | testo completo su leggibilità, LOD, triangoli |
| [80.lv, snow shader UE5](https://80.lv/articles/setting-up-a-detailed-snow-shader-in-unreal-engine-5) | dettagli di fresnel, falso SSS, sparkle |
| [GDC Vault, Sand Rendering in Journey](https://gdcvault.com/play/1017742/Sand-Rendering-in) e [Zucconi pt.5](https://www.alanzucconi.com/2019/10/08/journey-sand-shader-5/) | formula del glitter, distribuzione delle normali |
| [Arm, post-processing on mobile](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives) | costi in ms e alternative nel materiale |
| [PlayCanvas optimization guidelines](https://developer.playcanvas.com/user-manual/optimization/guidelines/) | il target 100–200 draw call nel contesto |
| [three.js forum, XZFog](https://discourse.threejs.org/t/xzfog-horizontal-distance-fog-for-three-js-top-down-isometric-games/87619) e [Ground Fog](https://discourse.threejs.org/t/high-performance-ground-fog-for-games-three-js/88522) | punti d'iniezione del chunk fog |
| [three.js forum, Tone Mapping Overview](https://discourse.threejs.org/t/tone-mapping-overview/75204) | confronto Neutral / AgX |
| [three.js forum, Fresnel su Standard](https://discourse.threejs.org/t/fresnel-shader-or-similar-effect/9997) | patch del rim valida in r187 (`opaque_fragment`) |
| [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html) | proporzioni e numero di ossa (solo come riferimento) |
| [Mixamo FAQ, testo legale ufficiale](https://community.adobe.com/questions-696/mixamo-faq-licensing-royalties-ownership-eula-and-tos-589400) | ridistribuzione su web statico |
| [Firewatch, Game Developer](https://gamedeveloper.com/design/environmental-artist-jane-ng-only-made-23-unique-trees-for-i-firewatch-i-) | metodo dei pochi asset rifiniti |
| Sorgente locale `node_modules/three/src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js` | se `shadow.radius > 1` aumenta i tap del PCF in r187 |

## Conclusione

Il punto nuovo è che a Snow Game il realismo stilizzato costa meno che a quasi ogni altro gioco del genere. La neve nasce da una funzione analitica, quindi normali, occlusione, tinta per pendenza, ombra a blob e sfumatura delle particelle contro il suolo sono **calcoli esatti fatti una volta e testabili in Node**, non approssimazioni in screen space da pagare a ogni frame. La stessa scelta che ha reso deterministica la fisica (regola 3) è anche la base della grafica. Ne segue un ordine di lavoro preciso. Prima si recupera il budget istanziando gli oggetti, perché la scena di oggi spende in draw call quello che servirebbe alla luce. Poi si cambia la luce, che è gratis. Solo dopo si aggiungono shader ed effetti, ciascuno legato a un livello.

Rispetto all'idea di partenza, "più poligoni e materiali PBR", la ricerca porta altrove. Il terreno resta su Lambert, PBR va solo sul rider, il post-processing solo su high, e la differenza visibile la fanno tre colori ben scelti (sole caldo, ombra ceruleo, orizzonte uguale alla nebbia). Il rischio principale non è tecnico ma di identità. Senza una regola 2 riscritta, il progetto ha due stili in conflitto. Per questo la decisione 1 va presa prima del passo 4. Tutti i numeri di costo restano **STIMA** finché non vengono misurati sul telefono con `renderer.info` e il frame time di `quality.ts`.
