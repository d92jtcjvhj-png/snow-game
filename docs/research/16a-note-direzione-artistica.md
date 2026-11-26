# Direzione artistica "realistica ma stilizzata" per giochi di neve/montagna: principi trasferibili

> Nota sul metodo: la rete della sessione ha bloccato il fetch diretto di 80.lv, gamedeveloper.com, androidpolice.com e alanzucconi.com (errore DNS "ENOTFOUND", host fuori dalla lista consentita). Quindi queste note si basano sugli **snippet dei motori di ricerca**, non sul testo completo degli articoli. Le citazioni vanno prese come parafrasi degli snippet. Le parti "Inferenze" sono ragionamento tecnico mio (rendering/WebGL), non dichiarazioni degli sviluppatori.
> Scopo: principi per uno stile ORIGINALE. Non si danno istruzioni per replicare il look, i personaggi o gli asset di un gioco specifico.

## 1. Quali tecniche danno il feel "realistico ma stilizzato" rispetto al puro low-poly flat-shaded?

### Takeaway
I giochi di riferimento non sono "più poligoni": sono **luce credibile su forme semplici**. Contano la direzione del sole, il contrasto caldo/freddo tra luce e ombra, la profondità atmosferica a strati, la leggibilità e qualche dettaglio di superficie mirato (tracce, sparkle). Il "cubotto" nasce da facce piatte tutte con lo stesso peso, ombre nere/grigie, nessuna nebbia e nessuna gradazione di colore.

