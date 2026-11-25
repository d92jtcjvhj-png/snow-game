import type RAPIER from '@dimforge/rapier3d-compat';
import { DEG, POP, SNOW, START_Z, STEP, TAKEOFF_EDGE, type TrickKind } from '../core/config';
import { Approach, type ApproachPhase } from '../physics/approach';
import { Board } from '../physics/board';
import { dragK } from '../physics/snow';
import { len, v3, type V3 } from '../physics/vec';
import { TERRAIN_GROUPS, createPhysicsWorld, type Rapier } from '../physics/world';
import { BA, LM, heightAt, inLanding, onKicker } from './bigair';
import type { TerrainGrid } from './terrain';

/** Player input for one physics step. The player never steers. */
export interface RunInput {
  /** left thumb down (or Z/X/Space held) */
  charging: boolean;
  /** rotation charge −1..1: side = direction (+ frontside, − backside), |value| = power */
  charge: number;
  /** off-axis stick −1..1 (up = cork / frontflip, down = misty-rodeo / backflip) */
  axis: number;
  /** speed check intensity 0..1 */
  brake: number;
}
export const NO_INPUT: RunInput = { charging: false, charge: 0, axis: 0, brake: 0 };

export type RunPhase = 'ride' | 'air' | 'landed' | 'done';
export type TimingLabel = 'presto' | 'giusto' | 'tardi';
export type EdgeName = 'heel' | 'toe' | 'flat';

export interface TakeoffRecord {
  kind: TrickKind;
  power: number;
  axis: number;
  speed: number;
  popQ: number;
  release: 'perfetto' | 'presto' | 'nessuno' | 'annullato';
  edgeDeg: number;
  edge: EdgeName;
  edgeExpected: EdgeName;
  timing: number | null;
  timingLabel: TimingLabel | null;
  compressed: boolean;
  /** velocity heading vs the kicker axis (deg, + towards +x) */
  headingDeg: number;
  vLat: number;
  /** board vs velocity (deg) */
  skidDeg: number;
  skidding: boolean;
  /** board yaw rate at the lip (rad/s, + = frontside direction for a regular rider) */
  yawRate: number;
  /**
   * How much the set-up carve helps the rotation (0..1; null without a spin). Full with a clean S on the
   * right edge; less if squeezed (late), skidded or on the wrong edge. In Phase 3 it scales the carve's
   * share of the rotation (≈5–15 %, docs/research 05–06); the shoulders do the rest.
   */
  carveHelp: number | null;
  x: number;
}
export interface LandingRecord {
  x: number;
  z: number;
  dKnuckle: number;
  drift: number;
  inLanding: boolean;
  airT: number;
  /** rotation the carve alone would give in this airtime (deg, signed like the trick direction) */
  carveDeg: number;
  /** normal speed into the snow at touchdown (m/s) and equivalent fall height v²/2g (m) */
  impact: number;
  efh: number;
}

const edgeName = (e: number): EdgeName => (Math.abs(e) < 4 * DEG ? 'flat' : e > 0 ? 'heel' : 'toe');
const expected = (k: TrickKind): EdgeName => { const s = TAKEOFF_EDGE[k]; return s > 0 ? 'heel' : s < 0 ? 'toe' : 'flat'; };

/**
 * One attempt on the big air: ride (speed check, charge = automatic set-up carve), pop at the lip,
 * real ballistic flight with any sideways drift, landing → card. No Three.js in here: tests drive it headless.
 */
export class Run {
  readonly world: RAPIER.World;
  readonly board: Board;
  readonly approach = new Approach();
  phase: RunPhase = 'ride';
  t = 0;
  /** path length ridden (m) */
  s = 0;
  airT = 0;
  takeoff: TakeoffRecord | null = null;
  landing: LandingRecord | null = null;
  /** live state for the HUD */
  power = 0;
  approachPhase: ApproachPhase = 'none';
  note = '';
  private wasHeld = false;
  private chargeOn = false;
  private kind: TrickKind = 'straight';
  private pending: { q: number; power: number; axis: number } | null = null;
  private landedT = 0;

