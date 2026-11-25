import * as THREE from 'three';

/** Snow spray particles (skids and speed checks). The count comes from the quality tier. */
export class Spray {
  readonly points: THREE.Points;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly life: Float32Array;
  private next = 0;

  constructor(private readonly max = 260) {
    this.pos = new Float32Array(max * 3); this.vel = new Float32Array(max * 3); this.life = new Float32Array(max);
    for (let i = 0; i < max; i++) this.pos[i * 3 + 1] = -9999;
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.points = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xb9d0e6, size: 0.2, transparent: true, opacity: 0.85, depthWrite: false }));
    this.points.frustumCulled = false;
  }

  /** active particle budget (quality) */
  budget = 260;

  emit(x: number, y: number, z: number, vx: number, vy: number, vz: number): void {
    const i = this.next; this.next = (this.next + 1) % Math.min(this.max, this.budget);
    this.pos.set([x, y, z], i * 3); this.vel.set([vx, vy, vz], i * 3); this.life[i] = 0.5 + Math.random() * 0.4;
  }

  update(dt: number): void {
    for (let i = 0; i < this.max; i++) {
      if (this.life[i]! <= 0) continue;
      this.life[i]! -= dt;
      if (this.life[i]! <= 0) { this.pos[i * 3 + 1] = -9999; continue; }
      this.vel[i * 3 + 1]! -= 9.8 * dt;
      for (let k = 0; k < 3; k++) this.pos[i * 3 + k]! += this.vel[i * 3 + k]! * dt;
    }
    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}
