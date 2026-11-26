# La lamina a valle decide la caduta

Un atterraggio reale da big air dura **0,15–0,3 s**. Nella maggior parte dei casi la tavola tocca **di coda (57%)**. Le gambe frenano la sola componente di velocità **normale** al pendio, con picchi misurati di circa **4 volte il peso corporeo**. Lo yaw residuo da solo non fa cadere. Fa cadere quando, mentre la tavola scivola di lato, **la lamina dalla parte verso cui scivola (quella a valle) si abbassa e morde**: la tavola si ferma, il corpo prosegue e il rider viene lanciato oltre quella lamina. Se invece il carico sta sulla lamina a monte o sulla base piatta, la tavola derapa e perde velocità, e il rider resta in piedi. Gli esiti reali sono una scala continua, dallo stomp alla mano a terra, al revert, al butt check, fino a washout, spigolo e faccia avanti. La scala si legge da poche variabili: yaw e suo verso, lamina caricata, pitch avanti/indietro, EFH e posizione rispetto al knuckle. Il modello attuale del gioco prende bene le variabili d'ingresso e ha soglie coerenti con la ricerca. Ha però tre lacune di fondo. Primo, **non distingue il verso**: errori in anticipo e in ritardo, in avanti e all'indietro, contano allo stesso modo. Secondo, **non conosce la lamina al contatto**: la tavola arriva sempre piatta, quindi spigolo e washout non possono esistere. Terzo, **dopo il contatto la fisica quasi non punisce**: a 30° di yaw si perdono circa 0,2 m/s, mentre la stima dalla ricerca è 0,7–1,3 m/s. Le modifiche proposte sono poche e deterministiche: un impulso d'attrito all'impatto, la rotazione residua con il segno, la lamina dedotta dal rollio del corpo, un pitch asimmetrico, e conseguenze fisiche distinte per ogni esito.

> **Come leggere il report.** Tutto viene da abstract e snippet: i testi completi erano bloccati (vedi le note di accesso nelle fonti).
> - I fatti con fonte sono citati in linea.
> - **[derivazione]** indica fisica mia, calcolata da valori citati.
> - **[stima]** indica una proposta di design senza fonte, da tarare in playtest.

## Il contatto si gioca in 0,15–0,3 s sulla corsa delle gambe

