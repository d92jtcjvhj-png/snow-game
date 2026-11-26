import { POP } from '../core/config';
import { vibrate, type Input } from '../core/input';
import type { GrabId } from '../physics/spin';

const PX_DEAD = 10, PX_FULL = 120, BAR_HALF = PX_FULL + 22, BRAKE_PX = 110;

export interface Controls {
  /** show the right pad only on the snow */
  setGround(onGround: boolean): void;
  /** floating charge bar position (touch) */
  barKnob(dx: number | null): void;
}

/**
 * Touch controls (same layout as the legacy prototype):
 * - left half: free thumb. Hold = start charging (and the rider starts the set-up carve), drag sideways =
 *   spin side and power %, lift on the kicker = pop.
 * - right, on the snow: SPEED CHECK pad (hold and drag down: the further, the harder) + off-axis stick.
 * - right, in the air: 4 grab buttons (Nose, Mute, Indy, Tail); the left thumb counter-rotates.
 */
export function createControls(root: HTMLElement, input: Input): Controls {
  root.insertAdjacentHTML('beforeend', `
    <div class="zone" id="zoneL"></div>
    <div id="bar" hidden><div id="barTicks"></div><div id="barKnob"></div></div>
    <div id="groundPad">
      <div id="brakePad"><div id="brakeFill"></div><span>Speed<br>check</span></div>
      <div id="stick"><div class="slbl up">Cork · Frontflip</div><div class="slbl dn">Misty/Rodeo · Backflip</div><div id="stickKnob"></div></div>
    </div>
    <div id="grabsPad" hidden>
      <button class="gb" id="gNose" data-g="nose">Nose</button><button class="gb" id="gMute" data-g="mute">Mute</button>
      <button class="gb" id="gIndy" data-g="indy">Indy</button><button class="gb" id="gTail" data-g="tail">Tail</button>
    </div>`);
  const $ = (id: string) => document.getElementById(id)!;
  const zoneL = $('zoneL'), bar = $('bar'), knob = $('barKnob');
  bar.style.width = BAR_HALF * 2 + 'px';
  for (const side of [-1, 1]) for (let i = 1; i <= 4; i++) {
    const t = document.createElement('i');
    t.style.left = BAR_HALF + side * (PX_DEAD + ((PX_FULL - PX_DEAD) * i) / 4) + 'px';
    if (i === 4) t.className = 'major';
    $('barTicks').appendChild(t);
  }

  const t = input.touch;
  let L: { id: number; x0: number; buzz: number } | null = null;
  zoneL.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (L) return;
    zoneL.setPointerCapture(e.pointerId);
    L = { id: e.pointerId, x0: e.clientX, buzz: 0 };
    t.charging = true; t.charge = 0;
    const cx = Math.max(BAR_HALF + 4, Math.min(window.innerWidth - BAR_HALF - 4, e.clientX));
    bar.style.left = cx - BAR_HALF + 'px'; bar.style.top = e.clientY - 22 + 'px';
    bar.hidden = false; knob.style.left = BAR_HALF + 'px';
    vibrate(8);
  });
  zoneL.addEventListener('pointermove', (e) => {
    if (!L || e.pointerId !== L.id) return;
    const dx = e.clientX - L.x0;
    const a = Math.max(0, Math.abs(dx) - PX_DEAD) / (PX_FULL - PX_DEAD);
    t.charge = a <= 0 ? 0 : Math.sign(dx) * Math.min(1, POP.DEAD + (1 - POP.DEAD) * a);
    knob.style.left = BAR_HALF + Math.max(-BAR_HALF + 22, Math.min(BAR_HALF - 22, dx)) + 'px';
    const q = Math.floor(Math.min(1, a) * 4);
    if (q !== L.buzz) { L.buzz = q; vibrate(6); }
  });
  const upL = (e: PointerEvent) => { if (!L || e.pointerId !== L.id) return; L = null; t.charging = false; bar.hidden = true; };
  zoneL.addEventListener('pointerup', upL); zoneL.addEventListener('pointercancel', upL);

  // speed check pad: press = board across on the heels (edge 25°), drag down = sit harder (up to 65°)
  const pad = $('brakePad'), fill = $('brakeFill');
  let B: { id: number; y0: number } | null = null;
  const setBrake = (v: number) => { t.brake = v; fill.style.height = Math.round(v * 100) + '%'; };
  pad.addEventListener('pointerdown', (e) => {
    e.preventDefault(); pad.setPointerCapture(e.pointerId);
    B = { id: e.pointerId, y0: e.clientY }; t.brakeActive = true; setBrake(0.05); vibrate(5);
  });
  pad.addEventListener('pointermove', (e) => {
    if (!B || e.pointerId !== B.id) return;
    setBrake(Math.max(0.05, Math.min(1, 0.05 + (0.95 * (e.clientY - B.y0)) / BRAKE_PX)));
  });
  const upB = (e: PointerEvent) => { if (!B || e.pointerId !== B.id) return; B = null; t.brakeActive = false; setBrake(0); };
  pad.addEventListener('pointerup', upB); pad.addEventListener('pointercancel', upB);

  // off-axis stick
  const stick = $('stick'), sKnob = $('stickKnob');
  let S: number | null = null, axisBuzz = 0;
  const fromEvent = (e: PointerEvent) => {
    const r = stick.getBoundingClientRect(), R = r.width / 2;
    const dy = Math.max(-1, Math.min(1, -(e.clientY - (r.top + R)) / (R - 16)));
    t.axis = Math.abs(dy) < 0.08 ? 0 : dy;
    // second power: a light tick every 25 % of off-axis push
    const q = Math.floor(Math.max(0, (Math.abs(dy) - POP.AXIS_DEAD) / (1 - POP.AXIS_DEAD)) * 4);
    if (q !== axisBuzz) { axisBuzz = q; vibrate(6); }
    sKnob.style.transform = `translateY(${-dy * (R - 30)}px)`;
  };
  stick.addEventListener('pointerdown', (e) => { e.preventDefault(); S = e.pointerId; stick.setPointerCapture(e.pointerId); t.stickActive = true; fromEvent(e); });
  stick.addEventListener('pointermove', (e) => { if (e.pointerId === S) fromEvent(e); });
  const upS = (e: PointerEvent) => { if (e.pointerId !== S) return; S = null; t.stickActive = false; t.axis = 0; sKnob.style.transform = ''; };
  stick.addEventListener('pointerup', upS); stick.addEventListener('pointercancel', upS);

  // grab buttons (hold): they tuck the rider and speed the spin up; letting go = opening up
  const grabBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('#grabsPad .gb'));
  for (const el of grabBtns) {
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('on'); t.grab = el.dataset.g as GrabId; vibrate(5); });
    const up = () => { el.classList.remove('on'); if (t.grab === el.dataset.g) t.grab = null; };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }

  document.addEventListener('gesturestart', (e) => e.preventDefault());

  let shown = true;
  return {
    setGround(onGround) {
      if (onGround === shown) return;
      shown = onGround;
      $('groundPad').hidden = !onGround;
      $('grabsPad').hidden = onGround;
      if (onGround) { t.grab = null; for (const el of grabBtns) el.classList.remove('on'); }
      if (!onGround) { B = null; t.brakeActive = false; setBrake(0); S = null; t.stickActive = false; t.axis = 0; sKnob.style.transform = ''; }
    },
    barKnob(dx) {
      // keyboard: show the bar at the bottom left
      if (dx === null) { if (!L) bar.hidden = true; return; }
      if (L) return;
      bar.hidden = false;
      bar.style.left = '16px'; bar.style.top = window.innerHeight - 140 + 'px';
      knob.style.left = BAR_HALF + dx * (PX_FULL - PX_DEAD) + 'px';
    },
  };
}
