import { DEG, POP, SPIN } from '../core/config';
import { qAxis, qMul, qRot, smoothstep, type Q4 } from './vec';

/** Grab buttons (compact grabs: they all tuck the rider and speed the spin up). */
export type GrabId = 'nose' | 'mute' | 'indy' | 'tail';
export const GRAB_NAME: Record<GrabId, string> = { nose: 'Nose', mute: 'Mute', indy: 'Indy', tail: 'Tail' };

export type SpinMode = 'none' | 'spin' | 'flip';
export type TiltType = 'flat' | 'cork' | 'misty' | 'rodeo';

/**
 * Rotation in the air, in the board's takeoff frame (x = heel side, y = up, z = nose).
 * Ported from the legacy SIM (initSpin / stepAir / airQuat) with angular-momentum physics and TWO
 * powers: the spin (left thumb, L) and the off-axis push (stick, L_f). ω = L / I(pose) for both;
 * the off-axis flip ramps in after the first half-turn of spin.
 */
export interface SpinState {
  mode: SpinMode;
  /** +1 frontside, −1 backside (spin); +1 frontflip, −1 backflip (flip) */
  dir: number;
  /** angular momentum, in "°/s × kg·m²" */
  L: number;
  /** yaw around the (tilted) spin axis (°), signed */
  phi: number;
  /** flip angle (°), signed */
  theta: number;
  tiltType: TiltType;
  /** +1 cork (stick up), −1 misty/rodeo (stick down): direction of the off-axis flip */
  tiltSgn: number;
  /** off-axis angular momentum (second power), "°/s × kg·m²" */
  Lf: number;
  /** off-axis push 0..1 (for the record) */
  axisPower: number;
  /** current tilt of the body from vertical due to the off-axis flip (°), for display */
  tilt: number;
  /** the off-axis flip has been closed (spotted) */
  flipDone: boolean;
  shifty: number;
  maxShifty: number;
  parked: number;
  stall: number;
  stalled: boolean;
  inv: number;
  wasInv: boolean;
  airT: number;
  apex: boolean;
  opened: boolean;
  grabbing: boolean;
  everGrabbed: boolean;
  curGrab: GrabId | null;
  grabTimes: Partial<Record<GrabId, number>>;
  power: number;
  axis: number;
  /** current spin rate (°/s) */
  omega: number;
}

export interface SpinInput {
  grab: GrabId | null;
  /** left thumb held in the air */
  held: boolean;
  /** thumb offset −1..1 (counter-rotation / push / shifty) */
  bar: number;
}

/**
 * Set up the rotation at the pop. `power` 0..1 and `dir` from the charge, `axis` from the stick,
 * `popQ` the pop quality, `carveHelp` the set-up carve's help (Phase 2; worth up to ~10 %).
 */
export function initSpin(power: number, dir: number, axis: number, popQ: number, carveHelp: number | null): SpinState {
  const sp: SpinState = {
    mode: 'none', dir: 0, L: 0, phi: 0, theta: 0, tiltType: 'flat', tiltSgn: 0, Lf: 0, axisPower: 0, tilt: 0, flipDone: false,
    shifty: 0, maxShifty: 0, parked: 0, stall: 0, stalled: false, inv: 0, wasInv: false, airT: 0,
    apex: false, opened: false, grabbing: false, everGrabbed: false, curGrab: null, grabTimes: {},
    power, axis, omega: 0,
  };
  const qf = 0.55 + 0.45 * popQ;
  const ay = Math.abs(axis);
  if (power < POP.DEAD) {
    if (ay >= POP.AXIS_DEAD) {
      sp.mode = 'flip';
      sp.dir = axis > 0 ? 1 : -1;
      sp.L = ay * SPIN.FLIP_MAX * qf * SPIN.I_NEUTRAL;
    }
    return sp;
  }
  sp.mode = 'spin';
  sp.dir = dir >= 0 ? 1 : -1;
  sp.L = power * SPIN.OMEGA_MAX * qf * (1 + 0.1 * (carveHelp ?? 0)) * SPIN.I_NEUTRAL;
  if (ay >= POP.AXIS_DEAD) {
    // second power: the off-axis push, stick distance from the dead zone to the end
    const a = Math.min(1, (ay - POP.AXIS_DEAD) / (1 - POP.AXIS_DEAD));
    const up = axis > 0;
    sp.tiltSgn = up ? 1 : -1;
    sp.tiltType = up ? 'cork' : sp.dir > 0 ? 'misty' : 'rodeo';
    sp.axisPower = a;
    sp.Lf = (SPIN.OFF_MIN + (1 - SPIN.OFF_MIN) * a) * SPIN.OFF_MAX * qf * SPIN.I_NEUTRAL;
  }
  return sp;
}

const rampIn = (t: number) => { const u = Math.min(1, t / SPIN.RAMP_IN); return 0.3 + 0.7 * u * u * (3 - 2 * u); };
const sgn = (v: number) => (v > 0 ? 1 : v < 0 ? -1 : 0);

