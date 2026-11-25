import { beforeAll, describe, expect, it } from 'vitest';
import { DEG } from '../src/core/config';
import { initRapier, type Rapier } from '../src/physics/world';
import { BA, LIP_H, LM, heightAt, kickerProfile } from '../src/world/bigair';
import { NO_INPUT, Run } from '../src/world/run';
import { buildTerrainGrid } from '../src/world/terrain';

let R: Rapier;
const grid = buildTerrainGrid();
beforeAll(async () => { R = await initRapier(); });

/** straight air, optional speed check of `brakeM` metres starting at z = 95 */
function straight(run: Run, brakeM: number) {
  run.reset();
  while (run.phase !== 'done' && run.t < 40) {
    const z = run.board.position().z;
    run.step({ ...NO_INPUT, brake: z > 95 && z < 95 + brakeM ? 1 : 0, charging: z > BA.kickerBase + 2 && z < LM.zLip - 1 });
  }
}

describe('big air geometry (FIS-like)', () => {
  it('lip ≥ 25°, kicker ~4 m, gap and landing as designed', () => {
    const e = 0.01, slope = (kickerProfile(LM.zLip - e) - kickerProfile(LM.zLip - 2 * e)) / e;
    expect(Math.atan(slope) / DEG).toBeGreaterThanOrEqual(25);
    expect(LIP_H).toBeGreaterThan(3.5);
    expect(LIP_H).toBeLessThan(5);
    expect(LM.zKnuckle - LM.zLip).toBeGreaterThanOrEqual(15);
  });

  it('render mesh and collider come from the same surface', () => {
    const W = grid.xs.length;
    for (const i of [0, 37, 211, grid.zs.length - 1]) for (const j of [0, 9, Math.floor(W / 2)]) {
      const k = (i * W + j) * 3;
      expect(grid.positions[k + 1]).toBeCloseTo(heightAt(grid.positions[k]!, grid.positions[k + 2]!), 4);
    }
  });

  it('no speed check: takes off fast (~60–66 km/h) and lands long', () => {
    const run = new Run(R, grid);
    straight(run, 0);
    expect(run.takeoff!.speed * 3.6).toBeGreaterThan(58);
    expect(run.takeoff!.speed * 3.6).toBeLessThan(67);
    expect(run.landing!.dKnuckle).toBeGreaterThan(12);
  });

  it('with a short speed check, 53–58 km/h: lands in the sweet spot after the knuckle, airtime 2–3 s', () => {
    const run = new Run(R, grid);
    straight(run, 6);
    const kmh = run.takeoff!.speed * 3.6;
    expect(kmh).toBeGreaterThan(53);
    expect(kmh).toBeLessThan(58);
    expect(run.landing!.dKnuckle).toBeGreaterThan(2);
    expect(run.landing!.dKnuckle).toBeLessThan(12);
    expect(run.landing!.airT).toBeGreaterThan(2);
    expect(run.landing!.airT).toBeLessThan(3);
    expect(run.landing!.inLanding).toBe(true);
  });

  it('takeoff speed is reproducible (no random contact losses)', () => {
    const run = new Run(R, grid);
    straight(run, 8);
    const a = run.takeoff!.speed;
    straight(run, 8);
    expect(run.takeoff!.speed).toBe(a);
  });
});
