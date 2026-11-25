import { describe, expect, it } from 'vitest';
import { DEG } from '../src/core/config';
import { evaluateLanding, type LandingInput } from '../src/physics/landing';

// 38° landing going down +z
const a = 38 * DEG;
const normal = { x: 0, y: Math.cos(a), z: Math.sin(a) };
const vel = { x: 0, y: -Math.sin(a) * 17, z: Math.cos(a) * 17 };
// board direction IN the slope plane, `yaw` degrees off the travel direction
const t = { x: 0, y: -Math.sin(a), z: Math.cos(a) }, l = { x: 1, y: 0, z: 0 };
const fwdAt = (yaw: number) => ({ x: Math.cos(yaw * DEG) * t.x + Math.sin(yaw * DEG) * l.x, y: Math.cos(yaw * DEG) * t.y, z: Math.cos(yaw * DEG) * t.z });
const base = (o: Partial<LandingInput> = {}): LandingInput => ({
  boardFwd: fwdAt(0), bodyUp: { x: 0, y: 1, z: 0 }, velocity: vel, normal, efh: 1, residualOmega: 0, dKnuckle: 8, inLanding: true, tolerance: false, ...o,
});

describe('landing judgment', () => {
  it('bands on the board yaw: 12° clean, 20° sketchy, 35° severe, 60° crash', () => {
    expect(evaluateLanding(base({ boardFwd: fwdAt(12) })).quality).toBe('clean');
    expect(evaluateLanding(base({ boardFwd: fwdAt(20) })).quality).toBe('sketchy');
    expect(evaluateLanding(base({ boardFwd: fwdAt(35) })).quality).toBe('severe');
    expect(evaluateLanding(base({ boardFwd: fwdAt(60) })).quality).toBe('crash');
  });

  it('landing at 180° is a clean switch landing', () => {
    const e = evaluateLanding(base({ boardFwd: fwdAt(180) }));
    expect(e.switchLand).toBe(true);
    expect(['perfect', 'clean']).toContain(e.quality);
  });

  it('a hard impact (EFH 4 m) is a crash; upside down is a crash', () => {
    expect(evaluateLanding(base({ efh: 4 })).quality).toBe('crash');
    expect(evaluateLanding(base({ bodyUp: { x: 0, y: -normal.y, z: -normal.z } })).cause).toBe('inverted');
  });

  it('on the knuckle at least severe; on the table sketchy or worse', () => {
    expect(evaluateLanding(base({ dKnuckle: 1 })).quality).toBe('severe');
    expect(['sketchy', 'severe']).toContain(evaluateLanding(base({ dKnuckle: -3 })).quality);
  });

  it('training tolerance ×1.7 turns a 20° landing clean', () => {
    expect(evaluateLanding(base({ boardFwd: fwdAt(20), tolerance: true })).quality).toBe('clean');
  });

  it('residual spin adds to the yaw error', () => {
    expect(evaluateLanding(base({ boardFwd: fwdAt(12), residualOmega: 400 })).quality).not.toBe('clean');
  });
});
