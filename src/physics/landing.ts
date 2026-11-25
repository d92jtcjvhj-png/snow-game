import { DEG, LANDING } from '../core/config';
import { clamp, dot, norm, scale, sub, type V3 } from './vec';

export type LandingQuality = 'perfect' | 'clean' | 'sketchy' | 'severe' | 'crash';
const ORDER: LandingQuality[] = ['perfect', 'clean', 'sketchy', 'severe', 'crash'];
const bump = (q: LandingQuality) => ORDER[Math.min(4, ORDER.indexOf(q) + 1)]!;

export type LandingCause = 'ok' | 'yaw' | 'tilt' | 'inverted' | 'impact' | 'knuckle' | 'table' | 'offpiste' | 'nose';

export interface LandingInput {
  /** board forward and body up at touchdown (world) */
  boardFwd: V3;
  bodyUp: V3;
  velocity: V3;
  /** snow normal at the touchdown point */
  normal: V3;
  /** equivalent fall height (m) */
  efh: number;
  /** spin still going at touchdown (°/s) */
  residualOmega: number;
  /** distance past the knuckle (m, < 0 = on the table) */
  dKnuckle: number;
  /** inside the prepared landing */
  inLanding: boolean;
  tolerance: boolean;
}

export interface LandingEval {
  quality: LandingQuality;
  cause: LandingCause;
  /** board vs travel on the slope, mod 180 (°) */
  yawErr: number;
  /** body vs vertical (°) */
  tiltErr: number;
  /** landed backwards: now riding switch */
  switchLand: boolean;
  /** signed board angle vs travel (°), for the diagram (|v| > 90 = switch) */
  yawSigned: number;
}

const band = (v: number, lim: readonly number[], k: number): LandingQuality =>
  v <= lim[0]! * k ? 'perfect' : v <= lim[1]! * k ? 'clean' : v <= lim[2]! * k ? 'sketchy' : v <= lim[3]! * k ? 'severe' : 'crash';

/**
 * Landing judgment (docs/research 12): the worst of yaw, body tilt and impact bands, then the landing
 * zone (table / knuckle / outside the prepared landing) and a nose-first touchdown make it worse.
 * The physics then does the rest (an off-line board skids and brakes on its own).
 */
export function evaluateLanding(i: LandingInput): LandingEval {
  const k = i.tolerance ? LANDING.TOLERANCE : 1;
  const n = norm(i.normal);
  const onPlane = (v: V3) => norm(sub(v, scale(n, dot(v, n))));
  const f = onPlane(i.boardFwd), t = onPlane(i.velocity);
  const fd = clamp(dot(f, t), -1, 1);
  let yawErr = Math.acos(Math.abs(fd)) / DEG;
  const cr = { x: t.y * f.z - t.z * f.y, y: t.z * f.x - t.x * f.z, z: t.x * f.y - t.y * f.x };
  const yawSigned = Math.atan2(dot(cr, n), fd) / DEG;
  yawErr = Math.min(90, yawErr + Math.abs(i.residualOmega) * LANDING.RESIDUAL_T);
  // body tilt vs the vertical (legacy): the legs pitch the board to the landing slope, what matters is
  // whether the body is still tilted off-axis / flipped. Upside down = relative to the snow normal.
  const upN = clamp(dot(norm(i.bodyUp), n), -1, 1);
  const tiltErr = Math.acos(clamp(norm(i.bodyUp).y, -1, 1)) / DEG;

  let quality: LandingQuality = 'perfect', cause: LandingCause = 'ok';
  const apply = (q: LandingQuality, c: LandingCause) => { if (ORDER.indexOf(q) > ORDER.indexOf(quality)) { quality = q; cause = c; } };
  if (upN < 0) apply('crash', 'inverted');
  apply(band(yawErr, LANDING.YAW, k), 'yaw');
  apply(band(tiltErr, LANDING.TILT, k), 'tilt');
  apply(band(i.efh, LANDING.EFH, k), 'impact');
  // where it lands
  if (i.dKnuckle < 0) apply(i.efh > 1.5 * k ? 'severe' : 'sketchy', 'table');
  else if (i.dKnuckle < 2) apply('severe', 'knuckle');
  else if (!i.inLanding) apply(yawErr > LANDING.YAW[1]! * k ? 'crash' : 'sketchy', 'offpiste');
  // nose-first with the body pitched forward: ~4× the fall risk (OR 4.01)
  const nosePitch = dot(norm(i.boardFwd), n);
  const q0 = quality as LandingQuality;
  if (q0 !== 'crash' && nosePitch < -Math.sin(15 * DEG) && fd > 0) { quality = bump(q0); cause = 'nose'; }
  return { quality, cause, yawErr, tiltErr, switchLand: fd < 0, yawSigned };
}
