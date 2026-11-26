import * as THREE from 'three';
import { flat } from './materials';
import type { GrabId } from '../physics/spin';

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
const BOARD_TOP = 0.05;
const ANKLE_Y = BOARD_TOP + 0.09;
const FOOT_Z = 0.27; // stance ≈ 0.31·H
const HIP_Z = 0.09; // hip joint centres ≈ 0.10·H apart
const THIGH = 0.43, SHANK = 0.43;
const SPINE = 0.46; // pelvis centre → base of the neck
const SHOULDER_Y = 0.42, SHOULDER_Z = 0.18;
const UPPER_ARM = 0.31, FOREARM = 0.25;
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

/** A limb segment: a group at the proximal joint, the mesh hanging along −y. */
class Bone {
  readonly g = new THREE.Group();
  readonly mesh: THREE.Mesh;
  constructor(parent: THREE.Object3D, readonly len: number, rTop: number, rBot: number, mat: THREE.Material) {
    const geo = new THREE.CylinderGeometry(rTop, rBot, len, 6, 1);
    geo.translate(0, -len / 2, 0);
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.castShadow = true;
    this.g.add(this.mesh);
    parent.add(this.g);
  }
}

const _y = new THREE.Vector3(), _x = new THREE.Vector3(), _z = new THREE.Vector3(), _m = new THREE.Matrix4();
/** place a bone from `a` to `b` (board frame), its front facing `pole` */
function setBone(bone: Bone, a: THREE.Vector3, b: THREE.Vector3, pole: THREE.Vector3): void {
  _y.subVectors(a, b);
  const len = _y.length();
  _y.divideScalar(len || 1);
  _x.copy(pole).addScaledVector(_y, -pole.dot(_y));
  if (_x.lengthSq() < 1e-8) _x.set(1, 0, 0).addScaledVector(_y, -_y.x);
  _x.normalize();
  _z.crossVectors(_x, _y);
  _m.makeBasis(_x, _y, _z);
  bone.g.quaternion.setFromRotationMatrix(_m);
  bone.g.position.copy(a);
  bone.mesh.scale.y = len / bone.len;
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
 * Low-poly articulated rider (docs/research 14): pelvis, spine, head with helmet and goggles, thighs,
 * shanks, upper arms, forearms, mittens and boots on a yellow/purple board. Key poses from the research
 * blended by the physics (edge, speed check, charge, tuck/open springs, impact, landing outcome, crash)
 * and smoothed with critically damped springs; feet locked to the bindings and hands placed by IK.
 * Pure CPU math on ~20 meshes: active at every quality tier.
 */
export class Rider {
  readonly root = new THREE.Group();
  private readonly roll = new THREE.Group();
  private readonly inner = new THREE.Group();
  private readonly pelvis = new THREE.Group();
  private readonly chest = new THREE.Group();
  private readonly head = new THREE.Group();
  private readonly thigh: [Bone, Bone];
  private readonly shank: [Bone, Bone];
  private readonly upper: [Bone, Bone];
  private readonly fore: [Bone, Bone];
  private readonly hand: [THREE.Mesh, THREE.Mesh];
  private readonly knee: [THREE.Mesh, THREE.Mesh];
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
    const NOSE = flat(0xffd21f), TAIL = flat(0x8a3cff), PANTS = flat(0x27394d), JACKET = flat(0x2c7be5);
    const DARK = flat(0x15243a), MITT = flat(0x1d2b3a), WHITE = flat(0xffffff), HELMET = flat(0xff4d4d), GOG = flat(0xffb000);
    const box = (w: number, h: number, d: number, m: THREE.Material, parent: THREE.Object3D) => {
      const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.castShadow = true; parent.add(o); return o;
    };
    // board: yellow nose half, purple tail half, kicked tips (1.56 m)
    box(0.28, 0.05, 0.62, NOSE, this.inner).position.set(0, 0.025, 0.31);
    box(0.28, 0.05, 0.62, TAIL, this.inner).position.set(0, 0.025, -0.31);
    const n = box(0.28, 0.05, 0.18, NOSE, this.inner); n.position.set(0, 0.06, 0.69); n.rotation.x = -0.4;
    const t = box(0.28, 0.05, 0.18, TAIL, this.inner); t.position.set(0, 0.06, -0.69); t.rotation.x = 0.4;
    // boots and highbacks, duck +15 / −15
    for (const [z, a] of [[FOOT_Z, DUCK], [-FOOT_Z, -DUCK]] as const) {
      const b = new THREE.Group(); b.position.set(0, BOARD_TOP, z); b.rotation.y = a; this.inner.add(b);
      box(0.3, 0.12, 0.13, DARK, b).position.set(-0.02, 0.06, 0);
      box(0.04, 0.2, 0.15, MITT, b).position.set(0.14, 0.12, 0);
    }
    // legs: baggy pants, a ball at the knee hides the joint
    const leg = (): Bone => new Bone(this.inner, THIGH, 0.1, 0.085, PANTS);
    const shin = (): Bone => new Bone(this.inner, SHANK, 0.085, 0.075, PANTS);
    this.thigh = [leg(), leg()];
    this.shank = [shin(), shin()];
    const kneeBall = () => { const k = new THREE.Mesh(new THREE.IcosahedronGeometry(0.085, 0), PANTS); k.castShadow = true; this.inner.add(k); return k; };
    this.knee = [kneeBall(), kneeBall()];
    // pelvis and trunk (jacket, white chest on the toe side, dark back), head with helmet and goggles
    this.inner.add(this.pelvis);
    box(0.24, 0.2, 0.36, PANTS, this.pelvis).position.y = 0.02;
    this.pelvis.add(this.chest);
    const jacket = box(0.3, 0.5, 0.44, JACKET, this.chest); jacket.position.y = 0.24;
    box(0.03, 0.36, 0.3, WHITE, this.chest).position.set(-0.155, 0.26, 0);
    box(0.03, 0.4, 0.34, DARK, this.chest).position.set(0.155, 0.26, 0);
    box(0.2, 0.08, 0.22, JACKET, this.chest).position.set(0, 0.5, 0); // collar
    this.head.position.y = SPINE + 0.1;
    this.chest.add(this.head);
    const helmet = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 1), HELMET); helmet.castShadow = true; helmet.position.y = 0.06; this.head.add(helmet);
    box(0.07, 0.08, 0.2, GOG, this.head).position.set(-0.11, 0.06, 0);
    // arms
    const arm = (): Bone => new Bone(this.inner, UPPER_ARM, 0.06, 0.055, JACKET);
    const fore = (): Bone => new Bone(this.inner, FOREARM, 0.055, 0.05, JACKET);
    this.upper = [arm(), arm()];
    this.fore = [fore(), fore()];
    const mitt = () => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.1), MITT); m.castShadow = true; this.inner.add(m); return m; };
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

    // legs: feet locked to the bindings, knees towards the toes along each foot (duck)
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 1 : -1;
      const hip = this.v2.set(0, 0, side * HIP_Z).applyMatrix4(this.pelvis.matrix);
      const ankle = this.v3.set(0, ANKLE_Y, side * FOOT_Z);
      const pole = this.v4.set(-Math.cos(DUCK), 0.15, side * Math.sin(DUCK));
      const kj = this.v5;
      ik(hip, ankle, THIGH, SHANK, pole, kj, 1.05);
      setBone(this.thigh[i]!, hip, kj, pole);
      setBone(this.shank[i]!, kj, ankle, pole);
      this.knee[i]!.position.copy(kj);
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
      setBone(this.upper[i]!, sh, el, pole);
      setBone(this.fore[i]!, el, wrist, pole);
      const h = this.hand[i]!;
      h.position.copy(wrist).addScaledVector(this.v7.subVectors(wrist, el).normalize(), 0.05);
      h.quaternion.copy(this.fore[i]!.g.quaternion);
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