  constructor(R: Rapier, grid: TerrainGrid) {
    this.world = createPhysicsWorld(R);
    const ground = this.world.createRigidBody(R.RigidBodyDesc.fixed());
    this.world.createCollider(
      R.ColliderDesc.trimesh(grid.positions, grid.indices, R.TriMeshFlags.FIX_INTERNAL_EDGES).setCollisionGroups(TERRAIN_GROUPS),
      ground,
    );
    this.board = new Board(R, this.world, { heightAt });
    this.reset();
  }

  reset(startZ: number = START_Z, startSpeed = 0): void {
    this.board.reset(0, heightAt(0, startZ), startZ);
    if (startSpeed > 0) this.board.body.setLinvel({ x: 0, y: -Math.tan(0) * startSpeed, z: startSpeed }, true);
    this.approach.stop();
    this.phase = 'ride';
    this.t = this.s = this.airT = this.power = 0;
    this.takeoff = this.landing = null;
    this.pending = null;
    this.chargeOn = this.wasHeld = false;
    this.kind = 'straight';
    this.approachPhase = 'none';
    this.note = '';
  }

  /** Advance one fixed step. */
  step(inp: RunInput, dt: number = STEP): void {
    if (this.phase === 'done') return;
    this.t += dt;
    const b = this.board, p0 = b.position();
    const held = inp.charging, pressed = held && !this.wasHeld, released = !held && this.wasHeld;
    this.wasHeld = held;
    const v = b.speed();

    if (this.phase === 'ride') {
      const beforeLip = p0.z < LM.zLip;
      if (pressed && beforeLip && !this.pending) { this.chargeOn = true; this.note = ''; }
      if (this.chargeOn && held) {
        this.power = Math.abs(inp.charge) >= POP.DEAD ? Math.abs(inp.charge) : 0;
        // the set-up carve starts as soon as the charge has a side
        if (!this.approach.active && this.power > 0) {
          const side = inp.charge > 0 ? 1 : -1;
          this.approach.start(side, BA.kickerBase - p0.z, v, this.s);
        }
      }
      if (released && this.chargeOn) {
        this.chargeOn = false;
        const kind = this.trickKind(inp);
        if (p0.z < BA.kickerBase) {
          // let go before the kicker: the rider aborts the set-up and straightens up
          this.approach.stop();
          this.note = 'Carica annullata: stacca il pollice sul kicker';
        } else if (beforeLip) {
          const vz = Math.max(1, b.velocity().z);
          const tLip = (LM.zLip - p0.z) / vz;
          const q = tLip <= POP.WINDOW ? 1 : Math.max(0.25, 1 - (tLip - POP.WINDOW) / 0.5);
          this.pending = { q, power: this.power, axis: inp.axis };
          this.kind = kind;
        }
      }
      const onRamp = p0.z >= BA.kickerBase;
      const cmd = this.approach.command(this.s, onRamp, this.power, v, b.aN, b.travelHeading());
      this.approachPhase = cmd.phase;
      b.preStep({ kappa: cmd.kappa, edge: cmd.edge, brake: inp.brake, tuck: this.chargeOn }, dt);
      this.world.step();
      b.postStep();
      this.s += v * dt;
      const p1 = b.position();
      if (p0.z < LM.zLip && p1.z >= LM.zLip && onKicker(p1.x, LM.zLip - 0.01)) this.launch(inp);
      else if (p1.z > LM.zKnuckle + 2 && !this.takeoff) { this.note = 'Sei passato di fianco al kicker'; this.phase = 'done'; }
    } else if (this.phase === 'air') {
      b.preStep({ kappa: 0, edge: 0, brake: 0, tuck: false }, dt);
      this.world.step();
      b.postStep();
      this.airT += dt;
      if (b.touchedDown && this.airT > 0.15) this.land();
    } else if (this.phase === 'landed') {
      b.preStep({ kappa: 0, edge: 0, brake: 0, tuck: false }, dt);
      this.world.step();
      b.postStep();
      if (this.t - this.landedT > 1.2) this.phase = 'done';
    }
    if (this.t > 90) this.phase = 'done';
  }

