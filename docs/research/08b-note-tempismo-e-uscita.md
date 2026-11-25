# How set-up timing fixes the takeoff point and the exit angle at the lip

**Source access note.** WebFetch could not reach snowboardaddiction.com or assets.fis-ski.com (DNS ENOTFOUND, because the hosts are outside the session's network allowlist). Earlier notes 04–07 record the same blocks for whitelines.com, ridestore.com, trick-tips.com and others. Every coaching citation below therefore comes from **WebSearch snippets or summaries**. Quoted wording is near-verbatim at best: the search tool sometimes paraphrases, so check the full pages before quoting them exactly. Material already in notes 04/06/07 is referred to rather than repeated. Anything labelled **[DERIVATION]** is my own geometry, computed in Python (scratchpad `geo.py`). Anything labelled **[ESTIMATE]** is a reasoned value with no source.

Conventions: regular rider. A "set-up S" means the takeoff-edge swing-out, then the set-up carve on the opposite edge, then the return arc on the takeoff edge, as in `src/physics/approach.ts` and docs/research 07. The "came-from side" is the side of the kicker axis that the S swings out to. ψ is the heading relative to the kicker axis.

## Q1. What coaches say happens when the set-up starts too early vs too late

### Takeaway
Coaching sources describe "too early" in concrete, consistent terms. The board is still turning, or has turned too much, **in/on the lip**. The rider scrubs speed, starts rotating before takeoff, leaves on a diagonal and **drifts off to the side of the landing**. "Too late" is barely described. I found no coaching phrase saying "coming in across the kicker" or "no time to set the edge" tied to a late set-up. The nearest real-world descriptions are a rushed edge change at the lip and a speed check too close to the lip (see note 06).

### Cited Findings
- SA, frontside 360 problems (search summary): "If you set up too early, you end up turning too much in the lip", which makes you "brush off speed when leaving the lip and drift off to the side of the landing." — [Snowboard Addiction, How To Improve Your Frontside 360s](https://snowboardaddiction.com/blogs/spins/16098668-top-3-problems-when-learning-how-to-frontside-360-on-a-snowboard)
- The same SA family (summary): riders "carving too far" end up "already spinning some of the 360 and 'scrubbing' off the lip of the jump". This "will totally kill your momentum and air stability". — [SA, How To Spin 360's, 540's & 720's](https://snowboardaddiction.com/blogs/jumping/10481297-how-to-spin-frontside-180s-360s-540s-720s-on-large-jumps)
- SA: "Don't carve too hard in your set up, because you don't want to rely on the set up for your rotation. You should still be using your upper body to initiate the spin." — [SA, Frontside 360 On Park Jumps](https://snowboardaddiction.com/blogs/training-education/how-to-frontside-360-on-park-jumps) (snippet; attribution within the SA family is uncertain)
- SA, frontside 180 (summary): a failed set-up carve often makes you "fly off on a diagonal". The board should be "perpendicular to the jump" at takeoff, which lands you in the landing's "sweet spot". — [SA, Ultimate Guide to Frontside 180s](https://snowboardaddiction.com/blogs/news/16927500-the-ultimate-guide-to-frontside-180s-on-a-snowboard)
- SA, backside 180 (summary): setting up too early makes the board leave at an angle and adds rotation before takeoff. The fix is to shift to the toe edge "as you are rolling up the lip". — [SA, Improve Your Backside 180s](https://snowboardaddiction.com/blogs/training-education/17257876-improve-your-backside-180s)
- Whitelines: "Don't start carving across the kicker too early, or you'll drift sideways over the landing and maybe even fall off the side of the jump". The turn and pop should "all happen right at the lip". This is already in note 04. — [Whitelines BS 360 Ben Kilner](https://whitelines.com/snowboarding-advice/trick-tips/kicker/snowboard-bs-360-ben-kilner.html)
- **Late:** a Medium rider-coach piece on FS 180s lists a "late edge change" as a common result of going into the jump too slowly. The snippet gives no detail on the takeoff line. — [Maverix Snow, The Keys to landing Frontside 180's (Medium)](https://medium.com/@maverixsnow/the-keys-to-landing-frontside-180-s-on-a-snowboard-1ad6fdcf8ed9)
- **Late (dissenting, anecdotal):** a Pinkbike comment on a 360 critique suggests turning into the lip *earlier*, at its peak. This is a rider's opinion, not credited coaching. — [Pinkbike video 189677](https://www.pinkbike.com/video/189677/)
- I found no source with the phrases "still on the wrong edge", "coming in across the kicker" or "no time to set the edge" tied to a late set-up. Searches aimed at them returned only the "too early" material above (searches run 2026-11-25).

### Inferences
- The coaching description of "too early" is literally the "S ends before the lip, the rider keeps carving on the takeoff edge" case. "Turning too much in the lip" means a residual takeoff-edge curvature on the ramp.
- The coaching picture of "too late" has to be built from physics (Q3). If a set-up S is cut short by the lip, the rider takes off before the return arc has straightened the board. They are therefore heading across the kicker, i.e. "hitting the lip at an angle", but toward the *opposite* side from the early case.

### Gaps
- No coaching source states, for a late set-up, which side of the lip the rider ends up on or which way they fly.
- No source gives timing in seconds or metres (as in note 06).

## Q2. Which way does the rider exit: toward the set-up carve's side or away from it? FS heel vs BS toe

### Takeaway
Coaches only say "drift off to the side" or "fly off on a diagonal". They do not say which side. Geometry gives a clear and symmetric answer **[DERIVATION]**. **Early**: the extra takeoff-edge carve turns the rider back toward the came-from side, so they fly toward the takeoff edge's turning side: **heel side for FS, toe side for BS**. **Late**: the lip arrives while the board still points across the kicker, coming from the came-from side, so they fly toward the **set-up carve's side**, i.e. **toe side for FS, heel side for BS**. In both cases the takeoff point sits on the came-from side, off-centre.

### Cited Findings
- Edge sequences that fix the sides: FS = heel → toe ("towards the side of the jump") → heel on the lip; BS = heel ("towards the side of the jump") → toe while riding up the lip. — [SA, Entry Paths For Spinning](https://snowboardaddiction.com/blogs/spins/entry-paths-for-spinning) (snippets; also in notes 07/07a)
- For FS heel takeoff (search summary): "a toeside carve roughly parallel to the jump, then a transition to heelside to carve up and off the lip". — [SA, Frontside 360 On Park Jumps](https://snowboardaddiction.com/blogs/spins/how-to-frontside-360-on-park-jumps)
- Turn sense: for a regular rider, a toe-side carve curves the path to skier's right and a heel-side carve to skier's left. Frontside rotation is counter-clockwise from above, the same sense as a heel turn. — note 07a (docs/research/07a-note-geometria-linea.md, sourced there)
- Over-carving on the takeoff edge gives pre-rotation in the spin direction. The rider has "made some of your rotation even before you leave the jump". — [SA, Backside 360 On Park Jumps](https://snowboardaddiction.com/blogs/training-education/how-to-backside-360-on-park-jumps) (snippet, in note 06)

### Inferences [DERIVATION]
- Return arc geometry: the rider comes back from the came-from side (+x) with heading pointing toward the axis (ψ < 0). The takeoff-edge curvature (> 0) brings ψ back to 0 exactly at x = 0.
  - **Late** (lip at an arc-length Δs before the end): x_lip ≈ +Δs²/(2R) (still on the came-from side), ψ_lip ≈ −Δs/R (pointing across the axis, toward the far side). The rider crosses the centreline in the air. The yaw is "un-turned": the board still has the opposite-edge set-up carve's direction, so there is no pre-rotation in the spin direction.
  - **Early** (S ends Δs before the lip, the rider keeps carving at radius R): x_lip ≈ +Δs²/(2R) (drifted back toward the came-from side), ψ_lip ≈ +Δs/R (pointing back out toward the came-from side). The extra heading is in the spin direction. This is coaching's "pre-rotation", plus drift toward the takeoff edge's side.
- Applied to a regular rider:
  - **FS (heel takeoff, heel = skier's left)**: early → exits toward skier's left (heel side), with pre-rotation. Late → exits toward skier's right (toe side), against the spin.
  - **BS (toe takeoff, toe = skier's right)**: early → exits toward skier's right (toe side), with pre-rotation. Late → exits toward skier's left (heel side).
  - Goofy riders are mirrored.
- With the shape used by `approach.ts` (swing-out on the takeoff edge), the came-from side **is** the takeoff edge's side: heel side for FS. Early riders therefore take off slightly heel-side of centre and fly further heel-side. Late riders take off heel-side of centre and fly toward the toe side.

### Gaps
- No real-world source (video analysis, coaching) confirms which side early or late riders actually land on. This is pure geometry.

## Q3. Lateral position and heading at the lip vs timing error (±0.25, 0.5, 1 s)

### Takeaway
**[DERIVATION]** On a return arc of R = 30–50 m at 55–75 km/h, an early error (continued carve) of 0.25 s gives ψ ≈ 4–10° and x ≈ 0.15–0.45 m. At 0.5 s it gives ψ ≈ 9–20° and x ≈ 0.6–1.8 m. At 1 s it gives ψ ≈ 17–40° and x ≈ 2.3–7 m, which is beyond a big-air kicker's half-width. Late errors are **capped by the S itself**: the residual heading can never exceed the S's peak heading. A 1–2 m set-up S at R 30–50 m has a peak of only about 8–15°. Late errors therefore saturate at about 10–15° and about 1–2 m. Their main real cost is the rushed edge change and skid (note 06), not geometry.

### Cited Findings
- Input ranges (arc radius 30–50 m, 55–75 km/h, set-up 25–40 m long, offset ~1–2 m) are taken from docs/research 07 / 07b (derivations and snippets cited there), not re-sourced here.
- Big-air lip speeds of this order fit Olympic in-run geometry: Livigno has a 75 m in-run at 39°, a 5 m jump height and 18 m from take-off to knoll. Shougang has an 85 m in-run at 30°, 5 m height and 20 m take-off to knoll. — [Olympedia, Livigno BA](https://www.olympedia.org/results/19020738); [Olympedia, Shougang BA](https://www.olympedia.org/results/15001235) (snippets; exact result-page mapping unverified)

### Inferences [DERIVATION, g-free kinematics]
**A. Two-arc S (circular arcs, radius R).** For an S of offset d made of two equal opposite arcs: θ = acos(1 − d/2R). Length 2Rθ.
| R | d = 1 m | d = 1.5 m | d = 2 m |
|---|---|---|---|
| 30 m | θ 10.5°, 11 m | 12.8°, 13 m | 14.8°, 16 m |
| 40 m | 9.1°, 13 m | 11.1°, 16 m | 12.8°, 18 m |
| 50 m | 8.1°, 14 m | 9.9°, 17 m | 11.5°, 20 m |

So a pure S with that much offset is only 11–20 m long. A 25–40 m line includes a swing-out arc and/or straight segments. **The peak heading in any 1–2 m S is about 8–15°.**

**Continued carve (early), or position on the last arc (late, valid only while Δs < one arc ≈ 6–10 m):** ψ = vΔt/R, x = R(1 − cos ψ), lateral velocity v·sin ψ.
| v | R | Δt 0.25 s | 0.5 s | 1.0 s |
|---|---|---|---|---|
| 55 km/h | 30 m | 7.3°, 0.24 m, 1.9 m/s | 14.6°, 0.97 m, 3.9 m/s | 29°, 3.8 m, 7.5 m/s |
| 55 | 50 | 4.4°, 0.15 m, 1.2 m/s | 8.8°, 0.58 m, 2.3 m/s | 17.5°, 2.3 m, 4.6 m/s |
| 65 | 30 | 8.6°, 0.34 m, 2.7 m/s | 17.2°, 1.35 m, 5.4 m/s | 34.5°, 5.3 m, 10.2 m/s |
| 65 | 40 | 6.5°, 0.25 m, 2.0 m/s | 12.9°, 1.0 m, 4.0 m/s | 25.9°, 4.0 m, 7.9 m/s |
| 65 | 50 | 5.2°, 0.20 m, 1.6 m/s | 10.3°, 0.81 m, 3.2 m/s | 20.7°, 3.2 m, 6.4 m/s |
| 75 | 30 | 9.9°, 0.45 m, 3.6 m/s | 19.9°, 1.8 m, 7.1 m/s | 39.8°, 7.0 m, 13.3 m/s |
| 75 | 50 | 6.0°, 0.27 m, 2.2 m/s | 11.9°, 1.1 m, 4.3 m/s | 23.9°, 4.3 m, 8.4 m/s |

- **Early** uses this table directly, as long as the rider really holds the carve. A 1 s early error at R 30–40 m is not physical for a competent rider: they would flatten the board or the takeoff would be ruled out.
- **Late**: the table is valid only for Δs up to about one arc (≈ 0.35–0.6 s). Beyond that the lip falls in the set-up arc, where |ψ| ≤ θ ≈ 8–15°, and the offset is at most d (1–2 m). Late Δt = 1 s ⇒ ψ about ±10°, x about 1–2 m, with the sign depending on which arc the lip falls in.
- Drift in the air **[ESTIMATE]**: with roughly 2 s from lip to landing on a big air (take-off to knoll 18–20 m, sweet spot further down), the lateral displacement ≈ 2·v·sin ψ. That is about 3–7 m at 0.25 s early and 5–14 m at 0.5 s early.

**B. The game's smooth profile** (`approach.ts`: ψ = A(sin 2πu − ½ sin 4πu), peak offset D = A·L/π, curvature zero at the ends). If the lip falls inside this S (late, u = 1 − vΔt/L):
| v, L, D | late 0.25 s | late 0.5 s | late 1.0 s |
|---|---|---|---|
| 65 km/h, 25 m, 1 m | −3.8°, 0.08 m | −9.1°, 0.67 m | +8.3°, 0.34 m |
| 65, 25, 2 m | −7.5°, 0.17 m | −18.1°, 1.35 m | +16.6°, 0.69 m |
| 65, 40, 1 m | −0.7°, 0.01 m | −3.8°, 0.18 m | −2.6°, 0.95 m |
| 65, 40, 2 m | −1.4°, 0.03 m | −7.5°, 0.36 m | −5.3°, 1.91 m |
| 75, 25, 2 m | −10.3°, 0.27 m | −13.4°, 1.74 m | +6.2°, 0.13 m |
| 55, 25, 2 m | −5.0°, 0.09 m | −18.2°, 0.90 m | +16.3°, 1.56 m |
(The sign of ψ is relative to the came-from side: − means heading across toward the far side. x is on the came-from side.)
- Because the curvature is zero at u = 1, ψ grows only ∝ δ³ near the end, where δ = 1 − u. A small late error (≤ 0.25 s on a 40 m line) is almost harmless geometrically. Mid-S lips (0.5 s late on a 25 m line) give the worst heading, about 9–18°. Very late errors can even flip the sign of ψ, because the lip then falls in the swing-out half. Late errors are thus **non-monotonic** in this model. Note that `approach.ts` currently does *not* truncate the S when late. It compresses the S into the remaining distance (curvature beyond grip → skid, quality 0.6–1), so the lip state stays centred and straight but degraded. That is closer to the coaching picture ("rushed", note 06) than truncation is.

### Gaps
- No measured data exist on real riders' heading or offset error at the lip vs timing.
- Flight time to the landing sweet spot for a given big air was not found. The 2 s figure is an estimate.

## Q4. How far off-centre can a takeoff be and still be "a jump"?

### Takeaway
FIS sets a **minimum kicker width of 5.0 m** for Big Air (Level B/C). Big World Cup structures are much wider overall: Klagenfurt 2025 is 19 m wide, but that is the whole structure, not the lip. No source gives a lip width for the Olympic jumps or a tolerance for off-centre takeoffs. **[ESTIMATE]** On a 5–8 m lip, a takeoff up to about 2–3.5 m off-centre still leaves from the ramp. In practice the stricter limit is the landing: heading error × flight time must keep the rider inside the landing's width.

### Cited Findings
- FIS technical data (SBX / Big Air etc., Level B and C): "Width of kicker min. 5.0 m"; drop-in ramp width min 5.0 m; kicker height min 2.0 m; takeoff angle min 25°; takeoff-to-landing distance min 10 m. — [FIS Precisions SB/FS/FK Southern Hemisphere 23/24 (snippet)](https://assets.fis-ski.com/image/upload/fis-prod/assets/Precisions_SBFSFK_Southern_Hemisphere_2324.pdf); see also [FIS BA venue requirements](https://assets.fis-ski.com/f/252177/da7ded1e56/ba-venue-requirements.pdf) (not fetchable)
- Conflict: NBC quotes FIS specs as drop-in ≥ 30 m, takeoff ≥ 25°, takeoff-to-landing ≥ 15 m. This probably reflects a higher-level spec than Level B/C, but that is unverified. — [NBC Olympics, Snowboarding 101 rules](https://www.nbcolympics.com/news/snowboarding-101-rules)
- Klagenfurt 2025 Big Air structure: height 45 m, length 105 m, width 19 m (overall structure). — [NUSSLI, Big Air Klagenfurt 2025](https://www.nussli.com/en/projects/big-air-klagenfurt-2025)
- ASTM F3557 lists "width of takeoff at the lip", "width at top of landing" and "width at toe of landing" as measurable features, but explicitly prescribes no values. — [ASTM F3557-22 sample](https://cdn.standards.iteh.ai/samples/114078/4eecaf12866f4017a66363453c1057f6/ASTM-F3557-22.pdf) (snippet)
- Consumer park-building guide (non-standard): jump width ≥ 5 ft, landing wider than the takeoff "to allow for imperfect landings". — search-summary attribution unclear; treat as anecdotal ([Terrain park, Wikipedia](https://en.wikipedia.org/wiki/Terrain_park) was among results, exact source not confirmed)
- Coaches name the failure as "fall off the side of the jump" and "drift off to the side of the landing" (Q1 citations). They are describing a landing miss, not a lip miss.

### Inferences
- **[ESTIMATE]** Takeoff tolerance on the lip ≈ half the kicker width minus about 0.5 m for the board and body. That is ±2 m on a 5 m kicker and about ±3.5 m on an 8 m kicker. Every early or late error up to 0.5 s in Q3 (x ≤ 1.8 m) stays on the lip. 1 s early at R ≤ 40 m (x ≈ 3–7 m) can miss a narrow lip.
- **[ESTIMATE]** The landing is the real limit. At 0.25 s early the lateral drift is about 3–7 m over a ~2 s flight, which is already near the edge of a landing roughly 15–20 m wide. Coaching's "drift sideways… fall off the side of the jump" is consistent with heading errors of only 5–10°.
- A game could treat |x_lip| ≤ half-width − 0.5 m as a valid takeoff and score or penalise the landing by v·sin ψ·t_flight against the landing half-width.

### Gaps
- No published lip width for World Cup or Olympic big-air kickers was found. The FIS venue-requirements PDF that likely holds these numbers was blocked.
- No source gave a landing-width figure for competition big air.
