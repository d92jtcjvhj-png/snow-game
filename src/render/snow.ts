import * as THREE from 'three';
import type { Tier } from './quality';

/**
 * Snow material (docs/research 16): a patched MeshLambertMaterial, no PBR on the terrain.
 *  - wrap diffuse (GPU Gems ch. 16): light bleeds a little past the terminator, a cheap stand-in for
 *    the scattering inside snow, so the slope never turns flat grey (all tiers);
 *  - fine grain: a light value noise on the world position (all tiers);
 *  - groomer corduroy: ribs along the fall line on the prepared piste, fading with distance (medium, high);
 *  - sparkle: rare grains with their own tilted normal flash towards the sun, near the camera only
 *    (medium, high).
 * The albedo, the sky occlusion and the groomed mask come baked in the vertex attributes (snowBake).
 */
export interface SnowMaterial {
  material: THREE.MeshLambertMaterial;
  /** direction towards the sun (world, unit) */
  sunDir: THREE.Vector3;
  setTier(tier: Tier): void;
}

const WRAP = 0.35;

export function createSnowMaterial(tier: Tier): SnowMaterial {
  const sunDir = new THREE.Vector3(0, 1, 0);
  const material = new THREE.MeshLambertMaterial({ vertexColors: true, dithering: true });
  let current = tier;
  const flags = () => ({ cord: current !== 'low', sparkle: current !== 'low' });
  material.customProgramCacheKey = () => 'snow-' + current;
  material.onBeforeCompile = (shader) => {
    const f = flags();
    shader.defines = { ...(shader.defines ?? {}), SNOW_WRAP: WRAP.toFixed(2), ...(f.cord ? { SNOW_CORD: 1 } : {}), ...(f.sparkle ? { SNOW_SPARKLE: 1 } : {}) };
    shader.uniforms.uSunDir = { value: sunDir };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float groom;\nvarying vec3 vWPos;\nvarying vec3 vWNormal;\nvarying float vGroom;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWNormal = normalize(mat3(modelMatrix) * objectNormal);\nvGroom = groom;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vWPos;
varying vec3 vWNormal;
varying float vGroom;
uniform vec3 uSunDir;
float snowHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float snowNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(snowHash(i), snowHash(i + vec2(1.0, 0.0)), u.x), mix(snowHash(i + vec2(0.0, 1.0)), snowHash(i + vec2(1.0, 1.0)), u.x), u.y);
}`)
      .replace('float dotNL = saturate( dot( geometryNormal, directLight.direction ) );',
        'float dotNL = saturate( ( dot( geometryNormal, directLight.direction ) + SNOW_WRAP ) / ( 1.0 + SNOW_WRAP ) );')
      .replace('#include <color_fragment>', `#include <color_fragment>
{
  float camD = distance(cameraPosition, vWPos);
  // grain: two octaves of value noise, fading out far away
  float grain = snowNoise(vWPos.xz * 3.1) * 0.6 + snowNoise(vWPos.xz * 11.0) * 0.4;
  diffuseColor.rgb *= 1.0 + (grain - 0.5) * 0.05 * smoothstep(60.0, 8.0, camD);
#ifdef SNOW_CORD
  // corduroy: ribs along the fall line (z), groomer passes 4 m wide with a faint seam
  float rib = 0.5 + 0.5 * sin(vWPos.x * 6.2832 / 0.22);
  float pass = abs(fract(vWPos.x / 4.0) - 0.5) * 2.0;
  float cord = (rib * 0.035 + smoothstep(0.92, 1.0, pass) * 0.04) * vGroom * smoothstep(45.0, 6.0, camD);
  diffuseColor.rgb *= 1.0 - cord;
#endif
}`)
      .replace('#include <opaque_fragment>', `#ifdef SNOW_SPARKLE
{
  vec3 V = normalize(cameraPosition - vWPos);
  float camD = distance(cameraPosition, vWPos);
  vec2 cp = vWPos.xz * 22.0, cell = floor(cp);
  float h = snowHash(cell);
  // a point-like grain inside the cell, not the whole cell
  float dot2 = length(fract(cp) - 0.5);
  if (h > 0.975 && camD < 30.0 && dot2 < 0.18) {
    vec3 rn = normalize(vWNormal + 0.7 * (vec3(snowHash(cell + 7.1), snowHash(cell + 3.3), snowHash(cell + 5.7)) - 0.5));
    float g = pow(max(dot(reflect(-uSunDir, rn), V), 0.0), 60.0);
    float lit = saturate(dot(vWNormal, uSunDir) * 3.0);
    outgoingLight += vec3(1.0, 0.96, 0.88) * g * lit * 1.6 * smoothstep(30.0, 6.0, camD) * smoothstep(0.18, 0.05, dot2);
  }
}
#endif
#include <opaque_fragment>`);
  };
  return {
    material, sunDir,
    setTier(t) { if (t !== current) { current = t; material.needsUpdate = true; } },
  };
}
