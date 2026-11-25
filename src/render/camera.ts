import * as THREE from 'three';

/** Chase camera, high and to the side (like the legacy one), smoothed with exponential damping. */
export class FollowCamera {
  readonly camera = new THREE.PerspectiveCamera(60, 1, 0.1, 900);
  private readonly pos = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly desired = new THREE.Vector3();
  private placed = false;

  constructor(private readonly offset = new THREE.Vector3(-9, 5, -9)) {}

  update(target: THREE.Vector3, dt: number): void {
    this.desired.copy(target).add(this.offset);
    if (!this.placed) {
      this.pos.copy(this.desired); this.look.copy(target); this.placed = true;
    } else {
      this.pos.lerp(this.desired, 1 - Math.exp(-dt * 5));
      this.look.lerp(target, 1 - Math.exp(-dt * 10));
    }
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }

  snap(): void {
    this.placed = false;
  }
}
