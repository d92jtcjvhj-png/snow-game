import * as THREE from 'three';

/**
 * Chase camera. On the snow: behind and on the toe side, high enough to read the set-up S.
 * In the air: moves to the side (like the legacy camera) and frames the rider and the predicted landing.
 */
export class FollowCamera {
  readonly camera = new THREE.PerspectiveCamera(62, 1, 0.1, 1200);
  private readonly pos = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly want = new THREE.Vector3();
  private readonly wantLook = new THREE.Vector3();
  private air = 0;
  private placed = false;

  update(target: THREE.Vector3, airborne: boolean, landing: THREE.Vector3 | null, dt: number): void {
    this.air += ((airborne ? 1 : 0) - this.air) * Math.min(1, dt * 2.5);
    const a = this.air;
    // ground: (-6, 4.2, -10) — air: (-16, 6, -3)
    this.want.set(target.x - 6 - 10 * a, target.y + 4.2 + 1.8 * a, target.z - 10 + 7 * a);
    this.wantLook.set(target.x, target.y + 0.6, target.z + 6 - 4 * a);
    if (landing && airborne) this.wantLook.lerp(new THREE.Vector3(landing.x, Math.max(landing.y, target.y - 8), landing.z), 0.25);
    if (!this.placed) { this.pos.copy(this.want); this.look.copy(this.wantLook); this.placed = true; }
    this.pos.lerp(this.want, 1 - Math.exp(-dt * 5));
    this.look.lerp(this.wantLook, 1 - Math.exp(-dt * 8));
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }

  snap(): void { this.placed = false; this.air = 0; }
}
