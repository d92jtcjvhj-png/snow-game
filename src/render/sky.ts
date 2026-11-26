import * as THREE from 'three';

/**
 * Sky and distant mountains (docs/research 16), all tiers: cheap and they give the scale of the big air.
 *  - a gradient dome (deep blue zenith → pale horizon equal to the fog colour) with an analytic sun disc
 *    and glow; it follows the camera, so it is always "at infinity";
 *  - three rings of mountain ridges, each one paler and closer to the haze than the one in front
 *    (atmospheric perspective), with snow above a ragged snow line. Faceted on purpose: rocks and
 *    mountains keep the low-poly character, the snow surface is the smooth part.
 */
export const SKY = {
  zenith: 0x3d7fd6,
  horizon: 0xd4e5f3,
  sunColor: 0xfff1d6,
} as const;

export interface Sky {
  group: THREE.Group;
  dome: THREE.Mesh;
  update(camera: THREE.Camera): void;
}

export function createSky(sunDir: THREE.Vector3, center: THREE.Vector3): Sky {
  const group = new THREE.Group();
  const uniforms = {
    uZenith: { value: new THREE.Color(SKY.zenith) },
    uHorizon: { value: new THREE.Color(SKY.horizon) },
    uSun: { value: new THREE.Color(SKY.sunColor) },
    uSunDir: { value: sunDir },
  };
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1500, 32, 16),
    new THREE.ShaderMaterial({
      uniforms, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 p = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * p;
          gl_Position.z = gl_Position.w; // always at the far plane
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uSun; uniform vec3 uSunDir;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = max(d.y, 0.0);
          vec3 col = mix(uHorizon, uZenith, pow(h, 0.55));
          // below the horizon: keep the haze colour
          col = d.y < 0.0 ? uHorizon : col;
          float s = max(dot(d, uSunDir), 0.0);
          col += uSun * (pow(s, 8.0) * 0.18 + pow(s, 64.0) * 0.35);
          col = mix(col, uSun * 2.2, smoothstep(0.9993, 0.9996, s));
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  );
  dome.renderOrder = -10;
  dome.frustumCulled = false;
  group.add(dome);

  // ridges: [radius, base height, peak height, colour tint towards the haze 0..1]
  const rings: [number, number, number, number][] = [[760, -40, 170, 0.42], [1000, -20, 250, 0.62], [1250, 0, 330, 0.78]];
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const haze = new THREE.Color(SKY.horizon), rock = new THREE.Color(0x6f8197), snow = new THREE.Color(0xeef3fa);
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, fog: false });
  for (const [R, base, peak, t] of rings) {
    const seg = 96, pos: number[] = [], col: number[] = [], idx: number[] = [];
    const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const n = 0.55 + 0.25 * Math.sin(a * 3 + ph[0]!) + 0.15 * Math.sin(a * 7 + ph[1]!) + 0.1 * Math.sin(a * 17 + ph[2]!) + 0.12 * (rnd() - 0.5);
      const top = base + peak * Math.max(0.15, n);
      const rr = R * (1 + 0.04 * (rnd() - 0.5));
      const x = center.x + Math.cos(a) * rr, z = center.z + Math.sin(a) * rr;
      const snowLine = base + peak * (0.45 + 0.1 * rnd());
      // three rows: foot, snow line (or a bit below the top), top
      const mid = Math.min(snowLine, top - 8);
      for (const [y, c] of [[center.y + base - 250, rock], [center.y + mid, rock], [center.y + top, snow]] as const) {
        const k = c.clone().lerp(haze, t);
        pos.push(x, y, z); col.push(k.r, k.g, k.b);
      }
    }
    for (let i = 0; i < seg; i++) {
      const a = i * 3, b = a + 3;
      for (let r = 0; r < 2; r++) idx.push(a + r, b + r, a + r + 1, a + r + 1, b + r, b + r + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.renderOrder = -5;
    group.add(m);
  }
  return {
    group, dome,
    update(camera) { dome.position.copy(camera.position); },
  };
}
