import { APPROACH, SNOW } from '../core/config';
import { edgeForCurvature } from './snow';
import { smoothstep } from './vec';

/**
 * Automatic pre-jump line (docs/research 01, 04, 06, 07). The player never steers: starting the charge
 * starts the rider's line. Real "gentle S", seen from above (frontside, regular; backside is mirrored):
 * a turn on the takeoff edge swings the rider out to one side of the kicker axis (up to ~1.5 m), the
 * set-up carve on the opposite edge brings him back, and the return arc on the takeoff edge carries
 * up the kicker ("carve up and off the lip") and arrives parallel to the axis, centred, at the lip.
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
      const A = (Math.PI * this.offset(power)) / this.Lnat, w = 2 * Math.PI * u;
      this.psiRef = this.side * A * (Math.sin(w) - 0.5 * Math.sin(2 * w));
      const xRef = this.x0 + (this.side * A * this.L) / (2 * Math.PI) * (1 - Math.cos(w) - 0.25 * (1 - Math.cos(2 * w)));
      cmd.kappa += APPROACH.LINE_GAIN * (this.psiRef - travel) + APPROACH.POS_GAIN * (xRef - x);
    } else {
      // early: the planned line is over; the extra carve turns the rider off the line on purpose
      this.holdPsi += cmd.kappa * (s - this.sLast);
      cmd.kappa += APPROACH.LINE_GAIN * (this.holdPsi - travel);
    }
    this.sLast = s;
    cmd.edge = edgeForCurvature(cmd.kappa, v, aN);
    // hand-over: from the last edge change the rider rolls progressively onto the takeoff edge and
    // keeps it, clearly, up the kicker
    const wgt = cmd.phase === 'hold' ? 1 : smoothstep((u - 2 / 3) / 0.25);
    const plat = wgt * (APPROACH.RAMP_EDGE + APPROACH.RAMP_EDGE_GAIN * power);
    cmd.edge = this.side > 0 ? Math.max(cmd.edge, plat) : Math.min(cmd.edge, -plat);
    return cmd;
  }

  /** widest planned offset from the axis (m) */
  offset(power: number): number {
    return APPROACH.OFFSET_MIN + APPROACH.OFFSET_GAIN * power;
  }

  private plan(s: number, power: number): ApproachCmd {
    const u = (s - this.s0) / this.L;
    // heading ψ(u) = side·A·(sin 2πu − ½ sin 4πu): curvature 0 at both ends, back on the axis and
    // parallel at u = 1; offset x(u) = side·A·L/2π·[(1 − cos 2πu) − ¼(1 − cos 4πu)], widest (A·L/π) at u = ½.
    // A is sized on the natural length for the wanted offset; squeezed into a shorter L (late), the
    // same heading swing needs more curvature than the edge can hold.
    const A = (Math.PI * this.offset(power)) / this.Lnat;
    if (u < 1) {
      const k0 = (this.side * A * 2 * Math.PI) / this.L;
      return { kappa: k0 * (Math.cos(2 * Math.PI * u) - Math.cos(4 * Math.PI * u)), edge: 0, phase: 'setup' };
    }
    // the line is over before the lip (early): the rider keeps carving on the takeoff edge
    const extra = s - this.s0 - this.L;
    const kappa = this.side * this.kLim * APPROACH.HOLD_EARLY * smoothstep(extra / 4) * Math.exp(-extra / APPROACH.HOLD_LEN);
    return { kappa, edge: 0, phase: 'hold' };
  }
}
