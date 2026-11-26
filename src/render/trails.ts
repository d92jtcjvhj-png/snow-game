import * as THREE from 'three';

/**
 * Board tracks on the snow (docs/research 16): a ribbon of quads laid behind the board while it is on
 * the snow, following h(x, z). Narrow where the edge carves, as wide as the board sweeps when it skids
 * (speed check). A ring buffer of segments (each quad on its own, so jumps leave gaps). The segment
 * budget comes from the quality tier (low 150, medium 350, high 600).
 */
export class Trails {
  readonly mesh: THREE.Mesh;
  private readonly pos: Float32Array;
  private next = 0;
  private last: { x: number; z: number; w: number; lx: number; lz: number } | null = null;
  budget = 600;

  constructor(private readonly heightAt: (x: number, z: number) => number, private readonly max = 600) {
    this.pos = new Float32Array(max * 4 * 3);
    const idx = new Uint32Array(max * 6);
    for (let j = 0; j < max; j++) { const a = j * 4; idx.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], j * 6); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    this.mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
      color: 0x8fa6c4, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
  }

  reset(): void {
    this.pos.fill(0);
    this.last = null;
    (this.mesh.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  /** a gap (the board left the snow) */
  lift(): void { this.last = null; }

  /**
   * The board is on the snow at (x, z), moving along (dx, dz) (unit, horizontal); `w` the track width (m).
   * A segment is laid every ~0.3 m.
   */
  add(x: number, z: number, dx: number, dz: number, w: number): void {
    const lx = -dz, lz = dx;
    if (!this.last) { this.last = { x, z, w, lx, lz }; return; }
    const L = this.last;
    if ((x - L.x) ** 2 + (z - L.z) ** 2 < 0.09) return;
    const j = this.next; this.next = (this.next + 1) % Math.min(this.max, this.budget);
    const put = (k: number, px: number, pz: number) => { this.pos.set([px, this.heightAt(px, pz) + 0.012, pz], (j * 4 + k) * 3); };
    put(0, L.x - L.lx * L.w / 2, L.z - L.lz * L.w / 2);
    put(1, L.x + L.lx * L.w / 2, L.z + L.lz * L.w / 2);
    put(2, x - lx * w / 2, z - lz * w / 2);
    put(3, x + lx * w / 2, z + lz * w / 2);
    this.last = { x, z, w, lx, lz };
    (this.mesh.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}
