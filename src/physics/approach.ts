import { APPROACH, SNOW } from '../core/config';
import { edgeForCurvature } from './snow';
import { smoothstep } from './vec';

/**
 * Automatic pre-jump line (docs/research 01, 04, 06, 07, 11). The player never steers: starting the
 * charge starts the rider's line. Real "gentle S", seen from above (frontside, regular; backside is
 * mirrored), as smooth as linked turns: a turn on the takeoff edge swings the rider out to one side of
 * the kicker axis, the set-up carve on the opposite edge brings him back, and the takeoff edge carries
 * him up the kicker ("carve up and off the lip"), parallel to the axis and centred at the lip.
 *
 * The line has a fixed length L = v·S_TIME from the moment the charge starts: the rider does NOT
 * adapt it to the kicker. The lip simply cuts the line wherever it falls (docs/research 08), so the
 * takeoff point across the lip, the exit angle and the edge depend only on when the charge starts
 * (and on the power, which sets how wide the S is):
 *  - on time: the lip falls at the end of the S → centred, straight, on the takeoff edge;
 *  - early:   the S is over before the lip; the rider keeps carving on the takeoff edge ("turning
 *             too much in the lip") → leaves on the side the S swung out to, on an angle → drift;
 *  - late:    the lip falls inside the S → still off to the side and still on the set-up curve:
 *             board across the kicker, maybe on the wrong edge (less pop, less rotation help).
 */
export type ApproachPhase = 'none' | 'setup' | 'hold';

export interface ApproachCmd {
  /** requested path curvature (1/m), + = towards +x (heel side for a regular rider) */
  kappa: number;
  /** requested edge angle (rad), + = heel */
  edge: number;
  phase: ApproachPhase;
}

/**
 * Plan-view shape of the line, f(u) for u ∈ [0, 1] (max 1 at u = ½), with its derivatives:
 * f = sin²(πu) − 2c·(1 − u)·sin²(2πu). A short opening to the OTHER side first (≈30 % of the big
 * swing), then the big swing on the takeoff edge's side, then back onto the axis, parallel, at the lip,
 * still carving on the takeoff edge (f''(1) = 2π² > 0). Smooth sine pieces: no straight bits.
 */
const OPEN = APPROACH.OPENING;
export function lineShape(u: number): { f: number; d1: number; d2: number } {
  const P = Math.PI, s1 = Math.sin(P * u) ** 2, s1d = P * Math.sin(2 * P * u), s1dd = 2 * P * P * Math.cos(2 * P * u);
  const s2 = Math.sin(2 * P * u) ** 2, s2d = 2 * P * Math.sin(4 * P * u), s2dd = 8 * P * P * Math.cos(4 * P * u);
  const g = (1 - u) * s2, gd = -s2 + (1 - u) * s2d, gdd = -2 * s2d + (1 - u) * s2dd;
  return { f: s1 - 2 * OPEN * g, d1: s1d - 2 * OPEN * gd, d2: s1dd - 2 * OPEN * gdd };
}

export class Approach {
  active = false;
  side: -1 | 0 | 1 = 0;
  /** line length actually used (m) and the natural one */
  L = 0;
  Lnat = 0;
  /** + = started early, − = late (s); 0 when not started */
  timing = 0;
  compressed = false;
  /** kept for the takeoff record; the timing now acts through position, angle and edge at the lip */
  quality = 1;
  /** heading the rider intends to have now (rad) */
  psiRef = 0;
  /** lateral position where the line started (m) */
  private x0 = 0;
  private holdPsi = 0;
  /** curvature the edge holds cleanly at the start speed (1/m), scaled by GRIP_USE */
  kLim = 0;
  private s0 = 0;
  private sLast = 0;

