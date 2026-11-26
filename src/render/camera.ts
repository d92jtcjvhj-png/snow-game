import * as THREE from 'three';

/**
 * Side camera (like the legacy one): on the toe side, a little behind, so the rider's edge and lean
 * read clearly. It always aims at the rider, on the snow and in the air.
 */
export class FollowCamera {
  readonly camera = new THREE.PerspectiveCamera(62, 1, 0.1, 1700);
  private readonly pos = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly want = new THREE.Vector3();
  private readonly wantLook = new THREE.Vector3();
  private placed = false;

  /** `groundAt`: snow height, so the camera never ends up inside the slope */
  constructor(private readonly groundAt: (x: number, z: number) => number) {}

  /**
   * Rigid side follow: the same offset from the rider on the snow and in the air, aimed exactly at
   * the rider. No look-ahead (it tilted the view up at the lip and down in the fall) and only a little
   * smoothing, so the framing does not swing during the jump. `vel` is kept for future use.
   */
  update(target: THREE.Vector3, _airborne: boolean, _vel: THREE.Vector3, dt: number): void {
    this.want.set(target.x - 11, target.y + 4.5, target.z - 5);
    this.wantLook.copy(target);
    this.wantLook.y += 0.6;
    if (!this.placed) { this.pos.copy(this.want); this.look.copy(this.wantLook); this.placed = true; }
    this.pos.lerp(this.want, 1 - Math.exp(-dt * 14));
    // never below the snow (the drop-in is 35°): keep at least 2 m above the ground under the camera
    this.pos.y = Math.max(this.pos.y, this.groundAt(this.pos.x, this.pos.z) + 2);
    this.look.lerp(this.wantLook, 1 - Math.exp(-dt * 20));
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }

  snap(): void { this.placed = false; }
}