  private trickKind(inp: RunInput): TrickKind {
    if (this.approach.side > 0) return 'frontside';
    if (this.approach.side < 0) return 'backside';
    return Math.abs(inp.axis) >= POP.AXIS_DEAD ? 'flip' : 'straight';
  }

  private launch(inp: RunInput): void {
    const b = this.board;
    const kind = this.pending ? this.kind : this.chargeOn ? this.trickKind(inp) : 'straight';
    const exp = expected(kind);
    const actual = edgeName(b.edge);
    // a rushed (skidding) or wrong-edge takeoff loses pop: there is nothing solid to push from
    const setupQ = this.approach.active ? this.approach.quality : 1;
    const wrongEdge = exp !== 'flat' && actual !== exp;
    const edgeQ = (b.skidding ? 0.6 : 1) * (wrongEdge ? 0.75 : 1) * setupQ;
    const spin = kind === 'frontside' || kind === 'backside';
    const carveHelp = spin ? (this.approach.active ? setupQ : 0.4) * (wrongEdge ? 0.5 : 1) * (b.skidding ? 0.7 : 1) : null;
    const q = this.pending ? this.pending.q : 0;
    const pop = POP.SPEED * q * edgeQ;
    const n = b.normal;
    b.body.applyImpulse({ x: n.x * pop * SNOW.MASS, y: n.y * pop * SNOW.MASS, z: n.z * pop * SNOW.MASS }, true);
    const vel = b.velocity();
    const travel = Math.atan2(vel.x, vel.z);
    this.takeoff = {
      kind,
      power: this.pending ? this.pending.power : this.power,
      axis: this.pending ? this.pending.axis : inp.axis,
      speed: len(vel),
      popQ: q * edgeQ,
      release: this.pending ? (this.pending.q >= 1 ? 'perfetto' : 'presto') : this.chargeOn ? 'nessuno' : 'nessuno',
      edgeDeg: b.edge / DEG,
      edge: actual,
      edgeExpected: exp,
      timing: this.approach.active ? this.approach.timing : null,
      timingLabel: this.approach.active ? (this.approach.timing > 0.35 ? 'presto' : this.approach.timing < -0.35 ? 'tardi' : 'giusto') : null,
      compressed: this.approach.compressed,
      headingDeg: travel / DEG,
      vLat: vel.x,
      skidDeg: Math.atan2(Math.sin(b.psi - travel), Math.cos(b.psi - travel)) / DEG,
      skidding: b.skidding,
      yawRate: b.yawRate,
      carveHelp,
      x: b.position().x,
    };
    this.approach.stop();
    this.chargeOn = false;
    this.pending = null;
    this.phase = 'air';
    this.airT = 0;
  }

  private land(): void {
    const p = this.board.position();
    const tk = this.takeoff!;
    this.landing = {
      x: p.x, z: p.z,
      dKnuckle: p.z - LM.zKnuckle,
      drift: p.x - tk.x,
      inLanding: inLanding(p.x, p.z),
      airT: this.airT,
      carveDeg: (tk.yawRate * this.airT) / DEG,
      impact: this.board.impactSpeed,
      efh: this.board.impactSpeed ** 2 / (2 * 9.81),
    };
    this.phase = 'landed';
    this.landedT = this.t;
  }

  /** Ballistic prediction of the landing point from the current state (training ring). */
  predict(): V3 | null {
    const p = this.board.position(), v = this.board.velocity();
    let { x, y, z } = p, vx = v.x, vy = v.y, vz = v.z;
    const k = dragK(), dt = 1 / 60;
    for (let i = 0; i < 600; i++) {
      const sp = Math.hypot(vx, vy, vz);
      vx -= k * sp * vx * dt; vz -= k * sp * vz * dt; vy -= (9.81 + k * sp * vy) * dt;
      x += vx * dt; y += vy * dt; z += vz * dt;
      if (i > 3 && y <= heightAt(x, z)) return v3(x, heightAt(x, z), z);
    }
    return null;
  }
}
