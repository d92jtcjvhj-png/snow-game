import * as THREE from 'three';

/**
 * Side camera (like the legacy one): on the toe side, a little behind, so the rider's edge and lean
 * read clearly. In the air it moves further out and frames the rider and the predicted landing.
 */
export class FollowCamera {
  readonly camera = new THREE.PerspectiveCamera(62, 1, 0.1, 1200);
  private readonly pos = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly want = new THREE.Vector3();
  private readonly wantLook = new THREE.Vector3();
  private air = 0;
  private placed = false;

  /** `groundAt`: snow height, so the camera never ends up inside the slope */
  constructor(private readonly groundAt: (x: number, z: number) => number) {}

  update(target: THREE.Vector3, airborne: boolean, landing: THREE.Vector3 | null, dt: number): void {
    this.air += ((airborne ? 1 : 0) - this.air) * Math.min(1, dt * 2.5);
    const a = this.air;
    // side view on the toe side, slightly behind — ground: (-11, 4.5, -5), air: (-16, 6, -2)
    this.want.set(target.x - 11 - 5 * a, target.y + 4.5 + 1.5 * a, target.z - 5 + 3 * a);
    this.wantLook.set(target.x, target.y + 0.6, target.z + 5 - 3 * a);
    if (landing && airborne) this.wantLook.lerp(new THREE.Vector3(landing.x, Math.max(landing.y, target.y - 8), landing.z), 0.25);
    if (!this.placed) { this.pos.copy(this.want); this.look.copy(this.wantLook); this.placed = true; }
    this.pos.lerp(this.want, 1 - Math.exp(-dt * 5));
    // never below the snow (the drop-in is 35°): keep at least 2 m above the ground under the camera
    this.pos.y = Math.max(this.pos.y, this.groundAt(this.pos.x, this.pos.z) + 2);
    this.look.lerp(this.wantLook, 1 - Math.exp(-dt * 8));
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }

  snap(): void { this.placed = false; this.air = 0; }
}
