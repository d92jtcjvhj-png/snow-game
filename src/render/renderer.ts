import * as THREE from 'three';
import { PALETTE } from './materials';
import { QualityManager, type Tier, type TierSettings } from './quality';

export interface Renderer {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  sun: THREE.DirectionalLight;
  quality: QualityManager;
  resize(camera: THREE.PerspectiveCamera): void;
  /** Keep the sun's shadow box centred on a point (the cube / the rider). */
  follow(target: THREE.Vector3): void;
}

export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const initial = QualityManager.guess();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: initial !== 'low', powerPreference: 'high-performance' });
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.sky);
  scene.fog = new THREE.Fog(PALETTE.fog, 70, 320);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7f97b2, 1.6));
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.2);
  sun.position.set(-20, 40, -15);
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -20; sc.right = sc.top = 20; sc.near = 1; sc.far = 120;
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);

  let lastCam: THREE.PerspectiveCamera | null = null;
  const apply = (_t: Tier, s: TierSettings) => {
    renderer.setPixelRatio(Math.min(s.maxPixelRatio, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = s.shadows;
    sun.castShadow = s.shadows;
    sun.shadow.mapSize.set(s.shadowMapSize, s.shadowMapSize);
    sun.shadow.map?.dispose();
    sun.shadow.map = null;
    // materials must recompile when shadows are toggled
    scene.traverse((o) => { if (o instanceof THREE.Mesh) (o.material as THREE.Material).needsUpdate = true; });
    if (lastCam) resize(lastCam);
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

  const offset = new THREE.Vector3(-20, 40, -15);
  return {
    renderer, scene, sun, quality, resize,
    follow(target) {
      sun.target.position.copy(target);
      sun.position.copy(target).add(offset);
    },
  };
}
