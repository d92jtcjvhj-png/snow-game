import * as THREE from 'three';
import { QualityManager, type Tier, type TierSettings } from './quality';
import { SKY } from './sky';

export interface Renderer {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  sun: THREE.DirectionalLight;
  quality: QualityManager;
  /** direction towards the sun (world, unit): shared with the sky and the snow shader */
  sunDir: THREE.Vector3;
  /** called after every quality change (materials with per-tier variants) */
  onTier: ((t: Tier) => void)[];
  resize(camera: THREE.PerspectiveCamera): void;
  /** Keep the sun's shadow box centred on a point (the cube / the rider). */
  follow(target: THREE.Vector3): void;
}

export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const initial = QualityManager.guess();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: initial !== 'low', powerPreference: 'high-performance' });
  // r187 removed PCFSoftShadowMap (it fell back to PCF with a warning)
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // tone mapping (docs/research 16): Neutral keeps the pastel hues and lets bright snow roll off instead of clipping
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.18;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SKY.horizon);
  scene.fog = new THREE.Fog(SKY.horizon, 90, 420);
  // clear morning: low warm sun from the downhill side, three-quarters to the side camera (never behind it);
  // the sky fills the shadows with blue, the snow bounces a bright neutral light from below
  const sunDir = new THREE.Vector3(0.38, 0.5, 0.78).normalize();
  scene.add(new THREE.HemisphereLight(0x9fc3f0, 0xdfe7f0, 1.2));
  const sun = new THREE.DirectionalLight(0xfff0dc, 2.8);
  sun.position.copy(sunDir).multiplyScalar(60);
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -18; sc.right = sc.top = 18; sc.near = 1; sc.far = 140;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  const onTier: ((t: Tier) => void)[] = [];

  let lastCam: THREE.PerspectiveCamera | null = null;
  const apply = (t: Tier, s: TierSettings) => {
    renderer.setPixelRatio(Math.min(s.maxPixelRatio, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = s.shadows;
    sun.castShadow = s.shadows;
    sun.shadow.mapSize.set(s.shadowMapSize, s.shadowMapSize);
    sun.shadow.map?.dispose();
    sun.shadow.map = null;
    // materials must recompile when shadows are toggled
    scene.traverse((o) => { if (o instanceof THREE.Mesh) (o.material as THREE.Material).needsUpdate = true; });
    if (lastCam) resize(lastCam);
    for (const f of onTier) f(t);
  };
  const quality = new QualityManager(apply, initial);

  function resize(camera: THREE.PerspectiveCamera) {
    lastCam = camera;
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  apply(quality.tier, quality.settings);

  const offset = sunDir.clone().multiplyScalar(60);
  return {
    renderer, scene, sun, quality, resize, sunDir, onTier,
    follow(target) {
      sun.target.position.copy(target);
      sun.position.copy(target).add(offset);
    },
  };
}
