# Snow Game — regole di progetto

Gioco di snowboard 3D per browser, PC e telefono. Stack: Vite + TypeScript strict + three r187 + Rapier (compat).

## Regole
1. **`legacy/index.html` è sola lettura.** È il riferimento di comportamento (fisica, comandi, feeling). Non modificarlo mai.
2. **Stile: 3D low-poly cartoon.** Flat shading, pochi poligoni, palette pastello (vedi `src/render/materials.ts`), niente texture realistiche. Materiali condivisi tramite `flat(color)`.
3. **Fisica realistica su misura.**
   - Rapier integra i corpi e gestisce le collisioni con gli oggetti.
   - **Il contatto con la neve è un vincolo nostro** sulla superficie analitica h(x, z) (`src/world/bigair.ts`), la stessa da cui nascono mesh e trimesh. Il contatto di Rapier sui triangoli perdeva energia a caso.
   - Le forze della neve sono nostre, in `src/physics`:
     - **attrito anisotropo**: basso lungo la tavola, alto di traverso;
     - **curva sulla lamina**: raggio dato dalla sidecut e dall'angolo di edge;
     - drag aerodinamico per posa.
   - La **lamina è un parametro**, non ruota il collider.
   - Nella proiezione sul pendio, la direzione della tavola si proietta in **verticale**, così ψ visto dall'alto resta ψ.
   - Passo fisso `STEP = 1/120 s` (`src/core/loop.ts`) con interpolazione al render. La fisica deve restare deterministica.
   - Unità SI e radianti nel codice; km/h e gradi solo nella UI.
   - I parametri fisici partono dai valori del legacy (μ 0,06, CdA per posa, ecc.) e vivono in `src/core/config.ts`.
4. **Il giocatore non sterza mai.**
   - A terra controlla solo lo speed check (analogico), la carica e il pop.
   - La curva pre-salto è automatica: parte quando inizia la carica (`src/physics/approach.ts`).
   - Le lamine di stacco sono quelle reali, nella tabella `TAKEOFF_EDGE` di `src/core/config.ts`: frontside → heel, backside → toe; straight e flip → base piatta.
   - Ogni scelta di tecnica si basa sulle ricerche in `docs/research/`. Le nuove ricerche vanno salvate lì.
5. **Rotazioni e atterraggio (Fase 3).**
   - Il momento angolare si fissa al pop; in aria ω = L / I(posa): grab = raccolto, aperto = lento. Nessun tetto fisso (`src/physics/spin.ts`).
   - Due potenze: spin (carica, L) e spinta fuori asse (levetta, L_f). Il ribaltamento parte dopo il primo mezzo giro e va chiuso a un giro intero prima di atterrare.
   - Atterraggio = fasce della ricerca 12 (`src/physics/landing.ts`) + fisica dopo il contatto: la tavola tiene il suo yaw, lo `stance` della tavola gestisce lo switch.
6. **Telefono prima.**
   - Qualità adattiva obbligatoria (`src/render/quality.ts`): ogni effetto nuovo deve dichiarare in quale livello è attivo.
   - Target 60 fps su un telefono medio.
   - Ogni azione ha comando touch **e** tastiera; rispetta le safe-area.
7. **Cartelle.**
   - `src/core`: loop, config, input.
   - `src/physics`: Rapier e forze; **non importa three**.
   - `src/world`: livelli (geometria pura in `bigair.ts`), run (`run.ts`, senza three, guidabile dai test), scena three (`scene.ts`).
   - `src/render`: renderer, camera, materiali, qualità.
   - `src/ui`: HUD e menu.
   - Mesh e collider nascono sempre dagli stessi dati.
8. **Aggiorna sempre `FEATURES.md`** a ogni cambiamento visibile al giocatore o al motore, con la legenda ✅ / ⚠️ / ❌.
9. **Prima di ogni commit:** `npm run typecheck && npm test && npm run build`. La fisica nuova va coperta da un test in `tests/` (Vitest, Node, senza browser).
10. **Versioni pinnate esatte** in `package.json`, senza `^`. Si aggiornano solo su richiesta.
11. Testi di gioco in italiano. Commenti nel codice in inglese.

## Comandi
- `npm run dev`: server locale.
- `npm test`: test fisica.
- `npm run build`: build in `dist/`.
- Deploy: automatico su GitHub Pages a ogni push su `main` (`.github/workflows/deploy.yml`).
