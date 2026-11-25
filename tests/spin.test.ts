import { describe, expect, it } from 'vitest';
import { STEP } from '../src/core/config';
import { airQuat, initSpin, stepSpin, type GrabId, type SpinState } from '../src/physics/spin';
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

  it('cork with the axis ramping in: inversions = turns − 1 (double cork 1080)', () => {
    const sp = initSpin(0.5, -1, 1, 1, 1);
    fly(sp, 2.4, 1.6);
    expect(Math.round(Math.abs(sp.phi) / 180) * 180).toBe(1080);
    expect(sp.inv).toBe(2);
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
