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
