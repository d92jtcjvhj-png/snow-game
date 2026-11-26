# Ricerche

Note delle ricerche approfondite (deep research) usate per la fisica e la tecnica del gioco.
Ogni affermazione ha la sua fonte. Molte pagine erano bloccate dalla rete della sessione, quindi parecchie citazioni vengono dagli estratti dei motori di ricerca: lo dicono le note stesse.

| File | Argomento |
|---|---|
| `01-lamine-e-approccio-spin.md` | Lamina di stacco per frontside e backside, curva d'impostazione, switch e cab |
| `02-offaxis-flip-straight.md` | Cork, rodeo, misty, underflip; flip dritti; straight air |
| `03-speed-check-e-numeri.md` | Speed check reale, velocità allo stacco, geometria FIS, sciancratura, μ, CdA, pop |
| `04-deriva-laterale-coaching.md` | Curva troppo profonda o fuori tempo, quindi stacco in diagonale (fonti di coaching) |
| `05-deriva-laterale-fisica.md` | Fisica: Δψ = s/R, deriva = v·sin Δψ·T, limiti di presa, momento angolare |
| `06-tempismo-curva.md` | Quando iniziare la curva d'impostazione; effetti di presto e tardi |
| `07-linea-di-approccio.md` | **Report**: la linea vista dall'alto (forma, scostamento 1–2 m, inizio 25–40 m prima del labbro), presa a 55–75 km/h, quanto frena uno speed check |
| `07a-note-geometria-linea.md`, `07b-note-presa-e-speed-check.md` | Note di base del report 07 |
| `08-punto-e-angolo-di-stacco.md` | **Report**: lo stacco non è sempre al centro e dritto. Punto sul labbro e angolo d'uscita variano col tempismo della curva (presto: verso il lato della S, nel verso dello spin; tardi: contro lo spin). Kicker FIS ≥ 5 m |
| `08a-note-punto-di-stacco.md`, `08b-note-tempismo-e-uscita.md` | Note di base del report 08 |

| `09-speed-check-e-curva-per-potenza.md` | **Report**: speed check reale (tavola a 90° sui talloni, forza N·tanΨ·sinγ di Komissarov, ci si ferma sul 35° se Ψ > 35°); la S è la stessa per tutti gli spin (lo spin nasce dalle spalle) |
| `09a-note-speed-check.md`, `09b-note-curva-e-spin.md` | Note di base del report 09 |
| `10-passo-della-carica.md` | Note: carica continua (passi dell'1%) con tacche ogni 25%, non fasce del 5%: il dito sbaglia di ~1,5 mm, più di una fascia |

| `11-curve-fluide.md` | Note: curve collegate quasi sinusoidali (curvatura per lo zero solo un istante, niente tratti dritti), lamina che cresce e cala in modo progressivo, molla smorzata per l'inclinazione |
| `12-trick-fase-3.md` | **Report Fase 3**: rotazioni in asse e fuori asse (cork, double/triple/quad, rodeo, misty, underflip, flip), momento angolare e inerzia, record al 2026 (BS 2340), giudizio FIS, cosa decide atterraggio pulito o caduta |
| `12-note-*.md` | Note di base del report 12 (spin in asse, fuori asse, record e giudizio, esiti d'atterraggio) |
| `13-atterraggio-realistico.md` | **Report**: atterraggio reale (contatto di coda, gambe ~4× il peso, edge catch vs washout vs derapata, rotazione residua, esiti da stomp a slam) confrontato col modello del gioco, con modifiche proposte per priorità |
| `13a-note-biomeccanica-atterraggio.md`, `13b-note-catalogo-esiti.md` | Note di base del report 13 |
| `14-animazioni-rider.md` | **Report**: come si muove il corpo di un rider di big air (andatura, curve, speed check, carica e pop, raccolto e grab, apertura e spotting, assorbimento, mano a terra, butt check, cadute per tipo), proporzioni e limiti articolari, molle critiche e IK a due ossa; tabella di pose chiave per il codice. Quasi tutti gli angoli sono STIMA: la rete della sessione bloccava i testi completi |
| `14a`–`14e-note-*.md` | Note di base del report 14 (andatura, stacco, aria e grab, atterraggio e cadute, proporzioni e limiti) |
| `15-grab-e-accelerazione.md` | **Report**: come i grab cambiano la rotazione (il grab ridistribuisce L, non lo aggiunge): inerzie per posa su asse spin e asse flip con la tavola, catalogo di tutti i grab con fattori k_spin/k_flip, tempistica (presa, tenuta, rilascio), effetto sull'asse dei cork e sull'atterraggio, proposte per il gioco e test. Quasi tutto STIMA: la rete della sessione bloccava i testi completi |
| `15a`–`15d-note-*.md` | Note di base del report 15 (inerzia, catalogo grab, tempistica, fuori asse) |
| `16-grafica-realistica.md` | **Report**: rifare la grafica più realistica e meno a cubotti con uno stile originale: luce e palette, neve (normali lisce da h(x,z), toni, scintillio, battitura, tracce), cielo, nebbia, montagne a strati, alberi istanziati, particelle, tone mapping, rider morbido (SkinnedMesh generato in codice), budget e livelli di qualità, piano in passi e decisioni per l'utente |
| `16a`–`16d-note-*.md` | Note di base del report 16 (direzione artistica, neve/cielo/luce, rider morbido, budget di prestazioni) |
| `17-rotazioni-fuori-asse.md` | **Report**: com'è composta una rotazione fuori asse (gradi = 360 × ribaltamenti + twist ≥ 180, quindi inversioni ≤ floor((D−180)/360)), catalogo trick con inversioni e quando la testa passa sotto, modello a corpo rigido (inversione solo con asse > 45°), causa del difetto del gioco (ribaltamento indipendente dallo spin) e proposta: la spinta sceglie un numero intero di inversioni |
| `17a`–`17c-note-*.md` | Note di base del report 17 (cinematica, catalogo trick, tempi e giochi) |

**Scelta di design (utente) sul report 08.** Per il ritardo il report proponeva di tenere la S compressa. Si è scelto invece il modello "il labbro taglia la S": la linea ha lunghezza fissa dall'inizio della carica, e punto, angolo e lamina allo stacco dipendono solo da quando inizi a caricare e da quanto carichi. Nessun aggiustamento automatico.

Una ricerca sull'atterraggio fuori linea (quando si salva e quando si cade) è stata interrotta: va rifatta prima della Fase 3.
