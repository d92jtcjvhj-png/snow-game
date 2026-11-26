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
  EDGE_MAX: 65 * DEG,
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
  S_TIME: 2.8,
  /** shortest line the rider can squeeze (m) */
  S_MIN: 6,
  /**
   * Widest offset from the kicker axis (m) of the big swing: 1.25 m + 0.25 m·power, after an opening
   * of ~55 % to the other side (OPENING). Coaches use the same entry line for
   * every spin (docs/research 09): the S barely grows, the spin size comes from the shoulders (Phase 3).
   * Same length for every power, so the right moment to start is the same for every spin.
   */
  OFFSET_MIN: 1.25,
  OFFSET_GAIN: 0.25,
  /** opening to the other side before the big swing (shape parameter c: 0.75 ≈ 55 % of the swing;
   * the turns get tighter, a little skid and speed loss at high power is accepted) */
  OPENING: 0.75,
  /** grip fraction used for the clean-carve limit kLim (diagnostics) */
  GRIP_USE: 0.7,
  /** early: the extra heading from carving on after the S is capped here (rad) */
  HOLD_MAX: 12 * DEG,
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

/**
 * Rotation in the air (docs/research 12; legacy SIM). Angular momentum is set at the pop and conserved:
 * ω = L / I(pose). Tuck (grab) spins faster, opening up slows down and levels the cork axis.
 */
export const SPIN = {
  /**
   * Moment of inertia, rider + board (kg·m²), neutral pose, about the spin axis and the flip axis
   * (docs/research 15). Only ratios matter for ω: the pose multiplies them by k (GRAB_K, K_OPEN_*).
   * Spin: the board is a fixed load no grab removes → open/tuck ≈ 1.75. Flip: tucking brings the
   * board close to the hips → open/tuck ≈ 2.9.
   */
  I_NEUTRAL: 2.5,
  IF_NEUTRAL: 8.5,
  /** opened up (arms out, legs long): k on each axis (3.5/2.5 spin, 13/8.5 flip) */
  K_OPEN_SPIN: 1.4,
  K_OPEN_FLIP: 1.53,
  /** pose changes take time (docs/research 15): critically damped springs, ω_n (rad/s). Tuck 90 % in ≈0.26 s, opening ≈0.22 s */
  TUCK_WN: 15,
  OPEN_WN: 18,
  /** the grab counts (time, name) only with the hand really on the board */
  TUCK_GRAB: 0.7,
  /** spin rate at 100 % charge in the neutral pose (°/s): ≈ 950 °/s tucked (2340 in ~2.5 s) */
  OMEGA_MAX: 760,
  /** straight flips at full stick, neutral pose (°/s): ≈ 400 °/s with Indy/Mute, like before research 15 */
  FLIP_MAX: 240,
  /** the spin builds up over the first moments (shoulders lead, board follows), legacy */
  RAMP_IN: 0.28,
  /**
   * Off-axis push (second power, the stick), docs/research 17: it sets how many flips fit in the
   * flight, push·(nMax + ½), where nMax = floor((D − 180)/360) from the predicted spin degrees D.
   * The flips are timed to close at FLIP_CLOSE of the flight in the reference pose. Little push with a
   * big spin = cork 1080 (one inversion); the right amount closes whole flips, too much goes over.
   */
  FLIP_CLOSE: 0.85,
  /** plausibility ceiling of the flip rate in the neutral pose (°/s) */
  FLIP_CAP: 650,
  /** spin below 540°: no inversion, the push only dips the axis by this much (°), little → full push */
  DIP_MIN: 15,
  DIP_MAX: 60,
  /** spotting: once opened, if the flip is within this many degrees of a whole flip the rider closes it */
  SPOT_WINDOW: 25,
  /** ...at this rate at least (°/s), legacy LEVEL_RATE */
  LEVEL_RATE: 130,
  /** counter-rotation (legacy): torso brake (°/s), parked degrees and their release */
  BRAKE_RATE: 260,
  PARK_MAX: 180,
  PARK_RET: 300,
  /** a grab counts if held at least this long (s) */
  GRAB_MIN: 0.15,
} as const;