  /**
   * Start the line. `dToLip`: distance still to ride to the lip (m); `s`: path length so far;
   * `aN`: normal acceleration now (grip available).
   */
  start(side: -1 | 1, dToLip: number, v: number, s: number, aN = 9.6, x = 0): void {
    this.active = true;
    this.x0 = x;
    this.holdPsi = 0;
    this.side = side;
    this.s0 = s;
    this.sLast = s;
    this.psiRef = 0;
    const vv = Math.max(3, v);
    this.Lnat = Math.max(APPROACH.S_MIN, vv * APPROACH.S_TIME);
    this.kLim = (APPROACH.GRIP_USE * SNOW.MU_LAT_EDGE * aN) / (vv * vv);
    // fixed length: the lip cuts the line wherever it falls (no squeezing to fit the kicker)
    this.compressed = false;
    this.L = this.Lnat;
    this.timing = (dToLip - this.Lnat) / vv;
    this.quality = 1;
  }

  stop(): void {
    this.active = false;
    this.side = 0;
  }

  /**
   * Command for the current point: `s` path length, `power` 0..1, `travel` the actual direction of
   * travel (rad), `x` lateral position (m). The rider follows the planned line (heading and lateral
   * position, closed loop): if the power changes during the S (the player is still dragging) the line
   * reshapes smoothly and still comes back onto the axis at the lip.
   */
  command(s: number, power: number, v: number, aN: number, travel = 0, x = 0): ApproachCmd {
    if (!this.active || this.side === 0) return { kappa: 0, edge: 0, phase: 'none' };
    const cmd = this.plan(s, power);
    const u = (s - this.s0) / this.L;
    if (cmd.phase === 'setup') {
      const X = this.side * this.offset(power), sh = lineShape(u);
      this.psiRef = (X * sh.d1) / this.L;
      const xRef = this.x0 + X * sh.f;
      cmd.kappa += APPROACH.LINE_GAIN * (this.psiRef - travel) + APPROACH.POS_GAIN * (xRef - x);
    } else {
      // early: the planned line is over; the extra carve turns the rider off the line on purpose
      this.holdPsi += cmd.kappa * (s - this.sLast);
      cmd.kappa += APPROACH.LINE_GAIN * (this.holdPsi - travel);
    }
    this.sLast = s;
    cmd.edge = edgeForCurvature(cmd.kappa, v, aN);
    // hand-over: from the last edge change (u ≈ 0.64) the rider rolls progressively onto the takeoff
    // edge and keeps it, clearly, up the kicker
    const wgt = cmd.phase === 'hold' ? 1 : smoothstep((u - 0.66) / 0.2);
    const plat = wgt * (APPROACH.RAMP_EDGE + APPROACH.RAMP_EDGE_GAIN * power);
    // blend in only from the hand-over on (a plain max/min here kept the board FLAT during the whole
    // set-up carve on the opposite edge: that was the "turn – straight – turn" feeling)
    const onTakeoffEdge = this.side > 0 ? Math.max(cmd.edge, plat) : Math.min(cmd.edge, -plat);
    cmd.edge += wgt * (onTakeoffEdge - cmd.edge);
    return cmd;
  }

  /** widest planned offset from the axis (m) */
  offset(power: number): number {
    return APPROACH.OFFSET_MIN + APPROACH.OFFSET_GAIN * power;
  }

  private plan(s: number, power: number): ApproachCmd {
    const u = (s - this.s0) / this.L;
    // Linked turns are close to a sine wave (docs/research 11): no straight bits, curvature crossing
    // zero only for an instant. Path x(u) = side·X·f(u) (see lineShape): opening to the other side,
    // big swing on the takeoff edge's side, back onto the axis at u = 1, still carving on the takeoff
    // edge up the kicker ("carve up and off the lip"). A short ramp-in avoids a curvature step.
    if (u < 1) {
      const X = this.side * this.offset(power);
      const kappa = ((X * lineShape(u).d2) / (this.L * this.L)) * smoothstep(u / 0.08);
      return { kappa, edge: 0, phase: 'setup' };
    }
    // the line is over before the lip (early): the rider simply keeps the carve he had at the end of
    // the S on the takeoff edge ("turning too much in the lip"); the extra heading builds up with how
    // early he is, up to HOLD_MAX, then he runs on at that angle. Monotonic: earlier = more off.
    const kEnd = (this.offset(power) * 2 * Math.PI ** 2) / (this.L * this.L);
    const kappa = Math.abs(this.holdPsi) < APPROACH.HOLD_MAX ? this.side * kEnd : 0;
    return { kappa, edge: 0, phase: 'hold' };
  }

}
