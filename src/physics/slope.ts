import type RAPIER from '@dimforge/rapier3d-compat';
import { SLOPE, SNOW_MU } from '../core/config';
import type { Rapier } from './world';

/**
 * Plane slope going downhill along +z (legacy convention: z = downhill, y = up).
 * The top surface passes through the origin: surfaceY(z) = -z * tan(angle).
 * Mesh and collider are both built from SLOPE + these helpers, so they never diverge.
 */
export function slopeSurfaceY(z: number, angle = SLOPE.angle): number {
  return -z * Math.tan(angle);
}

/** Rotation of the slope around +x, as a quaternion [x, y, z, w]. */
export function slopeRotation(angle = SLOPE.angle): [number, number, number, number] {
  return [Math.sin(angle / 2), 0, 0, Math.cos(angle / 2)];
}

/** Centre of the slope box, so that its top face passes through the origin. */
export function slopeCenter(angle = SLOPE.angle): [number, number, number] {
  // top-face normal after rotation = (0, cos a, sin a); move the box down by halfThickness along it
  const h = SLOPE.halfThickness;
  return [0, -Math.cos(angle) * h, -Math.sin(angle) * h];
}

export function createSlope(R: Rapier, world: RAPIER.World): RAPIER.Collider {
  const [qx, qy, qz, qw] = slopeRotation();
  const [cx, cy, cz] = slopeCenter();
  const body = world.createRigidBody(
    R.RigidBodyDesc.fixed().setTranslation(cx, cy, cz).setRotation({ x: qx, y: qy, z: qz, w: qw }),
  );
  const desc = R.ColliderDesc.cuboid(SLOPE.halfWidth, SLOPE.halfThickness, SLOPE.halfLength)
    .setFriction(SNOW_MU)
    .setFrictionCombineRule(R.CoefficientCombineRule.Min);
  return world.createCollider(desc, body);
}
