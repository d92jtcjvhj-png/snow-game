import * as THREE from 'three';
import { flat, PALETTE } from '../render/materials';
import { BA, LM, baseY, halfWidth, heightAt } from './bigair';
import { bakeSnow } from './snowBake';
import type { TerrainGrid } from './terrain';

/** What the render loop needs back from the scene. */
export interface SceneHandles {
  /** trees: one instanced mesh per part; `setTreeCount` shows the first n (quality tier) */
  setTreeCount(n: number): void;
}

/**
 * Three.js side of the big air: terrain mesh (same grid as the collider) with the baked snow shading,
 * park markings, flags and nets, start gate, trees. Repeated objects are instanced (docs/research 16:
 * ~575 draw calls → a few dozen). Seeded: always the same.
 */
export function buildScene(scene: THREE.Scene, grid: TerrainGrid, snow: THREE.Material): SceneHandles {
  scene.add(terrainMesh(grid, snow));
  markings(scene);
  return scenery(scene);
}

function terrainMesh(grid: TerrainGrid, snow: THREE.Material): THREE.Mesh {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(grid.positions, 3));
  geo.setIndex(new THREE.BufferAttribute(grid.indices, 1));
  const bake = bakeSnow(grid);
  geo.setAttribute('normal', new THREE.BufferAttribute(bake.normals, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(bake.colors, 3));
  geo.setAttribute('groom', new THREE.BufferAttribute(bake.groom, 1));
  const mesh = new THREE.Mesh(geo, snow);
  mesh.receiveShadow = true;
  return mesh;
}

/** A dye line across the snow, following the surface (several short segments). */
function dyeLine(z: number, color: number, width: number, halfX: number, opacity = 0.85): THREE.Mesh {
  const seg = 16, pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const x = -halfX + (2 * halfX * i) / seg;
    for (const dz of [-width / 2, width / 2]) pos.push(x, heightAt(x, z + dz) + 0.03, z + dz);
  }
  for (let i = 0; i < seg; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }));
}

function markings(scene: THREE.Scene): void {
  scene.add(dyeLine(LM.zLip - 0.15, PALETTE.blue, 0.3, BA.kickerHalfW));
  scene.add(dyeLine(LM.zKnuckle, 0xe5532c, 0.45, BA.landTopHalfW));
  for (let d = 5; d <= 25; d += 5) scene.add(dyeLine(LM.zKnuckle + BA.knuckleBlend + d, PALETTE.blue, 0.14, 1.5));
  // landing edges: blue lines
  for (const s of [-1, 1]) {
    const pts: number[] = [];
    for (let z = LM.zKnuckle; z <= LM.zOutEnd; z += 1) { const x = s * halfWidth(z); pts.push(x, heightAt(x, z) + 0.04, z); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: PALETTE.blue })));
  }
  // flags along the jump (instanced: two draw calls) and nets along the landing
  const net = new THREE.MeshLambertMaterial({ color: 0xff6a2b, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  const spots: [number, number, number][] = [];
  for (let z = BA.kickerBase - 20; z < LM.zOutEnd; z += 6) for (const s of [-1, 1]) {
    const x = s * (halfWidth(z) + 1.2);
    spots.push([x, heightAt(x, z), z]);
  }
  const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), flat(0x334455), spots.length);
  const flags = new THREE.InstancedMesh(new THREE.BoxGeometry(0.02, 0.35, 0.5), flat(0xe5532c), spots.length);
  const m = new THREE.Matrix4();
  spots.forEach(([x, y, z], i) => {
    poles.setMatrixAt(i, m.makeTranslation(x, y + 0.8, z));
    flags.setMatrixAt(i, m.makeTranslation(x, y + 1.4, z + 0.25));
  });
  poles.castShadow = flags.castShadow = true;
  scene.add(poles, flags);
  for (const s of [-1, 1]) {
    const pts: number[] = [], idx: number[] = [];
    let i = 0;
    for (let z = LM.zKnuckle - 4; z <= LM.zOutEnd + 10; z += 2, i++) {
      const x = s * (halfWidth(z) + 4), y = heightAt(x, z);
      pts.push(x, y, z, x, y + 1.8, z);
      if (i > 0) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.setIndex(idx); g.computeVertexNormals();
    scene.add(new THREE.Mesh(g, net));
  }
  // start gate
  const dark = flat(0x1d2b3a), y0 = baseY(BA.zStart + 6);
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 0.3), dark); p.position.set(s * 5, y0 + 2, BA.zStart + 6); scene.add(p); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.8, 0.3), flat(0xff6a2b)); top.position.set(0, y0 + 4, BA.zStart + 6); scene.add(top);
}

const MAX_TREES = 220;

function scenery(scene: THREE.Scene): SceneHandles {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // pines: two stacked cones and a trunk, instanced, with a per-tree green
  const lower = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 7), new THREE.MeshLambertMaterial({ flatShading: true }), MAX_TREES);
  const upper = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 7), new THREE.MeshLambertMaterial({ flatShading: true }), MAX_TREES);
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.15, 0.2, 1.2, 5), flat(PALETTE.trunk), MAX_TREES);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), c = new THREE.Color();
  const greens = [new THREE.Color(PALETTE.pine), new THREE.Color(PALETTE.pine2), new THREE.Color(0x2a5244)];
  for (let i = 0; i < MAX_TREES; i++) {
    const side = rnd() < 0.5 ? -1 : 1, z = BA.zStart + rnd() * (LM.zEnd - BA.zStart);
    const x = side * (halfWidth(z) + 6 + rnd() * 35), y = heightAt(x, z), h = 4 + rnd() * 6, yaw = rnd() * 6.28;
    q.setFromAxisAngle(v.set(0, 1, 0), yaw);
    lower.setMatrixAt(i, m.compose(v.set(x, y + 0.7 + h * 0.32, z), q, sc.set(h * 0.32, h * 0.65, h * 0.32)));
    upper.setMatrixAt(i, m.compose(v.set(x, y + 0.7 + h * 0.72, z), q, sc.set(h * 0.22, h * 0.55, h * 0.22)));
    trunks.setMatrixAt(i, m.compose(v.set(x, y + 0.4, z), q, sc.set(1, 1, 1)));
    c.copy(greens[i % 3]!).multiplyScalar(0.9 + 0.2 * rnd());
    lower.setColorAt(i, c); upper.setColorAt(i, c.multiplyScalar(1.08));
  }
  lower.castShadow = upper.castShadow = true;
  scene.add(lower, upper, trunks);
  return {
    setTreeCount(n) { lower.count = upper.count = trunks.count = Math.min(MAX_TREES, n); },
  };
}
