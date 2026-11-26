import { describe, expect, it } from 'vitest';
import { GRAB_K, SPIN, STEP } from '../src/core/config';
import { airQuat, initSpin, poseInertia, stepSpin, type GrabId, type SpinState } from '../src/physics/spin';
import { qRot } from '../src/physics/vec';

/** fly `T` seconds; grab held until `grabUntil` (s); vertical speed goes from +8 to −… (apex ~0.8 s) */
function fly(sp: SpinState, T: number, grabUntil: number, grab: GrabId = 'indy', bar = 0) {
  for (let t = 0; t < T; t += STEP) stepSpin(sp, { grab: t < grabUntil ? grab : null, held: bar !== 0, bar }, 8 - 9.81 * t, STEP);
  return sp;
}

describe('rotation in the air', () => {
  it('tucked spins faster than open (same angular momentum)', () => {
    const a = fly(initSpin(1, 1, 0, 1, null), 1, 1), b = initSpin(1, 1, 0, 1, null);
    b.opened = true;
    fly(b, 1, 0);
    expect(Math.abs(a.phi)).toBeGreaterThan(Math.abs(b.phi) * 1.4);
  });

  it('100 % frontside, grab until the apex then open, 2.4 s: between 1260° and 1800°', () => {
    const sp = fly(initSpin(1, 1, 0, 1, 1), 2.4, 0.8);
    expect(sp.phi).toBeGreaterThan(1260);
    expect(sp.phi).toBeLessThan(1800);
  });

  it('30 % charge gives a 360–540', () => {
    const sp = fly(initSpin(0.3, -1, 0, 1, 1), 2.4, 0.8);
    expect(Math.abs(sp.phi)).toBeGreaterThan(300);
    expect(Math.abs(sp.phi)).toBeLessThan(620);
    expect(sp.phi).toBeLessThan(0);
  });

  it('second power: more off-axis push = more inversions in the same spin', () => {
    const run = (push: number) => {
      const sp = initSpin(0.8, -1, 0.2 + 0.8 * push, 1, 1);
      fly(sp, 2.3, 1.4);
      return sp;
    };
    const low = run(0.1), high = run(1);
    expect(low.inv).toBeGreaterThanOrEqual(1);
    expect(high.inv).toBeGreaterThan(low.inv);
    expect(high.inv).toBeGreaterThanOrEqual(3);
  });

  it('the off-axis flip starts at the pop together with the spin and, opened in time, is closed on a whole flip', () => {
    const sp = initSpin(0.5, -1, 0.6, 1, 1);
    // one fluid rotation: after the first steps (neutral pose) both angles already move, in proportion ω_f/ω_s
    for (let t = 0; t < 0.25; t += STEP) stepSpin(sp, { grab: null, held: false, bar: 0 }, 8, STEP);
    expect(Math.abs(sp.theta)).toBeGreaterThan(15);
    expect(Math.abs(sp.theta) / Math.abs(sp.phi)).toBeCloseTo((sp.Lf / SPIN.IF_NEUTRAL) / (sp.L / SPIN.I_NEUTRAL), 2);
    fly(sp, 2.1, 1.2);
    expect(sp.flipDone).toBe(true);
    expect(Math.abs(sp.theta) % 360).toBe(0);
  });

  it('straight flips: stick up = frontflip, down = backflip', () => {
    const f = fly(initSpin(0, 0, 1, 1, null), 2, 0), bk = fly(initSpin(0, 0, -1, 1, null), 2, 0);
    expect(f.mode).toBe('flip');
    expect(f.theta).toBeGreaterThan(300);
    expect(bk.theta).toBeLessThan(-300);
    // a full flip goes through one inversion
    expect(f.inv).toBeGreaterThanOrEqual(1);
  });

  it('counter-rotation parks degrees in the torso, then gives them back ("Stalled")', () => {
    const sp = initSpin(0.6, 1, 0, 1, null);
    for (let t = 0; t < 0.4; t += STEP) stepSpin(sp, { grab: null, held: false, bar: 0 }, 5, STEP);
    for (let t = 0; t < 0.5; t += STEP) stepSpin(sp, { grab: null, held: true, bar: -1 }, 3, STEP);
    expect(sp.parked).toBeGreaterThan(45);
    for (let t = 0; t < 1; t += STEP) stepSpin(sp, { grab: null, held: false, bar: 0 }, -3, STEP);
    expect(sp.parked).toBe(0);
    expect(sp.stalled).toBe(true);
  });

  it('body up vector stays up for a flat spin', () => {
    const sp = fly(initSpin(1, 1, 0, 1, null), 1.5, 1);
    expect(qRot(airQuat(sp), { x: 0, y: 1, z: 0 }).y).toBeGreaterThan(0.99);
    expect(sp.inv).toBe(0);
  });

  it('is deterministic', () => {
    const a = fly(initSpin(0.8, 1, 0.5, 0.9, 0.7), 2.2, 0.9), b = fly(initSpin(0.8, 1, 0.5, 0.9, 0.7), 2.2, 0.9);
    expect([a.phi, a.tilt, a.inv]).toEqual([b.phi, b.tilt, b.inv]);
  });
});

