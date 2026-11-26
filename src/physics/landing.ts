import { DEG, LANDING } from '../core/config';
import { clamp, cross, dot, norm, scale, sub, v3, type V3 } from './vec';

export type LandingQuality = 'perfect' | 'clean' | 'sketchy' | 'severe' | 'crash';
const ORDER: LandingQuality[] = ['perfect', 'clean', 'sketchy', 'severe', 'crash'];
const bump = (q: LandingQuality) => ORDER[Math.min(4, ORDER.indexOf(q) + 1)]!;

export type LandingCause =
  | 'ok' | 'yaw' | 'pitchFwd' | 'backseat' | 'roll' | 'inverted' | 'impact'
  | 'edge' | 'washout' | 'knuckle' | 'table' | 'offpiste' | 'nose';

/** What the rider visibly does (docs/research 13: from stomp to slam). */
export type LandingOutcome = 'stomp' | 'clean' | 'hand' | 'twohands' | 'buttcheck' | 'crash';

export interface LandingInput {
  /** board forward, board lateral (+x = heel side) and body up at touchdown (world) */
  boardFwd: V3;
  boardLat?: V3;
  bodyUp: V3;
  velocity: V3;
  /** snow normal at the touchdown point */
  normal: V3;
  /** equivalent fall height (m), already softened in soft snow */
  efh: number;
  /** spin still going at touchdown, signed around the vertical (°/s, + = counter-clockwise seen from above) */
  residualOmega: number;
  /** off-axis flip still going (°/s, unsigned) */
  residualFlip?: number;
  /** distance past the knuckle (m, < 0 = on the table) */
  dKnuckle: number;
  /** inside the prepared landing */
  inLanding: boolean;
  /** a grab is still held at touchdown */
  grabHeld?: boolean;
  tolerance: boolean;
}

export interface LandingEval {
  quality: LandingQuality;
  cause: LandingCause;
  outcome: LandingOutcome;
  /** board vs travel on the slope, mod 180, residual spin included (°) */
  yawErr: number;
  /** body tilt vs vertical (°) and its components */
  tiltErr: number;
  pitch: number;
  roll: number;
  /** edge angle at contact (°, + = heel side down) */
  contactEdge: number;
  /** landed backwards: now riding switch */
  switchLand: boolean;
  /** signed board angle vs travel (°), for the diagram (|v| > 90 = switch) */
  yawSigned: number;
}

const band = (v: number, lim: readonly number[], k: number): LandingQuality =>
  v <= lim[0]! * k ? 'perfect' : v <= lim[1]! * k ? 'clean' : v <= lim[2]! * k ? 'sketchy' : v <= lim[3]! * k ? 'severe' : 'crash';

/**
 * Landing judgment (docs/research 12, 13). The worst of: board yaw (residual spin signed), body pitch
 * forward (strict) / backward (forgiving, butt check), roll, impact (stricter with a grab still held),
 * edge catch / washout from the edge at contact, landing zone and a nose-first touchdown. No landing
 * revert: a board too far across is a crash, whatever the residual spin (user feedback on PR #10).
 */
export function evaluateLanding(i: LandingInput): LandingEval {
  const k = i.tolerance ? LANDING.TOLERANCE : 1;
  const n = norm(i.normal);
  const onPlane = (v: V3) => norm(sub(v, scale(n, dot(v, n))));
  const f = onPlane(i.boardFwd), t = onPlane(i.velocity);
  const fd = clamp(dot(f, t), -1, 1);
  const yawSigned = Math.atan2(dot(cross(t, f), n), fd) / DEG;
  // yaw relative to the nearest line (0 or 180): d ∈ [−90, 90]; the residual spin adds or removes error
  const d = yawSigned - Math.round(yawSigned / 180) * 180;
  const dEff = d + i.residualOmega * LANDING.RESIDUAL_T;
  const yawErr = Math.min(90, Math.abs(dEff));

  // body attitude vs the vertical (the legs adapt the board to the slope): pitch along travel, roll across
  const u = norm(i.bodyUp);
  const th = norm(v3(t.x, 0, t.z)), lh = v3(th.z, 0, -th.x);
  const flipRes = (i.residualFlip ?? 0) * LANDING.RESIDUAL_T;
  const pitch = Math.atan2(dot(u, th), u.y) / DEG; // + = leaning forward / downhill
  const roll = Math.atan2(dot(u, lh), u.y) / DEG;
  const tiltErr = Math.acos(clamp(u.y, -1, 1)) / DEG;
  // edge at contact: up vector tipped towards the board's lateral axis (+ = heel side down)
  const lat = i.boardLat ? onPlane(i.boardLat) : norm(cross(n, f));
  const contactEdge = Math.atan2(dot(u, lat), dot(u, n)) / DEG;
  const vLat = dot(i.velocity, lat);

  let quality: LandingQuality = 'perfect', cause: LandingCause = 'ok';
  const apply = (q: LandingQuality, c: LandingCause) => { if (ORDER.indexOf(q) > ORDER.indexOf(quality)) { quality = q; cause = c; } };

  if (dot(u, n) < 0) apply('crash', 'inverted');
  apply(band(yawErr, LANDING.YAW, k), 'yaw');
  apply(pitch >= 0 ? band(pitch + flipRes, LANDING.PITCH_FWD, k) : band(-pitch + flipRes, LANDING.PITCH_BACK, k), pitch >= 0 ? 'pitchFwd' : 'backseat');
  apply(band(Math.abs(roll), LANDING.ROLL, k), 'roll');
  const efhK = k * (i.grabHeld ? LANDING.EFH_GRAB : 1);
  apply(band(i.efh, LANDING.EFH, efhK), 'impact');
  // edges: the leading (sliding) edge lowered = catch → slam; the heel edge with the weight back = washout
  if (Math.abs(vLat) > LANDING.CATCH_VLAT * k && Math.sign(contactEdge) === Math.sign(vLat) && Math.abs(contactEdge) > LANDING.CATCH_EDGE * k) apply('crash', 'edge');
  else if (contactEdge > 8 * k && pitch < -10) apply('severe', 'washout');
  // where it lands
  if (i.dKnuckle < 0) apply(i.efh > 1.5 * k ? 'severe' : 'sketchy', 'table');
  else if (i.dKnuckle < 2) apply(i.efh > 1 * k || pitch > 10 ? 'severe' : 'sketchy', 'knuckle');
  else if (!i.inLanding) apply(pitch > 15 * k || yawErr > LANDING.YAW[2]! * k ? 'crash' : 'sketchy', 'offpiste');
  // nose-first with the body pitched forward: ~4× the fall risk (OR 4.01); the LEADING tip counts (switch too)
  const lead = scale(norm(i.boardFwd), fd >= 0 ? 1 : -1);
  const q0 = quality as LandingQuality;
  if (q0 !== 'crash' && dot(lead, n) < -Math.sin(15 * DEG) && pitch > 0) { quality = bump(q0); cause = 'nose'; }

  const q1 = quality as LandingQuality;
  const c1 = cause as LandingCause;
  const backward = c1 === 'backseat' || c1 === 'washout';
  const outcome: LandingOutcome =
    q1 === 'perfect' ? 'stomp' : q1 === 'clean' ? 'clean' : q1 === 'crash' ? 'crash'
      : backward ? 'buttcheck' : q1 === 'sketchy' ? 'hand' : 'twohands';
  const switchLand = fd < 0;
  return { quality: q1, cause, outcome, yawErr, tiltErr, pitch, roll, contactEdge, switchLand, yawSigned };
}
