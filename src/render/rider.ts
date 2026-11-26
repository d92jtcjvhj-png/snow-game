import * as THREE from 'three';
import { flat } from './materials';

/** Pose for one frame (all smoothed by the rider itself). */
export interface RiderPose {
  /** board edge angle (rad, + heel): the rider rolls with it, a bit less (angulation) */
  edge: number;
  /** 0..1 */
  crouch: number;
  /** shoulders vs board (rad): wind-up before the jump */
  twist: number;
  /** arms: 0 relaxed, 1 wound up / spread */
  arms: number;
  airborne: boolean;
  /** opened up in the air (arms out) */
  opened?: boolean;
  /** grab held in the air */
  grab?: 'nose' | 'mute' | 'indy' | 'tail' | null;
  /** fallen: the rider tumbles over, in the direction of the cause */
  crash?: boolean;
  crashDir?: 'nose' | 'toe' | 'back' | 'side';
  /** 0..1: legs compressing to absorb a landing (∝ impact) */
  absorb?: number;
}

/**
 * Low-poly block rider, ported from the legacy prototype: board half yellow (nose) / half purple (tail),
 * white chest on the toe side (−x), dark back, red head. Regular stance, facing −x.
 */
export class Rider {
  readonly root = new THREE.Group();
  private readonly roll = new THREE.Group();
  private readonly legF: THREE.Mesh;
  private readonly legR: THREE.Mesh;
  private readonly torso = new THREE.Group();
  private readonly armF: THREE.Group;
  private readonly armR: THREE.Group;
  private cr = 0;
  private crashT = 0;
  /** body roll as a critically damped spring (docs/research 11): smooth lean, no snapping */
  private rollV = 0;

  constructor() {
    this.root.add(this.roll);
    const inner = new THREE.Group(); inner.scale.setScalar(1.25); this.roll.add(inner);
    const NOSE = flat(0xffd21f), TAIL = flat(0x8a3cff);
    const box = (w: number, h: number, d: number, m: THREE.Material) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.castShadow = true; return o; };
    const bF = box(0.26, 0.05, 0.62, NOSE); bF.position.set(0, 0.025, 0.31);
    const bT = box(0.26, 0.05, 0.62, TAIL); bT.position.set(0, 0.025, -0.31);
    const n = box(0.26, 0.05, 0.16, NOSE); n.position.set(0, 0.06, 0.68); n.rotation.x = -0.4;
    const t = box(0.26, 0.05, 0.16, TAIL); t.position.set(0, 0.06, -0.68); t.rotation.x = 0.4;
    inner.add(bF, bT, n, t);
    const pants = flat(0x27394d);
    this.legF = box(0.15, 0.7, 0.15, pants); this.legF.position.set(0, 0.4, 0.2);
    this.legR = box(0.15, 0.7, 0.15, pants); this.legR.position.set(0, 0.4, -0.2);
    inner.add(this.legF, this.legR);
    this.torso.position.y = 0.74; inner.add(this.torso);
    const jacket = flat(0x2c7be5);
    const tor = box(0.24, 0.55, 0.4, jacket); tor.position.y = 0.28; this.torso.add(tor);
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.15, 0), flat(0xff4d4d)); head.position.y = 0.7; head.castShadow = true; this.torso.add(head);
    const gog = box(0.06, 0.09, 0.21, flat(0xffb000)); gog.position.set(-0.13, 0.72, 0); this.torso.add(gog);
    const chest = box(0.03, 0.44, 0.32, flat(0xffffff)); chest.position.set(-0.13, 0.3, 0); this.torso.add(chest);
    const back = box(0.03, 0.44, 0.34, flat(0x15243a)); back.position.set(0.13, 0.3, 0); this.torso.add(back);
    const arm = (z: number) => {
      const g = new THREE.Group(); g.position.set(0, 0.5, z);
      const a = box(0.1, 0.5, 0.1, jacket); a.position.y = -0.25; g.add(a);
      const h = box(0.11, 0.09, 0.11, flat(0x1d2b3a)); h.position.y = -0.53; g.add(h);
      this.torso.add(g); return g;
    };
    this.armF = arm(0.24); this.armR = arm(-0.24);
  }

  update(p: RiderPose, dt: number): void {
    // roll: heel edge (+) puts the +x (heel) side down → negative rotation about the board axis
    // riders angulate (knees, hips): the body leans less than the board's edge angle.
    // Critically damped spring, half-life ~0.1 s: the lean flows from one turn into the next.
    const target = -0.75 * p.edge, w = 14, x = this.roll.rotation.z - target;
    const decay = Math.exp(-w * dt), v = this.rollV;
    this.roll.rotation.z = target + (x + (v + w * x) * dt) * decay;
    this.rollV = (v - w * (v + w * x) * dt) * decay;
    const crouch = Math.max(p.crouch, p.absorb ?? 0);
    this.cr += (crouch - this.cr) * Math.min(1, dt * (crouch < this.cr ? 14 : 20));
    const c = this.cr;
    this.legF.scale.y = this.legR.scale.y = 1 - 0.36 * c;
    this.legF.position.y = this.legR.position.y = 0.4 * (1 - 0.36 * c);
    this.torso.position.y = 0.74 - 0.26 * c;
    this.torso.rotation.z = 0.22 * c;
    this.torso.rotation.y += (p.twist - this.torso.rotation.y) * Math.min(1, dt * 8);
    // arms (legacy poses): relaxed, wound up, opened in the air, or reaching for a grab
    const toe = -0.55;
    let fx = -0.5 * p.arms, rx = 0.5 * p.arms, fz = 0.15, rz = 0.15;
    if (p.airborne) {
      if (p.opened) { fx = -1.3; rx = 1.3; fz = 0.4; rz = 0.4; } else { fx = -0.4; rx = 0.4; fz = 0.3; rz = 0.3; }
      if (p.grab === 'nose') { fz = 0; fx = -0.75; }
      else if (p.grab === 'mute') { fz = toe; fx = -0.2; }
      else if (p.grab === 'indy') { rz = toe; rx = 0.2; }
      else if (p.grab === 'tail') { rz = 0; rx = 0.75; }
    }
    const k = Math.min(1, dt * 12);
    this.armF.rotation.x += (fx - this.armF.rotation.x) * k; this.armR.rotation.x += (rx - this.armR.rotation.x) * k;
    this.armF.rotation.z += (fz - this.armF.rotation.z) * k; this.armR.rotation.z += (rz - this.armR.rotation.z) * k;
    // crash: tip over in the direction of the cause (docs/research 13)
    //  nose = over the nose (pitch forward), toe = thrown face-first over the toe edge (edge catch),
    //  back = sat down on the heels / back, side = sideways
    this.crashT = p.crash ? Math.min(1.45, this.crashT + dt * 4) : 0;
    if (p.crash) {
      const a = this.crashT;
      if (p.crashDir === 'nose') { this.roll.rotation.set(a, 0, 0); }
      else if (p.crashDir === 'toe') { this.roll.rotation.set(0, 0, -a); }
      else if (p.crashDir === 'back') { this.roll.rotation.set(0, 0, Math.min(a, 1.1)); }
      else { this.roll.rotation.set(0, 0, a); }
      this.rollV = 0;
    } else this.roll.rotation.x = 0;
  }
}
