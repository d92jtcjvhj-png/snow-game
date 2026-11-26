import * as THREE from 'three';

/**
 * Snow spray and powder puffs (docs/research 16): soft round sprites drawn in the shader (no texture),
 * each with its own size, growing a little and fading out with age. Skids and speed checks emit a
 * stream; a landing throws a burst sized by the impact. The particle budget comes from the quality
 * tier (low 60, medium 150, high 260); same look on every tier.
 */
export class Spray {
  readonly points: THREE.Points;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly life: Float32Array;
  private readonly life0: Float32Array;
  private readonly size: Float32Array;
  private readonly alpha: Float32Array;
  private readonly uniforms = { uViewH: { value: 800 }, uColor: { value: new THREE.Color(0xd2deec) } };
  private next = 0;

  /** active particle budget (quality) */
  budget = 260;

  constructor(private readonly max = 260) {
    this.pos = new Float32Array(max * 3); this.vel = new Float32Array(max * 3);
    this.life = new Float32Array(max); this.life0 = new Float32Array(max);
    this.size = new Float32Array(max); this.alpha = new Float32Array(max);
    for (let i = 0; i < max; i++) this.pos[i * 3 + 1] = -9999;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(this.size, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms, transparent: true, depthWrite: false,
      vertexShader: /* glsl */ `
        attribute float size; attribute float alpha;
        uniform float uViewH;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * projectionMatrix[1][1] * uViewH * 0.5 / max(-mv.z, 0.1);
          vAlpha = alpha;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.25, d) * vAlpha;
          if (a < 0.01) discard;
          gl_FragColor = vec4(uColor, a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
  }

  /** drawing-buffer height in pixels, for the point size */
  setViewHeight(h: number): void { this.uniforms.uViewH.value = h; }

  emit(x: number, y: number, z: number, vx: number, vy: number, vz: number, size = 0.22 + Math.random() * 0.18, life = 0.5 + Math.random() * 0.4): void {
    const i = this.next; this.next = (this.next + 1) % Math.min(this.max, this.budget);
    this.pos.set([x, y, z], i * 3); this.vel.set([vx, vy, vz], i * 3);
    this.life[i] = this.life0[i] = life; this.size[i] = size; this.alpha[i] = 0.9;
  }

  /** landing puff: `k` 0..1 from the impact; powder thrown out and up around (x, y, z), carried by (vx, vz) */
  burst(x: number, y: number, z: number, vx: number, vz: number, k: number): void {
    const n = Math.round((12 + 40 * k) * Math.min(1, this.budget / 150));
    for (let j = 0; j < n; j++) {
      const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * (2 + 3 * k);
      this.emit(x, y + 0.05, z, vx * 0.35 + Math.cos(a) * s, 0.8 + Math.random() * (1.5 + 2 * k), vz * 0.35 + Math.sin(a) * s,
        0.3 + Math.random() * (0.3 + 0.4 * k), 0.6 + Math.random() * 0.5);
    }
  }

  update(dt: number): void {
    for (let i = 0; i < this.max; i++) {
      if (this.life[i]! <= 0) continue;
      this.life[i]! -= dt;
      if (this.life[i]! <= 0) { this.pos[i * 3 + 1] = -9999; this.alpha[i] = 0; continue; }
      // light powder: gravity and a strong air drag
      const drag = Math.exp(-2.2 * dt);
      this.vel[i * 3]! *= drag; this.vel[i * 3 + 2]! *= drag;
      this.vel[i * 3 + 1] = this.vel[i * 3 + 1]! * drag - 7 * dt;
      for (let k = 0; k < 3; k++) this.pos[i * 3 + k]! += this.vel[i * 3 + k]! * dt;
      const age = 1 - this.life[i]! / this.life0[i]!;
      this.size[i]! *= 1 + 0.9 * dt;
      this.alpha[i] = 0.9 * (1 - age * age);
    }
    const g = this.points.geometry;
    (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.size as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.alpha as THREE.BufferAttribute).needsUpdate = true;
  }
}