### Cited Findings
- **Grand Mountain Adventure (Toppluva)**: è stato costruito "completamente da zero", con motore di gioco custom, editor di mappe, motore fisico, musica, modelli e montagne propri. MobyGames accredita un "Garass Graphics Engine" (Viktor Sehr). Toppluva è uno studio di Stoccolma fondato da tre fratelli snowboarder. Release Android: 27-28 marzo 2019. — [Search summary, Android Police / MobyGames / ModDB](https://www.mobygames.com/game/143235/grand-mountain-adventure/); [Toppluva su ModDB](https://www.moddb.com/company/toppluva)
- Recensione di GMA2: ciò che fa funzionare la neve è "la profonda comprensione della neve, sia di come appare sia delle sue proprietà materiali". — [TapSmart review GMA2](https://www.tapsmart.com/apps/books/review-gma2/)
- GMA2: grafica giudicata "molto dettagliata" e attenta ai dettagli "fino alle tracce lasciate nella neve". — [Pocket Gamer App Army](https://www.pocketgamer.com/grand-mountain-adventure-2/app-army-assemble)
- GMA Wonderlands: lodato per "uso superbo di luce, prospettiva e fisica della neve realistica". — [NoobFeed review](https://www.noobfeed.com/reviews/grand-mountain-adventure-wonderlands-pc-review)
- GMA2, feedback utenti aggregato: abbassare la grafica per avere fluidità rende tutto "molto sfocato". È un indizio che la scalabilità si fa (anche) con la risoluzione di render. — [Game Brain](https://gamebrain.co/game/grand-mountain-adventure-2)
- Comunicato GMA2: resort 2-4 volte più grandi del primo, "grafica molto migliorata". — [Game Developer press release](https://www.gamedeveloper.com/press-release/grand-mountain-adventure-2-smash-indie-mobile-hit-returning-to-the-slopes-february-6-2025)
- **Alto's Odyssey**: Harry Nesbitt (lead artist e programmatore) si ispira a giochi e arte "minimalista e impressionista". Il team ha cercato di "ridurre la complessità visiva". — [TNW](https://thenextweb.com/gaming/2018/03/05/how-altos-odyssey-transports-players-to-a-whole-new-world/); [Game Developer, Road to the IGF](https://www.gamedeveloper.com/business/road-to-the-igf-team-alto-s-i-alto-s-odyssey-i-)
- Alto's Odyssey: illuminazione dinamica ed effetti meteo (tempeste di sabbia, stelle cadenti), con "sorprese" affidate a meteo, luce e fauna. — [IGF](https://igf.com/altos-odyssey); [Red Bull](https://www.redbull.com/ca-en/altos-odyssey-ios-launch-interview)
- Alto's Odyssey è fatto in Unity. Il parallasse con uno sfondo "più smorzato" (muted) che scorre a velocità diversa dal primo piano crea profondità. — [Dice](https://www.dice.com/career-advice/altos-odyssey-winning-mobile-game)
- Lo stile di Alto's Adventure è nato "attraverso molte iterazioni". — [Red Bull](https://www.redbull.com/ca-en/altos-odyssey-ios-launch-interview)
- **Lonely Mountains: Downhill (Megagon, Berlino)**: è un gioco veloce e quasi open-world, quindi "volevamo uno stile grafico molto leggibile". Pur essendo "low-poly", alcune aree hanno "ben oltre un milione di triangoli a schermo". Fare i LOD è difficile per asset già low-poly. I primi livelli sono stati fatti con il terreno standard di Unity, convertito automaticamente in mesh low-poly. — [80.lv, Level & Game Production](https://80.lv/articles/level-game-production-lonely-mountains-downhill)
- Lonely Mountains: Snow Riders: la critica parla di design "da diorama" e "stile a blocchi" che dipinge wilderness evocative. Non ho trovato interviste degli sviluppatori sulla grafica di Snow Riders. — [Aftermath](https://aftermath.site/lonely-mountains-snow-riders-demo/)
- **Breath of the Wild**, GDC 2017: Satoru Takizawa cercava uno stile che rende "facile mentire" (credibile ma giocabile). Wind Waker HD era "troppo esagerato" e BotW ne è un'evoluzione più sobria. L'arte deve suggerire intuitivamente la fisica, in base all'esperienza reale del giocatore. — [Thumbsticks GDC17](https://www.thumbsticks.com/gdc17-designing-zelda-breath-of-the-wild/); [Zelda Universe](https://zeldauniverse.net/2017/03/14/takizawa-explains-how-the-wind-waker-hd-inspired-the-visual-style-for-breath-of-the-wild/)
- BotW (fonte secondaria): particelle atmosferiche che catturano la luce del sole, usate insieme alla nebbia classica. — [The Famicast](https://www.thefamicast.com/2017/12/part-5-art-and-implementation-of-3d.html)
- **Firewatch** (Jane Ng, GDC 2015/2016): colori decisi su strati distinti, dove ogni strato aggiunge profondità e distanza. Nebbia di colore custom e cielo procedurale come estensioni Unity proprietarie, per controllare il colore in funzione della distanza e combaciare con la concept art. Palette ispirata ai poster dei National Park anni '30. Ng ha fatto solo 23 alberi unici. — [Boing Boing](https://boingboing.net/2015/03/27/how-a-small-art-team-created-f.html); [Thumbsticks GDC15](https://www.thumbsticks.com/gdc-2015-the-art-of-firewatch); [Game Developer, 23 alberi](https://gamedeveloper.com/design/environmental-artist-jane-ng-only-made-23-unique-trees-for-i-firewatch-i-); [PC Gamer](https://pcgamer.com/why-less-is-more-when-it-comes-to-firewatchs-beautiful-trees)

### Inferences
- **Principio A, "forma semplice, luce vera".** Il salto da "cubotti" a "stilizzato credibile" passa per tre strati: (1) un solo sole forte, direzionale e basso (circa 20-35° di elevazione, mattina o pomeriggio) che fa leggere le pendenze; (2) un fill del cielo freddo, con ombre azzurre e mai grigie; (3) la prospettiva aerea, cioè il colore che va verso il cielo con la distanza. Firewatch, Alto e BotW convergono su questi tre punti.
- **Principio B, "gerarchia dei facet".** Il flat shading uniforme su tutto è ciò che fa "blocco". Meglio usare normali **smooth** (o con smoothing a soglia d'angolo) sul terreno innevato, che è la superficie più grande, e lasciare le faccette nette solo su rocce, alberi e ghiaccio. La neve reale è morbida, la roccia è spigolosa: la distinzione stessa è un'informazione di materiale (vedi il "suggerire la fisica" di Takizawa).
- **Principio C, "pochi asset ben fatti".** I 23 alberi di Firewatch e le "molte iterazioni" di Alto indicano che conviene investire in pochi modelli rifiniti, variati per scala, rotazione e tinta, invece che in molti modelli grezzi.
- **Principio D, "leggibilità prima di tutto".** Per un gioco veloce (Megagon) il kicker, il landing e la sagoma del rider devono emergere per valore (chiaro/scuro) e saturazione dal fondo. Il dettaglio va dove guarda il giocatore.
- Nota di progetto: CLAUDE.md impone il "flat shading" (regola 2). Questi risultati suggeriscono di interpretarlo come "colori piatti senza texture realistiche" più che come "normali per faccia ovunque". Valutare con l'utente se rilassare la regola per il manto nevoso.

### Gaps
- Non ho trovato dichiarazioni di Toppluva sul loro modello di shading, sulle ombre o sul colore. Il motore è custom, ma non so se usa PBR, ombre in tempo reale, ecc.
- Non ho trovato fonti dirette su Shredders, Steep, Riders Republic o Snowboard Kids per questo tema (nessuna ricerca dedicata è andata a buon fine nel budget disponibile).
- Non ho potuto leggere il testo completo delle interviste ad Alto, Megagon e Journey (host bloccati).

## 2. Quali di queste tecniche costano poco su WebGL mobile?

### Takeaway
Le tecniche che danno più resa per costo sono quasi tutte **calcoli per vertice o per pixel senza pass extra**: hemisphere/ambient freddo-caldo, fog con colore dipendente dalla distanza e dall'altezza, sky gradient su una sfera, AO cotta nei vertex color, rim light finto e sparkle via noise. Quelle care su telefono sono le ombre dinamiche ad alta risoluzione, SSAO, bloom multi-pass e la trasparenza sovrapposta (overdraw di particelle).

### Cited Findings
- Alto's Odyssey usa Unity su mobile e ottiene profondità con parallasse e sfondi smorzati, una tecnica economica. — [Dice](https://www.dice.com/career-advice/altos-odyssey-winning-mobile-game)
- Firewatch: nebbia di colore custom per controllare il colore per distanza, come shader e non come post-process pesante. — [Boing Boing](https://boingboing.net/2015/03/27/how-a-small-art-team-created-f.html)
- GMA2: le impostazioni basse rendono l'immagine "sfocata", quindi la scalabilità passa (anche) per la risoluzione di render. — [Game Brain](https://gamebrain.co/game/grand-mountain-adventure-2)
- Lonely Mountains: fino a oltre 1M di triangoli a schermo, con LOD problematici su asset già low-poly. Su PC/console il budget poligonale non è il collo di bottiglia, ma i LOD contano. — [80.lv](https://80.lv/articles/level-game-production-lonely-mountains-downhill)
- Esistono shader neve low-poly che regolano la copertura in base alla normale (pendenza) e all'altezza, senza texture. — [Jeremy Wolf, Low Poly Snow Shader](https://jeremy-wolf-taab.squarespace.com/blog/2017/4/23/tutorials-low-poly-snow-shader)
- Il subsurface della neve si può falsare con "un tocco di emissive" e un Fresnel, invece di un vero SSS. — [80.lv, snow shader UE5](https://80.lv/articles/setting-up-a-detailed-snow-shader-in-unreal-engine-5)

### Inferences (proposta di livelli per `src/render/quality.ts`)
- **Tutti i livelli (costo circa zero):** `HemisphereLight` (cielo azzurro / terra calda riflessa) più una direzionale calda; fog esponenziale con colore = orizzonte del cielo; sky dome con gradiente verticale (zenit saturo, orizzonte chiaro e caldo verso il sole); AO e variazione di tinta cotte nei **vertex color** del terreno e dei props alla generazione (coerente con "mesh e collider dagli stessi dati"); tinta dipendente dalla pendenza nel vertex shader; tone mapping ACES/AgX già presente in three (costo trascurabile).
- **Medio:** una shadow map singola, piccola (512-1024), che segue il rider con frustum stretto, più ombre "blob" o decal sotto gli oggetti lontani; sparkle procedurale nel fragment shader della neve; fascia di nebbia d'altezza; montagne lontane come silhouette a strati (2-3 mesh piatte con colore che sbiadisce verso il cielo, come il parallasse di Alto).
- **Alto:** shadow map 2048 o PCF soft; tracce della tavola come ribbon mesh; spray come particelle con instancing; bloom leggero a mezza risoluzione solo sugli highlight della neve.
- Da evitare su mobile: SSAO, ombre cascade multiple, particelle trasparenti grandi e sovrapposte, `MeshPhysicalMaterial` con transmission.
- Il trucco della risoluzione dinamica (pixel ratio < devicePixelRatio) è quello che GMA2 sembra usare a impostazioni basse. È il primo strumento da usare, ma va bilanciato perché la neve bianca sfocata si nota molto.

### Gaps
- Nessun dato misurato (ms per frame) dai giochi citati. I costi indicati sono stime ingegneristiche mie.
- Non ho trovato come Toppluva gestisce ombre e LOD su telefono.

## 3. Come si rende la neve perché non sembri bianco piatto?

### Takeaway
La neve "vera" è quasi bianca nella luce diretta (leggermente calda), **azzurra nelle ombre** (perché lì è illuminata solo dal cielo) e ha valori molto compressi. Va resa con: due toni (sole caldo / ombra fredda), una gradazione con la pendenza e con l'angolo rispetto al sole, scintillii rari ma molto brillanti, dettagli d'uso (tracce, battitura) e contrasti di materiale (rocce scure che affiorano sui pendii ripidi, alberi scuri). Senza contrasti scuri vicini, il bianco non si legge.

### Cited Findings
- Le ombre sulla neve sono blu perché sono illuminate solo dalla luce del cielo, che è blu per lo scattering di Rayleigh. La luce solare diretta, molto più forte, domina nelle zone al sole. — [Baird, WTAMU](https://wtamu.edu/~cbaird/sq/2014/02/10/why-doesnt-the-outside-world-appear-blue-even-though-so-much-light-comes-from-the-blue-sky/); [Story of Snow](https://storyofsnow.com/blog1.php/blues-and-whites-of-snow)
- Bilanciando il bianco perché la neve al sole sia bianca, le ombre appaiono blu. — [Straight Dope forum (aneddotico)](https://boards.straightdope.com/t/why-do-shadows-on-snow-appear-blue/599855)
- La neve può apparire blu anche in profondità (cavità, crepacci), per assorbimento del rosso nel ghiaccio e nella neve compatta. — [CBS News Boston](https://www.cbsnews.com/boston/news/why-does-snow-sometimes-appear-blue)
- **Journey** (John Edwards, GDC 2013, "Sand Rendering in Journey"): la sabbia ha tre termini speculari (rim, "ocean specular" e glitter). Il glitter va trattato come termine separato, con riflessi "rari e molto brillanti", presenti anche fuori dal sole diretto. Normali random con distribuzione gaussiana centrate sulla normale della superficie. — [GDC Vault](https://gdcvault.com/play/1017742/Sand-Rendering-in); [Alan Zucconi, serie Journey sand shader](https://www.alanzucconi.com/2019/10/08/journey-sand-shader-1/)
- Sparkle per neve: una texture glitter i cui canali definiscono a quale angolo dalla camera ogni fiocco raggiunge il picco, così i fiocchi brillano in momenti diversi. Consiglio pratico: niente mipmap sulla texture di sparkle, altrimenti spariscono a distanza. — [80.lv snow shader UE5](https://80.lv/articles/setting-up-a-detailed-snow-shader-in-unreal-engine-5); [Unity forum, stylized snow](https://discussions.unity.com/t/stylized-snow-shader/491952)
- Neve stilizzata: bump, specularità e glow in post-process, senza scattering realistico. — [Unity forum](https://discussions.unity.com/t/stylized-snow-shader/491952)
- Le tracce nella neve sono uno dei dettagli citati come "attenzione al dettaglio" in GMA2. — [Pocket Gamer](https://www.pocketgamer.com/grand-mountain-adventure-2/app-army-assemble)
- Copertura della neve in base alla pendenza e all'altezza (shader low-poly): sui pendii ripidi affiora la roccia. — [Jeremy Wolf](https://jeremy-wolf-taab.squarespace.com/blog/2017/4/23/tutorials-low-poly-snow-shader)

### Inferences (ricetta originale proposta)
- **Palette neve a 4 valori, non 1.** (a) luce piena: bianco leggermente caldo (circa #FFF8EE); (b) mezzotono: bianco-lavanda; (c) ombra propria/portata: azzurro-ceruleo medio desaturato (circa #A9C4E8); (d) occlusione nelle pieghe: blu più profondo. Il tone mapping non deve "bruciare" (a): lasciare margine sotto 1.0 e riservare il vero clip agli sparkle.
- **Ombra = tinta, non nero.** Il colore d'ombra della scena va legato al colore del cielo (hemisphere sky color), così il cambio di ora del giorno si propaga da solo.
- **Wrap/half-Lambert morbido** sulla neve, cioè `(N·L*0.5+0.5)` rimappato, per imitare la luce che "entra" nella neve. Aggiungere un leggerissimo termine emissivo freddo/Fresnel controluce come falso SSS, a costo zero.
- **Sparkle:** hash 3D della posizione world quantizzata a celle di pochi cm, con soglia alta e moltiplicato per `pow(max(0,R·L), k)`, solo vicino alla camera (sfuma con la distanza). Rari e brillanti, come in Journey. Questo è coerente con il determinismo: è solo render.
- **Tinta per pendenza e esposizione:** i pendii rivolti al sole più caldi e chiari, quelli in ombra più freddi. Sui ripidi (pendenza > ~35-40°) far affiorare roccia scura a faccette: dà scala e contrasto al bianco.
- **Dettaglio d'uso:** linee di battitura (corduroy) come leggera modulazione periodica della luminosità lungo la direzione di discesa sulla pista; fuori pista nessuna modulazione. Tracce della tavola come ribbon leggermente più scure/blu (l'ombra nella scanalatura). Spray in curva e all'atterraggio con particelle bianche che, controsole, si illuminano.
- **Kicker e landing:** la neve lavorata (fresata, liscia) va distinta dalla neve naturale per tono e speculare (più lucida), con bordi/labbro marcati da una linea d'ombra azzurra. In più, bandierine o paletti colorati come riferimento di scala e profondità.

### Gaps
- Non ho trovato fonti dirette sul modo in cui GMA o Lonely Mountains colorano le ombre. La ricetta è derivata da fisica e pittura, non dai loro sviluppatori.

## 4. Look del personaggio leggibile a ~100 px

### Takeaway
A ~100 px un personaggio si legge per **silhouette e blocchi di colore**, non per dettaglio. Servono proporzioni leggermente esagerate (testa/casco e mani/guanti un po' grandi, tavola ben visibile), abiti larghi a pochi volumi smussati, 2-3 colori saturi in contrasto con la neve (giacca e pantaloni di tinte diverse) e accessori iconici (casco, maschera con riflesso). Le forme vanno smussate: la luce morbida le "arrotonda", mentre i box spigolosi fanno "robot".

### Cited Findings
- Megagon voleva uno stile "molto leggibile" per un gioco veloce visto da lontano. — [80.lv](https://80.lv/articles/level-game-production-lonely-mountains-downhill)
- BotW: lo stile deve essere credibile ma "mentire" quanto serve alla giocabilità (esagerazione controllata). — [Thumbsticks GDC17](https://www.thumbsticks.com/gdc17-designing-zelda-breath-of-the-wild/)
- Rim light "tipo SSS" sui contorni quando l'oggetto è controluce (shader fan-made ispirato a BotW, non una fonte ufficiale). — [GitHub ccontinisio/zelda-botw-toon-shader](https://github.com/ccontinisio/zelda-botw-toon-shader)

### Inferences
- **Silhouette test:** renderizzare il rider tutto nero a 100 px nelle pose chiave (carica, pop, grab, spin, atterraggio). La posa e la direzione della tavola devono leggersi. La tavola va resa più spessa del reale (x1,5-2) e con un colore della base distinto dal top.
- **Volumi:** 8-12 lati per i cilindri di arti e torso, con normali smooth. Giacca e pantaloni oversize con un leggero "flare" ai bordi. Il casco è una sfera schiacciata. La maschera è una fascia scura lucida con un highlight speculare caldo (un punto di "vita" a costo zero).
- **Colore:** il rider è l'elemento più saturo della scena, con colori caldi (arancio, corallo, giallo) contro neve e cielo freddi. Si può usare un secondo colore complementare per distinguere petto e gambe, utile a leggere le rotazioni.
- **Rim light** caldo dal sole sul contorno del rider, per staccarlo dal cielo durante il volo.
- **Ombra di contatto** (blob o shadow map stretta) sotto il rider: è il riferimento più importante per leggere l'altezza in aria e il momento dell'atterraggio.

### Gaps
- Non ho trovato dichiarazioni degli sviluppatori sulle proporzioni dei personaggi di GMA, Lonely Mountains o Alto.

## 5. Atmosfera, cielo, ora del giorno, camera e UI

### Takeaway
La profondità si costruisce a **strati di valore**: primo piano contrastato, piano medio meno contrastato, montagne lontane quasi color cielo. Un cielo a gradiente e una nebbia con lo stesso colore dell'orizzonte fondono il mondo. L'ora del giorno è il "color grading" più economico. La camera e la UI devono lasciare spazio al cielo e al salto.

### Cited Findings
- Firewatch: strati di colore decisi, con ogni strato che aggiunge profondità. La nebbia è usata insieme alla luce per la profondità. — [Boing Boing](https://boingboing.net/2015/03/27/how-a-small-art-team-created-f.html); [Thumbsticks](https://www.thumbsticks.com/gdc-2015-the-art-of-firewatch)
- Alto's Odyssey: sfondi "smorzati" in parallasse, luce dinamica e meteo come varietà. — [Dice](https://www.dice.com/career-advice/altos-odyssey-winning-mobile-game); [IGF](https://igf.com/altos-odyssey)
- BotW: particelle atmosferiche illuminate dal sole più fog classica (fonte secondaria). — [The Famicast](https://www.thefamicast.com/2017/12/part-5-art-and-implementation-of-3d.html)
- Lonely Mountains: Snow Riders: estetica "da diorama". — [Aftermath](https://aftermath.site/lonely-mountains-snow-riders-demo/)

### Inferences
- **2-3 preset di ora del giorno** (es. "mattino limpido", "pomeriggio dorato", "coperto"), ciascuno come pochi parametri: colore e intensità del sole, elevazione, colori cielo zenit/orizzonte, colore ombra (= cielo), densità della nebbia. Il "coperto" va usato con attenzione: la neve senza sole perde lettura delle forme ("flat light"), quindi aggiungere più contrasto con alberi e paletti.
- **Montagne lontane:** sagome low-poly enormi a 2-3 distanze, con colore interpolato verso il colore dell'orizzonte (più lontano = più chiaro e più blu) e cime innevate che prendono il colore caldo del sole. Costo basso, e danno scala al big air.
- **Camera:** sole laterale o di 3/4 rispetto all'asse di salto (mai alle spalle della camera, che appiattisce tutto; il controsole parziale esalta rim e spray). Orizzonte nel terzo alto, cielo visibile durante il volo. FOV un po' più ampio in volo per enfatizzare l'altezza.
- **UI:** testi chiari con ombra/contorno scuro per leggerli sulla neve bianca; colori della UI presi dalla stessa palette pastello; niente pannelli opachi sopra l'area del salto; rispettare le safe-area (regola 6 di CLAUDE.md).

### Gaps
- Non ho trovato breakdown pubblici (ArtStation/80.lv) leggibili per i giochi di neve citati, per via degli host bloccati.
- Nessuna fonte trovata per camera e UI di GMA/Shredders/Steep/Riders Republic.
