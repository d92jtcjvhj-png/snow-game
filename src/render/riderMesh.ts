import * as THREE from 'three';
import { BOARD, SNOW } from '../core/config';

/*
 * Soft rider body (docs/research 16, 14): ONE skinned mesh built in code, so knees, elbows and waist
 * bend as a continuous skin instead of separate blocks. Bones are flat children of the rider's board
 * frame and follow the conventions of the IK in rider.ts: origin at the proximal joint, the segment
 * along local −y, local +x towards the bend ("pole"). The bind pose is upright with every bone
 * unrotated, so a ring of vertices shared by two bones sits at the same place in both frames.
 * Clothes are shapes, not textures: baggy pants that flare over the boots, a puffy jacket with a hem.
 * Pure function of constants: deterministic, built once (~1.5k triangles), active at every tier.
 */

export const RIG = {
  BOARD_TOP: 0.05,
  ANKLE_Y: 0.14,
  FOOT_Z: 0.27,
  HIP_Z: 0.09,
  THIGH: 0.43,
  SHANK: 0.43,
  SPINE: 0.46,
  SHOULDER_Y: 0.42,
  SHOULDER_Z: 0.18,
  UPPER_ARM: 0.31,
  FOREARM: 0.25,
} as const;

/** bone names; legs and arms: index 0 = front (+z, nose side), 1 = rear */
export type BoneName = 'pelvis' | 'chest' | 'thigh0' | 'thigh1' | 'shin0' | 'shin1' | 'upper0' | 'upper1' | 'fore0' | 'fore1';
const BONES: BoneName[] = ['pelvis', 'chest', 'thigh0', 'thigh1', 'shin0', 'shin1', 'upper0', 'upper1', 'fore0', 'fore1'];
/** bind length of each limb bone (the IK may stretch it a little: scale.y) */
export const BONE_LEN: Partial<Record<BoneName, number>> = {
  thigh0: RIG.THIGH, thigh1: RIG.THIGH, shin0: RIG.SHANK, shin1: RIG.SHANK,
  upper0: RIG.UPPER_ARM, upper1: RIG.UPPER_ARM, fore0: RIG.FOREARM, fore1: RIG.FOREARM,
};

const BIND_PELVIS_Y = RIG.ANKLE_Y + RIG.THIGH + RIG.SHANK;

/** bind position of each bone in the board frame (upright, unrotated) */
function bindOrigin(b: BoneName): [number, number, number] {
  const side = b.endsWith('0') ? 1 : -1;
  switch (b) {
    case 'pelvis': case 'chest': return [0, BIND_PELVIS_Y, 0];
    case 'thigh0': case 'thigh1': return [0, BIND_PELVIS_Y, side * RIG.HIP_Z];
    case 'shin0': case 'shin1': return [0, BIND_PELVIS_Y - RIG.THIGH, side * RIG.HIP_Z];
    case 'upper0': case 'upper1': return [0, BIND_PELVIS_Y + RIG.SHOULDER_Y, side * RIG.SHOULDER_Z];
    case 'fore0': case 'fore1': return [0, BIND_PELVIS_Y + RIG.SHOULDER_Y - RIG.UPPER_ARM, side * RIG.SHOULDER_Z];
  }
}

export const RIDER_COLORS = {
  jacket: 0x2c7be5,
  jacketDark: 0x1f5fb8,
  pants: 0x27394d,
  helmet: 0xff4d4d,
  goggles: 0xffb000,
  strap: 0x1d2b3a,
  mitt: 0x1d2b3a,
  boot: 0x15243a,
  nose: 0xffd21f,
  tail: 0x8a3cff,
  base: 0x1d2b3a,
  edge: 0x3a4652,
} as const;

/** Geometry buffers of the body (exported for the tests). */
export interface BodyData {
  positions: number[];
  normals?: number[];
  colors: number[];
  skinIndex: number[];
  skinWeight: number[];
  indices: number[];
}

