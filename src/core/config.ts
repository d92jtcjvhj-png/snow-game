/** Global constants. SI units and radians everywhere; convert only in the UI. */
export const DEG = Math.PI / 180;

/** Fixed physics step (s). Same as the legacy prototype. */
export const STEP = 1 / 120;
/** Max real time consumed per frame (s): avoids the "spiral of death" after a tab switch. */
export const MAX_FRAME = 0.05;

export const GRAVITY = 9.81;
export const MS_TO_KMH = 3.6;

/**
 * Snow / board physics. Sources in docs/research (03, 05).
 * Rapier does gravity + normal contact; every tangential force below is ours.
 */
export const SNOW = {
  /** rider + board mass (kg), legacy MASS */
  MASS: 75,
  /** longitudinal base friction on waxed base (research: 0.026–0.143; legacy 0.06) */
  MU_LONG: 0.06,
  /** lateral grip with a flat base: the board slides sideways easily */
  MU_LAT_FLAT: 0.12,
  /** lateral grip with the edge set (>= EDGE_FULL): hardpack edge hold (research: ~1.5–2 g ceiling) */
  MU_LAT_EDGE: 1.3,
  /** edge angle at which grip reaches MU_LAT_EDGE */
  EDGE_FULL: 20 * DEG,
  /** sliding (skid) friction once the grip limit is exceeded */
  MU_SKID: 0.6,
  /** park board sidecut radius (research: 7.6–8.4 m) */
  SIDECUT_R: 8,
  EDGE_MAX: 55 * DEG,
  /** how fast the rider can change edge angle (rad/s) */
  EDGE_RATE: 200 * DEG,
  /** air density × drag area (CdA 0.5 m², legacy "normal" pose, research 0.35–0.55) */
  RHO: 1.0,
  CDA: 0.5,
  CDA_TUCK: 0.38,
  /** board realigns to the velocity when nothing steers it (1/s) */
  ALIGN_RATE: 3,
  /** beyond this board-vs-travel angle the board is sliding sideways (skid), not carving */
  SKID_ANGLE: 20 * DEG,
} as const;

/** Board: the collider is a small ball (single contact point); the length is for visuals and future rails. */
export const BOARD = {
  LENGTH: 1.55,
  RADIUS: 0.1,
  /**
   * Speed check (docs/research 09, Komissarov 2021): as soon as it is pressed the board pivots fully
   * across the direction of travel (90°, heel edge) in ~0.25 s; the intensity is how hard the rider
   * sits on the heels = edge angle Ψ from CHECK_EDGE_MIN (pressed) to CHECK_EDGE_MAX (pad all the way
   * down). Braking force = N·tanΨ·sinγ: across a slope α the rider slows only if Ψ > α, so a full check
   * (65°) stops him even on the 35° drop-in, while a light one (25°) only brakes on gentle slopes.
   */
  CHECK_ANGLE: 90 * DEG,
  CHECK_YAW_RATE: 6.3,
  CHECK_EDGE_MIN: 25 * DEG,
  CHECK_EDGE_MAX: 65 * DEG,
  /** keyboard: intensity ramp while B is held (s from 0 to 1) */
  CHECK_RAMP: 0.6,
} as const;

/**
 * Automatic pre-jump carve (docs/research 01, 04, 06).
 * One S: set-up turn on the opposite edge, then onto the takeoff edge, straight at the
 * kicker base ("set-up point"), edge held up the ramp. Starts when the player starts charging.
 */
export const APPROACH = {
  /**
   * Natural duration of the whole line, from the start of the charge to the LIP (s): the S, then the
   * return arc on the takeoff edge that carries up the kicker and arrives parallel to the axis at the lip.
   * Research: set-up starts ~25–40 m before the lip at big-air speed (docs/research 07).
   */
  S_TIME: 2.5,
  /** shortest line the rider can squeeze (m) */
  S_MIN: 6,
  /**
   * Widest offset from the kicker axis (m): 1.5 m + 0.4 m·power (wide, gentle arcs: the peak lateral
   * acceleration 4π²·offset/S_TIME² stays under the edge grip, ~1.2 g, so the S never skids). Coaches use the same entry line for
   * every spin (docs/research 09): the S barely grows, the spin size comes from the shoulders (Phase 3).
   * Same length for every power, so the right moment to start is the same for every spin.
   */
  OFFSET_MIN: 1.5,
  OFFSET_GAIN: 0.4,
  /** early: curvature of the takeoff-edge carve after the S, as a fraction of the clean grip limit */
  GRIP_USE: 0.7,
  HOLD_EARLY: 1.3,
  /** ...fading out over this distance (m): the heading error stays, the turning stops */
  HOLD_LEN: 8,
  /** line following by eye: extra curvature per radian of heading error (1/m/rad)... */
  LINE_GAIN: 0.15,
  /** ...and per metre of lateral error (1/m²): critically damped with LINE_GAIN */
  POS_GAIN: 0.0056,
  /** takeoff-edge platform angle, clearly visible on the kicker: 15° + 15°·power */
  RAMP_EDGE: 15 * DEG,
  RAMP_EDGE_GAIN: 15 * DEG,
  /** timing tolerance shown as "on time" (s) */
  ON_TIME: 0.2,
} as const;

/** Charge / pop (legacy CFG). */
export const POP = {
  DEAD: 0.1,
  AXIS_DEAD: 0.2,
  /** perfect pop (m/s), legacy 1.2, research up to ~1.1–2.2 */
  SPEED: 1.2,
  /** release within this time before the lip = perfect pop */
  WINDOW: 0.18,
  /** charge resolution: 1 % steps (finger noise ≈ 1.5 mm > a 5 % band; docs/research 10) */
  STEP: 0.01,
  /** keyboard: charge ramp speed (1/s) */
  KEY_RATE: 0.8,
} as const;

/**
 * Takeoff edge for a REGULAR rider riding forward (docs/research 01, 02).
 * Frontside → heel, backside → toe; corks use the flat-spin edge; straight flips and straight airs flat.
 * Edge sign: +1 = heel (+x side), −1 = toe (−x side), 0 = flat.
 */
export type TrickKind = 'frontside' | 'backside' | 'flip' | 'straight';
export const TAKEOFF_EDGE: Record<TrickKind, -1 | 0 | 1> = {
  frontside: 1,
  backside: -1,
  flip: 0,
  straight: 0,
};

/** Rider start: horizontal distance down the drop-in (m). Tuned so the lip speed without braking is ~62 km/h. */
export const START_Z = 22;
