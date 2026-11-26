import { describe, expect, it } from 'vitest';
import { buildBodyData } from '../src/render/riderMesh';

describe('soft rider skin (docs/research 16)', () => {
  const d = buildBodyData();
  const n = d.positions.length / 3;

  it('every vertex has weights that sum to 1 on at most 4 bones', () => {
    for (let i = 0; i < n; i++) {
      const w = d.skinWeight.slice(i * 4, i * 4 + 4);
      expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
      for (const v of w) expect(v).toBeGreaterThanOrEqual(0);
    }
  });

  it('joint rings shared by two tubes coincide with the same weights (no tear when bending)', () => {
    const key = (i: number) => d.positions.slice(i * 3, i * 3 + 3).map((v) => Math.round(v * 1e4)).join(',');
    const byPos = new Map<string, number[]>();
    for (let i = 0; i < n; i++) { const k = key(i); byPos.set(k, [...(byPos.get(k) ?? []), i]); }
    let shared = 0;
    const wmap = (i: number) => {
      const m = new Map<number, number>();
      for (let k = 0; k < 4; k++) { const w = d.skinWeight[i * 4 + k]!; if (w > 0) m.set(d.skinIndex[i * 4 + k]!, +w.toFixed(5)); }
      return [...m.entries()].sort((a, b) => a[0] - b[0]);
    };
    for (const g of byPos.values()) {
      if (g.length < 2) continue;
      shared++;
      for (const i of g) expect(wmap(i)).toEqual(wmap(g[0]!));
    }
    expect(shared).toBeGreaterThan(30); // knees and elbows
  });

  it('stays light for a phone and is deterministic', () => {
    expect(d.indices.length / 3).toBeLessThan(3000);
    expect(buildBodyData()).toEqual(d);
  });
});
