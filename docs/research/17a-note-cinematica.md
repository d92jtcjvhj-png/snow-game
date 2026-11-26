# Kinematics of off-axis rotations (cork, multi-cork, misty, rodeo, underflip): composition, axis tilt, inversions

ACCESS NOTE: WebFetch was blocked by DNS for every host tried (arxiv.org, ar5iv.labs.arxiv.org, core.ac.uk, wirednews mirror). Earlier notes (docs/research/12-note-off_axis_tricks.md) report the same for fis-ski.com, mdpi.com, lboro.ac.uk, wikipedia, redbull.com and snowboardaddiction.com. Every cited finding below comes from search-engine snippets, not full-page reads. The model in this note is a DERIVATION from standard rigid-body mechanics, checked numerically with a short Python script (scratchpad `cork.py`, `cork2.py`, `cork3.py`). It is marked as inference wherever no source states it.

What this adds to 12-note-off_axis_tricks.md. That note found that inversions = revolutions − 1 and concluded that "the axis is not constant". This note shows a different explanation. The **angular momentum axis can stay constant**. The n−1 pattern then follows from (a) the torque-free motion of a near-axisymmetric body and (b) the naming convention: degrees = 360 × flips + twist, with twist ≥ 180°.

## Q1. How is a cork composed, and why are inversions = revolutions − 1?

### Takeoff
Snowboard trick names add flips and twist. A double cork 1080 is "two flips + one twist" (720 + 360), and a rodeo 540 is "a backflip with a frontside 180". So inversions = number of flips, and degrees = 360·flips + twist. For tricks named in whole revolutions, the minimum non-trivial twist is 360°, because twist 0 would just be a double/triple backflip. For half-revolution names (540, 900, 1260, 1620) the minimum twist is 180°. That gives inversions ≤ floor((D − 180)/360), and elite whole-revolution corks sit exactly at that cap: n revolutions with n−1 inversions. In torque-free rigid-body terms (derivation below), the "flips" are the precession cycles of the body's long axis around the fixed angular-momentum vector L, and the "twist" is rotation about the body's own long axis. The nose's winding about L is exactly 360·N_flips + ψ_twist, so the naming convention has a geometric meaning.

