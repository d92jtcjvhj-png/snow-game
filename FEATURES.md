# FEATURES — Snow Game

Legenda: ✅ funziona · ⚠️ presente nel codice ma non raggiungibile / non usato · ❌ assente

# Parte A — Nuovo motore (`src/`)

Stato: **Fase 2, la tavola e tutto ciò che porta allo stacco** su un big air FIS. Rotazioni, grab, trick e giudizio dell'atterraggio arrivano in Fase 3. Il prototipo completo resta nel legacy (Parte B).
Le ricerche su cui si basa la fisica sono in `docs/research/`.

## A1. Stack e struttura
- ✅ Vite 8 + TypeScript strict + three `0.187.0` + `@dimforge/rapier3d-compat 0.21.0`, versioni pinnate esatte.
- ✅ Cartelle `src/core`, `src/physics`, `src/world`, `src/render`, `src/ui`; `physics` non importa three.
- ✅ Regole di progetto in `CLAUDE.md`.

## A2. Salto: big air FIS (`src/world/bigair.ts`)
- ✅ Profilo parametrico (distanze orizzontali):
  - drop-in 70 m a 35°;
  - approccio a 12°, dove si fanno speed check e curva;
  - set-up point piano alla base del kicker.
- ✅ Kicker a transizione circolare (R 30 m) con labbro a 28°, alto 4 m, largo 7 m, fianchi a 45°.
- ✅ Gap/tavolo di 24 m, knuckle arrotondato, atterraggio a 38° lungo 28 m, uscita e run-out.
- ✅ Larghezze: run-in ±10 m; atterraggio da ±9 m (in cima) a ±13 m (in fondo); oltre, neve fresca che sale.
- ✅ Mesh three e collider trimesh di Rapier nascono dalla stessa griglia h(x, z).
- ✅ Velocità tarate sui dati reali:
  - senza speed check si stacca a ~62 km/h e si atterra lunghi (~18 m dopo il knuckle);
  - con ~5 m di speed check a pieno si stacca a ~56 km/h e si atterra nello sweet spot dopo il knuckle, con ~2,4 s di volo.

## A3. Fisica della neve (`src/physics`)
- ✅ Loop a passo fisso 1/120 s con interpolazione, deterministico.
- ✅ **Contatto con la neve**: vincolo nostro, esatto, sulla superficie analitica h(x, z).
  - Il contatto di Rapier sui triangoli perdeva energia a caso: la velocità allo stacco cambiava fino a 6 km/h.
  - Rapier integra il corpo; le collisioni con oggetti (rail, reti) arriveranno con lui.
- ✅ **Attrito anisotropo**:
  - longitudinale μ 0,06;
  - laterale da 0,12 (base piatta) a 1,0 (lamina ≥ 20°);
  - oltre il limite di presa la tavola **derapa** (μ 0,6) e perde velocità.
- ✅ **Curva sulla lamina**:
  - curvatura limitata dalla presa: v²κ ≤ μ·a_n;
  - lamina = inclinazione del rider, atan(a_lat/a_n), da 200°/s;
  - R = R_sciancratura·cos φ, con sciancratura 8 m.
- ✅ Carico normale con la curvatura del terreno: transizione del kicker, uscita dell'atterraggio.
- ✅ Resistenza aerodinamica ½ρCdA v², CdA 0,5 (0,38 quando ti accucci per caricare).
- ✅ **Speed check analogico**:
  - la tavola va di traverso fino a 80° × intensità, sulla lamina di tallone (15° + 20° × intensità);
  - più la lamina è piantata, più gratta: attrito di derapata da 0,6 fino a 1,1;
  - premere il pad = speed check al 50%, trascinare giù = fino al 100%;
  - a pieno rallenta anche sul drop-in a 35°; sull'approccio a 12° toglie ~6 m/s in un secondo;
  - la neve frena lungo la direzione di marcia, quindi lo speed check non devia mai.
- ✅ **Il giocatore non sterza mai.** Quando non c'è una curva, il rider riporta la tavola in linea con la marcia.

## A4. Curva automatica pre-salto (`src/physics/approach.ts`)
- ✅ **Parte quando inizi a caricare** e il lato della carica è deciso.
- ✅ **Lamina di stacco reale** (rider regular, tabella `TAKEOFF_EDGE`):
  - frontside → tallone (heel);
  - backside → punta (toe);
  - straight air e flip dritti → base piatta, senza curva.
