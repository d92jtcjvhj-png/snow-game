import type RAPIER from '@dimforge/rapier3d-compat';
import { BOARD_GROUPS } from './world';
import { BOARD, DEG, GRAVITY, SNOW } from '../core/config';
import { dragK, lateralImpulse, longitudinalImpulse } from './snow';
import { add, clamp, cross, dot, len, norm, quatFromBasis, scale, sub, v3, wrap, type Q4, type V3 } from './vec';
import type { Rapier } from './world';

/** The snow surface, analytic: the same function the terrain mesh is built from. */
export interface Ground {
  heightAt(x: number, z: number): number;
}

export interface BoardCmd {
  /** path curvature requested by the rider (1/m), + = towards +x */
  kappa: number;
  /** edge angle requested (rad), + = heel */
  edge: number;
  /** speed check intensity 0..1 */
  brake: number;
  /** compact pose (less drag) */
  tuck: boolean;
}

/**
 * The snowboard. Rapier integrates the body (gravity) and will handle collisions with objects (rails, nets).
 * The snow contact is ours: an exact, smooth constraint on the analytic surface h(x, z) — the same function
 * the terrain mesh is built from (a ball on the faceted trimesh lost energy at random on triangle edges).
 * Also ours: orientation (surface normal + yaw), and every tangential force as impulses:
 * anisotropic friction (longitudinal μ vs lateral grip by edge angle, skid beyond the limit),
 * carve yaw, speed check, aerodynamic drag. The edge angle is a parameter: it does not tilt the collider.
 */
export class Board {
  readonly body: RAPIER.RigidBody;
  readonly collider: RAPIER.Collider;
  /** board heading in the horizontal plane: forward = (sin ψ, 0, cos ψ) */
  psi = 0;
  /** edge angle (rad), + heel / − toe */
  edge = 0;
  grounded = false;
  normal: V3 = v3(0, 1, 0);
  /** normal acceleration (m/s²) used for grip */
  aN = GRAVITY;
  /** vertical curvature of the path (1/m, + concave) */
  private kv = 0;
  skidding = false;
  /** +1 riding regular (nose first), −1 riding switch (tail first): set after a 180-type landing */
  stance: 1 | -1 = 1;
  /** lateral acceleration felt by the rider (m/s², + towards +x): drives the visual lean */
  aLat = 0;
  /** board yaw rate (rad/s) */
  yawRate = 0;
  prevPos: V3 = v3();
  prevRot: Q4 = { x: 0, y: 0, z: 0, w: 1 };
  private rot: Q4 = { x: 0, y: 0, z: 0, w: 1 };
  /** normal speed at the last touchdown (m/s, ≥ 0): impact for the landing (equivalent fall height) */
  impactSpeed = 0;
  touchedDown = false;

  constructor(R: Rapier, world: RAPIER.World, private readonly ground: Ground) {
    this.body = world.createRigidBody(R.RigidBodyDesc.dynamic().lockRotations().setCcdEnabled(true).setCanSleep(false));
    // A single contact point under the rider: a long rigid shape on a concave transition touches with its
    // nose on the steeper part and gets braked by the contact solver (measured: ~2 m/s² extra on the kicker).
    const desc = R.ColliderDesc.ball(BOARD.RADIUS)
      .setMass(SNOW.MASS)
      .setFriction(0)
      .setFrictionCombineRule(R.CoefficientCombineRule.Min)
      .setRestitution(0)
      .setRestitutionCombineRule(R.CoefficientCombineRule.Min);
    // the terrain collider is in group 1 and does not touch the board: the snow contact is ours
    this.collider = world.createCollider(desc.setCollisionGroups(BOARD_GROUPS), this.body);
  }

