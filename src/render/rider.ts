import * as THREE from 'three';
import type { GrabId } from '../physics/spin';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { boardGeometry, createBody, RIDER_COLORS, RIG, soft, type BoneName } from './riderMesh';

/** Landing outcome shown by the body for a moment after touchdown (docs/research 13, 14). */
export type RiderOutcome = 'hand' | 'twohands' | 'buttcheck' | null;

/** Pose drivers for one frame, all read from the physics; the rider smooths them itself. */
export interface RiderPose {
  /** board edge angle (rad, + heel): the body rolls with it, a bit less (angulation) */
  edge: number;
  /** speed check 0..1 (analog) */
  brake: number;
  /** charge 0..1 (load before the lip) */
  charge: number;
  /** shoulders vs board (rad): pre-wind before the jump, lead in the air */
  twist: number;
  airborne: boolean;
  /** time since the takeoff (s), for the pop extension */
  airT?: number;
  /** physics pose springs (docs/research 15): tuck 0..1 (hand on the board) and open 0..1 (arms out) */
  tuck?: number;
  open?: number;
  /** grab shape in the air (the hand goes there as the tuck closes) */
  grab?: GrabId | null;
  /** fallen: the rider tumbles over, in the direction of the cause */
  crash?: boolean;
  crashDir?: 'nose' | 'toe' | 'back' | 'side';
  /** 0..1: legs compressing to absorb a landing (∝ impact) */
  absorb?: number;
  /** sketchy landing shown by the body, with the time since touchdown (s) */
  outcome?: RiderOutcome;
  sinceLand?: number;
}

/*
 * Rig (docs/research 14, Tab. 3): H = 1.76 m, Drillis & Contini fractions. Board frame: x = heel side,
 * y = up, z = nose. Regular stance, the rider faces −x (toe side), front foot towards +z.
 */
// stance ≈ 0.31·H, hip joint centres ≈ 0.10·H apart (the numbers live in riderMesh.RIG, shared with the skin)
const { BOARD_TOP, ANKLE_Y, FOOT_Z, HIP_Z, THIGH, SHANK, SPINE, SHOULDER_Y, SHOULDER_Z, UPPER_ARM, FOREARM } = RIG;
const DUCK = 15 * (Math.PI / 180); // +15 / −15 bindings

/** Parameters of a key pose (degrees and metres, chest frame for the hands: origin at the pelvis). */
interface Key {
  /** average knee flexion (°) → pelvis height */
  knee: number;
  /** pelvis offset: x (+ = towards the heels, sitting back), z (+ = towards the nose) */
  px: number;
  pz: number;
  /** trunk bend forward (towards the toes, °) and sideways (towards the nose, °) */
  pitch: number;
  roll: number;
  /** wrist targets in the chest frame [x, y, z]: front hand (+z side) and rear hand */
  hf: [number, number, number];
  hr: [number, number, number];
}

/* Key poses, docs/research 14 Tab. 1 (all ESTIMATES except where the research measured them). */
const G1: Key = { knee: 33, px: 0, pz: 0, pitch: 12, roll: 0, hf: [-0.14, 0.06, 0.33], hr: [-0.1, 0.04, -0.3] };
const G2: Key = { knee: 60, px: 0.1, pz: 0, pitch: 8, roll: 0, hf: [-0.12, 0.36, 0.48], hr: [0.02, 0.02, -0.34] };
const G3: Key = { knee: 50, px: -0.06, pz: 0, pitch: 5, roll: 6, hf: [-0.36, -0.04, 0.3], hr: [-0.34, -0.06, -0.26] };
const G4: Key = { knee: 72, px: 0.12, pz: 0, pitch: 25, roll: 0, hf: [-0.36, 0.22, 0.24], hr: [-0.36, 0.2, -0.2] };
/** S1: deepest load before the lip (rear knee a bit more bent, 65/35 load) */
const S1: Key = { knee: 62, px: 0.02, pz: -0.03, pitch: 25, roll: 0, hf: [-0.22, 0.08, 0.28], hr: [-0.18, 0.06, -0.3] };
/** S4: lip, legs extended (never straight) */
const S4: Key = { knee: 16, px: 0, pz: 0, pitch: 8, roll: 0, hf: [-0.2, 0.42, 0.34], hr: [-0.12, 0.34, -0.36] };
/** A1: neutral in the air, compact but not grabbing */
const A1: Key = { knee: 60, px: -0.02, pz: 0, pitch: 22, roll: 0, hf: [-0.24, 0.2, 0.32], hr: [-0.2, 0.18, -0.32] };
/** A2: tuck, knees to the chest, the board comes to the hand */
const A2: Key = { knee: 122, px: -0.05, pz: 0, pitch: 55, roll: 0, hf: [-0.3, 0.12, 0.28], hr: [-0.26, 0.1, -0.28] };
/** A5: opened up to spot the landing: legs long, arms out */
const A5: Key = { knee: 42, px: 0, pz: 0, pitch: 4, roll: 0, hf: [-0.08, 0.46, 0.74], hr: [0.02, 0.44, -0.72] };
/** L4: peak compression of a landing, chest over the front knee, hands at the knees */
const L4: Key = { knee: 92, px: -0.02, pz: 0.02, pitch: 40, roll: 0, hf: [-0.36, 0.02, 0.36], hr: [-0.32, 0.02, -0.34] };
/** D3: butt check, sitting on the heel side */
const D3: Key = { knee: 125, px: 0.32, pz: 0, pitch: -5, roll: 0, hf: [0.2, -0.2, 0.36], hr: [0.24, -0.22, -0.34] };
/** crash: protective, knees bent, arms out towards the fall */
const CR: Key = { knee: 75, px: 0, pz: 0, pitch: 30, roll: 0, hf: [-0.3, 0.1, 0.45], hr: [-0.28, 0.1, -0.45] };

