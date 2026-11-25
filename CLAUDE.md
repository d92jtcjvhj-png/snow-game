# Snow Game — regole di progetto

Gioco di snowboard 3D per browser, PC e telefono. Stack: Vite + TypeScript strict + three r187 + Rapier (compat).

## Regole
1. **`legacy/index.html` è sola lettura.** È il riferimento di comportamento (fisica, comandi, feeling). Non modificarlo mai.
2. **Stile: 3D low-poly cartoon.** Flat shading, pochi poligoni, palette pastello (vedi `src/render/materials.ts`), niente texture realistiche. Materiali condivisi tramite `flat(color)`.
3. **Fisica realistica su misura.**
   - Rapier si occupa solo di collisioni e integrazione dei corpi rigidi.
   - Le forze della neve sono nostre, in `src/physics`:
     - **attrito anisotropo**: basso lungo la tavola, alto di traverso;
     - **curva sulla lamina**: raggio dato dalla sidecut e dall'angolo di edge;
     - drag aerodinamico per posa.
   - Friction dei collider bassa, perché l'attrito vero lo applichiamo noi.
   - Passo fisso `STEP = 1/120 s` (`src/core/loop.ts`) con interpolazione al render. La fisica deve restare deterministica.
   - Unità SI e radianti nel codice; km/h e gradi solo nella UI.
   - I parametri fisici partono dai valori del legacy (μ 0,06, CdA per posa, ecc.) e vivono in `src/core/config.ts`.
4. **Telefono prima.**
   - Qualità adattiva obbligatoria (`src/render/quality.ts`): ogni effetto nuovo deve dichiarare in quale livello è attivo.
   - Target 60 fps su un telefono medio.
   - Ogni azione ha comando touch **e** tastiera; rispetta le safe-area.
5. **Cartelle.**
   - `src/core`: loop, config, input.
   - `src/physics`: Rapier e forze; **non importa three**.
   - `src/world`: livelli, scena, collega fisica e mesh.
   - `src/render`: renderer, camera, materiali, qualità.
   - `src/ui`: HUD e menu.
   - Mesh e collider nascono sempre dagli stessi dati.
6. **Aggiorna sempre `FEATURES.md`** a ogni cambiamento visibile al giocatore o al motore, con la legenda ✅ / ⚠️ / ❌.
7. **Prima di ogni commit:** `npm run typecheck && npm test && npm run build`. La fisica nuova va coperta da un test in `tests/` (Vitest, Node, senza browser).
8. **Versioni pinnate esatte** in `package.json`, senza `^`. Si aggiornano solo su richiesta.
9. Testi di gioco in italiano. Commenti nel codice in inglese.

## Comandi
- `npm run dev`: server locale.
- `npm test`: test fisica.
- `npm run build`: build in `dist/`.
- Deploy: automatico su GitHub Pages a ogni push su `main` (`.github/workflows/deploy.yml`).