  /** Place the board at rest on the surface at (x, y, z), pointing downhill. */
  reset(x: number, y: number, z: number): void {
    this.psi = 0; this.edge = 0; this.kv = 0; this.aLat = 0; this.yawRate = 0; this.stance = 1;
    this.normal = v3(0, 1, 0);
    this.body.setTranslation({ x, y: y + BOARD.RADIUS, z }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.probe();
    this.applyRotation();
    this.snapshot();
  }

  position(): V3 { const p = this.body.translation(); return v3(p.x, p.y, p.z); }
  velocity(): V3 { const v = this.body.linvel(); return v3(v.x, v.y, v.z); }
  speed(): number { return len(this.velocity()); }
  rotation(): Q4 { return this.rot; }
  /** direction of travel in the horizontal plane (rad) */
  travelHeading(): number { const v = this.velocity(); return Math.atan2(v.x, v.z); }

  snapshot(): void {
    this.prevPos = this.position();
    this.prevRot = { ...this.rot };
  }

  /** Exact surface normal at (x, z) from the analytic height. */
  private surfaceNormal(x: number, z: number): V3 {
    const e = 0.05, h = this.ground.heightAt.bind(this.ground);
    return norm(v3(-(h(x + e, z) - h(x - e, z)) / (2 * e), 1, -(h(x, z + e) - h(x, z - e)) / (2 * e)));
  }

  /** Height of the board centre above the snow, measured along the normal (m). */
  private clearance(p: V3, n: V3): number {
    return (p.y - this.ground.heightAt(p.x, p.z)) * n.y - BOARD.RADIUS;
  }

  /** Grounded flag + surface normal. */
  private probe(): void {
    const p = this.position(), v = this.velocity();
    const n = this.surfaceNormal(p.x, p.z);
    // on the snow when touching (5 cm tolerance) and not moving away from the surface
    this.grounded = this.clearance(p, n) < 0.05 && dot(v, n) < 0.5;
    if (this.grounded) this.normal = n;
    else this.normal = norm(add(scale(this.normal, 0.9), v3(0, 0.1, 0)));
  }

  /** Vertical curvature of the surface along the travel direction (1/m, + concave). */
  private pathCurvature(p: V3, heading: number): number {
    const e = 0.5, sx = Math.sin(heading) * e, sz = Math.cos(heading) * e;
    const h0 = this.ground.heightAt(p.x, p.z);
    const hp = this.ground.heightAt(p.x + sx, p.z + sz), hm = this.ground.heightAt(p.x - sx, p.z - sz);
    const d1 = (hp - hm) / (2 * e), d2 = (hp - 2 * h0 + hm) / (e * e);
    return d2 / Math.pow(1 + d1 * d1, 1.5);
  }

  /**
   * Snow contact, after world.step(): no penetration, no velocity into the snow (inelastic, like snow).
   * Records the normal speed at touchdown for the landing.
   */
  postStep(): void {
    const p = this.position();
    const n = this.surfaceNormal(p.x, p.z);
    const c = this.clearance(p, n);
    this.touchedDown = false;
    if (c < 0) {
      this.body.setTranslation({ x: p.x, y: p.y - c / n.y, z: p.z }, true);
      const v = this.velocity(), vn = dot(v, n);
      if (vn < 0) {
        this.impactSpeed = -vn;
        this.touchedDown = true;
        this.body.setLinvel(sub(v, scale(n, vn)), true);
      }
    }
  }

  /** Board axes on the surface for the current heading. */
  private axes(): { f: V3; l: V3; n: V3 } {
    const n = this.normal;
    // project the heading VERTICALLY onto the surface: seen from above, the board still points at ψ
    // (an orthogonal projection would bend it on a slope, and the velocity would chase it)
    const sx = Math.sin(this.psi), sz = Math.cos(this.psi);
    const f = norm(v3(sx, -(n.x * sx + n.z * sz) / Math.max(0.2, n.y), sz));
    return { f, l: cross(n, f), n };
  }

  private applyRotation(): void {
    const { f, l, n } = this.axes();
    this.rot = quatFromBasis(l, n, f);
    this.body.setRotation(this.rot, true);
  }

  /** Apply the snow forces for one step (call before world.step()). */
  preStep(cmd: BoardCmd, dt: number): void {
    this.snapshot();
    this.probe();
    const v = this.velocity(), speed = len(v), m = SNOW.MASS;
    let dv = v3();
    const psi0 = this.psi;

    if (this.grounded) {
      const { f } = this.axes();
      // normal load: gravity + centripetal on concave transitions (kicker, landing run-out)
      this.kv = this.pathCurvature(this.position(), speed > 0.5 ? Math.atan2(v.x, v.z) : this.psi);
      const vf = dot(v, f);
      this.aN = Math.max(0, GRAVITY * this.normal.y + vf * vf * this.kv);

      // edge: speed check (heel edge) overrides the rider's carve
      const braking = cmd.brake > 0.02;
      const edgeTarget = braking ? BOARD.CHECK_EDGE_MIN + (BOARD.CHECK_EDGE_MAX - BOARD.CHECK_EDGE_MIN) * cmd.brake : cmd.edge;
      this.edge += clamp(edgeTarget - this.edge, -SNOW.EDGE_RATE * dt, SNOW.EDGE_RATE * dt);

      // yaw (when almost stopped, "travel" is the fall line)
      const fall = Math.atan2(this.normal.x, this.normal.z);
      const travelDir = speed > 1 ? Math.atan2(v.x, v.z) : fall;
      // the board's nose points along the travel when regular, against it when switch
      const travel = this.stance < 0 ? wrap(travelDir + Math.PI) : travelDir;
      if (braking) {
        // fully across, on the heel edge (+ψ for a regular rider)
        const target = travel + BOARD.CHECK_ANGLE;
        this.psi += clamp(wrap(target - this.psi), -BOARD.CHECK_YAW_RATE * dt, BOARD.CHECK_YAW_RATE * dt);
      } else {
        this.psi += cmd.kappa * vf * dt;
        const off = wrap(travel - this.psi);
        if (Math.abs(cmd.kappa) < 1e-4 || Math.abs(off) > SNOW.SKID_ANGLE) {
          // not carving (or coming out of a speed check): the rider pivots the board back in line with
          // the direction of travel, so a check never sends him sideways
          this.psi += clamp(off, -BOARD.CHECK_YAW_RATE * dt, BOARD.CHECK_YAW_RATE * dt);
        }
      }
      this.psi = wrap(this.psi);

      // tangential forces in the (new) board frame
      const ax = this.axes();
      const vF = dot(v, ax.f), vL = dot(v, ax.l);
      const off = Math.abs(wrap(this.psi - travel));
      // skid: speed check, a big misalignment, or the board pivoting back in line (no carve): the edge is
      // not holding a turn, so the snow brakes along the travel direction instead of deflecting it
      const sliding = braking || off > SNOW.SKID_ANGLE || (Math.abs(cmd.kappa) < 1e-4 && off > 0.5 * DEG);
      if (sliding) {
        // the board slides across its edge; the snow brakes along the direction of travel, never
        // deflecting it (the rider does not steer). Cutting force N·tanΨ·sinγ (Komissarov 2021) for a
        // speed check; a plain skid uses MU_SKID.
        const across = Math.abs(Math.sin(wrap(this.psi - travel)));
        const vt = sub(v, scale(this.normal, dot(v, this.normal)));
        const vtl = len(vt);
        const mu = braking ? Math.tan(Math.abs(this.edge)) * across + SNOW.MU_LONG * (1 - across) : SNOW.MU_SKID * across + SNOW.MU_LONG * (1 - across);
        const budget = mu * this.aN * dt;
        if (braking && vtl < 0.3) {
          // (almost) stopped: static hold against the slope as long as the edge angle can take it
          const g = v3(0, -GRAVITY, 0), gt = sub(g, scale(this.normal, dot(g, this.normal)));
          const need = add(vt, scale(gt, dt)), nl = len(need);
          if (nl > 1e-9) dv = add(dv, scale(need, -Math.min(nl, budget) / nl));
        } else if (vtl > 1e-6) {
          dv = add(dv, scale(vt, -Math.min(vtl, budget) / vtl));
        }
        this.skidding = across > 0.3;
        this.aLat = 0;
      } else {
        const lat = lateralImpulse(vL, this.edge, this.aN, dt);
        this.skidding = lat.skidding;
        dv = add(dv, scale(ax.l, lat.dv));
        dv = add(dv, scale(ax.f, longitudinalImpulse(vF, this.aN, dt)));
        this.aLat = (lat.dv / dt) * ax.l.x;
      }
    } else {
      this.skidding = false;
      this.aLat = 0;
      this.edge += clamp(-this.edge, -SNOW.EDGE_RATE * dt, SNOW.EDGE_RATE * dt);
    }

    // aerodynamic drag
    const k = dragK(cmd.tuck ? SNOW.CDA_TUCK : SNOW.CDA);
    dv = add(dv, scale(v, -k * speed * dt));

    this.body.applyImpulse(scale(dv, m), true);
    this.yawRate = wrap(this.psi - psi0) / dt;
    this.applyRotation();
  }
}
