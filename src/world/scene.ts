import * as THREE from 'three';
import { flat, PALETTE } from '../render/materials';
import { BA, LM, baseY, halfWidth, heightAt } from './bigair';
import { bakeSnow, surfaceNormal } from './snowBake';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
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
const ROCKS = 70;

/**
 * One pine as a single faceted geometry (vertex colours): a trunk and three branch tiers, snow lying
 * on part of the upward faces of each tier. Unit height, base at y = 0.
 */
function pineGeometry(rnd: () => number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, f: (cy: number, ny: number) => THREE.Color) => {
    const ng = g.toNonIndexed();
    ng.computeVertexNormals();
    const p = ng.getAttribute('position'), n = ng.getAttribute('normal'), col = new Float32Array(p.count * 3);
    for (let t = 0; t < p.count; t += 3) {
      const cy = (p.getY(t) + p.getY(t + 1) + p.getY(t + 2)) / 3, ny = (n.getY(t) + n.getY(t + 1) + n.getY(t + 2)) / 3;
      const c = f(cy, ny);
      for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (t + k) * 3);
    }
    ng.setAttribute('color', new THREE.BufferAttribute(col, 3));
    ng.deleteAttribute('uv');
    return ng;
  };
  const trunk = new THREE.CylinderGeometry(0.035, 0.05, 0.22, 6); trunk.translate(0, 0.11, 0);
  const bark = new THREE.Color(PALETTE.trunk);
  parts.push(paint(trunk, () => bark));
  const green = new THREE.Color(PALETTE.pine), snowC = new THREE.Color(0xeef3fa);
  // tiers: [radius, height, base y]
  for (const [r, h, y0] of [[0.36, 0.42, 0.14], [0.27, 0.38, 0.38], [0.17, 0.34, 0.64]] as const) {
    const cone = new THREE.ConeGeometry(r, h, 8, 2); cone.translate(0, y0 + h / 2, 0);
    parts.push(paint(cone, (cy, ny) => (ny > 0.25 && cy > y0 + h * 0.22 && rnd() < 0.55 ? snowC : green)));
  }
  const g = mergeGeometries(parts);
  return g ?? parts[0]!;
}

/** A faceted rock, snow on the faces looking up. */
function rockGeometry(rnd: () => number): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(1, 1);
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const k = 0.75 + 0.45 * rnd();
    p.setXYZ(i, p.getX(i) * k * 1.3, p.getY(i) * k * 0.8, p.getZ(i) * k);
  }
  const ng = g.toNonIndexed();
  ng.computeVertexNormals();
  const n = ng.getAttribute('normal'), col = new Float32Array(n.count * 3);
  const rock = new THREE.Color(0x6c7a8c), dark = new THREE.Color(0x56626f), snowC = new THREE.Color(0xeef3fa);
  for (let t = 0; t < n.count; t += 3) {
    const ny = (n.getY(t) + n.getY(t + 1) + n.getY(t + 2)) / 3;
    const c = ny > 0.55 ? snowC : ny > 0.1 ? rock : dark;
    for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (t + k) * 3);
  }
  ng.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return ng;
}

function scenery(scene: THREE.Scene): SceneHandles {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // pines (one instanced mesh: one draw call + its shadow), per-tree tint and size
  const pines = new THREE.InstancedMesh(pineGeometry(rnd), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }), MAX_TREES);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), c = new THREE.Color();
  for (let i = 0; i < MAX_TREES; i++) {
    const side = rnd() < 0.5 ? -1 : 1, z = BA.zStart + rnd() * (LM.zEnd - BA.zStart);
    const x = side * (halfWidth(z) + 6 + rnd() * 35), y = heightAt(x, z), h = 5 + rnd() * 7, yaw = rnd() * 6.28;
    q.setFromAxisAngle(v.set(0, 1, 0), yaw);
    pines.setMatrixAt(i, m.compose(v.set(x, y - 0.1, z), q, sc.set(h * (0.85 + 0.3 * rnd()), h, h * (0.85 + 0.3 * rnd()))));
    pines.setColorAt(i, c.setScalar(0.85 + 0.25 * rnd()));
  }
  pines.castShadow = true;
  // rocks: only off the piste, where the bank is steep (> 28°), half buried
  const rocks = new THREE.InstancedMesh(rockGeometry(rnd), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }), ROCKS);
  let placed = 0;
  for (let tries = 0; tries < 4000 && placed < ROCKS; tries++) {
    const side = rnd() < 0.5 ? -1 : 1, z = BA.zStart + 10 + rnd() * (LM.zEnd - BA.zStart - 20);
    const x = side * (halfWidth(z) + 3 + rnd() * 40);
    if (surfaceNormal(x, z)[1] > Math.cos(28 * (Math.PI / 180))) continue;
    const s = 0.5 + rnd() * 1.6;
    q.setFromAxisAngle(v.set(0, 1, 0), rnd() * 6.28);
    rocks.setMatrixAt(placed++, m.compose(v.set(x, heightAt(x, z) - 0.25 * s, z), q, sc.set(s, s, s)));
  }
  rocks.count = placed;
  rocks.castShadow = true;
  scene.add(pines, rocks);
  return {
    setTreeCount(n) { pines.count = Math.min(MAX_TREES, n); },
  };
}