**Sequenza del contatto.** In 704 salti filmati in snowpark neozelandesi la tavola toccava **di coda nel 57%** dei casi, piatta nel 32% e **di punta nell'11%**. Studi cinetici precedenti associavano il contatto di coda a carichi d'impatto più bassi ([McAlpine, Kurpiers, Kersting 2008, SPONET](https://sponet.de/sponet/Record/3042548?lng=en); [BISp](https://www.bisp-surf.de/Record/PU201111009632)). Toccare di punta è il caso cattivo: **OR 4,01** per la caduta (IC 2,26–7,11) ([McAlpine, tesi Auckland 2010](https://researchspace.auckland.ac.nz/handle/2292/6655)). La tecnica insegnata è la stessa ovunque. Le gambe si distendono un poco prima del contatto e si flettono all'impatto. Si atterra a base piatta e solo dopo si rulla sulla lamina voluta ([abom.com](https://abom.com/how-to-jump-on-a-snowboard/); [snowboardbible](https://snowboardbible.com/list-of-snowboarding-tricks/)).

**Forze misurate.** Con pedane di forza montate tra tavola e attacco, la compressione media di picco è **4,14 BW (DS 1,63) al piede anteriore e 4,10 BW (DS 1,66) al posteriore**. Al contatto il rider "viene forzato in flessione di caviglia e ginocchio" ([ISBS 2012, McAlpine et al.](https://ojs.ub.uni-konstanz.de/cpa/article/view/5172/4748); dallo snippet non è chiaro se il valore sia per piede). Ampiezza e velocità di crescita delle forze **aumentano con la dimensione del salto** ([tesi McAlpine](https://researchspace.auckland.ac.nz/handle/2292/6655?show=full)). Nella nazionale tedesca di halfpipe il carico all'atterraggio era ripartito tra i piedi in modo più uniforme che allo stacco ([SPONET 4075893](https://www.sponet.de/sponet/Record/4075893?lng=en)). Due confronti da altri sport: nello slopestyle con gli sci, solette di pressione misurano circa **2 BW** sia su un 180 sia su uno switch 180 ([Löfquist et al., PMC7745909](https://pmc.ncbi.nlm.nih.gov/articles/PMC7745909)). Nel salto con gli sci si va da 1,1 a 5,3 BW per piede ([Bessone et al., *Sensors* 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6539877)). Sui rider freestyle d'élite, gli atterraggi straight air regular danno **le accelerazioni di picco più alte, con meno flessione del ginocchio** rispetto a switch e 360 ([Noonan, LJMU 2018](https://researchonline.ljmu.ac.uk/id/eprint/9585/)).

**Atterraggio morbido.** In laboratorio un atterraggio morbido (circa **55° di escursione del ginocchio**) abbassa il picco da **2,6 a 1,6 BW** rispetto a uno rigido (circa 37°) ([PubMed 21602566](https://pubmed.ncbi.nlm.nih.gov/21602566); attribuzione esatta dei numeri incerta).

**Limite delle gambe: una correzione ai documenti del progetto.** Il documento di ricerca 12 cita "Minetti 2010, 1,5 m". L'articolo di Minetti, Ardigò, Susta e Cotelli su *Ergonomics* è in realtà del **1998**. Il suo modello prevede un limite di atterraggio sicuro di **1,6–2,0 m per i sedentari e 2,6–3,0 m per gli atleti** della nazionale di sci ([BibBase](https://bibbase.org/network/publication/minetti-ardig-susta-cotelli-usinglegmusclesasshockabsorberstheoreticalpredictionsandexperimentalresultsofdroplandingperformance-1998); [AIR Unimi](https://air.unimi.it/handle/2434/19726)). Il valore di 1,5 m è quello che Petrone, McNeil e Hubbard usano come valore di progetto prudente ([arXiv 1611.04448](https://pdf.arxiv.org/pdf/1611.04448)). Non è un tetto fisiologico per un pro. Nel 2010 un follow-up su sciatori di discesa ha trovato una potenza negativa massima del 62% più alta rispetto al 1998 ([SPONET 3047810](https://sponet.de/sponet/Record/3047810?lng=en)).

**Conta l'allineamento, non la grandezza del salto.** In un triple cork reale, circa 16 m di "caduta" equivalente totale si dividevano in **1,2 m di componente normale** e 14,8 m di componente tangenziale ([arXiv 1611.04448](https://pdf.arxiv.org/pdf/1611.04448)).

**Durata e decelerazione dell'impatto. [derivazione]** Con decelerazione costante su una corsa d, vale a = v_n²/(2d) e t = 2d/v_n.
- EFH 1,5 m dà v_n = 5,4 m/s. Con d ≈ 0,4 m (anca da circa 25° a circa 90° di flessione del ginocchio) si ottengono circa **4,7 BW gravità compresa in t ≈ 0,15 s**, in linea con i 4 BW misurati.
- EFH 0,5 m dà circa 2,2 BW in 0,26 s.

**Limite di EFH e corsa disponibile. [derivazione]** Il limite vale circa EFH_max ≈ d·(F/BW − 1).
- Con 0,45 m di corsa e 6–7 BW tollerati si ottengono 2,3–2,7 m, coerenti con Minetti per gli atleti.
- Un rider rigido, o ancora raccolto in un grab, ha d ≈ 0,2 m e regge solo circa 1 m.
- Quindi **l'EFH assorbibile dipende da quanta flessione resta al contatto**.

**Perdita di velocità all'impatto. [derivazione]** Il contatto toglie la velocità normale. Con l'attrito aggiunge un impulso tangenziale di circa μ·m·v_n.
- Con μ = 0,06 sono appena 0,3 m/s.
- Con la tavola storta il coefficiente diventa μ_skid·|sin Δψ| e **lo yaw diventa il vero freno**. A 20° e v_n = 4 m/s si perdono circa 0,8 m/s; con v_n = 5,4 m/s circa 1,1 m/s.

## Lo yaw fa cadere solo quando morde la lamina a valle

**Nessuna soglia di yaw pubblicata.** Nessuna fonte, scientifica, di coaching o di videogiochi, dà una tolleranza di yaw in gradi. Lo studio del 2017 indica però la **"posizione sbagliata della tavola all'atterraggio"** come predittore significativo di caduta, insieme alla presenza di uno spin ([Kurpiers et al., *Injury* 2017](https://pubmed.ncbi.nlm.nih.gov/28865874/)).

**Il meccanismo è chiaro.** La lamina a valle "è quella che può piantarsi": morde la neve, ferma di colpo la tavola e butta giù il rider ([Science Insights](https://scienceinsights.org/what-is-catching-an-edge-in-snowboarding/)). La revisione medica descrive l'edge catch come la lamina che "improvvisamente e involontariamente" fa presa ([Thieme](https://thieme-connect.de/products/ejournals/html/10.1055/s-0041-1731702)). Direzione della caduta:
- **lamina di punta**: in avanti, di faccia;
- **lamina dei talloni**: all'indietro, con colpo di frusta della testa ([Science Insights](https://scienceinsights.org/what-is-catching-an-edge-in-snowboarding/)).

Il coaching sugli spin avverte che gli atterraggi "aperti" finiscono spesso con la lamina di punta che si pianta, "la causa abituale di un brutto atterraggio" ([Snowboard Addiction, how to land spins](https://snowboardaddiction.com/blogs/training-education/how-to-land-spins)). Cambiare l'angolo di lamina proprio al contatto, o caricare troppo il piede posteriore, porta al washout. Il consiglio è impegnarsi su una sola lamina ([r/snowboarding](https://redlib.ssps.io/r/snowboarding/comments/1hx48ja/what_am_i_doing_wrong_lol/m67kibz/?context=3), aneddotico).

**Washout ed edge catch sono opposti.** Nel washout la lamina **scivola** invece di fare presa ([The Manual](https://themanual.com/outdoors/snowboard-profiles-explained)), e il rider si siede sul lato a monte. Nell'edge catch la lamina **si pianta** e il rider viene lanciato oltre il lato a valle.

**Regola fisica per il gioco. [derivazione]** Sia v_lat la velocità laterale della tavola rispetto alla neve.
- Se si abbassa la lamina **verso cui scivola la tavola** (lamina anteriore rispetto a v_lat), nasce una forza di taglio F al livello della neve. Con il baricentro a h ≈ 0,9–1,0 m sopra la tavola, il momento F·h ribalta il rider oltre quella lamina.
- Esempio: a 15 m/s con 20° di yaw, v_lat ≈ 5 m/s. Se si ferma in circa 0,1 s sono circa 5 g laterali ai piedi, cioè caduta certa.
- Se invece carica la **lamina a monte** o la base piatta, la forza laterale riporta i piedi sotto il baricentro. È stabile: è una derapata, che l'attrito anisotropo del progetto già calcola.
- Il washout è il terzo caso: lamina dei talloni troppo inclinata e poco carica, con il baricentro dietro. La coda scappa e il rider si siede.

**Fasce di yaw. [stima]**
- Base piatta o lamina a monte: pulito fino a circa 10–15° di yaw, sporco tra 15 e 35°.
- Lamina a valle abbassata di più di qualche grado con v_lat apprezzabile: caduta, nella direzione di v_lat.

## Rotazione residua e inclinazione: il verso conta più del modulo

**Coaching sugli spin.** L'errore più comune è la **sovra-rotazione che finisce in revert**. Si gira troppo, o si cerca l'atterraggio troppo presto ([Snowboard Addiction BS 360](https://snowboardaddiction.com/blogs/training-education/why-your-backside-360-isn-t-working-live-coaching)). L'atterraggio **cieco**, con il busto leggermente in controrotazione e la lamina che fa presa, "aiuta a fermare la rotazione ed evita il revert" ([Snowboard Addiction](https://snowboardaddiction.com/blogs/jumping/how-to-land-spins)). Un coach scrive che "è meglio ruotare un po' meno un backside 180 che ruotarlo troppo" ([Maverix Snow](https://medium.com/@maverixsnow/the-keys-to-landing-frontside-180-s-on-a-snowboard-1ad6fdcf8ed9)). Atterrare sui talloni con rotazione residua "ti fa continuare a girare" ([Snowboard Addiction BS cork 540](https://snowboardaddiction.com/blogs/jumping/how-to-backside-cork-540)).

**Quanto attrito serve per fermare lo spin. [derivazione]** Per una tavola caricata in modo uniforme, il momento d'attrito laterale vale τ ≈ μ_lat·N·L/4.
- Con μ 0,5, N ≈ 3 BW, 75 kg e L = 1,55 m si ottengono circa 430 N·m.
- L'inerzia di yaw del rider è I ≈ 1,5–3 kg·m², quindi la decelerazione è di 150–280 rad/s².
- **360°/s si fermano in 25–40 ms, ruotando solo altri 5–8°.**

L'attrito quindi ferma lo spin. Il problema è che quel momento nasce dalla **presa della lamina**, la stessa condizione dell'edge catch. Di qui le conseguenze:
- Con la sotto-rotazione, lo spin residuo va **verso** l'allineamento, e l'errore si riduce.
- Con la sovra-rotazione, lo spin aggrava l'errore. Spesso la lamina anteriore morde, oppure la tavola prosegue fino al revert.

**Inclinazione del corpo.** Le cadute dopo un salto sono soprattutto **all'indietro: 51% posteriori**, "verso la coda e la lamina dei talloni, con la mano posteriore che tocca per prima" ([SPONET](https://sponet.de/sponet/Record/3042548?lng=en); [McAlpine 2010](https://researchspace.auckland.ac.nz/handle/2292/6655)). Le cadute all'indietro portano circa **il doppio delle fratture al polso** e forze sulle mani più alte ([UBC FIB wiki](https://wiki.ubc.ca/Documentation:FIB_book/Kinetics_of_Arm_Injuries_in_Snowboarding_Falls); [Proc IMechE P 2013](https://journals.sagepub.com/doi/full/10.1177/1754337113482706)). Sono anche una causa principale di fratture spinali ([PMC7223356](https://pmc.ncbi.nlm.nih.gov/articles/PMC7223356/)). Per la colonna cervicale la configurazione del corpo pesa più dell'EFH ([ASTM STP](https://dl.astm.org/stps/book/242/chapter-abstract/64973/Terrain-Park-Jump-Design-Would-Limiting-Equivalent?redirectedFrom=fulltext)).

L'asimmetria va però letta bene. All'indietro si cade più spesso, ma spesso con un **butt check**, che è recuperabile. In avanti si cade più di rado, ma quando si tocca di punta la probabilità di caduta è circa quattro volte più alta.

**Pitch al contatto. [derivazione]**
- Coda leggermente alta (0–10°): la tavola si appoggia, il caso buono.
- Coda molto bassa (20° o più, come in un backflip corto): il baricentro resta dietro il contatto e il rider continua a ruotare su sedere o schiena.
- Punta bassa: la punta si pianta e il rider si ribalta in avanti.
- Il rollio al contatto equivale a un angolo di lamina, e va giudicato con la regola dello spigolo.

**Fasce di pitch. [stima]** Fino a circa 15° pulito; 15–30° mano o butt check; oltre circa 30° caduta.

## Knuckle, tavolo e neve fresca cambiano EFH e pitch

**Zone d'atterraggio.** Solo il **45%** dei salti osservati atterrava nella zona giusta: il **35% sul knuckle**, il **20% sul tavolo** ([SPONET](https://sponet.de/sponet/Record/3042548?lng=en)). Piano e knuckle sono predittori significativi di caduta ([Kurpiers 2017](https://pubmed.ncbi.nlm.nih.gov/28865874/)). Atterrare appena dopo il knuckle può far ruotare il corpo in avanti di circa **60°**. Atterrare corti, o lunghi sul piano del run-out, dà EFH molto alti ([ASTM STP, McNeil/Hubbard](https://store.astm.org/stp20120062.html); [Levy et al. 2015](https://link.springer.com/article/10.1007/s12283-015-0182-6)). In Alberta la causa principale d'infortunio era un salto troppo alto seguito da un atterraggio in piano ([Alberta study](https://www.researchgate.net/publication/50891469_Injuries_and_terrain_park_feature_use_among_snowboarders_in_alberta)).

**Neve fresca.** Nessuno studio misura la decelerazione di una tavola in neve fresca. La meccanica della neve dice che la resistenza alla penetrazione cresce linearmente con la profondità ([Journal of Glaciology](https://cambridge.org/core/journals/journal-of-glaciology/article/measurement-of-mechanical-properties-of-snow-for-simulation-of-skiing/00DD7880EF30BFB651D61146B3EFC3FA)). L'attrito misurato di sci e tavole va da 0,02 a 0,14 ([KIT](https://publikationen.bibliothek.kit.edu/1000172164/153587108)). A 20 m/s su neve ventata, l'aria intrappolata dà circa metà della portanza ([APS DFD 2005](https://meetings-archive.aps.org/dfd/2005/am/11)).

**Modello di affondamento. [derivazione]** Con p = k·z, l'affondamento assorbe parte dell'EFH (atterraggio più morbido). Però frena molto, con un aratro proporzionale a z². Se affonda la punta, la tavola si pianta.

**Valori per il gioco. [stima]** μ efficace 0,15–0,3 più un attrito dovuto all'affondamento, contro lo 0,06 della pista battuta.

## Dieci esiti, da stomp a slam, con soglie FIS

I giudici tracciano il confine al **contatto del corpo**. Le detrazioni FIS 2019/20 su 100 sono:
- **piccole (1–9)**: una mano;
- **medie (10–19)**: due mani, revert per instabilità;
- **grandi (20–29)**: corpo sulla neve ([FIS 2019/20, copia FSUK](https://www.freestylesnowsports.co.uk/+documents/Judge%20Training/FIS%20Judges%20Manual.pdf)).

L'aggiornamento 2022 sposta qualche fascia. Mette "heavy hand" e revert nelle medie e il **butt check fra le grandi** ([FIS primavera 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf)). Il butt check è "sedersi brevemente e rimbalzare in piedi" ([WSF glossary](https://www.worldsnowboardfederation.org/glossary/)). Il revert d'atterraggio è "atterrare e subito scivolare o ruotare per correggere la direzione" ([WSF](https://www.worldsnowboardfederation.org/glossary/)). Va tenuto separato dal revert voluto, che è un trick a terra ([Canada Snowboard](https://www.canadasnowboard.ca/en/about/snowboarding/)). Whitelines suggerisce di lasciar succedere il butt check invece di lottare, perché lottare porta a piantare lo spigolo dopo ([Whitelines](https://whitelines.com/archive/features/ultimate-guide-snowboard-slams.html)). Il tasso complessivo di caduta osservato è del **21%** ([SPONET](https://sponet.de/sponet/Record/3042548?lng=en)). Nessuna fonte dà la frequenza dei singoli esiti in cui si resta in piedi.

| Esito | Causa tipica | Si vede | Detrazione FIS | Run |
|---|---|---|---|---|
| Stomp | yaw ≈ 0 (mod 180°), base piatta, coda appena alta, sul pendio | flessione profonda, busto fermo | 0 | continua |
| Incerto / derapata | yaw moderato o poca rotazione residua | la tavola derapa, le braccia si agitano | piccola | continua, perde velocità |
| Mano a terra | come sopra, baricentro basso o dietro | la mano posteriore sfiora la neve | 1–9 | continua |
| Due mani / heavy hand | inclinazione o yaw più grandi | il busto scende su un lato | 10–19 | continua |
| Revert per instabilità | rotazione residua vicino a 90° o un po' prima di 180° | la tavola continua a ruotare fino alla direzione stabile | 10–19 | continua (a volte switch) |
| Butt check | baricentro dietro o sui talloni, EFH alto | sedere sulla neve, rimbalzo | grande | continua |
| Washout | lamina poco caricata, cambio di lamina al contatto | la tavola scappa, il rider cade su anca o sedere a monte | caduta | di solito finisce |
| Spigolo → slam | lamina a valle che morde con v_lat | frustata oltre la lamina: punta = di faccia, talloni = schiena | caduta | finisce |
| Punta / knuckle | punta bassa, atterraggio corto | ribaltamento in avanti | caduta | finisce |
| Piano / troppo lungo | EFH alto | schiacciato, butt check o caduta | — | dipende dall'EFH |

La tabella è un'**[inferenza]** costruita dalle fonti citate sopra.

## Conclusione

La ricerca sposta il problema. Non serve tanto spostare di qualche grado le soglie, che sono già ragionevoli. Serve **dare un verso alle grandezze**. Lo stesso yaw di 25° è una derapata se carica la lamina a monte e uno slam se abbassa quella a valle. Lo stesso spin residuo aiuta se il trick è corto e rovina se è lungo. La stessa inclinazione è un butt check se è all'indietro e una faccia avanti se è in avanti. Queste distinzioni non chiedono nuovi comandi, perché il giocatore continua a non sterzare. Escono da grandezze che il gioco ha già al contatto: il segno di yawSigned, il segno di ω, il rollio e il pitch del corpo rispetto alla tavola, la velocità laterale.

Il secondo punto è che il realismo "dopo il contatto" sta quasi tutto in un singolo impulso: l'attrito durante l'impatto, pari a μ(yaw)·m·v_n. Basta questo per far nascere dalla fisica il costo in velocità di un atterraggio storto. La fascia diventa allora un'etichetta, non una punizione arbitraria. Era la domanda aperta 3 della ricerca 12.

## Confronto e modifiche proposte

Riferimenti al codice: `src/physics/landing.ts` (`evaluateLanding`), `src/core/config.ts` (`LANDING`), `src/world/run.ts` (`land()` e fasi `landed`/`crash`), `src/physics/board.ts` (`postStep`, `preStep`). Priorità: **A** = impatto grande sul realismo e poco costo; **B** = importante; **C** = rifinitura.

| Aspetto | Modello attuale | Realtà (ricerca) | Modifica proposta | Priorità |
|---|---|---|---|---|
| Impatto e perdita di velocità | `postStep` azzera v_n all'istante, senza impulso tangenziale; EFH = v_n²/2g, corretto | Si perde solo la componente normale; con lo yaw, Δv ≈ μ_skid·\|sin Δψ\|·v_n, circa 0,8–1,1 m/s a 20° **[derivazione]** | Al touchdown, impulso tangenziale opposto a v_t di modulo min(\|v_t\|, μ(Δψ)·v_n), con μ = MU_SKID·\|sin Δψ\| + MU_LONG·(1−\|sin Δψ\|). Deterministico, testabile in `tests/` | **A** |
| Derapata dopo l'atterraggio | Fase `landed`: kappa 0, la tavola torna in linea a `CHECK_YAW_RATE` 6,3 rad/s (≈360°/s); carico aN solo gravità più curvatura. A 30° si perdono circa 0,2 m/s in 0,08 s **[derivazione]** | Carico al contatto circa 4 BW per 0,15–0,3 s; la tavola "pattina e si raddrizza in pochi decimi" | Per T_abs = 2d/v_n (d ≈ 0,4 m) sommare a aN il termine v_n²/(2d). Riallineamento post-atterraggio più lento e legato all'esito, circa 90–180°/s **[stima]** | **A** |
| Rotazione residua | yawErr += \|ω\|·0,02 s, sempre peggiorativo; nei flip ω non passa (0) | Sotto-rotazione meno grave della sovra-rotazione; la presa della lamina ferma 360°/s in 5–8° **[derivazione]**, quindi 0,02 s è coerente | Con segno: errore efficace = yawErr ± \|ω\|·RESIDUAL_T, + se ω allontana dall'allineamento e − se avvicina (minimo 0). Passare anche il residuo del flip, come errore di pitch | **A** |
| Lamina al contatto | In aria la lamina decade a 0 (200°/s): al contatto è sempre piatta, quindi spigolo e washout non esistono | Base piatta = buono; lamina a valle con v_lat = spigolo; lamina dei talloni poco carica con baricentro dietro = washout | Ricavare φ_contatto dal rollio di bodyUp attorno all'asse della tavola rispetto a n. Nuove cause `edge` (caduta: lamina a valle abbassata più di circa 5° e \|v_lat\| > circa 2 m/s **[stima]**) e `washout` (talloni, pitch indietro) | **A** |
| Inclinazione del corpo | Un solo angolo dalla verticale, fasce simmetriche 8/15/25/40° | 51% delle cadute all'indietro ma spesso recuperabili (butt check); di punta OR 4,01 | Scomporre in pitch (avanti/indietro rispetto alla marcia) e rollio. All'indietro fasce più larghe che finiscono in butt check; in avanti più strette, con caduta `nose`; il rollio va alla regola della lamina | **A** |
| Contatto di punta | Sale di un livello se dot(fwd, n) < −sin 15° **e fd > 0**: in switch non viene mai rilevato (bug) | Di punta OR 4,01 | Usare la punta che guida: sign(fd)·boardFwd. Correzione di una riga, più un test | **A** |
| Esiti in cui si resta in piedi | sketchy/severe hanno la stessa fisica di clean; cambia solo l'etichetta | Mano, due mani, revert e butt check hanno costi diversi (FIS 1–9 / 10–19 / grande) | Etichette per causa ("Mano a terra", "Butt check", "Revert") e piccoli costi: butt check = perdita extra di velocità e controllo bloccato circa 0,5 s **[stima]** | B |
| Revert per instabilità | Yaw > 45° = caduta sempre | Il revert d'atterraggio è una detrazione media e si resta in piedi | Se lo yaw è tra 45° e 135°, lo spin residuo va verso il 180 più vicino e non c'è spigolo: esito `revert`, la tavola completa la rotazione (eventuale cambio di stance), con perdita di velocità | B |
| Caduta | brake = 1 per 1,8 s (logica speed check, tavola a 90° sui talloni); il rider si ribalta sempre di lato nello stesso verso | La direzione dipende dalla causa: spigolo = arresto brusco oltre la lamina; washout = scivolata a monte; punta = in avanti | Fase crash con parametri per causa (direzione e decelerazione); animazione del ribaltamento nel verso giusto; all'indietro sui talloni se la causa è ambigua | B |
| EFH | Fasce 0,8/1,5/2,5/3,5 m, tolleranza ×1,7 | 1,5 m come valore di progetto; limite per atleti 2,6–3,0 m (Minetti **1998**); limite ≈ d·(F/BW − 1) | Valori da tenere. Se al contatto c'è ancora un grab (corsa d ridotta), fasce EFH ×circa 0,6 **[stima]**. Correggere la citazione "Minetti 2010" nella ricerca 12 | B |
| Knuckle | 0 ≤ dK < 2 m = almeno severe, qualunque sia EFH o pitch | Predittore di caduta; meccanismo: pitch in avanti circa 60° ed EFH alto. L'EFH dalla geometria analitica lo cattura già in parte | Severe solo se EFH > circa 1 m o pitch in avanti; altrimenti sketchy. Evita di contare due volte la geometria | C |
| Tavolo | dK < 0: sketchy, severe se EFH > 1,5 | EFH alto in piano; caso tipico d'infortunio | Va bene; lasciare che decida soprattutto l'EFH | C |
| Fuori pista (neve fresca) | Solo una sponda geometrica; sketchy, caduta se yaw > 16°; attrito invariato | Resistenza crescente con l'affondamento; impatto più morbido ma frenata forte e rischio di piantare la punta | Zona con μ efficace 0,15–0,3 e attrito d'affondamento, EFH ridotto, punta bassa = caduta **[stima]**. Rivedere la caduta automatica a 16° | C |
| Ammortizzazione visiva | Nessuna compressione delle gambe al contatto | Flessione in 0,15–0,3 s, proporzionale a v_n | Animazione di compressione (profondità ∝ EFH), da dichiarare in `quality.ts` (attiva in tutti i livelli: è solo una trasformazione) | C |
| Esiti per lo switch | 180° = switch pulito, la stance si inverte | Corretto: lo switch pulito non è un errore (FIS) | Nessuna | — |

Ogni modifica di fisica va coperta in `tests/` (Vitest, senza browser). Esempi:
- 20° di yaw con v_n 4 m/s deve perdere circa 0,8 m/s;
- con lo stesso |ω| la sovra-rotazione deve dare un esito peggiore della sotto-rotazione;
- la lamina a valle abbassata deve portare a `edge`;
- il contatto di punta in switch deve essere rilevato.

Le modifiche visibili vanno poi riportate in `FEATURES.md`.

**Domande aperte per il designer**

| # | Domanda |
|---|---|
| 1 | Il rollio al contatto dipende solo da quanto il rider ha raddrizzato l'asse ("Apri ora!"). È abbastanza leggibile per giustificare una caduta per spigolo, o serve un indicatore (per esempio la bussola che mostra anche la lamina)? |
| 2 | Il revert per instabilità deve essere un esito in cui si resta in piedi (come per la FIS), o resta caduta oltre 45° per semplicità? |
| 3 | Sporco/molto sporco devono costare solo velocità, o anche controllo (butt check = comandi bloccati) e, più avanti, punti con le detrazioni FIS? |
| 4 | La tolleranza ×1,7 deve allargare anche le nuove soglie (spigolo, pitch, grab tenuto) o solo le fasce attuali? |
| 5 | Grab tenuto al contatto: penalità implicita (meno corsa delle gambe, EFH più severo) o esplicita ("Lascia il grab prima")? |
| 6 | Velocità del riallineamento dopo l'atterraggio: più lenta e realistica (la derapata si vede) o rapida come ora per una sensazione arcade? |
| 7 | Fuori pista: vale la pena di modellare la neve fresca (attrito, affondamento) o basta un'etichetta finché il livello non ha neve fresca vera? |
| 8 | Fasce del pitch all'indietro più permissive (butt check) rispetto a quelle in avanti: si accetta che lo stesso angolo dia esiti diversi a seconda del verso? |
