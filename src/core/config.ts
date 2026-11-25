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
  /** lateral grip with the edge set (>= EDGE_FULL): hardpack edge hold */
  MU_LAT_EDGE: 1.0,
  /** edge angle at which grip reaches MU_LAT_EDGE */
  EDGE_FULL: 20 * DEG,
  /** sliding (skid) friction once the grip limit is exceeded: this is what brakes in a speed check */
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
  /** speed check: max board angle across the velocity, and yaw rate to get there */
  CHECK_ANGLE: 80 * DEG,
  CHECK_YAW_RATE: 6,
  /** heel edge angle during a speed check: 15° + 20°·intensity */
  CHECK_EDGE_MIN: 15 * DEG,
  CHECK_EDGE_GAIN: 20 * DEG,
  /** keyboard: intensity ramp while B is held (s from 0 to 1) */
  CHECK_RAMP: 0.6,
} as const;

/**
 * Automatic pre-jump carve (docs/research 01, 04, 06).
 * One S: set-up turn on the opposite edge, then onto the takeoff edge, straight at the
 * kicker base ("set-up point"), edge held up the ramp. Starts when the player starts charging.
 */
export const APPROACH = {
  /** natural duration of the S at the speed the charge starts (s): starting this long before the kicker base is "on time" */
  S_TIME: 1.5,
  /** shortest S the rider can squeeze (m) */
  S_MIN: 4,
  /**
   * Size of the S: its sharpest point uses this fraction of the edge grip available at the speed the
   * charge starts (a clean carve, never a skid when on time). Power scales it from POWER_MIN to 1.
   * At 60–75 km/h a real set-up turn is gentle (radius 20–100 m, docs/research 05).
   */
  GRIP_USE: 0.7,
  POWER_MIN: 0.4,
  /** after an early S, the rider keeps carving on the takeoff edge at this fraction of the S's last curvature */
  HOLD_EARLY: 1.3,
  /** ...fading out over this distance (m): the heading error stays, the turning stops */
  HOLD_LEN: 8,
  /** line correction before the ramp: extra curvature per radian of heading error (1/m/rad) */
  LINE_GAIN: 0.15,
  /** on the ramp the edge is a platform: tiny residual curvature (1/m) */
  RAMP_CURV: 1 / 2000,
  /** platform edge angle on the ramp: 8° + 10°·power */
  RAMP_EDGE: 8 * DEG,
  RAMP_EDGE_GAIN: 10 * DEG,
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
