import * as THREE from 'three';

/**
 * Side camera (like the legacy one): on the toe side, a little behind, so the rider's edge and lean
 * read clearly. It always aims at the rider, on the snow and in the air.
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

  /**
   * `vel`: rider velocity, for a small look-ahead. The camera always aims at the rider (the landing is
   * shown by the ring on the snow): aiming between rider and landing pushed the rider out of a narrow
   * portrait view in the air.
   */
  update(target: THREE.Vector3, airborne: boolean, vel: THREE.Vector3, dt: number): void {
    this.air += ((airborne ? 1 : 0) - this.air) * Math.min(1, dt * 2.5);
    const a = this.air;
    // side view on the toe side — ground: (-11, 4.5, -5), air: (-13, 5, -4)
    this.want.set(target.x - 11 - 2 * a, target.y + 4.5 + 0.5 * a, target.z - 5 + 1 * a);
    this.wantLook.copy(target).addScaledVector(vel, 0.12);
    this.wantLook.y += 0.6;
    if (!this.placed) { this.pos.copy(this.want); this.look.copy(this.wantLook); this.placed = true; }
    // follow fast enough that a 60 km/h rider never runs out of the frame
    this.pos.lerp(this.want, 1 - Math.exp(-dt * (5 + 3 * a)));
    // never below the snow (the drop-in is 35°): keep at least 2 m above the ground under the camera
    this.pos.y = Math.max(this.pos.y, this.groundAt(this.pos.x, this.pos.z) + 2);
    this.look.lerp(this.wantLook, 1 - Math.exp(-dt * 14));
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }

  snap(): void { this.placed = false; this.air = 0; }
}
