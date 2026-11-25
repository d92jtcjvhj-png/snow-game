import type RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { CUBE, SLOPE } from '../core/config';
import { PhysicsCube } from '../physics/cube';
import { createSlope, slopeCenter, slopeRotation, slopeSurfaceY } from '../physics/slope';
import { createPhysicsWorld, type Rapier } from '../physics/world';
import { flat, PALETTE } from '../render/materials';

export interface GameWorld {
  physics: RAPIER.World;
  cube: PhysicsCube;
  cubeMesh: THREE.Mesh;
  step(dt: number): void;
  /** Copy the interpolated physics pose into the meshes. */
  sync(alpha: number): void;
}

const _pa = new THREE.Vector3(), _pb = new THREE.Vector3(), _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();

export function createGameWorld(R: Rapier, scene: THREE.Scene): GameWorld {
  const physics = createPhysicsWorld(R);
  createSlope(R, physics);
  const cube = new PhysicsCube(R, physics);

  // --- slope mesh: same box as the collider ---
  const slopeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(SLOPE.halfWidth * 2, SLOPE.halfThickness * 2, SLOPE.halfLength * 2),
    flat(PALETTE.snow),
  );
  slopeMesh.position.fromArray(slopeCenter());
  slopeMesh.quaternion.fromArray(slopeRotation());
  slopeMesh.receiveShadow = true;
  scene.add(slopeMesh);

  // --- cube mesh ---
  const s = CUBE.half * 2;
  const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), flat(PALETTE.hot));
  cubeMesh.castShadow = true;
  scene.add(cubeMesh);

  addScenery(scene);

  // fell off the bottom of the slope: start again
  const endZ = Math.cos(SLOPE.angle) * SLOPE.halfLength - 2;

  return {
    physics,
    cube,
    cubeMesh,
    step(dt) {
      cube.snapshot();
      physics.timestep = dt;
      physics.step();
      const p = cube.body.translation();
      if (p.z > endZ || p.y < slopeSurfaceY(p.z) - 5) cube.reset();
    },
    sync(alpha) {
      const p = cube.body.translation(), r = cube.body.rotation();
      _pa.set(cube.prevPos.x, cube.prevPos.y, cube.prevPos.z);
      _pb.set(p.x, p.y, p.z);
      _qa.set(cube.prevRot.x, cube.prevRot.y, cube.prevRot.z, cube.prevRot.w);
      _qb.set(r.x, r.y, r.z, r.w);
      cubeMesh.position.lerpVectors(_pa, _pb, alpha);
      cubeMesh.quaternion.slerpQuaternions(_qa, _qb, alpha);
    },
  };
}

/** Low-poly cartoon scenery: pine trees along the sides and a few mountains. Seeded, always the same. */
function addScenery(scene: THREE.Scene): void {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const leaves = [flat(PALETTE.pine), flat(PALETTE.pine2)];
  const trunk = flat(PALETTE.trunk);
  const coneGeo = new THREE.ConeGeometry(1, 1, 6);
  const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.2, 5);
  for (let i = 0; i < 80; i++) {
    const side = rnd() < 0.5 ? -1 : 1;
    const x = side * (SLOPE.halfWidth + 2 + rnd() * 25);
    const z = -SLOPE.halfLength + rnd() * SLOPE.halfLength * 2;
    const y = slopeSurfaceY(z) - 0.2;
    const h = 4 + rnd() * 5;
    const cone = new THREE.Mesh(coneGeo, leaves[i % 2]);
    cone.scale.set(h * 0.32, h, h * 0.32);
    cone.position.set(x, y + h / 2 + 0.8, z);
    cone.castShadow = true;
    const t = new THREE.Mesh(trunkGeo, trunk);
    t.position.set(x, y + 0.5, z);
    scene.add(cone, t);
  }
  // side ground beyond the slope, so trees are not floating
  const ground = new THREE.Mesh(new THREE.BoxGeometry(SLOPE.halfWidth * 2 + 80, 1, SLOPE.halfLength * 2), flat(PALETTE.snowShade));
  ground.position.fromArray(slopeCenter()).add(new THREE.Vector3(0, -0.35, 0));
  ground.quaternion.fromArray(slopeRotation());
  ground.receiveShadow = true;
  scene.add(ground);

  const rock = flat(PALETTE.rock), peak = flat(PALETTE.peak);
  const mtnGeo = new THREE.ConeGeometry(1, 1, 5);
  for (let i = 0; i < 9; i++) {
    const r = 60 + rnd() * 60, h = 70 + rnd() * 80;
    const m = new THREE.Mesh(mtnGeo, i % 2 ? peak : rock);
    m.scale.set(r, h, r);
    m.position.set(-260 + i * 65, slopeSurfaceY(SLOPE.halfLength) - 30 + h / 2, SLOPE.halfLength + 180 + rnd() * 60);
    m.rotation.y = rnd() * 3;
    scene.add(m);
  }
}
