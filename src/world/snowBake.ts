import { BA, LM, halfWidth, heightAt, kickerAt } from './bigair';
import type { TerrainGrid } from './terrain';

/**
 * Snow shading baked once from the analytic surface h(x, z) (docs/research 16). No three: pure data,
 * deterministic, testable in Node.
 *  - smooth normals from h itself (central differences), so the slope is lit like a continuous surface
 *    instead of facets: this is what took the "blocks" off the snow;
 *  - horizon ambient occlusion: how much of the sky each point sees, from the heights around it;
 *  - albedo tints: groomed piste a touch warm, fresh snow off the piste a touch cooler, the kicker a
 *    light blue so it reads; snow never pure white (fresh snow reflects ~0.9).
 */
export interface SnowBake {
  normals: Float32Array;
  colors: Float32Array;
  /** sky visibility 0..1 per vertex (1 = open sky) */
  ao: Float32Array;
  /** 1 on the groomed piste (corduroy), 0 on the kicker and in fresh snow */
  groom: Float32Array;
}

const EPS = 0.05;
/** AO: directions and radii (m) sampled around each vertex */
const AO_DIRS = 8;
const AO_R = [1.5, 4, 9] as const;

/** Smooth unit normal of the surface at (x, z). */
export function surfaceNormal(x: number, z: number): [number, number, number] {
  const dx = (heightAt(x + EPS, z) - heightAt(x - EPS, z)) / (2 * EPS);
  const dz = (heightAt(x, z + EPS) - heightAt(x, z - EPS)) / (2 * EPS);
  const l = Math.hypot(dx, 1, dz);
  return [-dx / l, 1 / l, -dz / l];
}

/** Horizon-based sky visibility at (x, z): 1 − mean of the sines of the highest elevation angles. */
export function skyVisibility(x: number, z: number): number {
  const h0 = heightAt(x, z);
  let occ = 0;
  for (let i = 0; i < AO_DIRS; i++) {
    const a = (i / AO_DIRS) * Math.PI * 2, cx = Math.cos(a), cz = Math.sin(a);
    let best = 0;
    for (const r of AO_R) {
      const e = Math.atan2(heightAt(x + cx * r, z + cz * r) - h0, r);
      if (e > best) best = e;
    }
    occ += Math.sin(best);
  }
  return Math.max(0, Math.min(1, 1 - occ / AO_DIRS));
}

/** Snow albedo (linear RGB) by zone: kicker, groomed piste, fresh snow off the piste. */
export function snowAlbedo(x: number, z: number): [number, number, number] {
  if (kickerAt(x, z) > 0.02) return [0.78, 0.86, 0.95];
  const off = Math.abs(x) - halfWidth(z);
  if (off > 0.3) {
    // fresh snow: cooler, a touch darker further out
    const t = Math.min(1, (off - 0.3) / 20);
    return [0.86 - 0.04 * t, 0.89 - 0.03 * t, 0.95 - 0.01 * t];
  }
  // the landing is the most worked surface: a hint warmer
  const land = z > LM.zKnuckle && z < LM.zOutEnd ? 1 : 0;
  return [0.88 + 0.01 * land, 0.9 + 0.005 * land, 0.94];
}

export function bakeSnow(grid: TerrainGrid): SnowBake {
  const n = grid.positions.length / 3;
  const normals = new Float32Array(n * 3), colors = new Float32Array(n * 3), ao = new Float32Array(n), groom = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = grid.positions[i * 3]!, z = grid.positions[i * 3 + 2]!;
    const nn = surfaceNormal(x, z);
    normals.set(nn, i * 3);
    // far from the park the AO only matters for the big shapes: fewer samples would do, but it is baked once
    const v = z < BA.zStart + 1 ? 1 : skyVisibility(x, z);
    ao[i] = v;
    const [r, g, b] = snowAlbedo(x, z);
    groom[i] = kickerAt(x, z) > 0.02 ? 0 : Math.max(0, Math.min(1, (halfWidth(z) - Math.abs(x)) / 1.5));
    // occluded snow loses brightness and leans blue (it is lit by the sky only)
    const k = 0.72 + 0.28 * v;
    colors[i * 3] = r * k * (0.96 + 0.04 * v);
    colors[i * 3 + 1] = g * k;
    colors[i * 3 + 2] = b * Math.min(1, k + 0.06 * (1 - v));
  }
  return { normals, colors, ao, groom };
}
