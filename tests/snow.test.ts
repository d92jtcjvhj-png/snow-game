import { describe, expect, it } from 'vitest';
import { DEG, SNOW } from '../src/core/config';
import { carveRadius, edgeForCurvature, lateralImpulse, lateralMu, maxCurvature } from '../src/physics/snow';

describe('snow model (pure)', () => {
  it('carve radius follows the sidecut: R = Rsc·cos φ, no carve with a flat base', () => {
    expect(carveRadius(0)).toBe(Infinity);
    expect(carveRadius(40 * DEG)).toBeCloseTo(SNOW.SIDECUT_R * Math.cos(40 * DEG), 6);
    expect(carveRadius(-40 * DEG)).toBeCloseTo(carveRadius(40 * DEG), 6);
  });

  it('anisotropic friction: lateral grip grows with the edge angle, well above the longitudinal μ', () => {
    expect(lateralMu(0)).toBeCloseTo(SNOW.MU_LAT_FLAT, 6);
    expect(lateralMu(10 * DEG)).toBeGreaterThan(lateralMu(2 * DEG));
    expect(lateralMu(30 * DEG)).toBeCloseTo(SNOW.MU_LAT_EDGE, 6);
    expect(lateralMu(0)).toBeGreaterThan(SNOW.MU_LONG);
  });

  it('grip is limited: within the limit the lateral velocity is cancelled, beyond it the board skids', () => {
    const dt = 1 / 120, aN = 9.81;
    const small = lateralImpulse(0.05, 30 * DEG, aN, dt);
    expect(small.dv).toBeCloseTo(-0.05, 6);
    expect(small.skidding).toBe(false);
    const big = lateralImpulse(3, 30 * DEG, aN, dt);
    expect(Math.abs(big.dv)).toBeCloseTo(SNOW.MU_SKID * aN * dt, 6);
    expect(big.skidding).toBe(true);
  });

  it('max curvature: v²κ ≤ μ·aN — a pure carve is impossible at kicker speed (docs/research 05)', () => {
    const k = maxCurvature(17, 9.81, 1);
    expect(17 * 17 * k).toBeCloseTo(9.81, 6);
    // the sidecut radius (8 m) needs much more than the snow can give at 60 km/h
    expect(1 / SNOW.SIDECUT_R).toBeGreaterThan(k);
  });

  it('edge needed for a turn = lean atan(a_lat/a_n), signed like the curvature', () => {
    const e = edgeForCurvature(1 / 30, 15, 9.81);
    expect(e).toBeGreaterThan(Math.atan(225 / 30 / 9.81));
    expect(edgeForCurvature(-1 / 30, 15, 9.81)).toBeCloseTo(-e, 6);
    expect(edgeForCurvature(0, 15, 9.81)).toBe(0);
  });
});
