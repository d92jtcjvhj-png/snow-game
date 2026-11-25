import type RAPIER from '@dimforge/rapier3d-compat';
import { beforeAll, describe, expect, it } from 'vitest';
import { DEG, GRAVITY, SNOW, STEP } from '../src/core/config';
import { Board, type BoardCmd, type Ground } from '../src/physics/board';
import { createPhysicsWorld, initRapier, type Rapier } from '../src/physics/world';

let R: Rapier;
beforeAll(async () => { R = await initRapier(); });

const plane = (angle: number): Ground => ({ heightAt: (_x, z) => -z * Math.tan(angle) });
const NONE: BoardCmd = { kappa: 0, edge: 0, brake: 0, tuck: false };

function setup(angle: number, speed = 0, psi = 0) {
  const world: RAPIER.World = createPhysicsWorld(R);
  const g = plane(angle);
  const b = new Board(R, world, g);
  b.reset(0, g.heightAt(0, 0), 0);
  b.psi = psi;
  if (speed) b.body.setLinvel({ x: 0, y: -Math.sin(angle) * speed, z: Math.cos(angle) * speed }, true);
  const step = (cmd: BoardCmd = NONE) => { b.preStep(cmd, STEP); world.step(); b.postStep(); };
  return { world, b, g, step };
}

describe('board on the snow', () => {
  it('straight run: no lateral drift, accelerates but stays below the terminal speed', () => {
    const angle = 15 * DEG, { b, g, step } = setup(angle);
    for (let i = 0; i < 8 / STEP; i++) {
      step();
      const p = b.position();
      expect(Number.isFinite(p.x + p.y + p.z)).toBe(true);
      expect(p.y).toBeGreaterThan(g.heightAt(p.x, p.z) - 0.01);
    }
    const vt = Math.sqrt((2 * SNOW.MASS * GRAVITY * (Math.sin(angle) - SNOW.MU_LONG * Math.cos(angle))) / (SNOW.RHO * SNOW.CDA));
    expect(Math.abs(b.position().x)).toBeLessThan(0.05);
    expect(b.speed()).toBeGreaterThan(12);
    expect(b.speed()).toBeLessThan(vt);
  });

  it('carving: path curvature follows the command while the grip holds', () => {
    const { b, step } = setup(0, 8);
    const kappa = 1 / 25;
    for (let i = 0; i < 60; i++) step({ kappa, edge: 20 * DEG, brake: 0, tuck: false });
    const h0 = b.travelHeading(), v0 = b.speed();
    for (let i = 0; i < 60; i++) step({ kappa, edge: 20 * DEG, brake: 0, tuck: false });
    const rate = (b.travelHeading() - h0) / (60 * STEP);
    expect(rate).toBeGreaterThan(0.9 * kappa * v0);
    expect(rate).toBeLessThan(1.1 * kappa * v0);
  });

  it('anisotropy: sideways (board across the travel) it stops much sooner than straight', () => {
    const dist = (psi: number) => {
      const { b, step } = setup(0, 10, psi);
      const brake = psi ? 1 : 0;
      for (let i = 0; i < 20 / STEP && b.speed() > 0.6; i++) step({ ...NONE, brake });
      return b.position().z;
    };
    expect(dist(80 * DEG)).toBeLessThan(dist(0) / 3);
  });

  it('speed check: net deceleration on a 12° slope grows with the intensity', () => {
    const decel = (brake: number) => {
      const { b, step } = setup(12 * DEG, 18);
      for (let i = 0; i < 30; i++) step({ ...NONE, brake });
      const v0 = b.speed();
      for (let i = 0; i < 120; i++) step({ ...NONE, brake });
      return (v0 - b.speed()) / 1;
    };
    const half = decel(0.5), full = decel(1);
    expect(full).toBeGreaterThan(2);
    expect(full).toBeGreaterThan(half);
    expect(decel(0)).toBeLessThan(0);
  });

  it('a full speed check slows the rider down even on the 35° drop-in; pressing alone (50%) brakes on the approach', () => {
    const dv = (angle: number, brake: number) => {
      const { b, step } = setup(angle * DEG, 18);
      for (let i = 0; i < 30; i++) step({ ...NONE, brake });
      const v0 = b.speed();
      for (let i = 0; i < 120; i++) step({ ...NONE, brake });
      return v0 - b.speed();
    };
    expect(dv(35, 1)).toBeGreaterThan(1.5);
    expect(dv(12, 1)).toBeGreaterThan(6);
    expect(dv(12, 0.5)).toBeGreaterThan(2.5);
  });

  it('speed check does not push the rider sideways', () => {
    const { b, step } = setup(12 * DEG, 18);
    for (let i = 0; i < 120; i++) step({ ...NONE, brake: i < 60 ? 1 : 0 });
    expect(Math.abs(b.travelHeading())).toBeLessThan(0.5 * DEG);
    expect(Math.abs(b.position().x)).toBeLessThan(0.1);
  });

  it('is deterministic', () => {
    const run = () => {
      const { b, step } = setup(15 * DEG);
      for (let i = 0; i < 300; i++) step({ kappa: 0.02 * Math.sin(i / 30), edge: 10 * DEG, brake: i > 200 ? 0.5 : 0, tuck: false });
      const p = b.position();
      return [p.x, p.y, p.z];
    };
    expect(run()).toEqual(run());
  });
});