### Cited Findings
- Double cork 1080 = "two head-over-heels flips with one full twist". — [NBC Sports explainer](https://www.nbcsportsphiladelphia.com/beijing-2022-winter-olympics/triple-cork-1080-chicken-salad-snowboarding-terms-explained/198491/)
- Rodeo = "A backflip with a frontside 180 on the y axis, opposed to the frontside cork 5 which is off axis". This gives rodeo 540 = 360 flip + 180 spin. — [FIS snowboard tricks list](https://www.fis-ski.com/DB/snowboard/park-and-pipe/tricks-list.html) (snippet, via 12-note)
- Double McTwist 1260 = "three-and-a-half twists and two flips in one piece of air", i.e. 1260° = 3.5 revolutions total, 2 of them flips. — [Olympics.com, Shaun White signature move](https://olympics.com/en/news/shaun-white-signature-move-double-mctwist-cork) (snippet)
- BS triple cork 1440 = "four full rotations" with "three off-axis dips". — [CBC, Craig McMorris](https://amp.cbc.ca/sports/olympics/winter/snowboard/craig-mcmorris-snowboard-1.3866081) (snippet)
- Quad cork 1800 = "four off-axis flips (or corks) and five full spins". — [Wired via Unofficial Networks](https://unofficialnetworks.com/2018/02/07/wired-magazine-asks-physicist-to-disect-the-physics-of-quad-cork-1800/); [Huck](https://www.huckmag.com/article/snowboarder-lands-worlds-first-quad-cork-1800) (snippets)
- Cab triple 1260 exists (Anna Gasser, 2018): 3 inversions in 3.5 revolutions. This shows that 3 inversions fit in 1260 when the twist is only 180. — [Olympics.com](https://olympics.com/en/news/anna-gasser-lands-historic-triple-cork) (via 12-note)
- In the Wired breakdown (physicist John Eric Goff) the quad needs "a simultaneous trunk twist and abdominal crunch" (~50 ft·lb of torque, at takeoff), and "during the first cork, he throws his left arm out to the side to adjust his rotational direction". — [Unofficial Networks summary of Wired](https://unofficialnetworks.com/2018/02/07/wired-magazine-asks-physicist-to-disect-the-physics-of-quad-cork-1800/) (snippet; full article not read)
- Aerials name tricks differently: each somersault is named with the twist it contains, e.g. "4x4" = four flips and four twists ("full, full, full, full"), "Lay Tuck Full" = triple backflip with one twist on the last flip. "The Daddy" = triple backflip with 1/2/1 twists. — [US Ski & Snowboard, aerial skiing 101](https://www.usskiandsnowboard.org/news/aerial-skiing-101); [FIS aerials 101](https://www.fis-ski.com/freestyle/news/moguls-aerials-2025-26/aerials-101-understanding-aerials-and-aerials-mixed-team) (snippets). In trampolining, "Triple Full" = one somersault with three twists. — [Wikipedia, Trampolining terms](https://en.wikipedia.com/wiki/Trampolining_terms) (snippet)

### Inferences
- DERIVATION (torque-free axisymmetric body; standard, not sourced to a snowboard paper). Model the rider plus board as a body with a symmetry axis ê = head–feet axis ("up"). C is the moment of inertia about ê (spin). A is the moment of inertia about any transverse axis (flip). In free flight L is fixed in space. The exact solution is
  `R(t) = Rot(L̂, Φ(t)) · R0 · Rot(ê, ψ(t))`, with `Φ̇ = |L|/A` (precession of the long axis around L) and `ψ̇ = L·ê (1/C − 1/A)` (twist about the long axis).
  The angle λ between ê and L is constant, because the axial component of L in the body frame is conserved for a symmetric body. This holds even when A and C change with pose (tuck or open), as long as the body stays symmetric.
- If the body leaves the lip upright (ê vertical) and L is tilted α from vertical, then λ = α. Then:
  - Up-vector height: `u_y(Φ) = cos²α + sin²α·cos Φ`. Its minimum is cos 2α at Φ = 180°. It returns to exactly 1 (fully upright) at every Φ = 360k.
  - The head goes below the feet only if α > 45°. Each precession cycle then gives exactly one inversion, so **inversions = N_p = Φ_total/360** (checked numerically for α = 50–85°, N_p = 1–4).
  - Fraction of each cycle spent inverted = `1 − acos(−cot²α)/180°`: 25 % at α = 50°, 39 % at 60°, 48 % at 75°, 50 % at 85°.
  - Inversions do not depend on α once α > 45°. They are set by |L|, A and airtime T: `N_p = |L|·T/(360°·A)`.
- DERIVATION: the board's nose (perpendicular to ê) winds around L by exactly `360·N_p + ψ_total` (numerical check: e.g. N_p = 2, ψ = 360 → 1080; N_p = 2, ψ = 540 → 1260; N_p = 4, ψ = 360 → 1800, for every tilt azimuth). So the media formula "flips + twist" is the rotation count about the angular momentum. That is a natural geometric definition of the trick's degrees. (The nose projection on the horizontal plane is NOT a reliable counter. It loses winding when the nose passes near vertical. In numerical tests it gave 360 instead of 1800 for α = 60°.)
- Why n−1 in practice. Write the twist ψ = D − 360·N. For whole-revolution names, N = n would need ψ = 0, which is a straight multiple backflip/wildcat, named as a flip and not as degrees. So the maximum is N = n − 1 with ψ = 360. For half-revolution names, ψ ≥ 180. Rule: **N_max = floor((D − 180)/360)**: 540 → 1, 720 → 1, 900 → 2, 1080 → 2, 1260 → 3 (cab triple 1260) or 2 (DC 1260), 1440 → 3, 1620 → 4, 1800 → 4. Elite whole-revolution corks use this cap. Single corks 900/1080 (N = 1, ψ = 540/720) are legal but less inverted versions.
- Ratio law (derived): `ψ/(360·N) = cos α · (A/C − 1)`. For a fixed named trick, more inversions mean a smaller twist share, which needs a larger α (a flatter, more "flippy" axis). With the game's neutral inertias (A = IF_NEUTRAL = 8.5, C = I_NEUTRAL = 2.5, A/C = 3.4): cork 720 → α ≈ 65°, DC 1260 → 72°, cork 540 / DC 1080 → 78°, TC 1440 → 82°, quad 1800 → 84°. These α are high: the maximum body tilt 2α reaches 156° for a DC 1080. Real riders look less upside-down, which points to a smaller effective A/C when tucked (with A/C ≈ 2, a DC 1080 gives α = 60° and a maximum tilt of 120°). No source gives the real values.
- Misty / rodeo / underflip / cork differ only in (a) the azimuth of L's tilt relative to the board's heading and the travel direction (back, side or forward), and (b) the spin direction. Rodeos and misties are the high-α end (α near 90°, flip-dominated). Corks are α ≈ 50–80°. In this model a rodeo 540 is N = 1, ψ = 180 with α close to 90°. Because `ψ̇ = L_s(1/C − 1/A)` has the sign of the vertical part of L, twist and precession always run in the same sense, so the degrees add (not subtract). That matches the convention.

### Gaps
- No source measures α (tilt of L) or the λ angle for snowboard corks. Jiang et al. 2025 ([Applied Sciences 15(12):6618](https://www.mdpi.com/2076-3417/15/12/6618)) measured takeoff angular momentum and moment of inertia for BS 720/1080/1440/1800 (11 Chinese national-team athletes, airbag), but the numbers were not retrievable (mdpi blocked). Its abstract says that harder tricks came with higher angular momentum and a higher moment of inertia at takeoff.
- No source confirms the "flips + twist = rotations about L" equivalence. It is my derivation. No official FIS counting rule was retrieved.
- Inversion count for 1980/2160/2340 remains unsourced (the cap formula predicts ≤ 4 / 5 / 5).

## Q2. Is the axis constant? What does the rider look like over time, and where are the inversions?

### Takeoff
In the torque-free model, L (the angular-momentum axis) is constant from pop to landing. What changes is the body's long axis, which sweeps a cone around L, and the **instantaneous rotation axis ω**, which also moves. At takeoff and landing the body is upright and the rotation looks like a near-flat spin, because the body's up vector leaves vertical only quadratically: `du_y/dΦ = −sin²α sin Φ`. ω starts ~35–70° from vertical, swings to ~100° in the middle of each cork, and comes back. Each inversion is centred at Φ = 180° + 360k. With constant rates, a single cork (540/720) has its head-lowest point at mid-trick. A double cork has its lowest points at about ¼ and ¾ of the trick and a brief near-upright pass at mid-trick (consistent with the coaching advice to finish the first cork by 540–630° of a 1080). Yeadon's twisting-somersault theory gives the same picture in the complementary case (L horizontal): tilt is set mostly at contact, adjusted ±4–8° by arms in flight, twist lasts until tilt is removed, and for a non-rigid, asymmetric body the tilt oscillates (nutation) with a period of half a twist.

### Cited Findings
- Yeadon: twist rate in a twisting somersault ≈ (h/C − φ̇) sin θ, where θ = tilt, φ̇ = somersault rate, h = angular momentum and C = moment of inertia about the twist axis. The ratio of twist and somersault rates "may be expressed as a function of the tilt angle" (Eaves 1969 and others) for a rigid body with an axis of symmetry. — [Yeadon 1993 Part I, core.ac.uk](https://core.ac.uk/download/288388971.pdf); [Yeadon Part IV, core.ac.uk](https://core.ac.uk/download/288388471.pdf) (snippets)
- "A gymnast can introduce twist into a somersault by producing tilt during the flight phase… will continue to twist until he or she removes the tilt and returns to the vertical somersault plane." Twist made this way is "tilt twist", the main in-flight mechanism. — [Yeadon, The physics of twisting (twistphysics00)](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/twistphysics00.pdf) (snippet)
- Contact (takeoff) techniques gave ~30 % of the tilt in one study. Tilt at mid-twist is used as the measure of twisting potential. Introducing twist changes the somersault rate by < 1 %. — [core.ac.uk 288388981](https://core.ac.uk/download/288388981.pdf); [Yeadon 1993b](https://dspace.lboro.ac.uk/2134/5320) (snippets)
- Nutation: in the twisting mode the long axis nutates and the tilt oscillates between bounds set by the three principal moments of inertia. The nutation period equals the period of a half twist. Tilt variation is greatest at odd quarter twists. An invariant links the tilts at twist 0° and 90°: `[1 − C/A] cos²α = [1 − C/B] cos²β`. A slow arm movement plus nutation increases tilt during the first quarter twist. — [Yeadon, nutation paper](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/nutation.pdf) (snippets)
- Arm movement through 180° gives ~8° of tilt without equipment and ~4° with skis and boots. In a freestyle-ski triple somersault, lowering one arm gave a 4° tilt that started the twist. Skis raise the moment of inertia about the tilt axis more than about the twist axis. — [Yeadon, Loughborough](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/twistflight97.pdf); [ISBS proceedings, Konstanz](https://ojs.ub.uni-konstanz.de/cpa/article/view/3076/2884) (snippets)
- Frohlich was first to show that shape change can make rotations even with zero angular momentum, and how a diver in pure somersault can start a twist mid-flight. Dullin & Tong reduce the twisting somersault to a time-dependent Euler equation and recover the somersault angle by a geometric-phase formula. — [Dullin & Tong, arXiv 1510.08046](https://arxiv.org/pdf/1510.08046) (SIAM J. Appl. Dyn. Syst. 2016); [Diver with a rotor, arXiv 1510.02978](https://arxiv.org/pdf/1510.02978) (snippets)
- Double cork coaching: "finish the first cork by 630°, … even 540°". Grab at ~360° (a grab as late as 540° turns a DC 1080 into a 1260). The ideal second-cork dip is "straight back". — [Newschoolers, How to double cork part 1](https://newschoolers.com/news/read/How-Double-cork-Part-1-double-cork-trampoline) (snippet, freeski)
- A cork "requires rotating whilst both upside down and angled, never directly vertical or horizontal". — [Snowboarding Days](https://www.snowboardingdays.com/?p=7738) (snippet)

### Inferences
- DERIVATION: instantaneous ω = Φ̇·L̂ + ψ̇·ê(t). With the game inertias and the DC 1080 solution below (Φ̇ ≈ 327°/s, ψ̇ ≈ 164°/s, α = 78°), ω is 54° from vertical at takeoff and 102° at the middle of each cork. For a cork 720 (α = 65°) it is 33° → 98°. For a TC 1440 it is 65° → 100°. So "the axis starts near vertical, tilts off and comes back" is true of the visible ω axis and of the body, while L stays fixed. There is no need to script an axis change.
- Real riders are not rigid or symmetric. Arms and shoulders give a few degrees of tilt (Yeadon), and nutation adds wobble. A small in-air authority of ±5–10° over λ is realistic. Large tilt changes in the air are not.
- Pose changes the timing, not the count geometry. A tuck lowers A and C and speeds up both Φ̇ and ψ̇. Opening raises them and slows both. Since A and C change by different factors (game: K_OPEN_FLIP 1.53 vs K_OPEN_SPIN 1.4), opening also changes the ratio slightly. This is how a rider makes the flip close (Φ = 360k) and the heading land (ψ = 180k) at the same time.
- Phase of the inversions: head lowest at Φ = 180° + 360k. With constant rates that is time `T·(2k+1)/(2N)`: single cork at 50 %, double at 25 % / 75 %, triple at 17 / 50 / 83 %, quad at 12.5 / 37.5 / 62.5 / 87.5 %. A mid-air tuck shifts the middle ones earlier.

### Gaps
- No video kinematics of snowboard corks (time series of body tilt) were found to confirm whether riders really pass near upright between the two dips of a double cork, or stay tilted. Coaching wording ("finish the first cork by 540–630°", "two dips") is consistent with a near-upright pass, but it is not proof.
- Wired/Goff full text (arm-out "adjust direction" in the first cork) not read.

## Q3. What geometric definition of "inversion" is used?

### Takeoff
The working definition across glossaries is "the head goes beneath the board at some point". A flat spin is one where "the head never goes below the board". A cork is "tilted but not fully inverted". No official FIS geometric threshold was found. In game terms the natural test is the body's up vector pointing below horizontal (u_y < 0), i.e. head below feet / board above head, counted once per downward crossing.

### Cited Findings
- WSF: "Inverted: The head is beneath the board at some point". "Cork / Off-Axis: A rotation where the axis is tilted but not fully inverted". — [World Snowboard Federation glossary](https://www.worldsnowboardfederation.org/glossary/) (snippet)
- NBC: "Flat spin: A type of rotation where the rider does not get inverted. In other words, their head never goes below their board during the spin." — [NBC Olympics snowboarding glossary](https://www.nbcolympics.com/news/snowboarding-101-glossary) (snippet)
- Freeski: a cork is a backward off-axis spin in which the feet should never pass over the head, versus the D-spin, where the feet come to about head level or slightly above. Judges assess whether a trick is "within an acceptable axis range" as part of form. — [Wikipedia, Freeskiing](https://Www.wikipedia.org/wiki/Freeskiing); [NBC freestyle skiing glossary](https://www.nbcolympics.com/news/freestyle-skiing-101-glossary) (snippets). CONFLICT: snowboard glossaries say corks do invert (double = two inversions), while the freeski entry says the feet never pass over the head. These are different meanings of "inversion": a full head-over-heels position versus head merely below the board.
- FIS trick list uses "In" (inverted) as a label without a definition in the snippet. The FIS SB/FS/FK glossary (v2.5/2.6) exists but was not read. — [FIS tricks list](https://www.fis-ski.com/DB/snowboard/park-and-pipe/tricks-list.html); [FIS glossary v2.6](https://assets.fis-ski.com/f/252177/x/eb662ae469/glossary-sbfsfk-rules-v-2-6_clean.pdf)

### Inferences
- Game test: count an inversion when `u_y` crosses from ≥ 0 to < 0, with a small hysteresis (e.g. require u_y < −0.05 to count and > +0.05 to re-arm) so that grazing the horizontal at α ≈ 45° does not flicker. Optionally use "board above head" = board centre higher than the head, which is the same as u_y < 0 for a rigid rider.
- A "deep" (fully upside-down) cork needs α near 90°. With α = 50–60° the rider only dips 10–30° below horizontal (u_y min = cos 2α = −0.17 to −0.5). That matches "tilted but not fully inverted". The freeski "feet never over the head" is roughly α ≤ 45–55°.

### Gaps
- Official FIS judges' handbook threshold not retrieved (blocked).

## Q4. How should the game drive it? (replacing yaw(φ)·pitch(θ) with independent L_f)

### Takeoff
The current model (orientation = yaw(φ)·pitch(θ), with θ driven by an independent L_f/I_f) inverts whenever θ passes 180°, regardless of how much spin there is. So a weak spin with any push gives a full head-down flip. Recommended: treat the two powers as **one angular-momentum vector** `L = L_s·ŷ + L_f·ĥ` (ĥ = horizontal direction set by the trick family), tilt `α = atan2(L_f, L_s)`, and use the exact torque-free solution `R = Rot(L̂, Φ)·Rot(ŷ_body, ψ)`, with `Φ̇ = |L|/A(pose)` and `ψ̇ = L_s(1/C(pose) − 1/A(pose))`. Inversions then appear only when L_f > L_s (α > 45°). Their count is Φ/360. The trick's degrees are Φ + ψ. The body lands upright only when Φ is a multiple of 360. A "pilot" layer can pick L_f at the pop so that N = min(round(push·N_max), N_max) with N_max = floor((D − 180)/360). Deterministic, closed form, no three.js needed.

### Cited Findings
- Spin rate and axis are set at takeoff. Angular momentum cannot change in the air. Arms in = faster, out = slower. — [Scientific American](https://www.scientificamerican.com/article/olympic-big-air-snowboarders-use-physics-to-their-advantage/) (snippet)
- Harder BS tricks (720→1800) showed higher takeoff velocity, joint extension and angular momentum, and an increased moment of inertia at takeoff. — [Jiang et al. 2025](https://www.mdpi.com/2076-3417/15/12/6618) (abstract snippets)
- Yeadon: contact (takeoff) technique gives most of the tilt. Aerial arm technique adds only a few degrees. — see Q2 citations.

### Inferences
- PROPOSED MODEL (derived; numbers use the current config `I_NEUTRAL = 2.5`, `IF_NEUTRAL = 8.5`):
  1. At the pop: `L_s` from the charge (as now), `L_f` from the push (as now), `|L| = √(L_s² + L_f²)`, `α = atan2(L_f, L_s)`, `L̂ = cos α·ŷ + sin α·ĥ`, with ĥ by family: cork → tilt so the body dips toward the heel/toe side matching the spin; misty → forward; rodeo/underflip → backward.
  2. Each step: `Φ += |L|/A(pose)·dt`, `ψ += L_s·(1/C(pose) − 1/A(pose))·dt` (pose from the existing springs/GRAB_K). Orientation `R = Rot(L̂, Φ)·Rot(ŷ, ψ)` in the takeoff frame. A pure flip (`mode = 'flip'`, L_s = 0) is the same formula with α = 90° and ψ̇ = 0.
  3. Head height `u_y = cos²α + sin²α·cos Φ`. Inversion counted on a downward zero crossing (with hysteresis).
  4. Landing checks: residual body tilt `acos(u_y)` (needs Φ ≈ 360k), and heading from ψ + Φ against the 180k target (12/13 bands). Named degrees = round((Φ + ψ)/180)·180, inversions = round(Φ/360) if α > 45°.
- Worked targets (constant rates, airtime T assumed; rates in °/s, L in "°/s·kg·m²" like the code):

  | Trick | T (s) | N | ψ | |L| | L_s | L_f | α |
  |---|---|---|---|---|---|---|---|
  | cork 540 | 1.5 | 1 | 180 | 2040 | 425 | 1995 | 78° |
  | cork 720 | 1.6 | 1 | 360 | 1912 | 797 | 1739 | 65° |
  | DC 1080 | 2.2 | 2 | 360 | 2782 | 580 | 2721 | 78° |
  | DC 1260 | 2.3 | 2 | 540 | 2661 | 832 | 2528 | 72° |
  | TC 1440 | 2.4 | 3 | 360 | 3825 | 531 | 3788 | 82° |
  | quad 1800 | 2.6 | 4 | 360 | 4708 | 490 | 4682 | 84° |

  Formulas: `|L| = 360·N·A/T`, `L_s = (D − 360N)/(T·(1/C − 1/A))`. Current caps: L_s max = OMEGA_MAX·I_NEUTRAL = 1900, L_f max = OFF_MAX·IF_NEUTRAL ≈ 3315. So corks up to the double fit today, while triples/quads need a larger L_f (or tucked A). Grabs (GRAB_K) lower A and make these reachable. That is consistent with "multi-corks need more angular momentum" (Jiang).
- Consequences that fix the reported problem. A small push (L_f < L_s) gives a tilted flat spin (cork-looking dip, no inversion; max tilt 2α < 90°). Inversions need the off-axis momentum to dominate. With a small spin and a big push you get a flip-dominated rodeo/misty (one inversion, little twist), which is the real-world result. No "inverts too often" artefact.
- Optional assisted layer (if pure physics is too hard to land):
  - At the pop, predict the airtime T from the ballistic arc and the landing surface (bigair.ts).
  - Predict the named degrees D from the charge, snapped to 180.
  - Set `N_max = floor((D − 180)/360)` and `N = min(round(push·N_max), N_max)`. Push 0 → flat spin; full push → elite n−1 cork.
  - Solve `|L| = 360·N·A/T` and `L_s = (D − 360N)/(T(1/C − 1/A))`, and set L_f from them.
  - The pose then only fine-tunes timing: tucking over-rotates, opening under-rotates.
  - Keep the solve at the pop only, so the flight stays deterministic physics and not a scripted animation.
- In-air axis authority: allow at most ±5–10° change of λ (arm/shoulder), per Yeadon's 4–8°. Do not let the stick change α freely in the air.

### Gaps
- Effective A/C for a snowboarder with a board (tucked vs open) is not sourced. The game's 8.5/2.5 gives α values that look more inverted than real corks. Tuning against video is needed.
- No source for airtimes per trick (T values above are estimates carried over from 12-note).
- The axisymmetric model ignores A ≠ B (flip about the lateral axis vs the front–back axis differ for a rider on a board) and so ignores nutation. Yeadon's invariant `[1 − C/A]cos²α = [1 − C/B]cos²β` could add it later if wanted.