describe('grabs and pose inertia (docs/research 15)', () => {
  /** hold `grab` from `from` to `to` (s), opened after; returns the state after `T` s */
  const hold = (sp: SpinState, T: number, grab: GrabId | null, from = 0, to = T) => {
    for (let t = 0; t < T; t += STEP) stepSpin(sp, { grab: grab && t >= from && t < to ? grab : null, held: false, bar: 0 }, 8, STEP);
    return sp;
  };

  it('a grab speeds the flip up more than the spin (separate inertia tables)', () => {
    const g = GRAB_K.indy;
    const flipGain = 1 / g.flip, spinGain = 1 / g.spin;
    expect(flipGain).toBeGreaterThan(spinGain);
    // in flight, fully tucked: ω_f/ω_s is higher than in the neutral pose
    const a = hold(initSpin(0.8, 1, 0.8, 1, null), 0.8, 'indy');
    const n = hold(initSpin(0.8, 1, 0.8, 1, null), 0.8, null);
    const I = poseInertia(a), In = poseInertia(n);
    expect((a.Lf / I.flip) / (a.L / I.spin)).toBeGreaterThan((n.Lf / In.flip) / (n.L / In.spin) * 1.2);
    // opening levels the axis: ω_f/ω_s drops below neutral
    n.opened = true; hold(n, 0.6, null);
    const Io = poseInertia(n);
    expect((n.Lf / Io.flip) / (n.L / Io.spin)).toBeLessThan((a.Lf / In.flip) / (a.L / In.spin));
  });

  it('the tuck takes time: little gain after 0.05 s, 90 % between 0.2 and 0.35 s, no overshoot', () => {
    const sp = initSpin(1, 1, 0, 1, null);
    let t = 0, t90 = -1, prev = 0, at05 = 0;
    while (t < 0.6) {
      stepSpin(sp, { grab: 'indy', held: false, bar: 0 }, 8, STEP); t += STEP;
      expect(sp.tuck).toBeGreaterThanOrEqual(prev - 1e-12);
      expect(sp.tuck).toBeLessThanOrEqual(1);
      prev = sp.tuck;
      if (Math.abs(t - 0.05) < STEP / 2) at05 = sp.tuck;
      if (t90 < 0 && sp.tuck >= 0.9) t90 = t;
    }
    expect(at05).toBeLessThan(0.3);
    expect(t90).toBeGreaterThan(0.2);
    expect(t90).toBeLessThan(0.35);
  });

  it('opening takes time too (90 % in 0.15–0.3 s)', () => {
    const sp = initSpin(1, 1, 0, 1, null);
    sp.opened = true;
    let t = 0, t90 = -1;
    while (t < 0.6 && t90 < 0) { stepSpin(sp, { grab: null, held: false, bar: 0 }, -2, STEP); t += STEP; if (sp.open >= 0.9) t90 = t; }
    expect(t90).toBeGreaterThan(0.15);
    expect(t90).toBeLessThan(0.3);
  });

  it('angular momentum is conserved through the pose change: I·ω = L', () => {
    const sp = initSpin(0.7, -1, 0, 1, null);
    for (let t = 0; t < 1.2; t += STEP) {
      stepSpin(sp, { grab: t > 0.4 && t < 0.9 ? 'mute' : null, held: false, bar: 0 }, 8 - 9.81 * t, STEP);
      if (t > SPIN.RAMP_IN + 0.01) expect(poseInertia(sp).spin * sp.omega).toBeCloseTo(sp.L, 6);
    }
  });

  it('grab ordering on the spin: Truck driver > Indy > Nose > Method; the Method slows the flip below neutral', () => {
    const deg = (g: GrabId) => Math.abs(hold(initSpin(0.8, 1, 0, 1, null), 1.6, g, 0.1, 1.4).phi);
    expect(deg('truckdriver')).toBeGreaterThan(deg('indy'));
    expect(deg('indy')).toBeGreaterThan(deg('nose'));
    expect(deg('nose')).toBeGreaterThan(deg('method'));
    const flip = (g: GrabId | null) => Math.abs(hold(initSpin(0.8, 1, 0.6, 1, null), 1.0, g, 0.1, 1.0).theta);
    expect(flip('method')).toBeLessThan(flip(null));
  });

  it('with the same push, holding the grab gives more inversions', () => {
    const held = hold(initSpin(0.8, -1, 0.7, 1, null), 2.3, 'indy', 0.2, 1.8);
    const none = hold(initSpin(0.8, -1, 0.7, 1, null), 2.3, null);
    expect(held.inv).toBeGreaterThan(none.inv);
  });

  it('a 0.1 s tap on a grab is not a grab (the hand never reaches the board)', () => {
    const sp = hold(initSpin(0.6, 1, 0, 1, null), 1, 'indy', 0.2, 0.3);
    expect(Object.keys(sp.grabTimes)).toHaveLength(0);
  });

  it('is deterministic with the pose springs', () => {
    const a = hold(initSpin(0.9, 1, 0.6, 0.9, 0.5), 2.2, 'japan', 0.25, 1.5);
    const b = hold(initSpin(0.9, 1, 0.6, 0.9, 0.5), 2.2, 'japan', 0.25, 1.5);
    expect(a).toEqual(b);
  });
});
