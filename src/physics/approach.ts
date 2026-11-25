import { APPROACH } from '../core/config';
import { edgeForCurvature } from './snow';
import { smoothstep } from './vec';

/**
 * Automatic pre-jump carve (docs/research 01, 04, 06). The player never steers: starting the charge
 * starts the rider's set-up S. Real "heel, toe, heel" line for a frontside spin (mirrored for backside):
 * a short turn on the takeoff edge, the set-up carve on the opposite edge "towards the side of the jump",
 * then back onto the takeoff edge, back on the kicker axis and straight at the kicker base.
 *
 * The rider has a natural S length L = v·S_TIME. Real-world consequences of the timing:
 *  - on time: the S ends at the kicker base → edge held as a platform up the ramp, straight takeoff;
 *  - early:   the S ends before the base; the rider rolls onto the takeoff edge and carves across
 *             the approach → leaves the lip on an angle → sideways drift in the air;
 *  - late:    the S is squeezed into the space left → curvature beyond the edge's grip → skid,
 *             speed loss, rushed edge change (maybe still on the wrong edge at the lip).
 */
export type ApproachPhase = 'none' | 'setup' | 'hold' | 'ramp';

export interface ApproachCmd {
  /** requested path curvature (1/m), + = towards +x (heel side for a regular rider) */
  kappa: number;
  /** requested edge angle (rad), + = heel */
  edge: number;
  phase: ApproachPhase;
}

export class Approach {
  active = false;
  side: -1 | 0 | 1 = 0;
  /** S length actually used (m) and the natural one */
  L = 0;
  Lnat = 0;
  /** + = started early, − = late (s); 0 when not started */
  timing = 0;
  compressed = false;
  /**
   * Takeoff quality from the set-up timing (0.6..1): a squeezed S means a rushed edge change and a
   * skidded ramp, so less pop and less rotation help (docs/research 06).
   */
  quality = 1;
  /** heading the rider intends to have now (rad): integral of the planned curvature */
  psiRef = 0;
  private s0 = 0;
  private sLast = 0;

  /** Start the S. `dToBase`: distance still to ride to the kicker base (m); `s`: path length so far. */
  start(side: -1 | 1, dToBase: number, v: number, s: number): void {
    this.active = true;
    this.side = side;
    this.s0 = s;
    this.sLast = s;
    this.psiRef = 0;
    const vv = Math.max(3, v);
    this.Lnat = Math.max(APPROACH.S_MIN, vv * APPROACH.S_TIME);
    this.compressed = dToBase < this.Lnat;
    this.L = this.compressed ? Math.max(APPROACH.S_MIN, dToBase) : this.Lnat;
    this.timing = (dToBase - this.Lnat) / vv;
    this.quality = 0.6 + 0.4 * Math.min(1, this.L / this.Lnat / 0.6);
  }

  stop(): void {
    this.active = false;
    this.side = 0;
  }

  /**
   * Command for the current point: `s` path length, `onRamp` past the kicker base, `power` 0..1,
   * `travel` the actual direction of travel (rad). Before the ramp the rider corrects his line by eye
   * (closed loop on the intended heading); on the ramp the edge is only a platform: no more corrections.
   */
  command(s: number, onRamp: boolean, power: number, v: number, aN: number, travel = 0): ApproachCmd {
    if (!this.active || this.side === 0) return { kappa: 0, edge: 0, phase: 'none' };
    const cmd = this.plan(s, onRamp, power, v, aN);
    this.psiRef += cmd.kappa * (s - this.sLast);
    this.sLast = s;
    if (cmd.phase !== 'ramp') {
      cmd.kappa += APPROACH.LINE_GAIN * (this.psiRef - travel);
      cmd.edge = edgeForCurvature(cmd.kappa, v, aN);
    }
    return cmd;
  }

  private plan(s: number, onRamp: boolean, power: number, v: number, aN: number): ApproachCmd {
    const psi = APPROACH.PSI_MIN + APPROACH.PSI_GAIN * power;
    const u = (s - this.s0) / this.L;
    // heading ψ(u) = side·A·(sin 2πu − ½ sin 4πu): curvature 0 at both ends, back on the line at u = 1;
    // curvature ∝ cos 2πu − cos 4πu: takeoff edge (short) → opposite edge (the set-up carve) → takeoff edge
    const A = psi / 1.3;
    const k0 = (this.side * A * 2 * Math.PI) / this.L;
    if (u < 1) {
      const kappa = k0 * (Math.cos(2 * Math.PI * u) - Math.cos(4 * Math.PI * u));
      return { kappa, edge: edgeForCurvature(kappa, v, aN), phase: 'setup' };
    }
    if (!onRamp) {
      // set up too early: nothing left to do, the rider rolls onto the takeoff edge and starts carving
      // across the approach (pre-rotating): he will leave the lip on an angle
      const extra = s - this.s0 - this.L;
      const kappa = 2 * k0 * APPROACH.HOLD_EARLY * smoothstep(extra / 4) * Math.exp(-extra / APPROACH.HOLD_LEN);
      return { kappa, edge: edgeForCurvature(kappa, v, aN), phase: 'hold' };
    }
    const edge = this.side * (APPROACH.RAMP_EDGE + APPROACH.RAMP_EDGE_GAIN * power);
    return { kappa: this.side * APPROACH.RAMP_CURV, edge, phase: 'ramp' };
  }
}
