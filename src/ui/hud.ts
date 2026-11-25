import { APPROACH, DEG, MS_TO_KMH } from '../core/config';
import type { LandingRecord, TakeoffRecord } from '../world/run';

export interface Assist {
  indicators: boolean;
  slowmo: boolean;
  tolerance: boolean;
}
const KEY = 'snowgame.assist';

export function loadAssist(): Assist {
  const a: Assist = { indicators: true, slowmo: false, tolerance: false };
  try { Object.assign(a, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { /* private mode */ }
  return a;
}

export interface HudState {
  speed: number;
  edge: number;
  grounded: boolean;
  charging: boolean;
  charge: number;
  axis: number;
  msg: string;
  bigMsg: boolean;
  fps: number;
  tier: string;
  /** in the air: live trick text and compass (board vs travel, seen from above) */
  air: { text: string; compassDeg: number | null; upsideDown: boolean } | null;
}

export interface Hud {
  update(s: HudState): void;
  showIntro(): void;
  showCard(tk: TakeoffRecord | null, ld: LandingRecord | null, note: string): void;
  hideCard(): void;
}

const EDGE: Record<string, string> = { heel: 'Tallone (heel)', toe: 'Punta (toe)', flat: 'Base piatta' };
const side = (v: number) => (v > 0 ? 'lato tallone' : 'lato punta');
const QUAL: Record<string, [string, string]> = {
  perfect: ['Perfetto', 'q-perfect'], clean: ['Pulito', 'q-clean'], sketchy: ['Sporco', 'q-sketchy'], severe: ['Molto sporco', 'q-severe'], crash: ['Caduta', 'q-crash'],
};
const CAUSE: Record<string, (l: LandingRecord) => string> = {
  ok: (l) => (l.quality === 'perfect' ? 'Nello sweet spot, dritto e livellato.' : 'Atterraggio pulito.'),
  yaw: (l) => (l.quality === 'crash' ? 'Tavola troppo di traverso: prendi la lamina a valle e cadi.' : 'Tavola non in linea: atterri derapando.'),
  tilt: () => 'Asse non livellato: eri ancora inclinato.',
  inverted: () => 'Atterri capovolto.',
  impact: (l) => (l.quality === 'crash' ? 'Impatto troppo duro.' : 'Atterraggio duro.'),
  knuckle: () => 'Atterri sul knuckle: la tavola ti butta in avanti.',
  table: () => 'Troppo corto: atterri sul tavolo.',
  offpiste: (l) => (l.quality === 'crash' ? 'Fuori dalla pista preparata, di traverso nella neve fresca.' : 'Fuori dalla pista preparata, nella neve fresca.'),
  nose: () => 'Atterri di punta, sbilanciato in avanti.',
};
/** a training tip from the main cause (legacy texts, updated) */
function tipFor(l: LandingRecord, tk: TakeoffRecord): string {
  if (l.quality === 'perfect' || l.quality === 'clean') return '';
  if (l.cause === 'yaw' && l.realDeg) {
    const over = l.realDeg - l.deg > 0;
    return over ? 'Hai girato troppo: lascia il grab un po’ prima (o carica meno).' : 'Non hai chiuso la rotazione: tieni il grab un po’ di più, o carica di più.';
  }
  if (l.cause === 'tilt' || l.cause === 'inverted') return 'Eri ancora inclinato: lascia il grab prima, aprirti raddrizza l’asse.';
  if (l.cause === 'table' || l.cause === 'knuckle') return 'Sei arrivato corto: frena meno prima del kicker o fai un pop migliore.';
  if (l.cause === 'impact' && l.dKnuckle > 10) return 'Sei arrivato lungo: fai uno speed check più deciso.';
  if (l.cause === 'offpiste') return tk.timingLabel && tk.timingLabel !== 'giusto' ? `Curva d'impostazione ${tk.timingLabel}: sei uscito storto dal kicker.` : 'Sei uscito di lato dal kicker.';
  return '';
}

/** HUD, intro, training settings and the takeoff card. */
export function createHud(root: HTMLElement, assist: Assist, h: { onStart(): void; onRetry(): void; onHelp(): void }): Hud {
  root.insertAdjacentHTML('beforeend', `
  <div id="top">
    <div class="pill" id="spd"><b id="hSpd">0</b><small>km/h</small></div>
    <div class="pill" id="edgeP"><b id="hEdge">—</b><small>lamina</small></div>
    <div class="pill" id="dbg"></div>
    <div id="icons"><button class="ib" id="setBtn" aria-label="Allenamento">⚙</button><button class="ib" id="helpBtn" aria-label="Comandi">?</button></div>
  </div>
  <div id="settings" hidden>
    <h3>Allenamento</h3>
    <label><input type="checkbox" id="opt-indicators"> Indicatori (quando caricare, punto d'atterraggio)</label>
    <label><input type="checkbox" id="opt-slowmo"> Rallentatore in aria</label>
    <label><input type="checkbox" id="opt-tolerance"> Tolleranza atterraggio (×1,7)</label>
  </div>
  <div id="trick"></div>
  <div id="compass" hidden><div class="travel"></div><div class="cb" id="cBoard"></div><div id="cTxt"></div></div>
  <div id="msg"></div>
  <div id="chargeLbl"></div>
  <div class="panel" id="intro">
    <div class="card">
      <h1>Big Air</h1>
      <p class="sub">Il rider non lo guidi: scende da solo. Tu dosi velocità, curva, stacco e rotazione.</p>
      <ul>
        <li><b>Speed check</b> (a destra): tieni premuto e trascina giù, più trascini più freni. Senza freno arrivi lungo.</li>
        <li><b>Pollice sinistro</b>: quando lo appoggi il rider <b>inizia la curva d'impostazione</b>. Trascina di lato: il lato è il verso (destra frontside, sinistra backside), la distanza è la potenza.</li>
        <li>Frontside stacca di <b>tallone</b>, backside di <b>punta</b>, come nella realtà. Il rider fa da solo la S tallone-punta-tallone.</li>
        <li><b>Tempismo</b>: inizi troppo presto → la curva è troppo larga ed esci in diagonale. Troppo tardi → curva schiacciata, derapata, meno pop.</li>
        <li><b>Stacca il pollice sul kicker</b> (linea blu sul labbro): è il pop. Senza carica = straight air. La <b>levetta</b> a destra sceglie l'asse: su = cork, giù = misty/rodeo (senza carica: frontflip/backflip).</li>
        <li><b>In aria</b>: 4 grab (Nose, Mute, Indy, Tail). Tienine uno: ti chiudi e giri più veloce. Lascialo: ti apri, rallenti e raddrizzi l'asse. Pollice sinistro dal lato opposto = controrotazione.</li>
        <li><b>Atterra</b> con la tavola in linea (o al contrario, in switch), dritto e nel pendio dopo il knuckle.</li>
      </ul>
      <p class="sub">Tastiera: Z/X carica · Spazio carica dritta · B speed check · ↑/↓ asse · Q/W/E/R grab · R riprova.</p>
      <button class="cta" id="start">Gioca</button>
    </div>
  </div>
  <div class="panel" id="card" hidden>
    <div class="card">
      <h2 id="cName"></h2>
      <div id="cChips"></div>
      <p id="cNote"></p>
      <p id="cTip" hidden></p>
      <div class="diagRow" id="cDiagRow" hidden><div class="diag" id="cDiag"><div class="travel"></div><div class="cb" id="cDiagBoard"></div></div><div id="cDiagTxt"></div></div>
      <dl id="cRows"></dl>
      <button class="cta" id="retry">Riprova</button>
    </div>
  </div>
  <div id="rotate" hidden>Gira il telefono in verticale per giocare.</div>`);
  const $ = (id: string) => document.getElementById(id)!;
  $('start').addEventListener('click', () => { $('intro').hidden = true; h.onStart(); });
  $('retry').addEventListener('click', () => h.onRetry());
  $('helpBtn').addEventListener('click', () => { $('intro').hidden = false; h.onHelp(); });
  $('setBtn').addEventListener('click', () => { $('settings').hidden = !$('settings').hidden; });
  for (const k of ['indicators', 'slowmo', 'tolerance'] as const) {
    const el = $('opt-' + k) as HTMLInputElement;
    el.checked = assist[k];
    el.addEventListener('change', () => { assist[k] = el.checked; try { localStorage.setItem(KEY, JSON.stringify(assist)); } catch { /* ignore */ } });
  }
  const rotate = () => { $('rotate').hidden = !(innerWidth > innerHeight * 1.15 && matchMedia('(pointer: coarse)').matches); };
  addEventListener('resize', rotate); rotate();

  const spd = $('hSpd'), edgeEl = $('hEdge'), dbg = $('dbg'), msg = $('msg'), lbl = $('chargeLbl');
  const trickEl = $('trick'), compass = $('compass'), cBoard = $('cBoard'), cTxt = $('cTxt');
  let frame = 0;
  return {
    update(s) {
      spd.textContent = String(Math.round(s.speed * MS_TO_KMH));
      const e = s.edge / DEG;
      edgeEl.textContent = !s.grounded ? '—' : Math.abs(e) < 4 ? 'piatta' : `${e > 0 ? 'heel' : 'toe'} ${Math.round(Math.abs(e))}°`;
      if (frame++ % 15 === 0) dbg.textContent = `${Math.round(s.fps)} fps · ${s.tier}`;
      msg.textContent = s.msg; msg.classList.toggle('big', s.bigMsg);
      if (s.charging && s.grounded) {
        const p = Math.round(Math.abs(s.charge) * 100);
        const ax = Math.abs(s.axis) >= 0.2 ? (s.axis > 0 ? 'Cork' : s.charge > 0 ? 'Misty' : 'Rodeo') : '';
        lbl.innerHTML = p >= 10
          ? `${s.charge > 0 ? 'Frontside' : 'Backside'} ${p}%<small>${s.charge > 0 ? 'stacco di tallone' : 'stacco di punta'}${ax ? ' · ' + ax : ''}</small>`
          : `${Math.abs(s.axis) >= 0.2 ? (s.axis > 0 ? 'Frontflip' : 'Backflip') : 'Straight air'}<small>base piatta</small>`;
      } else lbl.textContent = '';
      trickEl.textContent = s.air ? s.air.text : '';
      if (s.air && s.air.compassDeg !== null) {
        const rel = s.air.compassDeg, off = Math.min(Math.abs(rel), 180 - Math.abs(rel));
        compass.hidden = false;
        cBoard.style.transform = `rotate(${-rel}deg)`;
        compass.className = off <= 16 ? 'ok' : off <= 28 ? 'mid' : 'bad';
        cTxt.textContent = s.air.upsideDown ? 'Capovolto' : off <= 8 ? 'In linea' : `${Math.round(off)}°`;
      } else compass.hidden = true;
    },
    showIntro() { $('intro').hidden = false; },
    showCard(tk, ld, note) {
      const chips: string[] = [];
      const rows: [string, string][] = [];
      $('cTip').hidden = true; $('cDiagRow').hidden = true;
      if (!tk || !ld) {
        $('cName').textContent = 'Niente salto';
        $('cNote').textContent = note || 'Non hai preso il kicker.';
      } else {
        // trick and landing (Phase 3)
        $('cName').textContent = ld.trick;
        const [label, cls] = QUAL[ld.quality]!;
        chips.push(`<span class="chip ${cls}">${label}</span>`);
        $('cNote').textContent = note || CAUSE[ld.cause]!(ld);
        const tip = tipFor(ld, tk);
        if (tip) { $('cTip').textContent = tip; $('cTip').hidden = false; }
        const ys = ld.yawSigned, off = Math.min(Math.abs(ys), 180 - Math.abs(ys));
        $('cDiagBoard').style.transform = `rotate(${-ys}deg)`;
        $('cDiag').className = 'diag ' + (off <= 16 ? 'ok' : off <= 28 ? 'mid' : 'bad');
        $('cDiagTxt').innerHTML = `Tavola all’atterraggio: <b>${Math.round(off)}°</b> fuori linea${ld.switchLand ? ' (in switch)' : ''}.${ld.realDeg ? `<br>Rotazione: <b>${Math.round(ld.realDeg)}°</b>.` : ''}`;
        $('cDiagRow').hidden = false;
        rows.push(['Rotazione reale', ld.realDeg ? `${Math.round(ld.realDeg)}°` : '–']);
        rows.push(['Inversioni', String(ld.inv)]);
        rows.push(['Grab', ld.grab ? `${ld.grab}, ${ld.grabTime.toFixed(1)} s` : 'Nessuno']);
        rows.push(['Tempo in aria', `${ld.airT.toFixed(2)} s`]);
        rows.push(['Atterraggio', `${Math.abs(ld.dKnuckle).toFixed(1)} m ${ld.dKnuckle >= 0 ? 'dopo' : 'prima del'} knuckle${ld.dKnuckle >= 0 ? '' : ' (sul tavolo)'}${ld.inLanding || ld.dKnuckle < 0 ? '' : ', fuori pista'}`]);
        rows.push(['Impatto', `${ld.efh.toFixed(1)} m di caduta equivalente`]);
        rows.push(['Errore tavola (con rotazione residua)', `${ld.yawErr.toFixed(0)}°`]);
        rows.push(['Inclinazione', `${ld.tiltErr.toFixed(0)}°`]);
        rows.push(['Deriva in volo', Math.abs(ld.drift) < 0.3 ? 'Nessuna' : `${Math.abs(ld.drift).toFixed(1)} m verso il ${side(ld.drift)}`]);
        // takeoff (Phase 2)
        const edgeOk = tk.edge === tk.edgeExpected;
        rows.push(['— Stacco —', '']);
        rows.push(['Velocità allo stacco', `${(tk.speed * MS_TO_KMH).toFixed(0)} km/h`]);
        rows.push(['Pop', tk.release === 'nessuno' ? 'Nessuno (pollice tenuto oltre il labbro)' : `${tk.release === 'perfetto' ? 'Perfetto' : 'Presto'} · ${Math.round(tk.popQ * 100)}%`]);
        rows.push(['Lamina di stacco', `${EDGE[tk.edge]}${tk.edge !== 'flat' ? ' ' + Math.round(Math.abs(tk.edgeDeg)) + '°' : ''}${edgeOk ? '' : ' (serve ' + EDGE[tk.edgeExpected] + ')'}`]);
        if (tk.timing !== null) rows.push(['Inizio curva', Math.abs(tk.timing) <= APPROACH.ON_TIME ? 'Giusto' : `${tk.timing > 0 ? 'Presto' : 'Tardi'} di ${Math.abs(tk.timing).toFixed(1)} s`]);
        const offT = Math.abs(tk.headingDeg);
        rows.push(['Direzione allo stacco', offT < 0.5 ? 'Dritta' : `${offT.toFixed(1)}° verso il ${side(tk.headingDeg)}`]);
      }
      $('cChips').innerHTML = chips.join('');
      $('cRows').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      $('card').hidden = false;
    },
    hideCard() { $('card').hidden = true; },
  };
}