- ✅ **S reale**, con curvatura nulla all'inizio e alla fine:
  - frontside: tallone → punta (curva d'impostazione verso il lato del kicker) → tallone;
  - backside: lo stesso, a specchio;
  - finisce dritta, in linea, alla base del kicker;
  - dall'ultimo cambio di spigolo il rider si mette progressivamente sulla lamina di stacco e la **tiene visibilmente su tutto il kicker** (15° + 15° × potenza, fino a 30°), senza curvare: è la piattaforma da cui stacca.
- ✅ **S fluida, in carving pulito**:
  - la lamina passa da un lato all'altro in modo continuo;
  - nel punto più stretto la S usa il 70% della presa disponibile alla velocità di quel momento, quindi se il tempismo è giusto non derapa mai;
  - a velocità alta la S è più dolce, come nella realtà (raggi 20–100 m);
  - **più carica = S più ampia** (dal 40% al 100% di quell'ampiezza) e lamina più inclinata (fino a ~40°);
  - lo scostamento laterale è piccolo (~0,2–0,4 m): a queste velocità una curva d'impostazione vera è appena accennata.
- ✅ Durata naturale della S: **1,5 s** alla velocità del momento (~30 m a 75 km/h): si carica ~2,2 s prima del labbro. Prima della rampa il rider corregge la linea a occhio; sulla rampa non può più.
- ✅ **Tempismo** (finestra "giusto": ±0,2 s):
  - **giusto**: uscita dritta, errore ~0,5°, deriva < 0,5 m;
  - **presto**: la S finisce prima, il rider si mette sulla lamina di stacco e carva di traverso. Presto di 0,35 s: 4° e 3 m di deriva. Presto di 0,6 s: 5,6° e 4,4 m. Presto di 1 s: manchi il kicker. Uscire di lato non vuol dire cadere;
  - **tardi**: S schiacciata; pop e aiuto della curva alla rotazione calano in modo graduale (tardi di 0,35 s: 91%; 0,6 s: 84%; 1 s: 73%, con derapata).
- ✅ **Rilascio prima del kicker** = carica annullata: il rider si raddrizza.

## A5. Stacco e volo
- ✅ **Pop** come nel legacy: rilascio entro 0,18 s dal labbro = perfetto, poi cala.
  - Perfetto vale 1,2 m/s lungo la normale della rampa.
  - È ridotto se la tavola derapa o se stacchi sulla lamina sbagliata.
- ✅ Volo balistico vero, con resistenza dell'aria e direzione reale, quindi con la deriva laterale.
- ✅ **Scheda di stacco**:
  - trick e carica;
  - velocità allo stacco;
  - pop;
  - lamina di stacco, giusta o sbagliata;
  - inizio curva, presto o tardi di quanti secondi;
  - direzione allo stacco;
  - deriva in volo;
  - punto d'atterraggio rispetto al knuckle (anche "sul tavolo");
  - tempo in aria;
  - impatto (caduta equivalente);
  - aiuto della curva alla rotazione.
- ❌ Rotazioni in aria, grab, trick, giudizio dell'atterraggio, cadute: Fase 3.
- ❌ Switch e cab: la tabella delle lamine li prevede, ma il rider va sempre in avanti.
- ❌ Ollie / hop sull'approccio: nel legacy c'erano, qui il rilascio prima del kicker annulla la carica.

## A6. Comandi
- ✅ **Telefono**:
  - pollice sinistro libero: tieni premuto per iniziare la carica e la curva, trascina di lato per verso e potenza (barra con tacche 25/50/75/100% e vibrazione), stacca per il pop;
  - a destra, sulla neve: **pad speed check** (tieni premuto e trascina giù = più forte) e levetta dell'asse su/giù (per ora decide solo flip → base piatta).
- ✅ **Tastiera**: Z/X carica (sinistra/destra), Spazio carica dritta, B speed check (sale in 0,6 s), ↑/↓ asse, R riprova, Invio = Gioca.

## A7. Grafica
- ✅ Stile low-poly cartoon: flat shading, palette del legacy, abeti e montagne con seed fisso, nebbia.
- ✅ Rider a blocchi portato dal legacy: nose giallo e tail viola, petto bianco sul lato punta.
  - Si inclina con la lamina e la tavola rolla con lui.
  - Carica le spalle in senso opposto al verso, proporzionalmente alla carica.
  - Si accoscia; braccia aperte in aria.
- ✅ Spruzzo di neve in derapata e nello speed check; il numero di particelle dipende dalla qualità.
- ✅ Kicker leggermente azzurro, linea blu sul labbro, linea rossa sul knuckle, tacche ogni 5 m.
- ✅ Bordi blu dell'atterraggio, bandierine, reti arancioni, cancello di partenza.
- ✅ Camera laterale sul lato punta, un po' dietro, come nel legacy: si leggono bene lamina e inclinazione. Resta sempre almeno 2 m sopra la neve, anche sul drop-in a 35°. In volo si allontana e inquadra rider e atterraggio previsto.
- ✅ **Qualità adattiva**:
  - livelli low / medium / high: pixel ratio 1 / 1,5 / 2; ombre solo high; alberi 90 / 150 / 220; particelle 60 / 150 / 260;
  - scende se il frame resta > 20 ms per 2 s, sale se resta < 12 ms per 5 s.
- ❌ Animazioni del rider più ricche, tracce sulla neve, effetti in aria.

## A8. Interfaccia e allenamento
- ✅ Intro con i comandi, HUD (km/h, lamina heel/toe con gradi, fps e qualità), barra di carica con "Frontside 80% · stacco di tallone".
- ✅ Messaggi contestuali: "Carica ora!", "Troppo presto!", "Tardi!", "Stacca il pollice sul labbro".
- ✅ ⚙ Allenamento, salvato in localStorage:
  - **Indicatori**: fascia gialla sulla neve che indica dove iniziare a caricare alla velocità attuale, e anello del punto d'atterraggio previsto;
  - **Rallentatore in aria**.
- ✅ Schermata "gira il telefono in verticale".
- ❌ Suoni: da fare.

## A9. Test e deploy
- ✅ 26 test Vitest headless:
  - `snow`: sciancratura, anisotropia, presa limitata, derapata;
  - `board`: rettilineo, curva, traverso, speed check, determinismo;
  - `bigair`: geometria FIS, mesh uguale al collider, velocità e sweet spot, riproducibilità;
  - `approach`: giusto, presto, tardi, potenza, frontside/heel, backside/toe, straight e flip piatti, niente pop senza rilascio;
  - `loop`.
- ✅ GitHub Actions: typecheck + test + build a ogni push; deploy su GitHub Pages da `main`.
- ⚠️ Il bundle è grande (~1,8 MB gzip), soprattutto per il WASM di Rapier: da ottimizzare.

---

# Parte B — Prototipo legacy (`legacy/index.html`)

Inventario di **tutto ciò che il prototipo ha oggi**, ricavato da `legacy/index.html`
(prototipo "Big Air Lab", file unico HTML + three.js r128 da CDN, ~1250 righe).
Il file legacy non va modificato: è il riferimento di comportamento.

---

## 1. Struttura generale

- ✅ Un solo file HTML: CSS inline, three.js r128 da cdnjs, font Google (Barlow Condensed, Inter).
- ✅ Tre moduli JS nello stesso file:
  - `PHYS` — terreno e fisica di base (deterministica, nessun rendering).
  - `SIM` — simulazione del rider a passo fisso (1/120 s), esportabile per test in Node (`module.exports`).
  - IIFE di gioco — rendering, input, HUD, menu.
- ✅ Lingua dell'interfaccia: italiano.
- ✅ Debug: `window.__st()` restituisce lo stato della simulazione.

## 2. Modalità, livelli e flusso di gioco

- ✅ **Un solo livello**: una pista con un unico kicker (big air). Nessuna selezione livello.
- ✅ Flusso: schermata **Intro** (regole + "Gioca") → discesa → salto → atterraggio → **pannello Risultato** → "Riprova" (ricomincia da capo).
- ✅ Fasi della simulazione: `ground` (discesa) → `air` (volo) → `ride` (atterrato) o `crash` (caduta) → `done` (dopo 1,4 s / 1,6 s compare il risultato).
- ✅ Hop sul run-in: un ollie prima del kicker con atterraggio non caduto fa **continuare la discesa** (toast "Ollie: pulito · ora in switch").
- ✅ Riding **switch**: se si atterra al contrario si continua in switch; i nomi dei trick lo tengono in conto (Cab, Switch Backside, Switch Straight air).
- ❌ Nessuna run multi-salto, nessun rail/box, nessun halfpipe, nessuna classifica (il testo dice "in classifica tutto sarà manuale", ma non esiste).

## 3. Terreno (profilo 2D lungo z, uguale su tutta la larghezza)

| Tratto | Valore |
|---|---|
| Run-in | 160 m a 15° |
| Raccordo run-in → piano | Hermite cubica su 8 m |
| Piano di transizione | 6 m |
| Kicker: parte curva | 7 m (parabola) |
| Kicker: parte dritta finale | 3 m a 22° (labbro) |
| Table (deck) | 14 m in piano dopo il labbro |
| Knuckle | arrotondato su ±3 m |
| Atterraggio | da 34° al knuckle fino a 50° dopo 20 m, lungo 55 m (profilo ≈ EFH costante, tabellato ogni 0,25 m) |
| Uscita | curva di 18 m fino al piano |

- ✅ Pista larga ±13 m; oltre, sponde che salgono; oltre 18 m collina naturale.
- ✅ Partenza a z = 75 m con 3 m/s (velocità naturale al labbro ≈ 50 km/h = sweet spot).
- ✅ Bordo pista: se |x| > 13 m il rider viene tenuto dentro con perdita di velocità.

## 4. Fisica

### A terra
- ✅ Gravità 9,81; massa 75 kg; attrito neve **μ = 0,06** (isotropo, coulombiano).
- ✅ Resistenza aerodinamica quadratica con CdA per posa: tuck 0,35 · normale 0,5 · aperto 0,65.
- ✅ Accosciata (crouch) mentre si carica → posa tuck (meno drag).
- ✅ **Freno**: −7 m/s² mentre premuto (solo in discesa).
- ✅ Perdita di velocità in curva (`CARVE_DRAG`) e velocità minima 0,5 m/s.
- ⚠️ Sterzo (`stickX` → yaw, max 1,1 rad/s, ±55°): previsto dal motore ma **nessun comando lo pilota a terra** (lo stickX viene impostato solo dai grab). In pratica il rider va dritto.
- ⚠️ "Memoria di carving" (`carve`) calcolata ma non usata dal salto.
- ✅ Curva pre-salto **solo visiva** e automatica negli ultimi 26 m quando si carica.
- ✅ Dopo l'atterraggio il rider si raddrizza da solo.

### Stacco (pop)
- ✅ Rilascio del pollice **sul kicker**: il pop avviene al labbro; la qualità dipende dall'anticipo: perfetta se rilasci entro 0,18 s dal labbro, poi cala linearmente fino a 0,25. Dimezzata se la tavola è storta > 10°.
- ✅ Pop perfetto = +1,2 m/s perpendicolare al kicker.
- ✅ Rilascio **sul piatto** (prima del kicker) = ollie da 1,8 m/s, qualità 0,7.
- ✅ Nessun rilascio = si stacca senza pop; un rilascio entro 0,15 s dopo il labbro dà ancora una rotazione indebolita.
- ✅ Il volo parte dal punto del labbro con la pendenza del kicker (non del deck).

### In aria
- ✅ Volo balistico con drag (integrazione esplicita a 120 Hz).
- ✅ Il rider "legge" il salto: tempo di volo e tempo all'apice stimati simulando in avanti.
- ✅ **Rotazione = potenza × tempo**: la carica decide la velocità angolare (spin max 620°/s, flip max 320°/s), non i gradi; i gradi dipendono dal tempo in aria.
- ✅ Ramp-in della rotazione nei primi 0,28 s (spalle prima, tavola dopo).
- ✅ Effetto della posa sulla velocità di rotazione: grab/tuck ×1,2 · compatto ×1,05 · aperto ×0,85.
- ✅ **Aprirsi** (lasciare il grab, o all'apice senza aver grabbato) rallenta e **livella l'asse cork** (130°/s).
- ✅ **Controrotazione**: pollice dal lato opposto frena (fino a 260°/s) e "parcheggia" fino a 180° di rotazione nel busto, poi restituiti a 300°/s. Stesso lato = spinta +15%.
- ✅ **Stalled**: se si frena > 0,3 s con > 45° parcheggiati, il trick viene chiamato "Stalled".
- ✅ **Shifty**: senza rotazione, il pollice ruota la tavola fino a 85°.
- ✅ Conteggio **inversioni** (quante volte si passa a testa in giù).
- ✅ Assi fuori asse: cork (su), misty (giù, frontside), rodeo (giù, backside), inclinazione 35°–70° in base alla levetta.
- ⚠️ Underflip: nome previsto, mai generato.

### Atterraggio
- ✅ Valutato con: errore di yaw tavola vs direzione (in linea o in switch), inclinazione del corpo vs verticale, **EFH** (altezza di caduta equivalente dalla velocità perpendicolare al pendio).
- ✅ Quattro esiti:
  - **Perfetto**: yaw ≤ 8°, tilt ≤ 10°, EFH ≤ 1,5 m
  - **Pulito**: yaw ≤ 16°, tilt ≤ 18°, EFH ≤ 2,5 m
  - **Sporco**: il resto
  - **Caduta**: tilt > 60°, yaw > 40°, tilt > 38° o EFH > 4,2 m
- ✅ Opzione "Tolleranza atterraggio" moltiplica le soglie ×1,7.
- ✅ Velocità conservata: 92% (pulito/perfetto), 75% (sporco), 45% e frenata (caduta).
- ✅ Note e consigli testuali sull'errore (rotazione corta/lunga, asse non livellato, atterri sul tavolo, troppo lungo…).

## 5. Trick e nomi

- ✅ Spin: Frontside / Backside / Cab / Switch Backside + gradi arrotondati a 180.
- ✅ Off-axis: Cork / Misty / Rodeo, con Double/Triple/Quad dalle inversioni.
- ✅ Flip: Frontflip / Backflip, Double/Triple…
- ✅ Straight air, Shifty, Stalled.
- ✅ Grab (tenuto ≥ 0,15 s, vince il più lungo): **Nose, Mute, Indy, Tail** raggiungibili.
- ⚠️ Japan, Melon, Crail, Stalefish, Double grab: nomi definiti ma non raggiungibili con i 4 bottoni.

## 6. Punteggio

- ❌ **Nessun punteggio numerico**, nessun record, nessuna classifica.
- ✅ Valutazione qualitativa (Perfetto / Pulito / Sporco / Caduta) e scheda risultato con:
  nome trick, nota, consiglio, diagramma tavola all'atterraggio (verde/arancio/rosso), carica rotazione %, fuori asse %, rotazione reale, inversioni, grab e durata, qualità del pop, velocità allo stacco, tempo in aria, distanza dal knuckle, impatto (EFH), errore tavola, inclinazione.
- ⚠️ Campi `reqDeg`, `effDeg`, `carveUsed`, `barDegrees`, `SHOULDER_CAP`, `CARVE_CAP`, `SMALL_BONUS`: residui di versioni precedenti, sempre 0 / non usati.

## 7. Comandi

### Telefono (touch, solo verticale)
- ✅ **Metà sinistra, pollice libero**: tieni premuto e trascina di lato = carica potenza rotazione (zona morta 10 px, pieno a 120 px, il lato decide il verso). Compare una barra flottante con tacche 25/50/75/100% e vibrazione ogni 25%.
- ✅ **Stacca il pollice** sul labbro (linea blu) = ollie/pop. Senza carica = salto dritto.
- ✅ **In aria** lo stesso pollice: lato opposto = controrotazione, stesso lato = spinta; senza spin = shifty.
- ✅ **Destra, a terra**: bottone **Freno** (tieni) + **levetta verticale**: su = cork / frontflip, giù = misty-rodeo / backflip.
- ✅ **Destra, in aria**: freno e levetta spariscono, compaiono 4 bottoni grab: **Nose, Mute, Indy, Tail** (tieni).
- ✅ Vibrazione (navigator.vibrate) su tocchi, tacche, e "Apri ora!".
- ✅ Blocco zoom/gesture, safe-area iPhone, schermata "Gira il telefono in verticale" in landscape su touch.

### Tastiera (PC)
- ✅ **Z / X** = carica a sinistra / destra (cresce nel tempo), **Spazio** = tieni senza carica (ollie al rilascio).
- ✅ **Freccia su / giù** = asse (cork-frontflip / misty-rodeo-backflip).
- ✅ **B** = freno.
- ✅ **Q / W / E / R** = Nose / Mute / Indy / Tail (in aria).
- ❌ Nessun supporto gamepad, nessun remapping.

## 8. Menu e interfaccia

- ✅ **Intro** con spiegazione dei comandi e bottone "Gioca".
- ✅ Bottone **?** riapre l'intro (mette in pausa).
- ✅ Bottone **⚙ Allenamento** con 3 opzioni salvate in `localStorage` (`snowproto.assist`):
  - Rallentatore in aria (simulazione a 0,5×)
  - Tolleranza atterraggio (soglie ×1,7)
  - Indicatori (gradi live, cerchio di atterraggio, bussola, "Apri ora!") — attivo di default
- ✅ HUD: velocità in km/h; messaggi contestuali ("Freno a destra per regolare la velocità", "Stacca il pollice sul labbro", "Tieni il grab…", "Apri ora!", "Aperto"); testo trick live (gradi, inversioni, grab); percentuale di carica e nome dell'asse.
- ✅ **Bussola** tavola (in aria, con indicatori): vista dall'alto della tavola rispetto alla direzione, verde/arancio/rosso, "In linea" / gradi / "Capovolto".
- ✅ **Anello di atterraggio previsto** sulla neve, colorato per durezza dell'impatto.
- ✅ Toast per gli hop sul run-in.
- ⚠️ Elementi CSS/HTML non usati: `#carve` meter, `.pad`/`#carveKnob`/`#grabPad`, `#hintL` (testo presente ma la zona è coperta).

## 9. Grafica

- ✅ three.js r128, WebGLRenderer con antialias, pixel ratio max 2.
- ✅ Stile low-poly flat-shaded (MeshLambert + flatShading), cielo azzurro `#a9cde8`, nebbia 70–300 m.
- ✅ Luci: emisferica + direzionale (sole). **Nessuna ombra reale**.
- ✅ Terreno: mesh a griglia con vertex color (kicker leggermente più azzurro, sponde più grigie), risoluzione fine (0,25 m) intorno al salto.
- ✅ Segni di tintura sulla neve: linea blu sul labbro, linea rossa sul knuckle, tacche blu ogni 6 m sull'atterraggio.
- ✅ Bandierine rosse ai bordi della zona salto; cancello di partenza arancione.
- ✅ 170 abeti low-poly (coni a 6 lati, due verdi) e montagne-cono sullo sfondo (seed fisso → sempre uguali).
- ✅ **Rider a blocchi**: tavola metà gialla (nose) e metà viola (tail), gambe, busto blu con petto bianco e schiena scura, testa rossa icosaedro, occhiali arancioni, braccia snodate.
- ✅ Animazioni: accosciata, gambe tese nel pop, busto che si carica in senso opposto e si srotola al labbro, braccia aperte quando ci si apre, braccia ai punti di grab, sterzata con inclinazione, **speed check** in frenata (tavola di traverso + spruzzo di neve a particelle), caduta con ribaltamento.
- ✅ "Ombra" della tavola proiettata sulla neve con punta gialla (direzione del nose), sfuma con l'altezza.
- ✅ Camera laterale alta (−15 m di lato, +7,5 m), che segue il rider con smorzamento; in aria si sposta un po' verso l'atterraggio previsto.
- ❌ Nessun post-processing, nessuna qualità adattiva, nessuna ombra dinamica, nessuna traccia sulla neve.

## 10. Suoni

- ❌ **Nessun audio**: niente effetti, niente musica. Solo feedback aptico (vibrazione) su telefono.

## 11. Persistenza e piattaforma

- ✅ `localStorage` solo per le opzioni di allenamento.
- ✅ Funziona su PC (tastiera) e telefono (touch, verticale).
- ❌ Nessun build, nessun test automatico nel repo (il codice è predisposto per test in Node ma i test non ci sono), nessun deploy.
