import { beforeAll, describe, expect, it } from 'vitest';
import { CUBE, GRAVITY, SLOPE, SNOW_MU, STEP } from '../src/core/config';
import { FixedLoop } from '../src/core/loop';
import { PhysicsCube } from '../src/physics/cube';
import { createSlope, slopeSurfaceY } from '../src/physics/slope';
import { createPhysicsWorld, initRapier, type Rapier } from '../src/physics/world';

let R: Rapier;
beforeAll(async () => { R = await initRapier(); });

function setup() {
  const world = createPhysicsWorld(R);
  createSlope(R, world);
  const cube = new PhysicsCube(R, world);
  return { world, cube };
}

describe('cube on a slope', () => {
  it('slides downhill, stays on the surface, never NaN', () => {
    const { world, cube } = setup();
    const start = cube.body.translation();
    const steps = Math.round(3 / STEP);
    for (let i = 0; i < steps; i++) {
      world.step();
      const p = cube.body.translation();
      expect(Number.isFinite(p.x + p.y + p.z)).toBe(true);
      // the centre never goes below the surface (no tunnelling through the slope)
      expect(p.y).toBeGreaterThan(slopeSurfaceY(p.z));
    }
    const end = cube.body.translation();
    expect(end.z).toBeGreaterThan(start.z + 3);
    expect(end.y).toBeLessThan(start.y - 0.8);
    expect(cube.speed()).toBeGreaterThan(1);
    expect(Number.isFinite(cube.speed())).toBe(true);
  });

  it('accelerates close to g(sin a - mu cos a), the textbook value', () => {
    const { world, cube } = setup();
    const t = 2;
    for (let i = 0; i < Math.round(t / STEP); i++) world.step();
    const expected = GRAVITY * (Math.sin(SLOPE.angle) - SNOW_MU * Math.cos(SLOPE.angle)) * t;
    expect(cube.speed()).toBeGreaterThan(expected * 0.8);
    expect(cube.speed()).toBeLessThan(expected * 1.2);
  });

  it('is deterministic: two runs give the same position', () => {
    const run = () => {
      const { world, cube } = setup();
      for (let i = 0; i < 240; i++) world.step();
      const p = cube.body.translation();
      return [p.x, p.y, p.z];
    };
    expect(run()).toEqual(run());
  });

  it('reset puts the cube back at the start', () => {
    const { world, cube } = setup();
    for (let i = 0; i < 120; i++) world.step();
    cube.reset();
    expect(cube.body.translation().z).toBeCloseTo(CUBE.startZ, 0);
    expect(cube.speed()).toBe(0);
  });
});

describe('FixedLoop', () => {
  it('runs a whole number of fixed steps and returns alpha in [0,1)', () => {
    let n = 0;
    const loop = new FixedLoop(() => n++);
    const a = loop.advance(STEP * 2.5);
    expect(n).toBe(2);
    expect(a).toBeCloseTo(0.5, 5);
  });

  it('clamps huge frames (tab switch) to avoid the spiral of death', () => {
    let n = 0;
    const loop = new FixedLoop(() => n++);
    loop.advance(10);
    expect(n).toBeLessThanOrEqual(Math.ceil(0.05 / STEP));
  });
});
