import { DEG, MS_TO_KMH } from '../core/config';
import type { LandingRecord, TakeoffRecord } from '../world/run';

export interface Assist {
  indicators: boolean;
  slowmo: boolean;
}
const KEY = 'snowgame.assist';

export function loadAssist(): Assist {
  const a: Assist = { indicators: true, slowmo: false };
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
}

export interface Hud {
  update(s: HudState): void;
  showIntro(): void;
  showCard(tk: TakeoffRecord | null, ld: LandingRecord | null, note: string): void;
  hideCard(): void;
}

const TRICK: Record<string, string> = { frontside: 'Frontside', backside: 'Backside', flip: 'Flip', straight: 'Straight air' };
const EDGE: Record<string, string> = { heel: 'Tallone (heel)', toe: 'Punta (toe)', flat: 'Base piatta' };
const side = (v: number) => (v > 0 ? 'lato tallone' : 'lato punta');

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
  </div>
  <div id="msg"></div>
  <div id="chargeLbl"></div>
  <div class="panel" id="intro">
    <div class="card">
      <h1>Big Air</h1>
      <p class="sub">Fase 2: la tavola e tutto ciò che porta allo stacco. Il rider non lo guidi: scende da solo.</p>
      <ul>
        <li><b>Speed check</b> (a destra): tieni premuto e trascina giù, più trascini più freni. Senza freno arrivi lungo.</li>
        <li><b>Pollice sinistro</b>: quando lo appoggi il rider <b>inizia la curva d'impostazione</b>. Trascina di lato: il lato è il verso (destra frontside, sinistra backside), la distanza è la potenza.</li>
        <li>Frontside stacca di <b>tallone</b>, backside di <b>punta</b>, come nella realtà. Il rider fa da solo la S tallone-punta-tallone.</li>
        <li><b>Tempismo</b>: inizi troppo presto → la curva è troppo larga ed esci in diagonale. Troppo tardi → curva schiacciata, derapata, meno pop.</li>
        <li><b>Stacca il pollice sul kicker</b> (linea blu sul labbro): è il pop. Senza carica = straight air.</li>
      </ul>
      <p class="sub">Tastiera: Z/X carica · Spazio carica dritta · B speed check · ↑/↓ asse · R riprova.</p>
      <button class="cta" id="start">Gioca</button>
    </div>
  </div>
  <div class="panel" id="card" hidden>
    <div class="card">
      <h2 id="cName"></h2>
      <div id="cChips"></div>
      <p id="cNote"></p>
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
  for (const k of ['indicators', 'slowmo'] as const) {
    const el = $('opt-' + k) as HTMLInputElement;
    el.checked = assist[k];
    el.addEventListener('change', () => { assist[k] = el.checked; try { localStorage.setItem(KEY, JSON.stringify(assist)); } catch { /* ignore */ } });
  }
  const rotate = () => { $('rotate').hidden = !(innerWidth > innerHeight * 1.15 && matchMedia('(pointer: coarse)').matches); };
  addEventListener('resize', rotate); rotate();

  const spd = $('hSpd'), edgeEl = $('hEdge'), dbg = $('dbg'), msg = $('msg'), lbl = $('chargeLbl');
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
    },
    showIntro() { $('intro').hidden = false; },
    showCard(tk, ld, note) {
      const chips: string[] = [];
      const rows: [string, string][] = [];
      if (!tk) {
        $('cName').textContent = 'Niente salto';
        $('cNote').textContent = note || 'Non hai preso il kicker.';
      } else {
        $('cName').textContent = `${TRICK[tk.kind]}${tk.power ? ' ' + Math.round(tk.power * 100) + '%' : ''} · stacco`;
        const edgeOk = tk.edge === tk.edgeExpected;
        chips.push(edgeOk ? '<span class="chip q-ok">Lamina giusta</span>' : '<span class="chip q-bad">Lamina sbagliata</span>');
        if (tk.timingLabel) chips.push(`<span class="chip ${tk.timingLabel === 'giusto' ? 'q-ok' : 'q-mid'}">Curva ${tk.timingLabel === 'giusto' ? 'al momento giusto' : tk.timingLabel}</span>`);
        const off = Math.abs(tk.headingDeg);
        chips.push(`<span class="chip ${off < 2 ? 'q-ok' : off < 5 ? 'q-mid' : 'q-bad'}">${off < 2 ? 'Uscita dritta' : 'Uscita in diagonale'}</span>`);
        let n = note;
        if (!n) {
          if (tk.timingLabel === 'presto') n = 'Hai iniziato la curva troppo presto: al kicker stavi già curvando e sei uscito in diagonale.';
          else if (tk.timingLabel === 'tardi') n = 'Hai iniziato la curva troppo tardi: S schiacciata, cambio di lamina affrettato, meno pop.';
          else if (!edgeOk) n = `Hai staccato di ${EDGE[tk.edge]?.toLowerCase()}: per questo trick serve ${EDGE[tk.edgeExpected]?.toLowerCase()}.`;
          else if (tk.release === 'nessuno') n = 'Non hai staccato il pollice sul kicker: niente pop.';
          else n = off < 2 ? 'Stacco pulito: dritto, sulla lamina giusta.' : 'Stacco un po’ storto.';
        }
        $('cNote').textContent = n;
        rows.push(['Velocità allo stacco', `${(tk.speed * MS_TO_KMH).toFixed(0)} km/h`]);
        rows.push(['Pop', tk.release === 'nessuno' ? 'Nessuno (pollice tenuto oltre il labbro)' : `${tk.release === 'perfetto' ? 'Perfetto' : 'Presto'} · ${Math.round(tk.popQ * 100)}%`]);
        rows.push(['Lamina di stacco', `${EDGE[tk.edge]}${tk.edge !== 'flat' ? ' ' + Math.round(Math.abs(tk.edgeDeg)) + '°' : ''}${edgeOk ? '' : ' (serve ' + EDGE[tk.edgeExpected] + ')'}`]);
        if (tk.timing !== null) rows.push(['Inizio curva', Math.abs(tk.timing) <= 0.35 ? 'Giusto' : `${tk.timing > 0 ? 'Presto' : 'Tardi'} di ${Math.abs(tk.timing).toFixed(1)} s`]);
        rows.push(['Direzione allo stacco', off < 0.5 ? 'Dritta' : `${off.toFixed(1)}° verso il ${side(tk.headingDeg)}`]);
        if (tk.skidding) rows.push(['Tavola', `In derapata (${Math.abs(tk.skidDeg).toFixed(0)}°)`]);
      }
      if (ld) {
        rows.push(['Deriva in volo', Math.abs(ld.drift) < 0.3 ? 'Nessuna' : `${Math.abs(ld.drift).toFixed(1)} m verso il ${side(ld.drift)}`]);
        rows.push(['Atterraggio', `${Math.abs(ld.dKnuckle).toFixed(1)} m ${ld.dKnuckle >= 0 ? 'dopo' : 'prima del'} knuckle${ld.dKnuckle >= 0 ? '' : ' (sul tavolo)'}`]);
        rows.push(['Posizione', ld.dKnuckle < 0 ? 'Sul tavolo, prima del knuckle' : ld.inLanding ? 'Dentro l’atterraggio' : 'Fuori dalla pista preparata']);
        rows.push(['Tempo in aria', `${ld.airT.toFixed(2)} s`]);
        rows.push(['Impatto', `${ld.efh.toFixed(1)} m di caduta equivalente`]);
        if (tk && tk.carveHelp !== null) rows.push(['Aiuto della curva alla rotazione', `${Math.round(tk.carveHelp * 100)}% (in Fase 3 vale ~5–15% della rotazione)`]);
      }
      $('cChips').innerHTML = chips.join('');
      $('cRows').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      $('card').hidden = false;
    },
    hideCard() { $('card').hidden = true; },
  };
}
