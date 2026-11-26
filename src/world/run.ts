import type RAPIER from '@dimforge/rapier3d-compat';
import { APPROACH, DEG, POP, SNOW, START_Z, STEP, TAKEOFF_EDGE, type TrickKind } from '../core/config';
import { Approach, type ApproachPhase } from '../physics/approach';
import { Board } from '../physics/board';
import { evaluateLanding, type LandingCause, type LandingQuality } from '../physics/landing';
import { airQuat, initSpin, stepSpin, type GrabId, type SpinState } from '../physics/spin';
import { qAxis, qMul, qRot, type Q4 } from '../physics/vec';
import { dragK } from '../physics/snow';
import { len, v3, type V3 } from '../physics/vec';
import { TERRAIN_GROUPS, createPhysicsWorld, type Rapier } from '../physics/world';
import { BA, LM, heightAt, inLanding, onKicker } from './bigair';
import type { TerrainGrid } from './terrain';
import { trickName } from './trickName';

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
  /** grab held in the air */
  grab?: GrabId | null;
}
export const NO_INPUT: RunInput = { charging: false, charge: 0, axis: 0, brake: 0, grab: null };

export type RunPhase = 'ride' | 'air' | 'landed' | 'crash' | 'done';
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
  /** trick and landing judgment (Phase 3) */
  trick: string;
  deg: number;
  realDeg: number;
  inv: number;
  grab: string | null;
  grabTime: number;
  quality: LandingQuality;
  cause: LandingCause;
  yawErr: number;
  tiltErr: number;
  yawSigned: number;
  switchLand: boolean;
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
  /** rotation in the air (null on the snow) */
  spin: SpinState | null = null;
  /** board orientation at the lip, the frame the air rotation is applied to */
  private takeoffYaw = 0;
  private takeoffPitch = 0;
  /** training: landing tolerance ×1.7 */
  tolerance = false;
  /** off-axis push (second power) remembered during the charge, −1..1 */
  axisLatched = 0;
  /** the set-up line was interrupted by a speed check */
  lineBroken = false;

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
    this.lineBroken = false;
    this.spin = null;
    this.axisLatched = 0;
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
      if (pressed && beforeLip && !this.pending) { this.chargeOn = true; this.note = ''; this.lineBroken = false; this.axisLatched = 0; }
      // the off-axis stick is remembered for the whole charge (it used to be read only at the instant of
      // the release: a stick let go a moment earlier turned corks into flat spins and flips into straight airs)
      // second power: keep the strongest push reached (letting the stick go back does not reset it);
      // pushing the other way switches family with its own push
      if (this.chargeOn && Math.abs(inp.axis) >= POP.AXIS_DEAD &&
        (Math.sign(inp.axis) !== Math.sign(this.axisLatched) || Math.abs(inp.axis) > Math.abs(this.axisLatched))) this.axisLatched = inp.axis;
      if (this.chargeOn && held) {
        this.power = Math.abs(inp.charge) >= POP.DEAD ? Math.round(Math.abs(inp.charge) / POP.STEP) * POP.STEP : 0;
        // the set-up carve starts as soon as the charge has a side
        // a speed check during the set-up ruins the line: the S restarts where you are when you let go
        if (this.approach.active && inp.brake > 0.02) { this.approach.stop(); this.lineBroken = true; this.note = 'Speed check durante la curva: linea rovinata'; }
        if (!this.approach.active && this.power > 0 && inp.brake <= 0.02) {
          const side = inp.charge > 0 ? 1 : -1;
          this.approach.start(side, LM.zLip - p0.z, v, this.s, b.aN, p0.x);
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
          this.pending = { q, power: this.power, axis: this.axisLatched };
          this.kind = kind;
        }
      }
      const cmd = this.approach.command(this.s, this.power, v, b.aN, b.travelHeading(), p0.x);
      this.approachPhase = cmd.phase;
      b.preStep({ kappa: cmd.kappa, edge: cmd.edge, brake: inp.brake, tuck: this.chargeOn }, dt);
      this.world.step();
      b.postStep();
      this.s += v * dt;
      const p1 = b.position();
      if (p0.z < LM.zLip && p1.z >= LM.zLip && onKicker(p1.x, LM.zLip - 0.01)) this.launch(inp);
      else if (p1.z > LM.zKnuckle + 2 && !this.takeoff) { this.note = 'Sei passato di fianco al kicker'; this.phase = 'done'; }
    } else if (this.phase === 'air') {
      b.preStep({ kappa: 0, edge: 0, brake: 0, tuck: !!inp.grab }, dt);
      this.world.step();
      b.postStep();
      this.airT += dt;
      if (this.spin) stepSpin(this.spin, { grab: inp.grab ?? null, held: inp.charging, bar: inp.charge }, b.velocity().y, dt);
      if (b.touchedDown && this.airT > 0.15) this.land();
    } else if (this.phase === 'landed') {
      b.preStep({ kappa: 0, edge: 0, brake: 0, tuck: false }, dt);
      this.world.step();
      b.postStep();
      if (this.t - this.landedT > 1.4) this.phase = 'done';
    } else if (this.phase === 'crash') {
      // the rider tumbles and slides: the snow brakes him hard
      b.preStep({ kappa: 0, edge: 0, brake: 1, tuck: false }, dt);
      this.world.step();
      b.postStep();
      if (this.t - this.landedT > 1.8) this.phase = 'done';
    }
    if (this.t > 90) this.phase = 'done';
  }

  private trickKind(inp: RunInput): TrickKind {
    if (this.approach.side > 0) return 'frontside';
    if (this.approach.side < 0) return 'backside';
    void inp;
    return Math.abs(this.axisLatched) >= POP.AXIS_DEAD ? 'flip' : 'straight';
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
      axis: this.pending ? this.pending.axis : this.axisLatched,
      speed: len(vel),
      popQ: q * edgeQ,
      release: this.pending ? (this.pending.q >= 1 ? 'perfetto' : 'presto') : this.chargeOn ? 'nessuno' : 'nessuno',
      edgeDeg: b.edge / DEG,
      edge: actual,
      edgeExpected: exp,
      timing: this.approach.active ? this.approach.timing : null,
      timingLabel: this.approach.active ? (this.approach.timing > APPROACH.ON_TIME ? 'presto' : this.approach.timing < -APPROACH.ON_TIME ? 'tardi' : 'giusto') : null,
      compressed: this.approach.compressed,
      headingDeg: travel / DEG,
      vLat: vel.x,
      skidDeg: Math.atan2(Math.sin(b.psi - travel), Math.cos(b.psi - travel)) / DEG,
      skidding: b.skidding,
      yawRate: b.yawRate,
      carveHelp,
      x: b.position().x,
    };
    // rotation: angular momentum set at the pop (Phase 3)
    const power = this.takeoff.power, dirSpin = kind === 'frontside' ? 1 : kind === 'backside' ? -1 : 0;
    this.spin = initSpin(dirSpin ? power : 0, dirSpin, this.takeoff.axis, this.takeoff.popQ, carveHelp);
    // the rotation is measured from the direction of travel at the lip (legacy), not from a skidding board
    this.takeoffYaw = travel;
    this.takeoffPitch = Math.atan2(-b.normal.z * Math.cos(b.psi) - b.normal.x * Math.sin(b.psi), b.normal.y);
    this.approach.stop();
    this.chargeOn = false;
    this.pending = null;
    this.phase = 'air';
    this.airT = 0;
  }

  /**
   * Board/rider orientation in the air (world): takeoff yaw, the ramp's pitch fading out over 0.35 s,
   * riding switch if so, then the rotation. Null on the snow (the board's own rotation is used).
   */
  airOrientation(): Q4 | null {
    if (this.phase !== 'air' || !this.spin) return null;
    const blend = Math.max(0, 1 - this.airT / 0.35);
    const yaw = qAxis(0, 1, 0, this.takeoffYaw);
    const pitch = qAxis(1, 0, 0, -this.takeoffPitch * blend);
    return qMul(qMul(yaw, pitch), airQuat(this.spin));
  }

  private land(): void {
    const b = this.board, p = b.position(), v = b.velocity();
    const tk = this.takeoff!;
    const sp = this.spin ?? initSpin(0, 0, 0, 0, null);
    const q = this.airOrientationAt();
    const fwd = qRot(q, { x: 0, y: 0, z: 1 }), up = qRot(q, { x: 0, y: 1, z: 0 });
    const efh = b.impactSpeed ** 2 / (2 * 9.81);
    const dK = p.z - LM.zKnuckle, inL = inLanding(p.x, p.z);
    const ev = evaluateLanding({
      boardFwd: fwd, bodyUp: up, velocity: v, normal: b.normal, efh,
      residualOmega: sp.mode === 'spin' ? sp.omega : 0, dKnuckle: dK, inLanding: inL, tolerance: this.tolerance,
    });
    const info = trickName(sp, b.stance < 0);
    this.landing = {
      x: p.x, z: p.z,
      dKnuckle: dK,
      drift: p.x - tk.x,
      inLanding: inL,
      airT: this.airT,
      carveDeg: (tk.yawRate * this.airT) / DEG,
      impact: b.impactSpeed,
      efh,
      trick: info.name, deg: info.deg, realDeg: sp.mode === 'spin' ? Math.abs(sp.phi) : sp.mode === 'flip' ? Math.abs(sp.theta) : 0,
      inv: sp.inv, grab: info.grab, grabTime: info.grabTime,
      quality: ev.quality, cause: ev.cause, yawErr: ev.yawErr, tiltErr: ev.tiltErr, yawSigned: ev.yawSigned, switchLand: ev.switchLand,
    };
    // physics takes over: the board keeps the yaw it landed with (an off-line board skids and brakes);
    // a backwards landing means riding switch from now on
    b.psi = Math.atan2(fwd.x, fwd.z);
    if (ev.switchLand) b.stance = b.stance > 0 ? -1 : 1;
    this.phase = ev.quality === 'crash' ? 'crash' : 'landed';
    this.landedT = this.t;
  }

  /** air orientation even on the touchdown step (phase already switching) */
  private airOrientationAt(): Q4 {
    const prev = this.phase;
    this.phase = 'air';
    const q = this.airOrientation() ?? { x: 0, y: 0, z: 0, w: 1 };
    this.phase = prev;
    return q;
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
