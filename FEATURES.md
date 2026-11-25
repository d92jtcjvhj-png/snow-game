# FEATURES — Snow Game

Inventario di **tutto ciò che il gioco ha oggi**, ricavato da `legacy/index.html`
(prototipo "Big Air Lab", file unico HTML + three.js r128 da CDN, ~1250 righe).
Il file legacy non va modificato: è il riferimento di comportamento.

Legenda: ✅ funziona · ⚠️ presente nel codice ma non raggiungibile / non usato · ❌ assente

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
