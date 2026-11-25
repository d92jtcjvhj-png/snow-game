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
 * negative) the ideal moment, i.e. when the time left to the lip equals the natural line duration.
 */
function jump(charge: number, early: number, axis = 0, ramp = 0) {
  run.reset();
  let started = false, t0 = 0;
  let minX = 0, maxX = 0;
  while (run.phase !== 'done' && run.t < 40) {
    const p = run.board.position(), v = run.board.speed();
    const tToLip = (LM.zLip - p.z) / Math.max(1, v);
    if (!started && p.z > 63 && tToLip <= APPROACH.S_TIME + early) started = true;
    const charging = started && p.z < LM.zLip - 1.5;
    // ramp > 0: the charge grows while held (keyboard Z/X, or a finger still dragging)
    const c = ramp > 0 ? Math.sign(charge) * Math.min(Math.abs(charge), 0.1 + ramp * (run.t - t0)) : charge;
    if (!started) t0 = run.t;
    const inp: RunInput = { charging, charge: charging ? c : 0, axis, brake: p.z > 60 && p.z < 63 ? 1 : 0 };
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

  it('power growing during the S (keyboard ramp) still brings the rider back on the axis, straight', () => {
    const { tk } = jump(1, 0, 0, 0.8);
    expect(Math.abs(tk.x)).toBeLessThan(0.5);
    expect(Math.abs(tk.headingDeg)).toBeLessThan(2);
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
    // drifting off-line is not a crash by itself: the landing judgment comes in Phase 3
  });

  it('too late: the lip cuts the S — the rider exits on an angle the other way than when early', () => {
    const early = jump(0.8, 0.5), late = jump(0.8, -1.0);
    expect(late.tk.timingLabel).toBe('tardi');
    expect(Math.abs(late.tk.headingDeg)).toBeGreaterThan(3);
    expect(Math.sign(late.tk.headingDeg)).toBe(-Math.sign(early.tk.headingDeg));
  });

  it('much too late: still in the middle of the edge change at the lip → no takeoff edge set, less pop', () => {
    const { tk } = jump(1, -1.4);
    expect(tk.edge).not.toBe(tk.edgeExpected);
    expect(tk.popQ).toBeLessThan(0.9);
  });

  it('a speed check during the set-up ruins the line: it restarts later and the exit is off', () => {
    run.reset();
    let started = false;
    while (run.phase !== 'done' && run.t < 40) {
      const p = run.board.position(), v = run.board.speed();
      if (!started && p.z > 63 && (LM.zLip - p.z) / v <= APPROACH.S_TIME) started = true;
      const charging = started && p.z < LM.zLip - 1.5;
      const brake = started && p.z > 112 && p.z < 116 ? 0.5 : 0;
      run.step({ charging, charge: charging ? 0.8 : 0, axis: 0, brake: p.z > 60 && p.z < 63 ? 1 : brake });
    }
    expect(run.lineBroken).toBe(true);
    // either it misses the kicker, or it takes off off-line
    const tk = run.takeoff;
    expect(!tk || Math.abs(tk.headingDeg) > 2 || Math.abs(tk.x) > 0.5).toBe(true);
  });

  it('same line for every spin (opening + big swing ≈ 2.2–3 m wide), a little wider with more power', () => {
    const full = jump(1, 0).width, low = jump(0.3, 0).width;
    expect(full).toBeGreaterThan(2.2);
    expect(full).toBeLessThan(3);
    expect(low).toBeGreaterThan(2);
    expect(full).toBeGreaterThan(low * 1.03);
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