/**
 * Grabs (docs/research 14 Tab. 2, 15 catalogue): which hand, where on the board (board frame), how
 * the legs shift (pelvis towards the nose = front knee up) and the free arm (chest frame).
 */
interface GrabShape { hand: 'f' | 'r' | 'b'; at: [number, number, number]; at2?: [number, number, number]; pz: number; roll: number; free?: [number, number, number] }
const TOE = -0.15, HEEL = 0.15, EDGE_Y = BOARD_TOP + 0.04;
const GRAB: Partial<Record<GrabId, GrabShape>> = {
  nose: { hand: 'f', at: [0, 0.1, 0.72], pz: 0.12, roll: 28, free: [0.12, 0.5, -0.6] },
  mute: { hand: 'f', at: [TOE, EDGE_Y, 0.1], pz: 0, roll: 6, free: [0.1, 0.52, -0.58] },
  indy: { hand: 'r', at: [TOE, EDGE_Y, -0.12], pz: 0, roll: -4, free: [-0.12, 0.52, 0.62] },
  tail: { hand: 'r', at: [0, 0.1, -0.72], pz: -0.12, roll: -28, free: [-0.12, 0.5, 0.62] },
  japan: { hand: 'f', at: [TOE, EDGE_Y, 0.04], pz: 0.04, roll: 4, free: [0.1, 0.52, -0.58] },
  melon: { hand: 'f', at: [HEEL, EDGE_Y, 0.04], pz: 0, roll: 0, free: [0.1, 0.52, -0.58] },
  stalefish: { hand: 'r', at: [HEEL, EDGE_Y, -0.1], pz: 0, roll: 0, free: [-0.12, 0.52, 0.62] },
  method: { hand: 'f', at: [HEEL, EDGE_Y, -0.05], pz: 0.1, roll: 0, free: [0.05, 0.55, -0.6] },
  crail: { hand: 'r', at: [TOE, EDGE_Y, 0.45], pz: 0.06, roll: 15, free: [-0.05, 0.52, -0.6] },
  seatbelt: { hand: 'f', at: [0, 0.1, -0.72], pz: -0.12, roll: -25 },
  tindy: { hand: 'r', at: [TOE, EDGE_Y, -0.45], pz: -0.06, roll: -10, free: [-0.12, 0.52, 0.62] },
  tailfish: { hand: 'r', at: [HEEL, EDGE_Y, -0.45], pz: -0.06, roll: -10, free: [-0.12, 0.52, 0.62] },
  truckdriver: { hand: 'b', at: [TOE, EDGE_Y, 0.1], at2: [HEEL, EDGE_Y, -0.1], pz: 0, roll: 0 },
  stiffy: { hand: 'b', at: [TOE, EDGE_Y, 0.15], at2: [TOE, EDGE_Y, -0.15], pz: 0, roll: 0 },
  rocket: { hand: 'b', at: [TOE, EDGE_Y, 0.55], at2: [HEEL, EDGE_Y, 0.55], pz: 0.14, roll: 25 },
};

