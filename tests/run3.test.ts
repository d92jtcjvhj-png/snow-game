import { beforeAll, describe, expect, it } from 'vitest';
import { APPROACH } from '../src/core/config';
import type { GrabId } from '../src/physics/spin';
import { initRapier, type Rapier } from '../src/physics/world';
import { LM } from '../src/world/bigair';
import { Run } from '../src/world/run';
import { buildTerrainGrid } from '../src/world/terrain';

let R: Rapier;
let run: Run;
beforeAll(async () => { R = await initRapier(); run = new Run(R, buildTerrainGrid()); });

/** on-time set-up, speed check to ~56 km/h, charge `power`, grab `grab` from 0.1 s until `grabUntil` s of air */
function jump(power: number, grabUntil: number, axis = 0, grab: GrabId = 'indy') {
  run.reset();
  let started = false;
  while (run.phase !== 'done' && run.t < 40) {
    const p = run.board.position(), v = run.board.speed();
    if (!started && p.z > 66 && (LM.zLip - p.z) / v <= APPROACH.S_TIME) started = true;
    const charging = started && p.z < LM.zLip - 1.5;
    const air = run.phase === 'air';
    run.step({
      charging, charge: charging ? power : 0, axis: charging ? axis : 0,
      brake: p.z > 60 && p.z < 66 ? 1 : 0,
      grab: air && run.airT > 0.1 && run.airT < grabUntil ? grab : null,
    });
  }
  return run.landing!;
}

describe('a whole jump (Phase 3)', () => {
  it('frontside with a well-timed grab and opening lands clean (a skill window exists)', () => {
    let best = null;
    outer: for (const p of [0.35, 0.45]) for (const g of [0.6, 0.7, 0.8, 0.9]) {
      const ld = jump(p, g);
      if (ld.quality === 'perfect' || ld.quality === 'clean') { best = ld; break outer; }
    }
    expect(best).not.toBeNull();
    expect(best!.trick).toMatch(/^Frontside (540|720) Indy$/);
  });

  it('the same jump holding the grab to the end over-rotates: not clean', () => {
    const ld = jump(0.45, 9);
    expect(['sketchy', 'severe', 'crash']).toContain(ld.quality);
  });

  it('straight air is named and ridden away (long landing = harder impact)', () => {
    const ld = jump(0, 0);
    expect(ld.trick).toBe('Straight air');
    expect(ld.quality).not.toBe('crash');
  });

  it('the off-axis stick counts even if it is let go before the release (latched during the charge)', () => {
    run.reset();
    let started = false;
    while (run.phase !== 'done' && run.t < 40) {
      const p = run.board.position(), v = run.board.speed();
      if (!started && p.z > 66 && (LM.zLip - p.z) / v <= APPROACH.S_TIME) started = true;
      const charging = started && p.z < LM.zLip - 1.5;
      // stick up only for a moment in the middle of the charge
      const axis = charging && p.z > 110 && p.z < 115 ? 1 : 0;
      run.step({ charging, charge: charging ? 0.5 : 0, axis, brake: p.z > 60 && p.z < 66 ? 1 : 0, grab: run.phase === 'air' && run.airT > 0.1 && run.airT < 1 ? 'indy' : null });
    }
    expect(run.landing!.trick).toMatch(/Cork/);
  });

  it('after a crash the rider slides to a stop; a clean landing keeps the speed', () => {
    jump(0.45, 9);
    expect(run.landing!.quality).toBe('crash');
    expect(run.board.speed()).toBeLessThan(3);
    jump(0.35, 0.7);
    expect(['perfect', 'clean']).toContain(run.landing!.quality);
    expect(run.board.speed()).toBeGreaterThan(15);
  });
});
