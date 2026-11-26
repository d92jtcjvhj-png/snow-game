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

  it('on the knuckle: severe with a real impact, sketchy if soft; on the table sketchy or worse', () => {
    expect(evaluateLanding(base({ dKnuckle: 1, efh: 1.2 })).quality).toBe('severe');
    expect(evaluateLanding(base({ dKnuckle: 1, efh: 0.5 })).quality).toBe('sketchy');
    expect(['sketchy', 'severe']).toContain(evaluateLanding(base({ dKnuckle: -3 })).quality);
  });

  it('training tolerance ×1.7 turns a 20° landing clean', () => {
    expect(evaluateLanding(base({ boardFwd: fwdAt(20), tolerance: true })).quality).toBe('clean');
  });

  it('residual spin adds to the yaw error', () => {
    expect(evaluateLanding(base({ boardFwd: fwdAt(12), residualOmega: 400 })).quality).not.toBe('clean');
  });
});

describe('landing, research 13', () => {
  const up = { x: 0, y: 1, z: 0 };
  it('residual spin is signed: towards the line helps, away from it hurts', () => {
    // board 14° off on the + side
    const towards = evaluateLanding(base({ boardFwd: fwdAt(14), residualOmega: -400 }));
    const away = evaluateLanding(base({ boardFwd: fwdAt(14), residualOmega: 400 }));
    expect(towards.yawErr).toBeLessThan(away.yawErr);
  });

  it('pitch is asymmetric: 30° back = butt check (rider stays up), 30° forward = worse', () => {
    const tilt = (deg: number) => ({ x: 0, y: Math.cos(deg * DEG), z: Math.sin(deg * DEG) });
    const back = evaluateLanding(base({ bodyUp: tilt(-30) })), fwd = evaluateLanding(base({ bodyUp: tilt(30) }));
    expect(back.outcome).toBe('buttcheck');
    expect(['severe', 'crash']).toContain(fwd.quality);
  });

  it('edge catch: leading edge lowered while sliding sideways = crash', () => {
    // board 20° off, body rolled towards the side it slides to
    // board along the travel, sliding sideways towards +x, body rolled towards +x (that edge lowered)
    const vSide = { x: 4, y: vel.y, z: vel.z };
    const lean = { x: 0.2, y: 0.98, z: 0 };
    const e = evaluateLanding(base({ velocity: vSide, bodyUp: lean }));
    expect(e.cause).toBe('edge');
    expect(e.quality).toBe('crash');
  });

  it('a big yaw with the spin still carrying on becomes a revert (rider stays up, now switch)', () => {
    const e = evaluateLanding(base({ boardFwd: fwdAt(60), residualOmega: 300 }));
    expect(e.outcome).toBe('revert');
    expect(e.switchLand).toBe(true);
  });

  it('a grab still held makes the impact bands stricter', () => {
    expect(evaluateLanding(base({ efh: 1.3 })).quality).toBe('clean');
    expect(evaluateLanding(base({ efh: 1.3, grabHeld: true })).quality).not.toBe('clean');
  });

  it('nose-first is detected in switch too (leading tip)', () => {
    const tilt = { x: 0, y: Math.cos(10 * DEG), z: Math.sin(10 * DEG) };
    // riding switch: the leading tip (−fwd) points down the slope and 20° into the snow
    const c = Math.cos(20 * DEG), sn = Math.sin(20 * DEG);
    const lead = { x: 0, y: t.y * c - normal.y * sn, z: t.z * c - normal.z * sn };
    const e = evaluateLanding(base({ boardFwd: { x: -lead.x, y: -lead.y, z: -lead.z }, bodyUp: tilt }));
    expect(e.switchLand).toBe(true);
    expect(e.cause).toBe('nose');
    void up;
  });
});
