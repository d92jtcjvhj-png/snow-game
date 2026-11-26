# FEATURES — Snow Game

Legenda: ✅ funziona · ⚠️ presente nel codice ma non raggiungibile / non usato · ❌ assente

# Parte A — Nuovo motore (`src/`)

Stato: **Fase 3**: tavola, approccio e stacco su un big air FIS, poi rotazioni in aria, grab e atterraggio (pulito → caduta). I punteggi arrivano più avanti. Il prototipo completo resta nel legacy (Parte B).
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
  - laterale da 0,12 (base piatta) a 1,3 (lamina ≥ 20°; ricerca: tetto ~1,5–2 g su neve dura);
  - oltre il limite di presa la tavola **derapa** (μ 0,6) e perde velocità.
- ✅ **Curva sulla lamina**:
  - curvatura limitata dalla presa: v²κ ≤ μ·a_n;
  - lamina = inclinazione del rider, atan(a_lat/a_n), da 200°/s;
  - R = R_sciancratura·cos φ, con sciancratura 8 m.
- ✅ Carico normale con la curvatura del terreno: transizione del kicker, uscita dell'atterraggio.
- ✅ Resistenza aerodinamica ½ρCdA v², CdA 0,5 (0,38 quando ti accucci per caricare).
- ✅ **Speed check reale** (ricerca `docs/research/09`, modello di Komissarov 2021):
  - appena premi, la tavola gira **a 90°, di traverso**, sui talloni, in ~0,25 s;
  - trascinando giù il rider schiaccia di più sui talloni: lamina da **25°** (premuto e basta) a **65°** (tutto giù);
  - forza frenante N·tanΨ·sinγ: di traverso su un pendio rallenti solo se la lamina supera la pendenza;
  - premuto e basta frena sull'approccio a 12° ma non sul drop-in a 35°; **tutto giù ti ferma anche sul drop-in** (da 35 km/h in ~1 s) e ti tiene fermo;
  - la neve frena lungo la direzione di marcia, quindi lo speed check non devia mai;
  - **speed check durante la curva d'impostazione = linea rovinata**: la S si interrompe e riparte da dove sei quando lasci il freno (di solito esci storto o manchi il kicker).
- ✅ **Il giocatore non sterza mai.** Quando non c'è una curva, il rider riporta la tavola in linea con la marcia.

## A4. Curva automatica pre-salto (`src/physics/approach.ts`)
- ✅ **Parte quando inizi a caricare** e il lato della carica è deciso.
- ✅ **Lamina di stacco reale** (rider regular, tabella `TAKEOFF_EDGE`):
  - frontside → tallone (heel);
  - backside → punta (toe);
  - straight air e flip dritti → base piatta, senza curva.
