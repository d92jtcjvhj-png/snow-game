import * as THREE from 'three';

/** Low-poly cartoon palette (taken from the legacy prototype). */
export const PALETTE = {
  sky: 0xa9cde8,
  fog: 0xd6e6f2,
  snow: 0xf4f8fc,
  snowShade: 0xdfe9f3,
  hot: 0xff5a36,
  blue: 0x2c7be5,
  pine: 0x2f5d4a,
  pine2: 0x3d7059,
  trunk: 0x5b4636,
  rock: 0x8ea3b8,
  peak: 0xe9f1f8,
} as const;

const cache = new Map<number, THREE.MeshLambertMaterial>();

/** Shared flat-shaded material for a colour: faceted low-poly look, cheap on phones. */
export function flat(color: number): THREE.MeshLambertMaterial {
  let m = cache.get(color);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color, flatShading: true });
    cache.set(color, m);
  }
  return m;
}
