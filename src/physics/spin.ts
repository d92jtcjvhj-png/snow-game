import { DEG, POP, SPIN } from '../core/config';
import { qAxis, qConj, qMul, qRot, smoothstep, type Q4 } from './vec';

/** Grab buttons (compact grabs: they all tuck the rider and speed the spin up). */
export type GrabId = 'nose' | 'mute' | 'indy' | 'tail';
export const GRAB_NAME: Record<GrabId, string> = { nose: 'Nose', mute: 'Mute', indy: 'Indy', tail: 'Tail' };

export type SpinMode = 'none' | 'spin' | 'flip';
export type TiltType = 'flat' | 'cork' | 'misty' | 'rodeo';

/**
 * Rotation in the air, in the board's takeoff frame (x = heel side, y = up, z = nose).
 * Ported from the legacy SIM (initSpin / stepAir / airQuat) with real angular-momentum physics:
 * L is set at the pop, ω = L / I(pose); the cork axis ramps in after the first half-turn.
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
  /** +1 cork (axis tipped forward), −1 misty/rodeo */
  tiltSgn: number;
  tiltTarget: number;
  /** current tilt of the spin axis from vertical (°) */
  tilt: number;
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
    mode: 'none', dir: 0, L: 0, phi: 0, theta: 0, tiltType: 'flat', tiltSgn: 0, tiltTarget: 0, tilt: 0,
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
    const a = Math.min(1, (ay - POP.AXIS_DEAD) / (1 - POP.AXIS_DEAD));
    const up = axis > 0;
    sp.tiltSgn = up ? 1 : -1;
    sp.tiltType = up ? 'cork' : sp.dir > 0 ? 'misty' : 'rodeo';
    sp.tiltTarget = Math.min(85, SPIN.TILT_MIN + SPIN.TILT_GAIN * a + (up ? 0 : SPIN.TILT_FLIPPY));
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
    // cork axis: ramps in after the first half-turn while closed; opening up levels it
    if (sp.tiltType !== 'flat') {
      if (!sp.opened || grabbing) {
        const ramp = smoothstep((Math.abs(sp.phi) - SPIN.TILT_FROM) / (SPIN.TILT_TO - SPIN.TILT_FROM));
        sp.tilt = Math.max(sp.tilt, sp.tiltTarget * ramp);
      } else {
        sp.tilt = Math.max(0, sp.tilt - SPIN.LEVEL_RATE * dt);
      }
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
  const T = qAxis(1, 0, 0, sp.tiltSgn * sp.tilt * DEG);
  return qMul(qMul(T, qAxis(0, 1, 0, sp.phi * DEG)), qConj(T));
}

/** Longest grab (≥ GRAB_MIN) and its time. */
export function mainGrab(sp: SpinState): { grab: GrabId | null; time: number } {
  let grab: GrabId | null = null, best = 0;
  for (const [g, t] of Object.entries(sp.grabTimes) as [GrabId, number][]) if (t > best) { best = t; grab = g; }
  return best >= SPIN.GRAB_MIN ? { grab, time: best } : { grab: null, time: best };
}