- ✅ **Linea reale vista dall'alto, fluida e completa** (ricerche `docs/research/07` e `11`): curve sinusoidali, senza tratti dritti, come le curve collegate vere. Frontside, rider regular:
  - **apertura** dal lato opposto (~0,5 m, di punta);
  - **curva grande** sul lato della lamina di stacco (di tallone, fino a 1,25–1,5 m dall'asse);
  - **rientro** di punta verso l'asse;
  - **tallone** sul kicker, ancora in curva ("carve up and off the lip"), parallelo all'asse e centrato al labbro;
  - la lamina scorre in modo continuo (es. punta −21° → tallone 45° → punta −51° → tallone 30°), mai piatta a metà curva;
  - backside: lo stesso, a specchio.
- ✅ **Stessa linea per tutti gli spin** (ricerca 09: i coach usano la stessa entrata; lo spin nasce dalle spalle, Fase 3): lunghezza fissa, quindi il momento giusto è uguale per tutti; la larghezza cresce poco con la carica, da 1,25 m a 1,5 m dall'asse, dopo l'apertura iniziale. Fino a ~1,1 g laterale, lamina fino a 65° (ricerca: carving d'élite 66–71°): nessuna derapata.
- ✅ **Carica a passi dell'1%** (ricerca 10): continua, con tacche ogni 25% (visive e vibrazione su Android).
- ✅ Il rider **segue la linea** prevista, sia in posizione sia in direzione: se la potenza cambia mentre la curva è in corso (tastiera, o dito che trascina ancora), la linea si adatta e torna comunque in asse alla fine della S.
- ✅ **Apertura iniziale ampia** (~55% della curva grande, ~0,5 m dal lato opposto): curve più strette, quindi a carica alta un po' di derapata e ~5 km/h persi allo stacco (accettato).
- ✅ Durata naturale della linea: **2,8 s fino al labbro** alla velocità del momento (~62 m a 79 km/h).
- ✅ **Il labbro taglia la linea dove capita** (ricerca `docs/research/08`): la linea ha lunghezza fissa dall'inizio della carica e il rider non la adatta al kicker. **Punto di stacco, angolo d'uscita e lamina dipendono solo da quando inizi a caricare** e da quanto carichi (S più larga = effetto più forte).
- ✅ **Tempismo** (finestra "giusto": ±0,2 s), frontside 100%:
  - **giusto**: la S finisce al labbro: centro, dritto, sulla lamina di stacco;
  - **presto**: la S finisce prima e il rider continua la stessa curva sulla lamina di stacco ("gira troppo sul labbro"): esce in diagonale nel verso dello spin. Presto di 0,25 / 0,5 / 1 s: +3 / +6 / +12° (massimo), deriva 2,4 / 4,4 / 9 m;
  - **tardi**: il labbro cade dentro la S, quindi esce di traverso contro lo spin. Tardi di 0,25 / 0,5 / 1 s: −1,4 / −2 / −6°. Tardi di 1,4 s: sei ancora nella curva grande, sulla lamina sbagliata, con meno pop;
  - uscire di lato non vuol dire cadere: il giudizio dell'atterraggio arriva in Fase 3.
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
- ✅ **Rotazioni in aria** (ricerca `docs/research/12`, legacy `SIM`):
  - momento angolare fissato al pop dalla carica (potenza e verso), dal pop e dall'aiuto della curva (fino a +10%); in aria ω = L / I(posa);
  - inerzia: raccolto (grab) 2,0, neutro 2,5, aperto 3,5 kg·m² → raccolto ≈ 950°/s a piena carica; nessun tetto fisso (su questo salto ~1800 è il massimo pulito);
  - la rotazione parte in 0,28 s (spalle prima, tavola dopo);
  - **fuori asse con la levetta**: su = cork, giù = misty (FS) o rodeo (BS); senza carica su/giù = frontflip/backflip. La levetta vale per **tutta la carica**: basta spostarla mentre carichi, anche se la lasci prima di staccare il pollice;
  - nel nome i ribaltamenti sono al massimo giri − 1, come nei trick dei pro (es. Quint Cork 2160);
  - **asse a rampa**: piatto il primo mezzo giro, poi inclinato (35–70°, misty/rodeo più ripidi); aprirsi lo raddrizza a 130°/s. Ne esce inversioni = giri − 1 (double cork 1080, triple 1440…);
  - inversioni contate quando la testa va sotto i piedi;
  - **controrotazione** (pollice in aria dal lato opposto): frena e "parcheggia" fino a 180° nel busto, poi li restituisce ("Stalled" se tenuta a lungo); dallo stesso lato spinge +15%;
  - **shifty** senza rotazione: solo la tavola, rotazione netta zero.
- ✅ **Grab**: Nose, Mute, Indy, Tail (bottoni in aria o Q/W/E/R). Tenuto = raccolto e più veloce; lasciato = aperto, più lento e asse che si raddrizza; all'apice senza grab ti apri da solo. Conta se tenuto ≥ 0,15 s; vince il più lungo.
- ✅ **Nome del trick**: Frontside / Backside / Cab / Switch Backside + Double/Triple/Quad/Quint + Cork/Misty/Rodeo + gradi a multipli di 180 + grab; Frontflip/Backflip; Straight air, Shifty, Stalled.
- ✅ **Atterraggio = fisica + fasce** (ricerca 12):
  - errore della tavola rispetto alla marcia (mod 180°, più la rotazione residua): ≤ 8° perfetto, ≤ 16° pulito, ≤ 28° sporco, ≤ 45° molto sporco, oltre = caduta;
  - inclinazione del corpo rispetto alla verticale: 8 / 15 / 25 / 40°; capovolto = caduta;
  - impatto (caduta equivalente): 0,8 / 1,5 / 2,5 / 3,5 m;
  - zona: sul tavolo = sporco o peggio; sul knuckle = almeno molto sporco; fuori pista con tavola storta = caduta; di punta sbilanciato in avanti = un livello peggio;
  - vince la fascia peggiore; **tolleranza ×1,7** opzionale;
  - poi decide la fisica: la tavola tiene l'imbardata con cui atterra, quindi chi atterra storto derapa e frena;
  - **atterrare al contrario (~180°) è pulito e prosegui in switch** (stance della tavola nella fisica);
  - **caduta**: il rider si ribalta e scivola, frenato forte.
- ✅ **Scheda**: nome del trick, esito, nota, consiglio, diagramma della tavola, gradi reali, inversioni, grab, tempo in aria, punto d'atterraggio, impatto, errori; sotto, i dati di stacco.
- ❌ Punteggi e giudici: più avanti. Underflip e grab "tirati": più avanti.
- ❌ Switch e cab: la tabella delle lamine li prevede, ma il rider va sempre in avanti.
- ❌ Ollie / hop sull'approccio: nel legacy c'erano, qui il rilascio prima del kicker annulla la carica.

## A6. Comandi
- ✅ **Telefono**:
  - pollice sinistro libero: tieni premuto per iniziare la carica e la curva, trascina di lato per verso e potenza (barra con tacche 25/50/75/100% e vibrazione), stacca per il pop;
  - a destra, sulla neve: **pad speed check** (tieni premuto e trascina giù = più forte) e levetta dell'asse su/giù (cork, misty/rodeo, flip);
  - a destra, in aria: **4 bottoni grab**; il pollice sinistro fa controrotazione / shifty.
- ✅ **Tastiera**: Z/X carica (sinistra/destra) e in aria controrotazione, Spazio carica dritta, B speed check, ↑/↓ asse, Q/W/E/R grab, R riprova, Invio = Gioca.

## A7. Grafica
- ✅ Stile low-poly cartoon: flat shading, palette del legacy, abeti e montagne con seed fisso, nebbia.
- ✅ Rider a blocchi portato dal legacy: nose giallo e tail viola, petto bianco sul lato punta.
  - Si inclina con la lamina e la tavola rolla con lui.
  - Carica le spalle in senso opposto al verso, proporzionalmente alla carica.
  - Si accoscia; braccia aperte in aria.
- ✅ Spruzzo di neve in derapata e nello speed check; il numero di particelle dipende dalla qualità.
- ✅ Kicker leggermente azzurro, linea blu sul labbro, linea rossa sul knuckle, tacche ogni 5 m.
- ✅ Bordi blu dell'atterraggio, bandierine, reti arancioni, cancello di partenza.
- ✅ Camera laterale sul lato punta, un po' dietro, come nel legacy: si leggono bene lamina e inclinazione. **Inquadratura rigida**: stessa posizione rispetto al rider a terra e in volo, mira esattamente su di lui e lo segue quasi senza ritardo, così durante il salto l'inquadratura non oscilla. Resta sempre almeno 2 m sopra la neve.
- ✅ **Qualità adattiva**:
  - livelli low / medium / high: pixel ratio 1 / 1,5 / 2; ombre solo high; alberi 90 / 150 / 220; particelle 60 / 150 / 260;
  - scende se il frame resta > 20 ms per 2 s, sale se resta < 12 ms per 5 s.
- ❌ Animazioni del rider più ricche, tracce sulla neve, effetti in aria.

## A8. Interfaccia e allenamento
- ✅ Intro con i comandi, HUD (km/h, lamina heel/toe con gradi, fps e qualità), barra di carica con "Frontside 80% · stacco di tallone".
- ✅ Messaggi contestuali: "Carica ora!", "Troppo presto!", "Tardi!", "Stacca il pollice sul labbro".
- ✅ ⚙ Allenamento, salvato in localStorage:
  - **Indicatori**: fascia gialla dove iniziare a caricare, anello del punto d'atterraggio previsto e, in aria, gradi in diretta, inversioni, grab, **bussola** della tavola rispetto alla marcia e **"Apri ora!"**;
  - **Rallentatore in aria**;
  - **Tolleranza atterraggio ×1,7**.
- ✅ Schermata "gira il telefono in verticale".
- ❌ Suoni: da fare.

## A9. Test e deploy
- ✅ 54 test Vitest headless:
  - `snow`: sciancratura, anisotropia, presa limitata, derapata;
  - `board`: rettilineo, curva, traverso, speed check (stop sul 35°, check leggero, tavola a 90°), determinismo;
  - `bigair`: geometria FIS, mesh uguale al collider, velocità e sweet spot, riproducibilità;
  - `approach`: giusto, presto, tardi (verso opposto), molto tardi (lamina non settata), potenza, frontside/heel, backside/toe, straight e flip piatti, niente pop senza rilascio;
  - `spin`, `landing`, `trick`, `run3` (salto completo: pulito, sovra-rotazione, straight air, caduta);
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
