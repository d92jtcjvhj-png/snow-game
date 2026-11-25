import { DEG, SNOW } from '../core/config';
import { smoothstep } from './vec';

/**
 * Pure snow model (no Rapier, no three): everything here is unit-tested.
 * Edge sign convention: + = heel edge (+x side for a regular rider going +z), − = toe edge.
 */

/** Carved turn radius from the edge angle (sidecut geometry): R = Rsc·cos φ. Infinity with a flat base. */
export function carveRadius(edge: number, sidecut: number = SNOW.SIDECUT_R): number {
  const a = Math.abs(edge);
  return a < 1e-6 ? Infinity : sidecut * Math.cos(a);
}

/** Lateral grip coefficient: low with a flat base, high once the edge bites (anisotropic friction). */
export function lateralMu(edge: number): number {
  return SNOW.MU_LAT_FLAT + (SNOW.MU_LAT_EDGE - SNOW.MU_LAT_FLAT) * smoothstep(Math.abs(edge) / SNOW.EDGE_FULL);
}

/** Highest curvature (1/m) the edge can hold at speed v with normal acceleration aN: v²κ ≤ μ·aN. */
export function maxCurvature(v: number, aN: number, mu: number): number {
  return v < 0.5 ? Infinity : (mu * Math.max(0, aN)) / (v * v);
}

/** Edge angle the rider needs to balance a turn of curvature κ (lean = atan(a_lat / a_n)), plus a little platform. */
export function edgeForCurvature(kappa: number, v: number, aN: number): number {
  if (kappa === 0) return 0;
  const lean = Math.atan2(v * v * Math.abs(kappa), Math.max(1, aN));
  // a little platform angle on top of the lean, fading to 0 with the curvature: continuous through
  // the edge change (no +4° → −4° jump)
  const platform = 4 * DEG * Math.min(1, Math.abs(kappa) / 0.005);
  return Math.sign(kappa) * Math.min(SNOW.EDGE_MAX, lean + platform);
}

export interface LateralResult {
  /** velocity change along the lateral axis this step (m/s) */
  dv: number;
  /** true when the grip limit was exceeded: the board slides sideways */
  skidding: boolean;
}

/**
 * Lateral (cross-board) friction for one step. Grip cancels the lateral velocity up to μ_lat·aN·dt;
 * beyond that the board slides and sliding friction μ_skid·aN·dt opposes the motion.
 */
export function lateralImpulse(vLat: number, edge: number, aN: number, dt: number): LateralResult {
  const grip = lateralMu(edge) * Math.max(0, aN) * dt;
  if (Math.abs(vLat) <= grip) return { dv: -vLat, skidding: false };
  const slide = Math.min(Math.abs(vLat), SNOW.MU_SKID * Math.max(0, aN) * dt);
  return { dv: -Math.sign(vLat) * slide, skidding: Math.abs(vLat) > 0.4 };
}

/** Longitudinal base friction for one step (never reverses the motion). */
export function longitudinalImpulse(vLong: number, aN: number, dt: number): number {
  const f = SNOW.MU_LONG * Math.max(0, aN) * dt;
  return -Math.sign(vLong) * Math.min(Math.abs(vLong), f);
}

/** Quadratic drag coefficient k so that a = −k·|v|·v. */
export function dragK(cda: number = SNOW.CDA): number {
  return (0.5 * SNOW.RHO * cda) / SNOW.MASS;
}
