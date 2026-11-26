# Moment of inertia by pose, and how much a pose change speeds up a rotation (snowboarder + board)

Research note. Page fetches failed for mdpi.com, arxiv.org, lboro.ac.uk and ojs.ub.uni-konstanz.de (DNS blocked in this session). Like earlier notes, everything cited here comes from **search-result snippets**, not full texts, so read the numbers with that in mind. Anything marked **ESTIMATE** or **DERIVATION** is my own arithmetic, not a measurement.

Game state when this was written (`src/core/config.ts`, `src/physics/spin.ts`): `SPIN.I_TUCK 2.0 / I_NEUTRAL 2.5 / I_OPEN 3.5` kg·m², a ratio of 0.8 : 1 : 1.4. **The same three values are used for spin (`mode 'spin'`), for straight flips (`mode 'flip'`) and for the off-axis flip component (`wf = Lf / I`).**

## Q1. Measured or modelled inertia of the body by pose (twist and somersault axes)

### Takeoff
About the long (twist) axis, an adult with arms down sits around **0.5–1.3 kg·m²**, and arms out at shoulder height multiply that by roughly **2–3×**. About the transverse (somersault) axis, layout is about **12–19 kg·m²**, pike about **7** and tuck about **3.4–4**. That makes layout/tuck roughly **3.5–5×** and pike/tuck about **2×**. The body is about 10–16× harder to somersault than to twist.