/** One step in the air. `vy` vertical velocity (for the apex). */
export function stepSpin(sp: SpinState, inp: SpinInput, vy: number, dt: number): void {
  sp.airT += dt;
  // pose
  const grabbing = !!inp.grab;
  if (grabbing) {
    sp.everGrabbed = true;
    sp.curGrab = inp.grab;
    sp.grabTimes[inp.grab!] = (sp.grabTimes[inp.grab!] ?? 0) + dt;
  } else {
    if (sp.grabbing) sp.opened = true; // letting go = opening up
    sp.curGrab = null;
  }
  sp.grabbing = grabbing;
  if (!sp.apex && vy <= 0) { sp.apex = true; if (!sp.everGrabbed) sp.opened = true; }
  const I = grabbing ? SPIN.I_TUCK : sp.opened ? SPIN.I_OPEN : SPIN.I_NEUTRAL;
  const b = inp.held ? inp.bar : 0;

  if (sp.mode === 'spin') {
    let w = (sp.L / I) * rampIn(sp.airT);
    const opposite = inp.held && sgn(b) === -sp.dir && Math.abs(b) > 0.08;
    if (inp.held && !opposite) w *= 1 + 0.15 * Math.abs(b);
    let adv = w * dt;
    if (opposite && sp.parked < SPIN.PARK_MAX) {
      const dp = Math.min(Math.abs(b) * SPIN.BRAKE_RATE * dt, adv, SPIN.PARK_MAX - sp.parked);
      sp.parked += dp; adv -= dp; sp.stall += dt;
    } else if (!opposite && sp.parked > 0) {
      const r = Math.min(sp.parked, SPIN.PARK_RET * dt);
      if (sp.stall > 0.3 && sp.parked > 45) sp.stalled = true;
      sp.parked -= r; adv += r;
    }
    sp.phi += sp.dir * adv;
    sp.omega = adv / dt;
    // off-axis flip (second power): starts after the first half-turn of spin, ω_f = L_f / I(pose).
    // Opened up, within SPOT_WINDOW of a whole flip, the rider spots the landing and closes it.
    if (sp.tiltType !== 'flat' && !sp.flipDone) {
      const ramp = smoothstep((Math.abs(sp.phi) - SPIN.TILT_FROM) / (SPIN.TILT_TO - SPIN.TILT_FROM));
      let wf = (sp.Lf / I) * ramp;
      const a = Math.abs(sp.theta), next = Math.ceil(a / 360 - 1e-9) * 360, rem = next - a;
      if (sp.opened && !grabbing && a > 90 && rem < SPIN.SPOT_WINDOW) {
        wf = Math.max(wf, SPIN.LEVEL_RATE);
        if (wf * dt >= rem) { sp.theta = sp.tiltSgn * next; sp.flipDone = true; wf = 0; }
      }
      if (!sp.flipDone) sp.theta += sp.tiltSgn * wf * dt;
      sp.tilt = Math.abs(((Math.abs(sp.theta) + 180) % 360) - 180);
    }
  } else if (sp.mode === 'flip') {
    const w = (sp.L / I) * rampIn(sp.airT);
    sp.theta += sp.dir * w * dt;
    sp.omega = w;
  } else {
    // shifty: the board turns under a quiet upper body, no net rotation
    const target = inp.held ? -b * 85 : 0, d = target - sp.shifty;
    sp.shifty += Math.sign(d) * Math.min(Math.abs(d), 400 * dt);
    sp.maxShifty = Math.max(sp.maxShifty, Math.abs(sp.shifty));
    sp.omega = 0;
  }
  // inversions (head below the feet), with hysteresis
  const up = qRot(airQuat(sp), { x: 0, y: 1, z: 0 });
  if (up.y < -0.05 && !sp.wasInv) { sp.inv++; sp.wasInv = true; }
  if (up.y > 0.3) sp.wasInv = false;
}

/** Orientation in the takeoff frame. */
export function airQuat(sp: SpinState): Q4 {
  if (sp.mode === 'flip') return qAxis(1, 0, 0, sp.theta * DEG);
  if (sp.mode === 'none') return qAxis(0, 1, 0, sp.shifty * DEG);
  // spin around the vertical, off-axis flip around the rider's own lateral axis
  return qMul(qAxis(0, 1, 0, sp.phi * DEG), qAxis(1, 0, 0, sp.theta * DEG));
}

/** Longest grab (≥ GRAB_MIN) and its time. */
export function mainGrab(sp: SpinState): { grab: GrabId | null; time: number } {
  let grab: GrabId | null = null, best = 0;
  for (const [g, t] of Object.entries(sp.grabTimes) as [GrabId, number][]) if (t > best) { best = t; grab = g; }
  return best >= SPIN.GRAB_MIN ? { grab, time: best } : { grab: null, time: best };
}
