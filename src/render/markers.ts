import * as THREE from 'three';
import { PALETTE } from './materials';

/** Training indicators: predicted landing ring and the "start charging here" band on the approach. */
export class Markers {
  readonly ring: THREE.Mesh;
  readonly band: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.25, 28), new THREE.MeshBasicMaterial({ color: PALETTE.blue, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false }));
    this.band = new THREE.Mesh(new THREE.PlaneGeometry(12, 1.6), new THREE.MeshBasicMaterial({ color: 0xffd24a, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }));
    this.ring.visible = this.band.visible = false;
    scene.add(this.ring, this.band);
  }

  /** place a flat marker on the snow at (x, y, z) with the slope pitch `pitch` (rad, down-slope positive) */
  static place(m: THREE.Mesh, x: number, y: number, z: number, pitch: number): void {
    m.position.set(x, y + 0.05, z);
    m.rotation.set(-Math.PI / 2 + pitch, 0, 0);
  }
}
