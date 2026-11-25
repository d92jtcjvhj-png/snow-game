import { BA, LM, heightAt } from './bigair';

/**
 * Terrain grid shared by the render mesh and the Rapier trimesh collider:
 * same vertices, same triangles, so what you see is exactly what you ride.
 */
export interface TerrainGrid {
  xs: number[];
  zs: number[];
  positions: Float32Array;
  indices: Uint32Array;
}

export function buildTerrainGrid(): TerrainGrid {
  const zs: number[] = [];
  const fine = (z: number) => (z > BA.kickerBase - 3 && z < LM.zLip + BA.kickerBack + 1) || Math.abs(z - LM.zKnuckle) < 6;
  const mid = (z: number) => z > BA.approachEnd - 4 && z < LM.zOutEnd;
  for (let z: number = BA.zStart; z < LM.zEnd; ) { zs.push(z); z += fine(z) ? 0.25 : mid(z) ? 0.5 : 1.5; }
  zs.push(LM.zEnd, LM.zLip, LM.zLip + 0.02);
  zs.sort((a, b) => a - b);
  const zu = zs.filter((z, i) => i === 0 || z - zs[i - 1]! > 0.005);

  const xs: number[] = [];
  for (let x = -8; x <= 8.001; x += 0.5) xs.push(+x.toFixed(3));
  for (const x of [9, 10, 11, 12, 13, 14, 15, 16, 18, 21, 25, 30, 38, 48, 60]) xs.push(x, -x);
  xs.sort((a, b) => a - b);

  const W = xs.length, H = zu.length;
  const positions = new Float32Array(W * H * 3);
  for (let i = 0; i < H; i++) for (let j = 0; j < W; j++) {
    const k = (i * W + j) * 3, x = xs[j]!, z = zu[i]!;
    positions[k] = x; positions[k + 1] = heightAt(x, z); positions[k + 2] = z;
  }
  const indices = new Uint32Array((W - 1) * (H - 1) * 6);
  let n = 0;
  for (let i = 0; i < H - 1; i++) for (let j = 0; j < W - 1; j++) {
    const a = i * W + j, b = a + 1, d = a + W, e = d + 1;
    // counter-clockwise seen from above (+y): normals point up
    indices[n++] = a; indices[n++] = d; indices[n++] = b;
    indices[n++] = b; indices[n++] = d; indices[n++] = e;
  }
  return { xs, zs: zu, positions, indices };
}