/**
 * Every grab's effect on the moment of inertia (docs/research 15, catalogue table; ESTIMATES):
 * I_spin = I_NEUTRAL·spin, I_flip = IF_NEUTRAL·flip. Compact grabs speed both rotations up, nose/tail
 * and cross-body grabs the spin more than the flip, straight-leg grabs (method, stiffy, pokes) slow
 * the flip down. New grabs only need a row here.
 */
export const GRAB_K = {
  truckdriver: { spin: 0.78, flip: 0.55 },
  indy: { spin: 0.8, flip: 0.6 },
  mute: { spin: 0.8, flip: 0.6 },
  japan: { spin: 0.82, flip: 0.55 },
  melon: { spin: 0.83, flip: 0.65 },
  taipan: { spin: 0.85, flip: 0.65 },
  roastbeef: { spin: 0.85, flip: 0.7 },
  chickensalad: { spin: 0.85, flip: 0.75 },
  stalefish: { spin: 0.85, flip: 0.7 },
  nose: { spin: 0.88, flip: 0.75 },
  tail: { spin: 0.88, flip: 0.75 },
  seatbelt: { spin: 0.88, flip: 0.75 },
  nuclear: { spin: 0.88, flip: 0.75 },
  tindy: { spin: 0.88, flip: 0.75 },
  tailfish: { spin: 0.88, flip: 0.75 },
  rocket: { spin: 0.9, flip: 0.8 },
  bloodydracula: { spin: 0.9, flip: 0.85 },
  crail: { spin: 0.92, flip: 0.85 },
  canadianbacon: { spin: 0.95, flip: 0.9 },
  tweak: { spin: 0.95, flip: 0.95 },
  poke: { spin: 0.95, flip: 1.1 },
  method: { spin: 1.02, flip: 1.1 },
  slob: { spin: 1.0, flip: 1.05 },
  lien: { spin: 1.0, flip: 1.05 },
  stiffy: { spin: 1.0, flip: 1.25 },
} as const;

/**
 * Landing (docs/research 12 and 13). Bands: perfect / clean / sketchy / severe, beyond = crash; the
 * worst row decides. Tolerance (training) multiplies every band. Physics then does the rest.
 */
export const LANDING = {
  /** board yaw vs travel (mod 180°), with the residual spin signed (it helps if it turns towards line) */
  YAW: [8, 16, 28, 45],
  /** body pitch FORWARD vs the vertical (°): strict, ends in a nose dive (OR ≈ 4) */
  PITCH_FWD: [8, 15, 25, 35],
  /** body pitch BACKWARD (°): more forgiving, ends in a butt check before a fall (51 % of falls are backward, often saved) */
  PITCH_BACK: [10, 20, 35, 50],
  /** body roll sideways (°) */
  ROLL: [8, 15, 25, 40],
  /** equivalent fall height (m): 1.5 m design value, athletes up to ~2.6–3 m (Minetti 1998) */
  EFH: [0.8, 1.5, 2.5, 3.5],
  /** a grab still held at touchdown shortens the legs' stroke: EFH bands × this */
  EFH_GRAB: 0.6,
  /** residual spin/flip counts as extra error over this time (s): edge grip stops ~360 °/s in 5–8° */
  RESIDUAL_T: 0.02,
  /** edge catch: the leading (downhill-sliding) edge lowered more than this (°) with this much sideslip (m/s) */
  CATCH_EDGE: 5,
  CATCH_VLAT: 2,
  /** legs' stroke for the absorption (m): extra normal load v_n²/(2d) for 2d/v_n seconds */
  ABSORB_D: 0.4,
  /** post-landing pivot back into line (rad/s): slower than a speed check, the skid shows */
  REALIGN_RATE: 2.4,
  TOLERANCE: 1.7,
} as const;

/** Soft snow outside the prepared surface (docs/research 13): sinking drag and a lower impact. */
export const SOFT_SNOW = {
  /** extra longitudinal friction once off the groomed surface */
  MU: 0.22,
  /** EFH is softened by this factor in deep snow */
  EFH: 0.7,
} as const;
