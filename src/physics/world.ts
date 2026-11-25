import RAPIER from '@dimforge/rapier3d-compat';
import { GRAVITY, STEP } from '../core/config';

export type Rapier = typeof RAPIER;

let ready: Promise<Rapier> | null = null;

/** Load the Rapier WASM (embedded in the compat build) once. */
export function initRapier(): Promise<Rapier> {
  ready ??= RAPIER.init().then(() => RAPIER);
  return ready;
}

export function createPhysicsWorld(R: Rapier): RAPIER.World {
  const world = new R.World({ x: 0, y: -GRAVITY, z: 0 });
  world.timestep = STEP;
  return world;
}

/**
 * Collision groups (16-bit memberships << 16 | 16-bit filter).
 * Terrain: group 1, collides with nothing (the snow contact is our analytic constraint; the trimesh stays
 * available for ray queries and future props). Board: group 2, collides with everything except terrain.
 */
export const TERRAIN_GROUPS = (0x0001 << 16) | 0x0000;
export const BOARD_GROUPS = (0x0002 << 16) | (0xffff & ~0x0001);