/** Build the skin: limb tubes and a lofted torso, weights by construction. */
export function buildBodyData(): BodyData {
  const d: BodyData = { positions: [], colors: [], skinIndex: [], skinWeight: [], indices: [] };
  const idx = (b: BoneName) => BONES.indexOf(b);
  const c = new THREE.Color();
  const push = (x: number, y: number, z: number, col: number, w: [BoneName, number][]) => {
    d.positions.push(x, y, z);
    c.setHex(col);
    d.colors.push(c.r, c.g, c.b);
    const ws = w.filter(([, v]) => v > 1e-4).slice(0, 4);
    const sum = ws.reduce((s, [, v]) => s + v, 0);
    for (let k = 0; k < 4; k++) {
      d.skinIndex.push(ws[k] ? idx(ws[k]![0]) : 0);
      d.skinWeight.push(ws[k] ? ws[k]![1] / sum : 0);
    }
    return d.positions.length / 3 - 1;
  };
  const grid = (start: number, rings: number, sides: number) => {
    for (let r = 0; r < rings - 1; r++) for (let s = 0; s < sides; s++) {
      const a = start + r * sides + s, b = start + r * sides + ((s + 1) % sides);
      const a2 = a + sides, b2 = b + sides;
      d.indices.push(a, a2, b, b, a2, b2);
    }
  };

  // limbs: tube along the bone, a ring every few cm; the ends blend 50/50 with the joint's other bone
  const tube = (bone: BoneName, parent: BoneName | null, child: BoneName | null, len: number, rad: (t: number) => number, col: (t: number, a: number) => number, rings: number, sides: number) => {
    const [ox, oy, oz] = bindOrigin(bone);
    const start = d.positions.length / 3;
    const BL = 0.22;
    for (let r = 0; r < rings; r++) {
      const t = r / (rings - 1);
      const w: [BoneName, number][] = [[bone, 1]];
      if (parent && t < BL) { const p = 0.5 * (1 - t / BL); w[0]![1] = 1 - p; w.push([parent, p]); }
      if (child && t > 1 - BL) { const q = 0.5 * (1 - (1 - t) / BL); w[0]![1] = 1 - q; w.push([child, q]); }
      for (let s = 0; s < sides; s++) {
        const a = (s / sides) * Math.PI * 2, rr = rad(t);
        push(ox + Math.cos(a) * rr, oy - t * len, oz + Math.sin(a) * rr, col(t, a), w);
      }
    }
    grid(start, rings, sides);
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  for (const i of [0, 1] as const) {
    // baggy pants: wide thigh, a fuller knee, flaring over the boot
    tube(`thigh${i}`, 'pelvis', `shin${i}`, RIG.THIGH, (t) => 0.105 - 0.02 * t + 0.008 * Math.sin(Math.PI * t), () => RIDER_COLORS.pants, 8, 10);
    tube(`shin${i}`, `thigh${i}`, null, RIG.SHANK, (t) => 0.085 + 0.018 * smooth(t), () => RIDER_COLORS.pants, 8, 10);
    // puffy jacket sleeves, a cuff at the wrist
    tube(`upper${i}`, 'chest', `fore${i}`, RIG.UPPER_ARM, (t) => 0.072 - 0.01 * t, () => RIDER_COLORS.jacket, 6, 10);
    tube(`fore${i}`, `upper${i}`, null, RIG.FOREARM, (t) => (t > 0.85 ? 0.068 : 0.062 - 0.006 * t), (t) => (t > 0.85 ? RIDER_COLORS.jacketDark : RIDER_COLORS.jacket), 7, 10);
  }

  // torso: lofted ellipses from the crotch to the neck; pants below the hem, jacket above;
  // pelvis below, chest above, blended across the waist
  const prof: [number, number, number][] = [ // y (from the pelvis), half depth x, half width z
    [-0.14, 0.11, 0.17], [-0.05, 0.13, 0.2], [0.04, 0.14, 0.205], [0.07, 0.155, 0.215], [0.1, 0.15, 0.21],
    [0.2, 0.152, 0.215], [0.3, 0.155, 0.22], [0.38, 0.145, 0.215], [0.44, 0.12, 0.18], [0.49, 0.075, 0.09], [0.55, 0.06, 0.065],
  ];
  const sides = 14, start = d.positions.length / 3;
  const [px, py, pz] = bindOrigin('pelvis');
  for (const [y, rx, rz] of prof) {
    const u = Math.min(1, Math.max(0, (y - 0.02) / 0.24));
    const w: [BoneName, number][] = [['pelvis', 1 - smooth(u)], ['chest', smooth(u)]];
    for (let s = 0; s < sides; s++) {
      const a = (s / sides) * Math.PI * 2, x = Math.cos(a) * rx, z = Math.sin(a) * rz;
      // pants below the hem; a darker hem band; jacket above
      const col: number = y < 0.06 ? RIDER_COLORS.pants : y < 0.085 ? RIDER_COLORS.jacketDark : RIDER_COLORS.jacket;
      push(px + x, py + y, pz + z, col, w);
    }
  }
  grid(start, prof.length, sides);
  // bottom cap
  const capC = push(px, py + prof[0]![0], pz, RIDER_COLORS.pants, [['pelvis', 1]]);
  for (let s = 0; s < sides; s++) d.indices.push(capC, start + s, start + ((s + 1) % sides));
  return d;
}

/** Rim light on the soft materials: a cool fresnel edge that reads against the snow (all tiers, cheap). */
function addRim(m: THREE.MeshLambertMaterial): THREE.MeshLambertMaterial {
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `{
  float rim = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 3.0);
  outgoingLight += vec3(0.72, 0.84, 1.0) * rim * 0.28;
}
#include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => 'rider-rim';
  return m;
}

const softCache = new Map<number, THREE.MeshLambertMaterial>();
/** Smooth-shaded shared material for the rider's rigid parts (helmet, mitts, boots). */
export function soft(color: number): THREE.MeshLambertMaterial {
  let m = softCache.get(color);
  if (!m) { m = addRim(new THREE.MeshLambertMaterial({ color })); softCache.set(color, m); }
  return m;
}

/** average the normals of vertices that coincide (the joint rings of two tubes), so seams don't show */
function weldNormals(geo: THREE.BufferGeometry): void {
  const p = geo.getAttribute('position'), n = geo.getAttribute('normal');
  const groups = new Map<string, number[]>();
  for (let i = 0; i < p.count; i++) {
    const k = `${Math.round(p.getX(i) * 1e4)},${Math.round(p.getY(i) * 1e4)},${Math.round(p.getZ(i) * 1e4)}`;
    const g = groups.get(k); if (g) g.push(i); else groups.set(k, [i]);
  }
  const v = new THREE.Vector3();
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    v.set(0, 0, 0);
    for (const i of g) v.x += n.getX(i), v.y += n.getY(i), v.z += n.getZ(i);
    v.normalize();
    for (const i of g) n.setXYZ(i, v.x, v.y, v.z);
  }
}

export interface RiderBody {
  mesh: THREE.SkinnedMesh;
  bones: Record<BoneName, THREE.Bone>;
}

/** The skinned body; `parent` must be at identity when this is called (bind time). */
export function createBody(parent: THREE.Object3D): RiderBody {
  const data = buildBodyData();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(data.colors, 3));
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(data.skinIndex, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(data.skinWeight, 4));
  geo.setIndex(data.indices);
  geo.computeVertexNormals();
  weldNormals(geo);
  const bones = {} as Record<BoneName, THREE.Bone>;
  for (const b of BONES) {
    const bone = new THREE.Bone();
    bone.position.set(...bindOrigin(b));
    parent.add(bone);
    bones[b] = bone;
  }
  const mat = addRim(new THREE.MeshLambertMaterial({ vertexColors: true }));
  const mesh = new THREE.SkinnedMesh(geo, mat);
  mesh.castShadow = true;
  mesh.frustumCulled = false;
  parent.add(mesh);
  parent.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(BONES.map((b) => bones[b])));
  return { mesh, bones };
}

/**
 * Snowboard from the real numbers (docs/research 16): sidecut radius SNOW.SIDECUT_R over the effective
 * edge, rounded nose and tail, kicked tips; yellow nose half and purple tail half on the top sheet,
 * dark base and edges. Top at RIG.BOARD_TOP − binding plates, base at y = 0.
 */
export function boardGeometry(): THREE.BufferGeometry {
  const L = BOARD.LENGTH + 0.01, half = L / 2, edgeHalf = 0.59, R = SNOW.SIDECUT_R, waist = 0.25;
  const thick = 0.018, kick = 0.065, N = 48;
  const depth = R - Math.sqrt(R * R - edgeHalf * edgeHalf); // sidecut depth per side
  const contactW = waist + 2 * depth;
  const width = (z: number) => {
    const a = Math.abs(z);
    if (a <= edgeHalf) return waist + 2 * (R - Math.sqrt(R * R - a * a));
    const u = Math.min(1, (a - edgeHalf) / (half - edgeHalf));
    return contactW * Math.sqrt(Math.max(0, 1 - u * u * u));
  };
  const lift = (z: number) => { const a = Math.abs(z); return a <= edgeHalf ? 0 : kick * ((a - edgeHalf) / (half - edgeHalf)) ** 2; };
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const c = new THREE.Color();
  const v = (x: number, y: number, z: number, hex: number) => { pos.push(x, y, z); c.setHex(hex); col.push(c.r, c.g, c.b); return pos.length / 3 - 1; };
  const rows: number[][] = [];
  for (let i = 0; i <= N; i++) {
    const z = -half + (L * i) / N, w = width(z) / 2, y = lift(z);
    const top = z >= 0 ? RIDER_COLORS.nose : RIDER_COLORS.tail;
    // top left/right, bottom left/right (edges dark)
    rows.push([v(-w, y + thick, z, top), v(w, y + thick, z, top), v(-w, y, z, RIDER_COLORS.base), v(w, y, z, RIDER_COLORS.base),
      v(-w, y + thick, z, RIDER_COLORS.edge), v(w, y + thick, z, RIDER_COLORS.edge), v(-w, y, z, RIDER_COLORS.edge), v(w, y, z, RIDER_COLORS.edge)]);
  }
  for (let i = 0; i < N; i++) {
    const a = rows[i]!, b = rows[i + 1]!;
    idx.push(a[0]!, b[0]!, a[1]!, a[1]!, b[0]!, b[1]!); // top (+y)
    idx.push(a[2]!, a[3]!, b[2]!, a[3]!, b[3]!, b[2]!); // base (−y)
    idx.push(a[4]!, a[6]!, b[4]!, a[6]!, b[6]!, b[4]!); // side −x
    idx.push(a[5]!, b[5]!, a[7]!, a[7]!, b[5]!, b[7]!); // side +x
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
