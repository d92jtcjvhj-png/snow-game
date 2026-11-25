import type RAPIER from '@dimforge/rapier3d-compat';
import { CUBE, SNOW_MU } from '../core/config';
import { slopeRotation, slopeSurfaceY } from './slope';
import type { Rapier } from './world';

export interface Vec3 { x: number; y: number; z: number }
export interface Quat { x: number; y: number; z: number; w: number }

/** A dynamic cube that keeps its previous pose, so the renderer can interpolate. */
export class PhysicsCube {
  readonly body: RAPIER.RigidBody;
  prevPos: Vec3 = { x: 0, y: 0, z: 0 };
  prevRot: Quat = { x: 0, y: 0, z: 0, w: 1 };

  constructor(R: Rapier, world: RAPIER.World) {
    this.body = world.createRigidBody(R.RigidBodyDesc.dynamic().setCanSleep(false));
    const desc = R.ColliderDesc.cuboid(CUBE.half, CUBE.half, CUBE.half)
      .setDensity(600) // ~75 kg for a 0.5 m half-size cube: same mass as the legacy rider
      .setFriction(SNOW_MU)
      .setFrictionCombineRule(R.CoefficientCombineRule.Min);
    world.createCollider(desc, this.body);
    this.reset();
  }

  /** Put the cube at rest at the top of the slope, aligned with the surface. */
  reset(): void {
    const z = CUBE.startZ;
    const [qx, qy, qz, qw] = slopeRotation();
    // centre half a cube above the surface along its normal (+1 cm so it settles without overlap)
    const a = Math.atan2(qx, qw) * 2, h = CUBE.half + 0.01;
    this.body.setTranslation({ x: 0, y: slopeSurfaceY(z) + Math.cos(a) * h, z: z + Math.sin(a) * h }, true);
    this.body.setRotation({ x: qx, y: qy, z: qz, w: qw }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0.3, z: 0 }, true); // a slight twist, so the 3D motion is visible
    this.snapshot();
  }

  /** Call before each physics step. */
  snapshot(): void {
    const p = this.body.translation(), r = this.body.rotation();
    this.prevPos = { x: p.x, y: p.y, z: p.z };
    this.prevRot = { x: r.x, y: r.y, z: r.z, w: r.w };
  }

  speed(): number {
    const v = this.body.linvel();
    return Math.hypot(v.x, v.y, v.z);
  }
}
