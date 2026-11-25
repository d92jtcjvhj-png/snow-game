import * as THREE from 'three';
import { flat, PALETTE } from '../render/materials';
import { BA, LM, baseY, halfWidth, heightAt, kickerAt } from './bigair';
import type { TerrainGrid } from './terrain';

/**
 * Three.js side of the big air: terrain mesh (same grid as the collider), park markings, flags and nets,
 * start gate, low-poly trees and mountains. Seeded: always the same.
 */
export function buildScene(scene: THREE.Scene, grid: TerrainGrid, treeCount: number): void {
  scene.add(terrainMesh(grid));
  markings(scene);
  scenery(scene, treeCount);
}

function terrainMesh(grid: TerrainGrid): THREE.Mesh {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(grid.positions, 3));
  geo.setIndex(new THREE.BufferAttribute(grid.indices, 1));
  const n = grid.positions.length / 3, col = new Float32Array(n * 3), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = grid.positions[i * 3]!, z = grid.positions[i * 3 + 2]!, ax = Math.abs(x);
    // per-vertex noise from the position (a row index would draw stripes)
    const hsh = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453, shade = 0.955 + 0.035 * (hsh - Math.floor(hsh));
    if (kickerAt(x, z) > 0.02) c.setRGB(0.85 * shade, 0.92 * shade, 1.0 * shade); // the kicker: a touch of blue
    else if (ax > halfWidth(z) + 0.3) c.setRGB(0.88 * shade, 0.92 * shade, 0.97 * shade); // soft snow outside
    else c.setRGB(0.97 * shade, 0.98 * shade, 1.0 * shade); // groomed
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
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
  // flags along the jump and nets along the landing
  const pole = flat(0x334455), flag = flat(0xe5532c), net = new THREE.MeshLambertMaterial({ color: 0xff6a2b, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 5), flagGeo = new THREE.BoxGeometry(0.02, 0.35, 0.5);
  for (let z = BA.kickerBase - 20; z < LM.zOutEnd; z += 6) for (const s of [-1, 1]) {
    const x = s * (halfWidth(z) + 1.2), y = heightAt(x, z);
    const p = new THREE.Mesh(poleGeo, pole); p.position.set(x, y + 0.8, z); scene.add(p);
    const f = new THREE.Mesh(flagGeo, flag); f.position.set(x, y + 1.4, z + 0.25); scene.add(f);
  }
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

function scenery(scene: THREE.Scene, treeCount: number): void {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const leaves = [flat(PALETTE.pine), flat(PALETTE.pine2)], trunk = flat(PALETTE.trunk);
  const coneGeo = new THREE.ConeGeometry(1, 1, 6), trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.2, 5);
  for (let i = 0; i < treeCount; i++) {
    const side = rnd() < 0.5 ? -1 : 1, z = BA.zStart + rnd() * (LM.zEnd - BA.zStart);
    const x = side * (halfWidth(z) + 6 + rnd() * 35), y = heightAt(x, z), h = 4 + rnd() * 6;
    const cone = new THREE.Mesh(coneGeo, leaves[i % 2]); cone.scale.set(h * 0.3, h, h * 0.3); cone.position.set(x, y + h / 2 + 0.7, z); cone.castShadow = true;
    const t = new THREE.Mesh(trunkGeo, trunk); t.position.set(x, y + 0.4, z);
    scene.add(cone, t);
  }
  const rock = flat(PALETTE.rock), peak = flat(PALETTE.peak), mtnGeo = new THREE.ConeGeometry(1, 1, 5);
  const yEnd = baseY(LM.zEnd);
  for (let i = 0; i < 10; i++) {
    const r = 60 + rnd() * 70, h = 70 + rnd() * 90, m = new THREE.Mesh(mtnGeo, i % 2 ? peak : rock);
    m.scale.set(r, h, r); m.position.set(-300 + i * 65 + rnd() * 20, yEnd - 30 + h / 2, LM.zEnd + 140 + rnd() * 80); m.rotation.y = rnd() * 3;
    scene.add(m);
  }
  for (let i = 0; i < 12; i++) {
    const r = 50 + rnd() * 60, h = 60 + rnd() * 80, z = -40 + i * 30 + rnd() * 20, s = i % 2 ? 1 : -1;
    const m = new THREE.Mesh(mtnGeo, i % 3 ? peak : rock);
    m.scale.set(r, h, r); m.position.set(s * (150 + rnd() * 60), baseY(Math.min(z, LM.zEnd)) - 25 + h / 2, z); m.rotation.y = rnd() * 3;
    scene.add(m);
  }
}