### Cited Findings
- **Yeadon model (40 solids, 95 measurements; J. Biomech. 1990, 23(1):67–74).** An object-oriented implementation reports whole-body moment of inertia about the global vertical Z axis of **0.55 kg·m² with arms down** and **1.58 kg·m² with arms out**. That is about 2.9× more, or +1.03 kg·m². The snippet does not give the subject's size. — [Dembia et al., "An object oriented implementation of the Yeadon human inertia model", PMC4329601](https://pmc.ncbi.nlm.nih.gov/articles/PMC4329601/) (snippet); model: [Yeadon 1990, ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/002192909090370I)
- Whole body minus the feet, in vivo: **AP 11.99 ± 0.45, ML 11.39 ± 0.53, longitudinal 1.30 ± 0.06 kg·m²**. — [Academia.edu, "Estimation of Whole Body Moment of Inertia Using Self-imposed Oscillations"](https://www.academia.edu/39233900/Estimation_of_Whole_Body_Moment_of_Inertia_Using_Self_imposed_Oscillations) (snippet)
- Across seven methods, Hanavan among them, the mean sagittal-axis whole-body moment is **14.85 ± 2.16 kg·m²**, with a maximum of 17.86 (Brenière model). — same source (snippet). Hanavan (1964) claims moments within about 10%. — [Scribd, Hanavan model](https://www.scribd.com/document/371156694/Hanavan-Model-Full) (snippet)
- A skater can "more than double" the longitudinal moment of inertia by abducting the arms to shoulder level. — [Masaryk Univ., Kinetics of rotary motion](https://www.fsps.muni.cz/emuni/data/reader/book-2/31.html) (snippet)
- Ratio of transverse to longitudinal inertia during twisting somersaults: **16.0 with arms adducted**, **20.3 with one arm overhead**, **25.1 with both arms overhead**. Arms overhead lower the twist inertia and raise the somersault inertia. — [Yeadon, "Twist within a somersault", ResearchGate](https://www.researchgate.net/publication/284136535_Twist_within_a_somersault) (snippet)
- Somersault axis, diving: **tuck 3.4–4.1, pike 6.8, layout 14.3–21.4** kg·m². Layout/pike is about 3.1. — [Univ. Amsterdam, "Splashing physics of springboard diving"](https://pure.uva.nl/ws/files/218263160/Splashing_physics_of_springboard_diving.pdf) (snippet)
- Normalized model: pike ≈ **0.0511·M·h²** and tuck ≈ **0.0222·M·h²**, so pike/tuck is about 2.3. — [arXiv 1811.04750, "Diving Body Shape Coefficient Setting Based on Moment of Inertia Analysis"](https://arxiv.org/pdf/1811.04750) (snippet)
- Teaching figures: layout about 15 → tuck about 3 kg·m² (5×). Opening out of a tuck makes the moment of inertia "about five times larger". — [UTA KINE 3301, Lesson 13](https://wweb.uta.edu/faculty/ricard/Classes/KINE-3301/Notes/Lesson-13.html); [U. Toronto, Physics of Somersaulting and Twisting](https://www.physics.utoronto.ca/~phy189h1/Physics%20of%20Somersaults%20and%20Twists.pdf) (snippets). Another set of notes gives layout 14 / pike 7 / tuck 4 kg·m², but it is teaching material, not measured data. — [knowt](https://knowt.com/note/df2834e1-e080-4860-be69-eb062194c84b/Moment-of-Inertia) (snippet). A looser guide says only "about half" (2×). — [Fiveable](https://fiveable.me/sports-biomechanics/unit-5/rotational-movements-sports-eg-gymnastics-diving/study-guide/ByhOkVbnXjKLFHOb) (snippet). The sources disagree: 2× is the outlier, 3.5–5× is the consensus.
- Tuck and pike keep rotation close to the maximum-inertia principal axis, which makes them stable. Layout is less stable. — [lboro / Yeadon aerial papers via search](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/aerial00.pdf) (snippet)

### Inferences
- **ESTIMATE, body only, 75 kg / 1.78 m adult, twist axis:**

  | Pose | I_twist (kg·m²) |
  |---|---|
  | standing, arms down | ~0.6–1.3 (central value ~1.0) |
  | arms overhead | ~0.9–1.0× arms-down |
  | T-pose | ~1.6–2.5 |
  | athletic crouch, arms half out | ~1.1–1.5 |
  | tucked, arms in | ~0.6–0.9 |

  Arms overhead come out slightly lower than arms down: the 16 → 25 ratio rise comes from both a lower twist inertia and a higher somersault inertia. In the tuck, the hips and knees fold close to the axis, but the feet stay apart on the board (see Q2).
- **ESTIMATE, snowboard stance correction:** the feet sit about ±0.27 m from the axis instead of ±0.1 m. The legs (about 2 × 12 kg) lean outward, which adds roughly **+0.4–0.6 kg·m²** about the twist axis compared with standing feet together. A grab does not remove this, because the feet stay bolted to the board.
- **Somersault axis, body only:** layout 12–19, open/extended crouch about 8–10 (ESTIMATE), pike about 7, tuck about 3.5–4.

### Gaps
- I could not retrieve the original Yeadon 1990, Hanavan 1964 or Dempster tables with per-pose kg·m² values (full texts blocked). Crouched/athletic and grab poses are not tabulated anywhere I found; they are ESTIMATES.

## Q2. Effect of the snowboard (1.6 m, ~3–4 kg, at the feet) on each axis

### Takeaway
For a spin, the board is a **fixed load of about 0.65–0.9 kg·m²** that no pose can reduce. That is about as large as the whole body's arms-down twist inertia, and it dilutes every pose change for spins. For flips, the board adds m·d². That term drops from about 3.5 to about 0.7 kg·m² when the board comes up to the hips, so the board **amplifies** the open/tuck difference for flips.

### Cited Findings
- No source in this search computed the board's inertia for snowboarding. The values below are textbook thin-plate formulas.

### Inferences
- **DERIVATION, spin (vertical axis through the board's centre, board horizontal):** I = m(L² + w²)/12 with L = 1.6 m and w = 0.27 m.
  - 3.0 kg → **0.66**
  - 3.5 kg → **0.77**
  - 4.0 kg → **0.88** kg·m²
  - The boots (about 1.2–1.5 kg each at ±0.27 m) add about 0.2 kg·m² on top, if the body model's feet don't already include them.
  - **Board plus boots ≈ 0.85–1.0 kg·m², constant in every pose.**
- **DERIVATION, flip with the board end over end** (axis perpendicular to the board: a tail- or nose-first backflip or frontflip): I_board = m(L²+w²)/12 + m·d², where d is the distance from the system's centre of mass to the board. With 3.5 kg:
  - d = 1.0 m (extended) → 4.3
  - d = 0.8 → 3.0
  - d = 0.6 → 2.0
  - d = 0.45 (tight tuck, board at the hips) → 1.5 kg·m²
- **DERIVATION, flip with the axis parallel to the board** (a body somersault about the shoulder-to-shoulder axis, which in a sideways stance runs along the board, e.g. a wildcat/side-flip): only m·d² counts. 3.5 → 0.7 kg·m² from extended to tucked.
- **DERIVATION, twist ratio with the board:** (body T-pose 2.0 + 1.0) / (body tuck 0.8 + 1.0) = 3.0 / 1.8 ≈ **1.7**. Without the board it would be 2.0 / 0.8 = 2.5. The board takes about a third out of the speed-up.

### Gaps
- No measured inertia for a rider plus board was found. The board's mass distribution (heavier at the inserts) would lower its mL²/12 term by perhaps 10–20%. That is an ESTIMATE.

## Q3. Measured spin rates for snowboarders and skiers; does the rate visibly rise after the grab?

### Takeaway
No measured deg/s or rad/s profile for big-air snowboard spins could be retrieved. Jiang et al. 2025 measured inertia and angular momentum at takeoff, but its tables were blocked. Rates derived from airtime are about 550–950°/s (10–16 rad/s), the same order as gymnast twist peaks of about 9–10 rad/s. I found **no source that measured a visible spin speed-up after the grab** in snowboarding.

### Cited Findings
- Jiang et al., *Applied Sciences* 15(12):6618 (2025): 11 riders from the Chinese national team, BS 720/1080/1440/1800 off a dry slope onto an airbag. The study analysed takeoff moment of inertia, angular momentum and rotational energy. Snippets say **the moment of inertia at takeoff increased with trick difficulty**, together with angular momentum and upper-trunk twist velocity. — [doi 10.3390/app15126618](https://doi.org/10.3390/app15126618); [ResearchGate](https://www.researchgate.net/publication/392647531_Biomechanical_Factors_for_Enhanced_Performance_in_Snowboard_Big_Air_Takeoff_Phase_Analysis_Across_Trick_Difficulties) (snippets; numbers not retrieved)
- Snowboard tricks on a trampoline (IMU vs markerless video): angular velocity, takeoff velocity and moment of inertia are the key indicators for adding rotation. — [ResearchGate 390411706](https://www.researchgate.net/publication/390411706_Comparative_analysis_of_inertial_measurement_units_and_markerless_video_motion_capture_systems_for_assessing_rotational_parameters_in_snowboard_freestyle) (snippet, via search)
- Google Cloud / U.S. Ski & Snowboard (2026) measures "Rotational Degrees" from video. One rider's trick measured about **1,122° of real rotation** against its nominal 1440. Corks tilt the axis 45–60°. No deg/s figures were published in the snippet. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/measure-physics-of-freestyle-snowboarding-and-skiing) (snippet)
- Figure skating, jumps: mean rotation rate **2.9 rev/s (single Axel), 4.3 (double), 4.9 (triple)**. Skaters add revolutions by rotating faster, not by staying in the air longer. A triple Axel needs more than 5 rev/s. — [King et al., "A biomechanical comparison of single, double, and triple axels", ISBS](https://ojs.ub.uni-konstanz.de/cpa/article/view/1695) (snippet)
  - Note: this differs from the "~2 rev/s" in docs/research/12-note-on_axis_spins.md. King's 4.9 rev/s is the better figure for triples.
- Gymnastics rings, double back straight with a full twist: peak angular velocity **10.0 and 9.05 rad/s**. — [ResearchGate 352746129](https://www.researchgate.net/publication/352746129_Kinematic_analysis_of_double_back_straight_somersault_and_double_back_straight_somersault_with_full_twist_on_rings) (snippet)
- A 2340 in about 2.5 s works out to about 940°/s on average (already in docs/research/12). — [Defector](https://defector.com/how-big-can-big-air-go)

### Inferences
- **DERIVATION:** effective spin time of 1.3 / 2.0 / 2.2 s for 720 / 1440 / 1800 gives about **550 / 720 / 820°/s** (9.7 / 12.6 / 14.3 rad/s).
- Skaters reach about 5 rev/s (1760°/s) because their in-air I is very small, roughly 1 kg·m² or less with arms crossed, and there is no board. A snowboarder carries at least about 1 kg·m² of board and boots, so for the same L the rate has to be lower. That fits 900–1000°/s as an upper limit.
- **Inference from Jiang:** elite riders take off **more open** (higher I) on harder tricks. That fits "load up L open at takeoff, then close up to spin". It supports a real but moderate speed-up when the rider closes into the grab.

### Gaps
- No angular-velocity time series for big-air spins (Jiang tables blocked, no IMU big-air study found). No study quantifies the rate before and after a grab.

## Q4. Realistic open → grab speed-up for spin, flip and cork; is 1.4 : 1 : 0.8 right?

### Takeaway
**For spin, the current ratio is about right:** open/tuck is 1.75 in the game against about 1.6–1.9 estimated. For **flips** it is too flat. The flip ratio should be roughly open : neutral : tuck ≈ **2.2 : 1 : 0.55**, so open/tuck ≈ 3.5–4. For **corks**, a value in between is reasonable, depending on axis tilt.

### Cited Findings
- Twist, body only: arms out vs down is 2.9× (Yeadon implementation), and "more than doubles" (Masaryk). — sources in Q1
- Somersault, body only: layout/tuck is about 3.5–5×, pike/tuck about 2–2.3×. — sources in Q1
- Worked spin examples in physics teaching material: 1.63 → 0.62 kg·m² (2.6×); 1.2 → 1.8 rev/s (1.5×). — [Pearson](https://pearson.com/channels/physics/exam-prep/set/default/16-angular-momentum/a-figure-skater-is-spinning-at-a-rate-of-12-revs-with-her-arms-extended-outwards) (snippets; textbook problems, not measurements)

### Inferences
- **ESTIMATE, total rider (75 kg) + board (3.5 kg) + boots, twist axis:**

  | Pose | I (kg·m²) | ω relative to neutral |
  |---|---|---|
  | open: T-pose, legs extended | ~2.8–3.2 | ×0.75 |
  | standing, arms down | ~1.9–2.0 | ×1.15 |
  | neutral: athletic crouch, arms half out | ~2.2–2.4 | 1 |
  | grab / tuck (knees up, hands to board) | ~1.6–1.8 | ×1.35 |

  - open/tuck ≈ **1.6–1.9** (central value 1.7)
  - neutral/tuck ≈ **1.3**
  - open/neutral ≈ **1.3–1.4**
- **Game (3.5 / 2.5 / 2.0):** open/tuck 1.75, neutral/tuck 1.25, open/neutral 1.4. This **fits the estimate**. The absolute values are about 10–20% high, which is plausible for a heavier rider with boots. **No change needed for spins.**
- **ESTIMATE, flips about the transverse axis** (board end over end, the typical backflip/frontflip):

  | Pose | I (kg·m²) |
  |---|---|
  | open (layout, board ~1 m from the centre of mass) | ~15 + 4.3 ≈ **18–20** |
  | neutral (open crouch) | ~8 + 2.5 ≈ **9–11** |
  | pike | ~7 + 2 ≈ 9 |
  | tight tuck / grab (board at the hips) | ~3.8 + 1.5 ≈ **5–5.5** |

  - open/tuck ≈ **3.5–4**
  - neutral/tuck ≈ **1.8–2**
  - Suggested game ratio for flips: **I_open : I_neutral : I_tuck ≈ 2.0 : 1 : 0.5–0.55**.
  - Because flips use L_f/I, a grab doubles the flip rate. With FLIP_MAX re-tuned for neutral, this matches what happens in diving and trampoline.
- **ESTIMATE, cork (axis tilted θ from the twist axis):** I_eff ≈ I_twist·cos²θ + I_flip·sin²θ. This simple principal-axis blend ignores the fact that L is fixed and the body precesses, but it works as a game model.

  | θ | I tuck | I neutral | I open | open/tuck |
  |---|---|---|---|---|
  | 45° | ~3.1 | ~5.6 | ~10.6 | ~3.4 |
  | 60° | ~3.8 | ~7.3 | ~14.3 | ~3.7 |

  - Practical choice: keep separate I tables for yaw (spin) and for the off-axis component (flip). The off-axis component (`wf = Lf / I` in `spin.ts`) should use the **flip** table.
  - This also means that **opening up slows the inversion much more than it slows the spin**. That matches the coaching advice that "opening levels the axis" (docs/research 12).

### Gaps
- None of this is measured on snowboarders. The flip and cork values come from diving and gymnastics data plus board arithmetic.

## Q5. How fast can a human tuck or untuck?

### Takeaway
I found no measured millisecond durations for tucking or untucking in the snippets I could reach.

### Cited Findings
- None of the trampoline and diving sources found (USA Gymnastics DD, NBC glossary, Wikipedia terms) gives timings. — [USA Gymnastics DD TR](https://members.usagym.org/PDFs/Forms/T&T/DD_TR.pdf); [NBC Olympics glossary](https://nbcolympics.com/post/9931) (snippets)
- A "puck" (an open tuck, halfway between pike and tuck) is used in multi-twisting somersaults. — [Wikipedia, Trampolining terms](https://en.wikipedia.com/wiki/Trampolining_terms) (snippet)

### Inferences
- **ESTIMATE (unsourced):** I would put arm adduction or abduction at about 0.15–0.25 s, a full tuck at about 0.25–0.4 s, and a grab (knees up plus reaching the board) at about 0.3–0.5 s.
- In the game, the change in I should be smoothed over roughly **0.2–0.35 s**, with ω = L/I(t) at every step, rather than switching instantly. This fits the pose sequence in docs/research/14c (rider compact within 15–25% of the airtime, grab released 0.2–0.4 s before landing).

### Gaps
- No high-speed-video data on tuck and untuck timing was found. The Yeadon simulation papers (lboro, blocked) may contain arm-movement durations for twisting.
