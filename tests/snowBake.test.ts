import { describe, expect, it } from 'vitest';
import { LM } from '../src/world/bigair';
import { bakeSnow, skyVisibility, snowAlbedo, surfaceNormal } from '../src/world/snowBake';
import { buildTerrainGrid } from '../src/world/terrain';

describe('snow bake (docs/research 16)', () => {
  it('normals are unit length and point up', () => {
    for (const [x, z] of [[0, 20], [0, 100], [2, LM.zLip - 2], [0, LM.zKnuckle + 10], [30, 150]] as const) {
      const n = surfaceNormal(x, z);
      expect(Math.hypot(...n)).toBeCloseTo(1, 6);
      expect(n[1]).toBeGreaterThan(0.5);
    }
  });

  it('the landing (38°) faces downhill: its normal leans towards +z', () => {
    const n = surfaceNormal(0, LM.zKnuckle + 12);
    expect(n[2]).toBeGreaterThan(0.5);
    expect(Math.acos(n[1]) * (180 / Math.PI)).toBeCloseTo(38, 0);
  });

  it('sky visibility: open on the flat table, lower at the foot of the kicker', () => {
    const table = skyVisibility(0, LM.zLip + 10);
    const foot = skyVisibility(0, LM.zLip - 6);
    expect(table).toBeGreaterThan(0.95);
    expect(foot).toBeLessThan(table);
    expect(foot).toBeGreaterThan(0.3);
  });

  it('snow is never pure white and fresh snow is cooler than the piste', () => {
    const piste = snowAlbedo(0, 100), fresh = snowAlbedo(25, 100);
    for (const c of [...piste, ...fresh]) expect(c).toBeLessThan(0.96);
    expect(fresh[2] - fresh[0]).toBeGreaterThan(piste[2] - piste[0]);
  });

  it('is deterministic and covers the whole grid', () => {
    const g = buildTerrainGrid();
    const a = bakeSnow(g), b = bakeSnow(g);
    expect(a.normals.length).toBe(g.positions.length);
    expect(a.colors).toEqual(b.colors);
    expect(a.normals).toEqual(b.normals);
  });
});
