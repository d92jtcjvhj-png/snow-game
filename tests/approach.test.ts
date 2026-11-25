import { beforeAll, describe, expect, it } from 'vitest';
import { APPROACH } from '../src/core/config';
import { initRapier, type Rapier } from '../src/physics/world';
import { BA, LM } from '../src/world/bigair';
import { NO_INPUT, Run, type RunInput } from '../src/world/run';
import { buildTerrainGrid } from '../src/world/terrain';

let R: Rapier;
let run: Run;
beforeAll(async () => { R = await initRapier(); run = new Run(R, buildTerrainGrid()); });

/**
 * Same speed every time: speed check 60–63 m, then the charge starts `early` seconds before (or after, if
 * negative) the ideal moment, i.e. when the time left to the kicker base equals the natural S duration.
 */
function jump(charge: number, early: number, axis = 0) {
  run.reset();
  let started = false;
  let minX = 0, maxX = 0;
  while (run.phase !== 'done' && run.t < 40) {
    const p = run.board.position(), v = run.board.speed();
    const tToBase = (BA.kickerBase - p.z) / Math.max(1, v);
    if (!started && p.z > 63 && tToBase <= APPROACH.S_TIME + early) started = true;
    const charging = started && p.z < LM.zLip - 1.5;
    const inp: RunInput = { charging, charge: charging ? charge : 0, axis, brake: p.z > 60 && p.z < 63 ? 1 : 0 };
    run.step(inp);
    if (run.phase === 'ride' && p.z < BA.kickerBase) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); }
  }
  return { tk: run.takeoff!, ld: run.landing!, width: maxX - minX };
}

describe('automatic pre-jump carve (the player never steers)', () => {
  it('on time: straight takeoff on the right edge — frontside → heel', () => {
    const { tk, ld } = jump(0.8, 0);
    expect(tk.timingLabel).toBe('giusto');
    expect(tk.edge).toBe('heel');
    expect(tk.edgeExpected).toBe('heel');
    expect(Math.abs(tk.headingDeg)).toBeLessThan(2);
    expect(Math.abs(tk.x)).toBeLessThan(0.5);
    expect(Math.abs(ld.drift)).toBeLessThan(1.5);
    expect(tk.popQ).toBeGreaterThan(0.95);
  });

  it('on time: backside → toe', () => {
    const { tk } = jump(-0.8, 0);
    expect(tk.edge).toBe('toe');
    expect(tk.edgeExpected).toBe('toe');
    expect(Math.abs(tk.headingDeg)).toBeLessThan(2);
  });

  it('too early: the S is over before the kicker, the rider carves across → diagonal takeoff, drift', () => {
    const { tk, ld } = jump(0.8, 0.6);
    expect(tk.timingLabel).toBe('presto');
    expect(Math.abs(tk.headingDeg)).toBeGreaterThan(5);
    expect(Math.abs(ld.drift)).toBeGreaterThan(2);
    // drifting off-line is not a crash by itself: still on the landing here
    expect(ld.inLanding).toBe(true);
  });

  it('too late: squeezed S → rushed edge change, skid, less pop and speed', () => {
    const ok = jump(0.8, 0), late = jump(0.8, -1.0);
    expect(late.tk.timingLabel).toBe('tardi');
    expect(late.tk.popQ).toBeLessThan(ok.tk.popQ - 0.15);
    expect(late.tk.speed).toBeLessThan(ok.tk.speed);
  });

  it('more power = wider set-up carve', () => {
    expect(jump(1, 0).width).toBeGreaterThan(jump(0.3, 0).width * 1.3);
  });

  it('straight air and straight flips: flat base, in line, no carve', () => {
    for (const axis of [0, 1]) {
      const { tk } = jump(0, 0, axis);
      expect(tk.kind).toBe(axis ? 'flip' : 'straight');
      expect(tk.edge).toBe('flat');
      expect(Math.abs(tk.headingDeg)).toBeLessThan(0.3);
    }
  });

  it('charging without releasing on the kicker = no pop', () => {
    run.reset();
    while (run.phase === 'ride' && run.t < 40) run.step({ ...NO_INPUT, charging: true, charge: 0, brake: 0 });
    expect(run.takeoff!.popQ).toBe(0);
  });
});
