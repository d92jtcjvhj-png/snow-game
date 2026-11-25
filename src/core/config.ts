/** Global constants. SI units and radians everywhere; convert only in the UI. */
export const DEG = Math.PI / 180;

/** Fixed physics step (s). Same as the legacy prototype. */
export const STEP = 1 / 120;
/** Max real time consumed per frame (s): avoids the "spiral of death" after a tab switch. */
export const MAX_FRAME = 0.05;

export const GRAVITY = 9.81;
/** Snow friction coefficient (legacy PHYS.MU). */
export const SNOW_MU = 0.06;

/** Test slope: same angle as the legacy run-in. */
export const SLOPE = {
  angle: 15 * DEG,
  halfWidth: 15,
  halfLength: 100,
  halfThickness: 0.5,
} as const;

/** Test cube. */
export const CUBE = {
  half: 0.5,
  startZ: -90,
} as const;

export const MS_TO_KMH = 3.6;
