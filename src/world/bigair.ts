import { DEG } from '../core/config';
import { smoothstep } from '../physics/vec';

/**
 * Big air jump, FIS-like (docs/research 03, 05). Pure data: no three, no Rapier.
 * Coordinates: z = horizontal distance downhill, y = up, x = across (kicker axis at x = 0).
 * Heights are a smooth centreline profile + the kicker bump + side banks.
 */
export const BA = {
  // centreline pitch profile (horizontal metres, degrees)
  dropInEnd: 70, dropInAngle: 35,
  approachStart: 85, approachAngle: 12,
  approachEnd: 125, setupStart: 133,
  /** kicker base: the "set-up point" where the set-up turn should be finished */
  kickerBase: 137,
  kickerR: 30, lipAngle: 28, kickerStraight: 1.0, kickerHalfW: 3.5, kickerBack: 3,
  /** table / gap from lip to knuckle (m) */
  gap: 24,
  knuckleBlend: 3, landingAngle: 38, landingLen: 28, outBlend: 25, runout: 80,
  // widths (half widths, m)
  runHalfW: 10, landTopHalfW: 9, landBottomHalfW: 13, outHalfW: 16,
  /** side banks: soft snow rising outside the prepared surface */
  bankSlope: 0.7,
  zStart: -2,
} as const;

/** Derived landmarks (computed once). */
export const LM = (() => {
  const zLip = BA.kickerBase + BA.kickerR * Math.sin(BA.lipAngle * DEG) + BA.kickerStraight;
  const zKnuckle = zLip + BA.gap;
  const zLandEnd = zKnuckle + BA.knuckleBlend + BA.landingLen;
  const zOutEnd = zLandEnd + BA.outBlend;
  const zEnd = zOutEnd + BA.runout;
  return { zLip, zKnuckle, zLandEnd, zOutEnd, zEnd };
})();

/** Centreline pitch (down-slope angle, rad) at z. Smooth blends between sections. */
export function pitchAt(z: number): number {
  const b = (z0: number, z1: number, a0: number, a1: number) => a0 + (a1 - a0) * smoothstep((z - z0) / (z1 - z0));
  let a: number;
  if (z < BA.dropInEnd) a = BA.dropInAngle;
  else if (z < BA.approachStart) a = b(BA.dropInEnd, BA.approachStart, BA.dropInAngle, BA.approachAngle);
  else if (z < BA.approachEnd) a = BA.approachAngle;
  else if (z < BA.setupStart) a = b(BA.approachEnd, BA.setupStart, BA.approachAngle, 0);
  else if (z < LM.zKnuckle - BA.knuckleBlend) a = 0;
  else if (z < LM.zKnuckle + BA.knuckleBlend) a = b(LM.zKnuckle - BA.knuckleBlend, LM.zKnuckle + BA.knuckleBlend, 0, BA.landingAngle);
  else if (z < LM.zLandEnd) a = BA.landingAngle;
  else if (z < LM.zOutEnd) a = b(LM.zLandEnd, LM.zOutEnd, BA.landingAngle, 0);
  else a = 0;
  return a * DEG;
}

// integrate the centreline once (0.05 m table)
const TB = (() => {
  const step = 0.05, z0 = BA.zStart - 1, n = Math.ceil((LM.zEnd + 40 - z0) / step);
  const ys = new Float64Array(n + 1);
  // y = 0 at the kicker base
  let y = 0;
  for (let i = 0; i <= n; i++) { ys[i] = y; y -= Math.tan(pitchAt(z0 + (i + 0.5) * step)) * step; }
  const off = sample(ys, (BA.kickerBase - z0) / step);
  for (let i = 0; i <= n; i++) ys[i]! -= off;
  return { step, z0, ys };
})();
function sample(ys: Float64Array, f: number): number {
  if (f <= 0) return ys[0]!;
  const i = Math.floor(f);
  if (i >= ys.length - 1) return ys[ys.length - 1]!;
  return ys[i]! + (ys[i + 1]! - ys[i]!) * (f - i);
}

/** Centreline ground height (no kicker). */
export function baseY(z: number): number {
  return sample(TB.ys, (z - TB.z0) / TB.step);
}

/** Kicker height above the base along its axis (circular transition + short straight, back face). */
export function kickerProfile(z: number): number {
  const z0 = BA.kickerBase, R = BA.kickerR, a = BA.lipAngle * DEG;
  const zc = z0 + R * Math.sin(a);
  const hc = R * (1 - Math.cos(a));
  const hLip = hc + Math.tan(a) * BA.kickerStraight;
  if (z <= z0) return 0;
  if (z <= zc) { const s = (z - z0) / R; return R * (1 - Math.cos(Math.asin(Math.min(1, s)))); }
  if (z <= LM.zLip) return hc + Math.tan(a) * (z - zc);
  if (z <= LM.zLip + BA.kickerBack) return hLip * (1 - (z - LM.zLip) / BA.kickerBack);
  return 0;
}
export const LIP_H = kickerProfile(LM.zLip);

/** Prepared surface half width at z. */
export function halfWidth(z: number): number {
  if (z < LM.zKnuckle) return BA.runHalfW;
  if (z < LM.zLandEnd) return BA.landTopHalfW + (BA.landBottomHalfW - BA.landTopHalfW) * (z - LM.zKnuckle) / (LM.zLandEnd - LM.zKnuckle);
  if (z < LM.zOutEnd) return BA.landBottomHalfW + (BA.outHalfW - BA.landBottomHalfW) * (z - LM.zLandEnd) / BA.outBlend;
  return BA.outHalfW;
}

/** Kicker bump at (x, z): full height inside the top width, 45° side walls. */
export function kickerAt(x: number, z: number): number {
  const h = kickerProfile(z);
  if (h <= 0) return 0;
  return Math.max(0, h - Math.max(0, Math.abs(x) - BA.kickerHalfW));
}

/** Ground height at (x, z). */
export function heightAt(x: number, z: number): number {
  const hw = halfWidth(z), ax = Math.abs(x);
  // soft side bank, smoothed over 1 m at the edge of the prepared surface
  const over = ax - hw;
  const bank = over <= -0.5 ? 0 : over >= 0.5 ? over * BA.bankSlope : BA.bankSlope * (over + 0.5) ** 2 / 2;
  return baseY(z) + kickerAt(x, z) + bank;
}

/** Is (x, z) on top of the kicker (within its full-height width)? */
export function onKicker(x: number, z: number): boolean {
  return z > BA.kickerBase && z <= LM.zLip + 0.05 && Math.abs(x) <= BA.kickerHalfW + 0.3;
}

/** Is (x, z) inside the prepared landing (between knuckle and end of landing)? */
export function inLanding(x: number, z: number): boolean {
  return z >= LM.zKnuckle && z <= LM.zOutEnd && Math.abs(x) <= halfWidth(z);
}

/** Soft snow outside the prepared surface: 0 on the groomed run/landing, → 1 a metre beyond its edge. */
export function softAt(x: number, z: number): number {
  const over = Math.abs(x) - halfWidth(z);
  return over <= 0 ? 0 : Math.min(1, over);
}
