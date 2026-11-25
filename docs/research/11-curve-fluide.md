# Linked snowboard turns: kinematics of a fluid S-shaped set-up line

Access note: every full-text host tried was blocked in this session (DNS failure through the proxy): www.frontiersin.org, pmc.ncbi.nlm.nih.gov, infoscience.epfl.ch, www.scitepress.org. All findings below therefore come from **search-result snippets/abstracts**, not from reading the full papers. Numbers quoted from snippets should be checked against the originals before being written into `docs/research/`. Items marked **[DERIVED]** are my own calculations or inferences, not sourced facts.

## Turn phases, transition duration, flat-base moment

### Takeaway
Turns have 3–4 phases (initiation, steering/control, completion), and the phases blend together more as speed rises and turns get shorter. The edge change is a short "dead spot" with the board flat. Coaching sources aim for about 0.1 s in GS racing, and anything near 0.2 s already reads as slow. Instruction says the board should be flat "only for a split second". I found no peer-reviewed mean edge-switch duration (the GS force-based studies define it but snippets didn't give values).

### Cited Findings
- Snowboard coaching course: the turn has three phases, Initiation, Control (the belly of the turn through the fall line) and Completion/preparation. It notes these phases **blend together as turns get smaller and speed increases**. Initiation = uphill edge releases and the tip enters the new arc — [Online Snowboard Coach](https://onlinesnowboardcoach.com/course/carving-on-a-snowboard/module-2-the-turn-dynamics/phases-of-the-turn/)
- Ski research phase model (Kröll et al., used in a 2023 EMG/NIRS study): Initiation, Steering I, Steering II, Turn Completion. "Transition" = Initiation + Completion = **41% of turn time**, with Initiation alone = **23%** — [ScienceDirect 2023, two turn-transition techniques](https://www.sciencedirect.com/science/article/pii/S2772696723000182)
- A secondary (blog-style) summary attributes this split to Falda-Buscaiot 2017: ~21% initiation, 33% steering 1, 32% steering 2, 14% completion. It also says max edge angle comes at 50–60% of the turn cycle. Not verified against the original — [Ozone Skiing, phases of the turn](https://www.ozone-skiing.com/en/post/alpine-skiing-phases-of-the-turn)
- The word "transition" is used inconsistently. Research uses it for initiation+completion (a long span). Instruction uses it for the short flat-ski moment between turns — [Active.com Phases of a Ski Turn](https://www.active.com/outdoors/articles/phases-of-a-ski-turn); [ScienceDirect 2023](https://www.sciencedirect.com/science/article/pii/S2772696723000182)
- GS coaching benchmark: the edge change should take **~0.1 s** (about one ski length at 18–19 m/s). A 0.2 s transition travels two ski lengths and "takes them off their line" — [SkiRacing.com, Turn Connection/Transition](https://skiracing.com/turn-connection-transition-the-critical-moment-between-turns/)
- The flat-ski moment is described as a "balancing dead spot": the skis are flat and travelling straight, so they cannot produce lateral reactions — [Effective Skiing, Transition](https://effectiveskiing.com/topics/Transition)
- Snowboard instruction: the board "should never be flat for more than a split second". The edge change happens as the board passes through flat base while pointing downhill — [RidingBoards](https://www.ridingboards.com/linking-turns-vs-carving-vs-skidding-in-snowboarding/); [Progresspedia Linking Turns](https://progresspedia.org/courses/snowboarding/linking-turns/)
- Cross-under: quick linked carves where the lean comes from moving the board side to side under the body rather than moving the body. At speed, "the board snaps aggressively under the body from one carve to the next". Terminology is informal and disputed on forums — [effluvia blog](http://effluviaofascatteredmind.blogspot.com/2014/03/advanced-snowboard-turns-carving-cross.html); [SnowboardingForum](https://www.snowboardingforum.com/threads/carving-transition-question.129441/)
- GS research (Delhaye et al. 2020) defines the edge switch as the lag between the end of force on the outside ski and the start of force on the new outside ski. Snippets did not give a mean value. Note that "0.195/0.453" numbers in snippets are correlation stats, not durations — [Frontiers 2020 589257](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.589257/full)
- IMU turn segmentation detects turn-switch points from ski-boot gyroscope signals with ±0.03 s precision. This shows the switch is a sharp, near-instant event in the signal — [Frontiers 2019 fspor.2019.00018](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2019.00018/pdf)
- In GS, a longer transition phase goes with less speed gained, because less time is spent near the fall line — [Frontiers 2020 589257](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.589257/full)

### Inferences
- **[DERIVED]** For a game: give the visible "flat-base" window (|edge| below ~5°) about 0.1–0.2 s at 60–75 km/h. Do not hold the board flat at zero. Lean should pass through zero with non-zero rate (a zero-crossing, not a plateau).
- **[DERIVED]** Cross-under at speed means the board/legs flip faster than the torso. The torso's lean can lag and look smoother than the board's edge angle. Animate the board edge and the upper body with different smoothing.

### Gaps
- No measured snowboard edge-switch duration (s) found. No peer-reviewed numeric flat-base duration for skiing either (the 0.1 s figure is from a coaching site).
- Supej & Holmberg 2010 phase percentages not retrieved (full texts blocked).

## Path geometry: sine-like vs arcs joined by straight traverses

### Takeaway
Measured CoM turn-radius profiles in GS show radius smoothly falling to a minimum mid-turn and rising toward very large values (near-straight) at the transitions. Curvature passes through zero at the switch rather than holding a long straight, but racers vary between an "S" line (short straight) and a "Z" line (longer straight). Snowboard PGS data favour keeping a larger minimum radius (rounder, smoother) over long glide phases. Arc–straight–arc joins have discontinuous curvature, which means infinite jerk and an instant lean flip. Engineering fixes this with clothoid (Euler spiral) transitions where curvature varies linearly.

### Cited Findings
- Meyer & Borrani (2018) built 3D models of 7 elite GS skiers and computed turn radius over each turn for CoM, pelvis and head. Supej (2008) got a similar-shaped curve for the CoM radius of 4 GS athletes. Reid et al. (2009) in slalom found the radius **decreased slowly during the first part of the turn and increased rapidly at the end**. The head is a poor proxy mid-turn because of side-leaning — [Frontiers in Physiology 2018](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2018.01541/full); [PMC6282051](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6282051/)
- Wimmer (2001), GS: ski radius from trajectories correlates only modestly (r = 0.39–0.57) with Howe's sidecut/edge prediction. **The largest gaps are around turn transitions, where the actual ski turn radius approaches large values** (curvature → 0) — [Frontiers 2020 fspor.2020.00025 / Reid et al.](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.00025/full)
- Delhaye et al. (2020, GNSS + force plates, 17 GS skiers) model a turn as a **straight-line phase followed by a turning phase**. The Z strategy has a long straight that builds speed and leads into sharper turns. The S strategy has a short straight. Straight-line path length did **not** significantly predict race time (dropped from the model, p = 0.301). Faster skiers dissipated less energy whatever line they used — [PubMed 33345162](https://pubmed.ncbi.nlm.nih.gov/33345162/); [Frontiers full text](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.589257/full)
- Snowboard PGS (Swiss national team, 212 runs, 3716 turns, GNSS): a larger minimum turn radius went with faster section times on flat/medium slopes. Speed rose on average in toe-edge turns and fell in heel-edge turns. Turn phases showed no significant difference. Conclusion: unlike skiing, keeping speed with a **larger minimum radius** may matter more than a long gliding phase. Abstract only — [BORIS Bern, ICSS 2023 abstract](https://boris.unibe.ch/180600/1/abstract_icss_2023.pdf); [record](https://boris.unibe.ch/180600)
- Carving is described as long arcing turning phases started higher on the slope, with greater radii — [Frontiers 2020 589257](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.589257/full)
- Instruction describes turn shapes as C, J or Z. Carved turns lose no speed through braking — [PSIA-W movement analysis tool](https://psia-w.org/western-alpine-movement-analysis-training-tools/)
- Linking advice: ski "from the shaping phase of one turn to the shaping phase of the next". Finish and initiation phases redirect the CoM and skis from one turn into the next — [PSIA-C (Ron Shepard)](https://psia-c.org/author/ron-shepard/)
- Euler spiral/clothoid: curvature changes linearly with arc length. It is the standard easement between a straight and an arc, avoiding abrupt jumps in centripetal acceleration. A straight-to-circle join has mathematically infinite jerk. Among transitions, the Euler spiral is the shortest one for a given limit on the rate of change of superelevation (banking ≈ lean) — [Wikipedia Track transition curve](https://en.wikipedia.org/wiki/Track_transition_curve); [Wikipedia Euler spiral](https://en.wikipedia.org/wiki/Euler_spiral); [UIUC TAM 212](https://courses.physics.illinois.edu/tam212/su2025/avt.html)

### Inferences
- **[DERIVED]** A good model for a fluid set-up line is a path whose curvature κ(s) is a smooth function crossing zero linearly at each switch. A sine curve y = A·sin(2πx/λ) has κ ∝ −sin and works well. So do arcs joined by clothoid ramps with zero or very short straight sections. Avoid "arc → straight → arc" with step changes in κ, because that is exactly the "turn – straight – turn" feel.
- **[DERIVED]** Example sine set-up at 70 km/h (19.4 m/s): wavelength λ = 80 m (two turns), with minimum radius 60 m at the apex, gives lateral amplitude A = λ²/(4π²·Rmin) ≈ 2.7 m. That is 4.1 s for a turn pair, ~2.05 s per turn.
- **[DERIVED]** The racing debate (S vs Z) suggests a short straight is tolerable. For a game set-up line, though, the snowboard PGS finding (bigger min radius beats long glide) and the clothoid argument both favour a near-sinusoidal S.

### Gaps
- No published snowboard CoM/board trajectory curvature time series found. Ski GS radius profiles exist but figures/values were not readable (full texts blocked).

## Edge angle / lean angle time profile through a turn

### Takeaway
In balanced carving, edge angle ≈ inclination (lean). It builds progressively from the switch to a peak around or just after mid-turn (about 50–60% of the cycle per a secondary source), with sustained high angles roughly 20–80% of the turn in good carving, then releases. Coaching tools reward progressive build, not an early snap to max. So the profile sits between a sinusoid and a rounded plateau. Peak values: slalom 66–71° (elite skis), expert recreational carvers 60–74°. No measured snowboard IMU time series found.

### Cited Findings
- Balanced carving model: the ski edge angle equals the skier inclination angle, so edge angle is largely set by lean. Inclination peaks at ≈67° around traverse angle β≈130° in a modelled turn. Models cap inclination at ~70–80° — [Komissarov, Modelling of carving turns (arXiv 1812.02539)](https://arxiv.org/html/1812.02539v3); [Balanced carving turns (White Rose)](https://eprints.whiterose.ac.uk/id/eprint/168379/1/carving.pdf)
- Reid et al. 2020, slalom on 19°: max ski edge angles **65.7 ± 1.7° (10 m gates) and 71.0 ± 1.9° (13 m)**, min outside-ski radius 3.96 ± 0.23 m and 4.94 ± 0.59 m. Howe's model fits at high edge angles but underestimates the actual radius at **low** edge angles. Sidecut radius governs the trajectory at high edge angles — [PMC7739813](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7739813/); [Semantic Scholar](https://www.semanticscholar.org/paper/Alpine-Ski-Motion-Characteristics-in-Slalom-Reid-Haugen/4749d0f3a03acc91074fad784dbe15dba1a6836f)
- FEM ski study: edging angle has the largest effect on radius. Above ~50° the computed radius levels out, while Howe's R = Rsc·cos(θ) tends to zero. Harder snow gives larger radii above ~40° — [ResearchGate FEM parameter study](https://www.researchgate.net/publication/224891596_Parameter_Study_using_a_Finite_Element_Simulation_of_a_Carving_Alpine_Ski_to_Investigate_the_Turn_Radius_and_its_Dependence_on_Edging_Angle_Load_and_Snow_Properties)
- Carved radius ≈ sidecut radius × cos(tilt) — [Wikipedia Carved turn](https://en.wikipedia.org/wiki/Carved_turn)
- Snowboard physics write-up: a 12 m sidecut at ~10 m/s gives 6.3 m at ~58° edge/lean and 7 m at 55°. Angulation lets edge angle exceed inclination — [Michaud & Duncumb, Physics of a Snowboard Carved Turn (Bomber)](https://bomberonline.3dcartstores.com/assets/images/PDFs/Physics-of-a-Snowboard-Carved-Turn.pdf)
- Carv's "Progressive Edge Build" metric uses the median edge angle from 10% to 80% of the turn. It rewards maintaining and increasing steering through the turn and penalises over-committing early — [Carv blog](https://getcarv.com/blog/introducing-progressive-edge-build). Its "Mid-turn Edge Build" rewards sustained high edge angles from 20% to 80% of the turn — [Carv edging page](https://getcarv.com/lp/edging)
- Users report Carv dislikes bringing on too much edge too quickly at the start of a turn ("smoothly progressive") — [SkiTalk forum](https://www.skitalk.com/threads/skitalk-com-carv-2-group.35738/post-1171789) (forum, low authority)
- "Edging Velocity" (2025) is proposed as a metric based on the time to reach 90% of max edge angle. Values not retrieved (host blocked) — [SciTePress 2025](https://www.scitepress.org/publishedPapers/2025/136651/pdf/index.html)
- CSIA's framework says the largest edge angles occur between the end of the control phase and the start of completion. That is somewhat after the fall line, consistent with a 50–60% peak — [CSIA 5 Skills Framework](https://csia.snowpro.com/ServicesServlet/telechargement/document/The5SkillsFramework.pdf)
- A 150–250°/s edge roll rate appears only in a hobby game's design notes, not in measured data — [GitHub SnowboardAnywhere issue #273](https://github.com/drewkeriazes/SnowboardAnywhere/issues/273)

### Inferences
- **[DERIVED]** In the sine-path example (70 km/h, Rmin = 60 m, λ = 80 m): peak lean φ = atan(v²/(g·R)) ≈ 33°. If lean ≈ φmax·sin(ωt), the peak edge-change rate at the zero crossing is φmax·ω ≈ **50°/s**, and the time with |lean| < 5° is ≈ **0.20 s** per crossing. This matches the "split second" / 0.1–0.2 s coaching guidance without any explicit flat hold.
- **[DERIVED]** A slightly flattened sinusoid fits the sources: faster through zero, a broader top from about 20–80%, peak at ~50–60%. Two ways to get it: (a) raise a sinusoid to a power below 1 (sign(s)·|s|^p with p ≈ 0.7), or (b) critically damp toward a target that switches sign.
- **[DERIVED]** Elite racing rates (66–71° within a ~1 s slalom turn) imply edge rates of several hundred °/s. A gentle set-up turn needs only ~30–60°/s.

### Gaps
- No snowboard IMU edge-angle time series found. No measured edge-rate (°/s) values found (the Edging Velocity paper was unreachable).

## Gentle wide set-up turn at 60–75 km/h before a kicker

### Takeaway
At these speeds, wide set-up turns (R ≈ 40–100 m) need only 16–48° of lean (balance: tan φ = v²/(gR)). A pure-sidecut carve cannot produce radii far larger than the board's sidecut (~7–12 m), so such turns are in reality low-edge, board-not-fully-bent or slightly skidded ("semi-carved") arcs. Measured data confirm Howe's model underestimates radius at low edge angles. The line should be one continuous S with curvature passing smoothly through zero.

### Cited Findings
- Howe/sidecut radius R ≈ Rsc·cos(θ) underestimates actual radius at low edge angles, with largest gaps near transitions — [Reid et al. 2020 / PMC7739813](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7739813/); [Frontiers fspor.2020.00025](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.00025/full)
- Snowboard PGS: larger minimum radius kept speed and was faster — [BORIS ICSS 2023](https://boris.unibe.ch/180600/1/abstract_icss_2023.pdf)
- Carved turns don't lose speed through braking. Skidding is used for speed control — [PSIA-W](https://psia-w.org/western-alpine-movement-analysis-training-tools/)

### Inferences
- **[DERIVED]** Lean needed for balance φ = atan(v²/(gR)):

  | speed | R = 40 m | R = 60 m | R = 100 m |
  |---|---|---|---|
  | 60 km/h | 35° | 25° | 16° |
  | 70 km/h | 44° | 33° | 21° |
  | 75 km/h | 48° | 36° | 24° |

- **[DERIVED]** Project implication: the game's carve model (radius from sidecut and edge angle, per CLAUDE.md) gives R ≤ Rsc. So a 60–100 m set-up arc must come from small effective edge, board-flex limits or controlled skid. Body lean (from v²/R) can therefore differ from board edge in a wide turn. Animate the body lean from actual lateral acceleration, not from the edge parameter.
- **[DERIVED]** For a 2-arc or 3-arc S before a kicker, use alternating arcs whose curvature follows a smooth half-sine (or clothoid ramp → arc → clothoid ramp) with no straight segments. Make the last arc's release end at the takeoff alignment, with lean returning to the takeoff edge per `TAKEOFF_EDGE` (frontside → heel, backside → toe, straight/flip → flat). A typical rhythm is ~1.5–2.5 s per arc at 60–75 km/h; the final half-arc can be shallower so curvature and lean reach ~0 (or the takeoff edge) exactly at the lip.

### Gaps
- No source on real riders' set-up turn radii before big-air kickers (other research notes may cover this).

## Animation/game references for fluid turns

### Takeaway
No GDC talk or developer write-up on SSX/Steep lean animation was found. The standard game technique is critically damped spring smoothing of lean/facing targets, sometimes with a "double spring" for an S-shaped (ease-in/ease-out) response. A hobby browser snowboard game drives its pose from carve/lean signals through a critically damped follower.

### Cited Findings
- Unreal's `CriticalSpringDamper`/`CriticallyDampedSmoothing`: the smoothing time is the lag when tracking constant motion, and 0 means snapping. A "double spring" variant passes through an intermediate state for a more S-shaped curve — [UE CriticalSpringDamper](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/SpringMath/CriticalSpringDamper); [UE CriticallyDampedSmoothing](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/FMath/CriticallyDampedSmoothing); [UE CriticalDoubleSpringDampFloat](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/SpringMath/CriticalDoubleSpringDamper)
- Spring half-life for smoothed quantities (facing angle, velocity) also caps the derivative (max rate) — [Orange Duck, Fitting Code Driven Displacement](https://theorangeduck.com/page/fitting-code-driven-displacement); background: [Spring-It-On: Spring-Roll-Call](https://theorangeduck.com/page/spring-roll-call)
- Browser snowboard game: the pose is built from carve, crouch, load, lean, press, pop and wind-up readings, eased with a critically damped follower — [GitHub game5 PR #460](https://github.com/niclaslindstedt/game5/pull/460)
- Steep's skiing is described as "believable" between tricks. No technical detail available — [The Inertia](https://www.theinertia.com/mountain/video-games-12-best-ski-snowboard-ranked/)

### Inferences
- **[DERIVED]** Recommended layering:
  1. The physics path (the auto pre-jump curve in `approach.ts`) commands curvature κ(t) as a smooth sinusoid or clothoid-ramped arcs, never step changes.
  2. The edge parameter follows κ with a short lead.
  3. Body lean = atan(a_lat/g) smoothed with a critically damped spring (half-life ~0.08–0.15 s). A double spring avoids a linear-looking snap.
  4. Upper body/head leads the next turn by ~0.1–0.2 s (anticipation) while the board crosses under.

  All numbers are estimates, to be tuned.
- **[DERIVED]** Because the physics must stay deterministic at STEP = 1/120 s, smoothing belongs in the commanded-curvature generator (deterministic) or purely in render-side animation, not in random-ish filtering.

### Gaps
- No primary source from SSX, Steep, Shredders, Riders Republic or similar on how they animate turn transitions.