/** exact critically damped spring by half-life (Holden): deterministic and frame-rate independent */
function spring(x: number, v: number, goal: number, halflife: number, dt: number): [number, number] {
  const y = (2 * Math.LN2) / halflife, j0 = x - goal, j1 = v + j0 * y, e = Math.exp(-y * dt);
  return [goal + (j0 + j1 * dt) * e, (v - j1 * y * dt) * e];
}

const lerpKey = (a: Key, b: Key, t: number): Key => {
  if (t <= 0) return a;
  const L = (p: number, q: number) => p + (q - p) * t;
  return {
    knee: L(a.knee, b.knee), px: L(a.px, b.px), pz: L(a.pz, b.pz), pitch: L(a.pitch, b.pitch), roll: L(a.roll, b.roll),
    hf: [L(a.hf[0], b.hf[0]), L(a.hf[1], b.hf[1]), L(a.hf[2], b.hf[2])],
    hr: [L(a.hr[0], b.hr[0]), L(a.hr[1], b.hr[1]), L(a.hr[2], b.hr[2])],
  };
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** smoothed channels: name, half-life (s) — docs/research 14 Tab. 5 */
const CH = {
  knee: 0.09, px: 0.1, pz: 0.1, pitch: 0.15, roll: 0.15, twist: 0.12, head: 0.2,
  hfx: 0.08, hfy: 0.08, hfz: 0.08, hrx: 0.08, hry: 0.08, hrz: 0.08,
} as const;
type Ch = keyof typeof CH;

const _y = new THREE.Vector3(), _x = new THREE.Vector3(), _z = new THREE.Vector3(), _m = new THREE.Matrix4();
/** place a bone from `a` to `b` (board frame), its front facing `pole`; stretched along y if longer than `len0` */
function setBone(bone: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, pole: THREE.Vector3, len0: number): void {
  _y.subVectors(a, b);
  const len = _y.length();
  _y.divideScalar(len || 1);
  _x.copy(pole).addScaledVector(_y, -pole.dot(_y));
  if (_x.lengthSq() < 1e-8) _x.set(1, 0, 0).addScaledVector(_y, -_y.x);
  _x.normalize();
  _z.crossVectors(_x, _y);
  _m.makeBasis(_x, _y, _z);
  bone.quaternion.setFromRotationMatrix(_m);
  bone.position.copy(a);
  bone.scale.set(1, len / len0, 1);
}

const _d = new THREE.Vector3(), _n = new THREE.Vector3();
/**
 * Two-bone IK (law of cosines + pole). Writes the middle joint into `j`; returns the reach scale
 * (> 1 if the limb had to stretch a bit to get there, cartoon style, up to `maxStretch`).
 */
function ik(a: THREE.Vector3, t: THREE.Vector3, l1: number, l2: number, pole: THREE.Vector3, j: THREE.Vector3, maxStretch: number): number {
  _d.subVectors(t, a);
  let d = _d.length();
  _d.divideScalar(d || 1);
  const reach = l1 + l2;
  const s = Math.min(maxStretch, Math.max(1, d / (reach * 0.999)));
  const L1 = l1 * s, L2 = l2 * s;
  d = Math.max(Math.abs(L1 - L2) + 1e-4, Math.min(d, (L1 + L2) * 0.999));
  const cosA = Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
  const sinA = Math.sqrt(1 - cosA * cosA);
  _n.copy(pole).addScaledVector(_d, -pole.dot(_d));
  if (_n.lengthSq() < 1e-8) _n.set(-1, 0, 0);
  _n.normalize();
  j.copy(a).addScaledVector(_d, L1 * cosA).addScaledVector(_n, L1 * sinA);
  return s;
}

/**
 * Soft rider (docs/research 14, 16): one skinned body (pants and jacket, riderMesh.ts) driven by the
 * same bones the IK places, plus rigid helmet, goggles, mittens, boots and a board with the real
 * sidecut. Key poses from the research blended by the physics (edge, speed check, charge, tuck/open
 * springs, impact, landing outcome, crash) and smoothed with critically damped springs; feet locked to
 * the bindings and hands placed by IK. ~15 draw calls, ~3k triangles: active at every quality tier.
 */
export class Rider {
  readonly root = new THREE.Group();
  private readonly roll = new THREE.Group();
  private readonly inner = new THREE.Group();
  private readonly pelvis = new THREE.Group();
  private readonly chest = new THREE.Group();
  private readonly head = new THREE.Group();
  private readonly bones: Record<BoneName, THREE.Bone>;
  private readonly hand: [THREE.Mesh, THREE.Mesh];
  private readonly s: Record<Ch, [number, number]>;
  private rollV = 0;
  private crashT = 0;
  private clock = 0;
  private grip = 0;
  private lastGrab: GrabId | null = null;
  // scratch
  private readonly v0 = new THREE.Vector3(); private readonly v1 = new THREE.Vector3(); private readonly v2 = new THREE.Vector3();
  private readonly v3 = new THREE.Vector3(); private readonly v4 = new THREE.Vector3(); private readonly v5 = new THREE.Vector3();
  private readonly v6 = new THREE.Vector3(); private readonly v7 = new THREE.Vector3();
  private readonly e = new THREE.Euler();

  constructor() {
    this.root.add(this.roll);
    this.roll.add(this.inner);
    // the skin binds now, while everything is still at identity
    const body = createBody(this.inner);
    this.bones = body.bones;
    const C = RIDER_COLORS;
    // board from the real sidecut, smooth
    const board = new THREE.Mesh(boardGeometry(), new THREE.MeshLambertMaterial({ vertexColors: true }));
    board.castShadow = true;
    this.inner.add(board);
    // bindings and boots (rounded), duck +15 / −15; plates bring the boots to BOARD_TOP
    for (const [z, a] of [[FOOT_Z, DUCK], [-FOOT_Z, -DUCK]] as const) {
      const b = new THREE.Group(); b.position.set(0, BOARD_TOP, z); b.rotation.y = a; this.inner.add(b);
      const part = (g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, 0); o.castShadow = true; b.add(o); return o; };
      part(new RoundedBoxGeometry(0.3, 0.035, 0.2, 2, 0.012), soft(C.strap), 0, -0.012);
      part(new RoundedBoxGeometry(0.31, 0.15, 0.14, 3, 0.05), soft(C.boot), -0.02, 0.07);
      part(new RoundedBoxGeometry(0.05, 0.24, 0.16, 2, 0.02), soft(C.strap), 0.15, 0.12).rotation.z = -0.15;
    }
    // head: helmet, goggles band with a strap, a neck gaiter (rigid, it follows the chest)
    this.inner.add(this.pelvis);
    this.pelvis.add(this.chest);
    this.head.position.y = SPINE + 0.1;
    this.chest.add(this.head);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.155, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), soft(C.helmet));
    helmet.position.y = 0.05; helmet.scale.set(1.05, 1, 0.95); helmet.castShadow = true; this.head.add(helmet);
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 10), soft(C.strap)); face.position.y = 0.0; this.head.add(face);
    const strap = new THREE.Mesh(new THREE.TorusGeometry(0.132, 0.014, 6, 24), soft(C.strap)); strap.position.y = 0.035; strap.rotation.x = Math.PI / 2; this.head.add(strap);
    // goggle lens: a curved band in front of the face (the rider faces −x)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.142, 0.07, 16, 1, true, Math.PI * 1.2, Math.PI * 0.6), soft(C.goggles));
    lens.position.y = 0.035; lens.material.side = THREE.DoubleSide; this.head.add(lens);
    // mittens
    const mitt = () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), soft(C.mitt)); m.scale.set(0.9, 1.25, 1); m.castShadow = true; this.inner.add(m); return m; };
    this.hand = [mitt(), mitt()];
    this.s = Object.fromEntries((Object.keys(CH) as Ch[]).map((k) => [k, [0, 0]])) as Record<Ch, [number, number]>;
    this.snap(G1, 0);
  }

  private snap(k: Key, twist: number): void {
    const set = (c: Ch, v: number) => { this.s[c] = [v, 0]; };
    set('knee', k.knee); set('px', k.px); set('pz', k.pz); set('pitch', k.pitch); set('roll', k.roll); set('twist', twist); set('head', 0);
    set('hfx', k.hf[0]); set('hfy', k.hf[1]); set('hfz', k.hf[2]); set('hrx', k.hr[0]); set('hry', k.hr[1]); set('hrz', k.hr[2]);
  }

  /** blend the key poses from the physics drivers (docs/research 14 Tab. 1) */
  private target(p: RiderPose): Key {
    const tuck = clamp01(p.tuck ?? 0), open = clamp01(p.open ?? 0);
    let k: Key;
    if (p.crash) return CR;
    if (p.airborne) {
      const t = p.airT ?? 1;
      // lip extension, then neutral compact; tuck and open come from the physics springs
      k = lerpKey(S4, A1, clamp01((t - 0.08) / 0.2));
      k = lerpKey(k, A5, open * (1 - tuck));
      k = lerpKey(k, A2, tuck);
      const g = p.grab ? GRAB[p.grab] ?? GRAB.indy! : null;
      if (g) {
        k = { ...k, pz: k.pz + g.pz * tuck, roll: k.roll + g.roll * tuck };
        if (g.free && g.hand !== 'b') {
          const f = g.free;
          const L = (a: [number, number, number]): [number, number, number] => [a[0] + (f[0] - a[0]) * tuck, a[1] + (f[1] - a[1]) * tuck, a[2] + (f[2] - a[2]) * tuck];
          k = g.hand === 'f' ? { ...k, hr: L(k.hr) } : { ...k, hf: L(k.hf) };
        }
      }
      return k;
    }
    const heel = clamp01(p.edge / 0.55), toe = clamp01(-p.edge / 0.6);
    k = lerpKey(G1, G2, heel);
    k = lerpKey(k, G3, toe);
    k = lerpKey(k, G4, clamp01(p.brake));
    k = lerpKey(k, S1, clamp01(p.charge));
    k = lerpKey(k, L4, clamp01(p.absorb ?? 0));
    // sketchy landings: a hand (uphill, heel side) or both down, or sitting on the heels for a moment
    const tl = p.sinceLand ?? 9;
    const bell = clamp01(tl / 0.15) * clamp01((0.9 - tl) / 0.35);
    if (p.outcome === 'hand') k = { ...k, knee: k.knee + 45 * bell, px: k.px + 0.1 * bell, roll: k.roll - 8 * bell, hr: lerpV(k.hr, [0.42, -0.62, -0.3], bell) };
    else if (p.outcome === 'twohands') {
      const b2 = clamp01(tl / 0.2) * clamp01((1.2 - tl) / 0.4);
      k = lerpKey(k, { ...L4, knee: 115, px: 0.14, pitch: 15, hf: [0.42, -0.55, 0.3], hr: [0.44, -0.55, -0.3] }, b2);
    } else if (p.outcome === 'buttcheck') k = lerpKey(k, D3, clamp01(tl / 0.2) * clamp01((1.4 - tl) / 0.5));
    return k;
  }

  update(p: RiderPose, dt: number): void {
    this.clock += dt;
    // body roll with the edge: critically damped, angulation (the body leans less than the board)
    const target = -0.75 * (p.airborne ? 0 : p.edge), w = 14, x = this.roll.rotation.z - target;
    const decay = Math.exp(-w * dt), rv = this.rollV;
    this.roll.rotation.z = target + (x + (rv + w * x) * dt) * decay;
    this.rollV = (rv - w * (rv + w * x) * dt) * decay;

    const k = this.target(p);
    const step = (c: Ch, goal: number) => { const [v, s] = spring(this.s[c][0], this.s[c][1], goal, CH[c], dt); this.s[c] = [v, s]; return v; };
    const life = p.airborne || p.crash ? 0 : 1;
    const knee = step('knee', k.knee), px = step('px', k.px), pz = step('pz', k.pz);
    const pitch = step('pitch', k.pitch) * (Math.PI / 180), roll = step('roll', k.roll) * (Math.PI / 180);
    const twist = step('twist', p.twist);
    const hf = this.v0.set(step('hfx', k.hf[0]), step('hfy', k.hf[1]) + 0.02 * life * Math.sin(this.clock * 3.1), step('hfz', k.hf[2]));
    const hr = this.v1.set(step('hrx', k.hr[0]), step('hry', k.hr[1]) + 0.02 * life * Math.sin(this.clock * 2.7 + 1), step('hrz', k.hr[2]));

    // pelvis height from the knee flexion: hip–ankle distance 2·l·cos(flex/2), minus the spread to the feet
    const reach = 2 * THIGH * Math.cos((knee * Math.PI) / 360);
    const spread = FOOT_Z - HIP_Z;
    const py = ANKLE_Y + Math.sqrt(Math.max(0.01, reach * reach - spread * spread - px * px));
    this.pelvis.position.set(px, py, pz);
    // trunk: bend towards the toes (−x: + about z), sideways towards the nose (+ about x), shoulders twisted
    this.e.set(roll, 0, pitch, 'YZX');
    this.pelvis.quaternion.setFromEuler(this.e);
    this.chest.rotation.set(0, twist, 0);
    // head: looks over the front shoulder towards the nose, keeps the gaze level against the trunk bend
    const look = p.airborne ? 0.6 : 1.15;
    const headYaw = step('head', look - twist * 0.6);
    this.head.rotation.set(0, headYaw, -pitch * 0.7);

    this.pelvis.updateMatrix();
    this.chest.updateMatrix();
    // world (board-frame) matrix of the chest
    const mChest = _m2.multiplyMatrices(this.pelvis.matrix, this.chest.matrix);
    // the skin's trunk bones follow the pelvis and the (twisted) chest
    this.bones.pelvis.position.copy(this.pelvis.position);
    this.bones.pelvis.quaternion.copy(this.pelvis.quaternion);
    mChest.decompose(this.bones.chest.position, this.bones.chest.quaternion, this.v7);
    this.bones.chest.scale.set(1, 1, 1);

    // legs: feet locked to the bindings, knees towards the toes along each foot (duck)
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 1 : -1;
      const hip = this.v2.set(0, 0, side * HIP_Z).applyMatrix4(this.pelvis.matrix);
      const ankle = this.v3.set(0, ANKLE_Y, side * FOOT_Z);
      const pole = this.v4.set(-Math.cos(DUCK), 0.15, side * Math.sin(DUCK));
      const kj = this.v5;
      ik(hip, ankle, THIGH, SHANK, pole, kj, 1.05);
      setBone(this.bones[i === 0 ? 'thigh0' : 'thigh1'], hip, kj, pole, THIGH);
      setBone(this.bones[i === 0 ? 'shin0' : 'shin1'], kj, ankle, pole, SHANK);
    }

    // arms: wrists to their targets (chest frame → board frame), or to the board while grabbing
    const g = p.airborne && p.grab ? GRAB[p.grab] ?? GRAB.indy! : null;
    if (p.grab) this.lastGrab = p.grab;
    this.grip = g ? clamp01(p.tuck ?? 0) : Math.max(0, this.grip - dt * 8);
    const gs = g ?? (this.lastGrab ? GRAB[this.lastGrab] ?? null : null);
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 1 : -1;
      const sh = this.v2.set(0, SHOULDER_Y, side * SHOULDER_Z).applyMatrix4(mChest);
      const wrist = this.v3.copy(i === 0 ? hf : hr).applyMatrix4(mChest);
      if (gs && this.grip > 0) {
        const mine = gs.hand === 'b' || (gs.hand === 'f') === (i === 0);
        const pt = gs.hand === 'b' && i === 1 && gs.at2 ? gs.at2 : gs.at;
        if (mine) wrist.lerp(this.v6.set(pt[0], pt[1] + 0.06, pt[2]), this.grip);
      }
      // elbows out and back
      const pole = this.v4.set(0.8, -0.35, side * 0.55).transformDirection(mChest);
      const el = this.v5;
      ik(sh, wrist, UPPER_ARM, FOREARM, pole, el, 1.25);
      const fore = this.bones[i === 0 ? 'fore0' : 'fore1'];
      setBone(this.bones[i === 0 ? 'upper0' : 'upper1'], sh, el, pole, UPPER_ARM);
      setBone(fore, el, wrist, pole, FOREARM);
      const h = this.hand[i]!;
      h.position.copy(wrist).addScaledVector(this.v7.subVectors(wrist, el).normalize(), 0.045);
      h.quaternion.copy(fore.quaternion);
    }

    // crash: tip over in the direction of the cause (docs/research 13, 14)
    //  nose = over the nose, toe = thrown over the toe edge (edge catch), back = onto the back, side = sideways
    this.crashT = p.crash ? Math.min(1.45, this.crashT + dt * 4) : 0;
    if (p.crash) {
      const a = this.crashT;
      if (p.crashDir === 'nose') this.roll.rotation.set(a, 0, 0);
      else if (p.crashDir === 'toe') this.roll.rotation.set(0, 0, -a);
      else if (p.crashDir === 'back') this.roll.rotation.set(0, 0, Math.min(a, 1.1));
      else this.roll.rotation.set(0, 0, a);
      this.rollV = 0;
    } else this.roll.rotation.x = 0;
  }
}

const _m2 = new THREE.Matrix4();
function lerpV(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
