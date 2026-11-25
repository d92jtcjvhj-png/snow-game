# Physics of a carved snowboard kicker takeoff: rotation and sideways drift

NOTE ON SOURCING: WebFetch was blocked in this session. Requests to www.mdpi.com, jyx.jyu.fi, pmc.ncbi.nlm.nih.gov, arxiv.org and ar5iv.labs.arxiv.org all failed with ENOTFOUND, meaning these hosts are not on the session's network allowlist. Every citation below therefore comes from search-engine summaries and snippets, not from reading the full text. I could not check any of these numbers against the original tables. Anything marked DERIVATION or ESTIMATE is my own calculation and has no source.

## Q1. How is angular momentum generated at takeoff in big air and halfpipe, and how big is it?

### Takeoff
The published work agrees that the takeoff phase creates nearly all of the angular momentum, and that the rider can only redistribute it in the air (by tucking or extending). The papers name the drivers as upper-trunk twist, shoulder action and takeoff velocity. I found no paper that measures how much the carve itself contributes. Coaching sources say spins come from the upper-body "pre-wind/unwind" plus an edge set, and specifically warn against relying on the set-up carve. My own scaling (below) shows that trajectory curvature supplies only about 5-15% of the yaw rate a 1080 needs.

### Cited Findings
- Applied Sciences 2025 (Beijing Institute of Technology and Capital University of Physical Education and Sports; 11 Chinese national-team athletes) studied big-air takeoff rotational parameters: moment of inertia, angular momentum and rotational energy. Its hypothesis was that harder tricks involve higher takeoff velocity, greater joint extension and higher angular momentum. The authors say takeoff "generates the majority of the angular momentum required" — [MDPI 15(12):6618](https://www.mdpi.com/2076-3417/15/12/6618) / [doi](https://doi.org/10.3390/app15126618) (from snippets; I did not get the numbers in its tables).
- In the same paper, upper-trunk twist angle and shoulder horizontal abduction increased significantly with trick difficulty, which the authors read as "enhanced rotational momentum and stability". They also say athletes "generate greater force to overcome the larger moment of inertia". The search summary notes some inconsistencies in the text (abduction/adduction wording) — [ResearchGate](https://www.researchgate.net/publication/392647531)
- Jyväskylä MSc thesis (2022) used 3D motion analysis of 5 athletes doing BS 360/540/720. CoM vertical velocity rose with difficulty in every subject, and knee and elbow angular velocities were higher on tricks with more rotation. The changes were subject-dependent — [JYX](https://jyx.jyu.fi/jyx/Record/jyx_123456789_81576)
- "Competition trick analysis in snowboard slopestyle and big air" found that, regardless of discipline or rotation direction, angular velocity, takeoff velocity and moment of inertia are the key performance indicators for the amount of rotation — [ResearchGate 368779247](https://www.researchgate.net/publication/368779247)
- Merz et al. 2025 summary gives the same KPIs: moment of inertia, angular velocity and take-off velocity — [OpenLB record](https://ngdc.cncb.ac.cn/openlb/publication/OLB-PM-39831653)
- Halfpipe IMU and kinematics study: angular velocity affects rotation more than airtime does. The reported angular-velocity : airtime ratios were about 4:1 for frontside and nearly 5:1 for backside (units not given in the snippet) — [PMC13618448](https://pmc.ncbi.nlm.nih.gov/articles/PMC13618448)
- A 2025 validity study of a board-mounted IMU against markerless video used 8 elite riders and 88 tricks on a trampoline bounce board. Validity was high for rotation amount and for the angular-velocity time series, with a mean bias of −0.19 °/s. The authors advise caution with angular velocity at single time points near take-off and landing — [ScienceDirect S2665917425000662](https://www.sciencedirect.com/science/article/pii/S2665917425000662)
- Harding et al. (2008) used tri-axial rate gyros in halfpipe. Integrating angular velocity gave an "Air Angle" that separated tricks into 180/360/540/720 groups — [Griffith repository](https://research-repository.griffith.edu.au/items/7dbe0697-cb9f-58fb-9272-5c9a8213f63d)
- Gorges et al., Sensors 2024 (8 elite German riders, 626 halfpipe tricks). An IMU U-Net detected take-off and landing with median errors of about 0.008 s and 0.005 s — [PMC11548732](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11548732/)
- Aerial skiing (Yeadon) evidence on where twist starts. In 6 triple somersaults at Calgary 1988, 2 athletes started the twist at takeoff, 2 in the air and 2 used both. Twist can also be produced in the air by asymmetric arm or hip movement, which tilts the body's long axis relative to the angular-momentum vector — [Loughborough](https://repository.lboro.ac.uk/articles/journal_contribution/Twisting_techniques_used_in_freestyle_aerial_skiing/9617171); [Yeadon 1997 twisting review](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/twistflight97.pdf)
- Yeadon 2013 (J Biomech) found 4-6 twists are possible within 3 somersaults. The ski equipment raises the frontal moment of inertia, and that limits how much tilt arm asymmetry can produce — [Loughborough](https://repository.lboro.ac.uk/articles/journal_contribution/The_limits_of_aerial_twisting_techniques_in_the_aerials_event_of_freestyle_skiing/9624755)
- Coaching and technique sources:
  - Pre-wind means rotating the shoulders against the spin direction, then releasing as the front foot leaves the lip.
  - "Don't carve too hard in your set up, you don't want to rely on the set up for your rotation." Another source recommends "little to no set up carve".
  - Riders use the edges to grip, because a flat-base attempt makes the board "slip out".
  - Heelside: "the earlier you start this the more pre-rotation you'll have" — [Snowboard Addiction: FS spin from toe edge](https://snowboardaddiction.com/blogs/jumping/how-to-spin-frontside-from-the-toe-edge); [Entry paths for spinning](https://snowboardaddiction.com/blogs/spins/entry-paths-for-spinning); [Rotation vs counter-rotation](https://snowboardaddiction.com/blogs/training-education/rotation-vs-counter-rotation)
- Angular momentum is fixed at takeoff. Tucking speeds the spin and extending slows it — [Scientific American](https://www.scientificamerican.com/article/olympic-big-air-snowboarders-use-physics-to-their-advantage/)

### Inferences (DERIVATION / ESTIMATE)
- **Required yaw rate.** Spinning θ_total degrees in airtime T needs a mean rate ω = θ_total / T.
  - 1080° in 2.5 s → 432 °/s = 7.5 rad/s.
  - 1440° in 3 s → 480 °/s = 8.4 rad/s.
  - 360° in 1.2 s (park kicker) → 300 °/s.
- **Carving-induced yaw.** A board carving on radius R at speed v turns its heading, and the whole rider's heading, at ω_c = v/R.
  - At v = 15 m/s: R = 20 m gives 0.75 rad/s (43 °/s); R = 50 m gives 0.3 rad/s (17 °/s).
  - That is about 4-10% of a 1080's spin rate.
  - Carving alone would give 7.5 rad/s only if R = v/ω = 2 m, which is physically impossible at that speed.
- **So the spin must come mainly from an impulsive torque** applied through the board edge during the last part of the ramp: a friction/edge couple plus the upper body unwinding against the legs and board, which then transfers to the whole body.
- **Moment of inertia I_yaw (ESTIMATE; no measured value found).**
  - Body alone: a 70 kg cylinder with r ≈ 0.15 m gives about 0.8 kg·m² (search summary estimate, [no primary source]).
  - With the stance included (legs at about ±0.2-0.25 m from the axis), add roughly 1 kg·m².
  - The board (about 3 kg, 1.55 m long) is a rod about its centre perpendicular to its length: about 0.6 kg·m².
  - Arms extended add about 0.5-1 kg·m².
  - Working range: about 1.5 kg·m² tucked or grabbed, 2.5-3.5 kg·m² open at takeoff.
- **Angular momentum (ESTIMATE).** L = I·ω. With I ≈ 2.5 kg·m² and a mean of 7.5 rad/s, L ≈ 15-20 kg·m²/s for a 1080. If the rider opens at takeoff and tucks in the air, L can be lower for the same degrees.
  - The carve's share is L_c = I·v/R ≈ 2.5 × 0.75 ≈ 1.9 kg·m²/s for R = 20 m.
- **Torque budget (ESTIMATE).** The transition or lip phase lasts about 0.15-0.4 s (lip region 2-6 m at 15 m/s).
  - Average torque needed: 15 / 0.25 ≈ 60 N·m.
  - Applied as a couple at tip and tail (arm about ±0.7 m), that is only about ±40-90 N of lateral edge force. This is small next to the 700-1500+ N normal load, so the snow can easily provide it.
  - Asymmetric tip and tail forces give a net lateral impulse, i.e. sideways drift, even with no carve. For example, a 50 N imbalance over 0.25 s on an 80 kg rider gives Δv_lat ≈ 0.16 m/s.

### Gaps
- I found no numbers for angular momentum (kg·m²/s), I_yaw or yaw rate on the ramp. The Applied Sciences 2025 tables and the slopestyle/big air trick analysis probably contain them, but I could not open the full text.
- I found no study that separates the carve's contribution to takeoff yaw from upper-body unwinding.
- I found no measured takeoff (ramp contact) duration for snowboard big air.

## Q2. How does carving at the lip turn into a heading error and sideways drift?

### Takeoff
In a constant-radius carve the heading turns by Δψ = s/R, where s is the arc length ridden on the ramp while carving. This is independent of speed. The lateral launch velocity is v·sinΔψ, and the drift in flight is v·sinΔψ·T. Five degrees at 15 m/s over 2.5 s gives about 3.3 m, so the user's example is confirmed. No academic source discusses takeoff heading relative to the kicker axis. The only quantitative evidence of real takeoff variability is the poor speed-to-distance correlation in terrain-park studies.

### Cited Findings
- Shealy et al. 2010 (J ASTM Int 7(10)) measured takeoff speed at the end of the takeoff with a laser speed trap (±0.11 m/s) on two tabletops. The r between speed² and landing distance was 0.75 on the small jump and 0.41 on the large one — [ASTM JAI102885](https://store.astm.org/jai102885.html)
- A 2012 follow-up paper explained the scatter by rider "pop". Pop speeds from −2.48 to +1.12 m/s (a modelled result) cover the measured landing-distance range — [ASTM STP104240](https://store.astm.org/stp104240.html)
- Slopestyle skiers' airtime was just under 2 s, with a triple cork estimated at about 2.3 s — [PMC7745909](https://pmc.ncbi.nlm.nih.gov/articles/PMC7745909/)
- Airtime depends only on the vertical takeoff velocity component (classical projectile, term paper) — [Phillips PHY235w](https://patrickphillips.page/pdfs/Term_Paper_PHY235w.pdf)

### Inferences (DERIVATION)
- **Heading kinematics.** dψ/dt = v/R, so over a ramp distance s, Δψ = s/R (radians), whatever the speed.

  | Carved distance on ramp s | R = 25 m | R = 50 m | R = 100 m |
  |---|---|---|---|
  | 3 m (lip only) | 6.9° | 3.4° | 1.7° |
  | 5 m | 11.5° | 5.7° | 2.9° |
  | 10 m (whole kicker) | 22.9° | 11.5° | 5.7° |

- **Lateral launch speed.** v_lat = v·sinΔψ. The ramp's cross-slope direction is horizontal, so this is purely horizontal. The along-ramp component v·cosΔψ splits into v_h and v_z using the lip angle.
- **Lateral drift.** Aerodynamic side force is neglected (small). The drift is d = v·sinΔψ·T.

  | v | Δψ = 2° | 5° | 10° |
  |---|---|---|---|
  | 15 m/s, T = 2.5 s | 1.31 m | 3.27 m | 6.51 m |
  | 20 m/s, T = 2.5 s | 1.74 m | 4.36 m | 8.68 m |
  | 12 m/s, T = 1.5 s (park) | 0.63 m | 1.57 m | 3.13 m |

- **Airtime (DERIVATION).** For a lip at angle α with speed v, the time back to lip height is 2v·sinα/g.
  - 20 m/s at 30° → 2.04 s.
  - Big-air landings sit several metres below the lip, which adds about 0.3-0.8 s. So T ≈ 2.3-3 s, consistent with the ski airtime figures above.
- **Game model.** With CoM velocity v at the lip, launch_dir = rotate(kicker_axis, Δψ), where Δψ comes from the integrated heading change on the ramp plus any edge-set impulse. In flight, apply only gravity (and drag). Yaw spin is separate:
  - ω0 = (L_carve + L_torque) / I_open, with L_carve = I·v/R and L_torque coming from player input (pre-wind release).
  - In flight, ω(t) = L / I(t) (tuck/grab lowers I).

### Gaps
- I found no measured data on takeoff heading angle or lateral CoM velocity relative to the kicker axis for snowboarders.
- I found no measured big-air snowboard airtimes. The 2.3-3 s figure is derived, not measured.

## Q3. How wide are kickers and landings, and how much drift is tolerable?

### Takeoff
I could not find official FIS or ASTM width values: the standards define the measurements but the snippets do not give numbers. One venue figure is available: the St. Moritz 2025 big air landing is 25 m wide. That means ±12.5 m of total landing tolerance, although the usable "sweet spot" is narrower.

### Cited Findings
- FIS minimums as reported by secondary sources: drop-in ramp ≥ 30 m, kicker height ≥ 2 m, takeoff angle ≥ 25°, take-off to landing ≥ 15 m — [NBC Olympics](https://www.nbcolympics.com/news/snowboarding-101-what-know-about-olympic-big-air); [STEEP](https://steep.jp/en/topics/116561/)
- The older FIS judges' book (2006/07) gives a 25° takeoff and 12 m from takeoff to knoll — [FIS Judgesbook PDF](https://www.apul.cz/media/uploads/sekce_snowboarding/dokumenty/fis_judges_manual_snowboard.pdf)
- St. Moritz 2025 big air: kicker about 21 m, landing length 30 m, landing width 25 m — [Freestyle St. Moritz 2025](https://www.freestylestmoritz2025.ch/en/program/competitions/big-air-ski)
- Livigno 2026 Olympic big air: in-run 75 m at 39°, jump height 5 m, landing pitch 38°, take-off to knoll 18 m — [Olympedia](https://www.olympedia.org/results/15000538). NBC calls it a "25-meter kicker" and Reuters a "55-metre jump"; these figures conflict and probably refer to different measures (the structure's height) — [The Star/Reuters](https://www.thestar.com.my/sport/others/2026/02/07/olympics-livigno039s-sky-high-big-air-jump-wows-riders-despite-scaffolding-surprise)
- ASTM F3557 lists "width of takeoff at lip", "width at top of landing" and "width at toe of landing" as measured parameters, with no values in the snippet — [ASTM F3557-22 sample](https://cdn.standards.iteh.ai/samples/114078/4eecaf12866f4017a66363453c1057f6/ASTM-F3557-22.pdf)
- An informal builder guide gives jump width ≥ 5 ft (about 1.5 m), landings wider than takeoffs, and 22-26 ft between features — [IMBA Canada](https://imbacanada.com/?p=74686) (bike-oriented, low authority)
- Kicker rules of thumb: lip angle 20-30° and a 4:1 length-to-lip-height ratio — [Kitesurfing mag](https://kitesurfingmag.com/how-to-building-kickers-boxes-and-rails/) (low authority)

### Inferences (ESTIMATE)
- Typical big-air lips (not sourced) are likely about 4-8 m wide and landings 20-30 m. Park medium and large jumps are likely about 3-6 m wide at the lip and 8-15 m on the landing.
- On a 25 m landing, a rider launched from the centreline has about ±10 m before reaching the edge. From the Q2 table, Δψ ≈ 5° at 20 m/s (≈ 4.4 m of drift) is still a landable but visibly off-axis jump. Δψ ≥ 10-15° (≈ 9-13 m) puts the rider at or off the landing edge.
- On a 10 m park landing (±5 m), about 5° at 12-15 m/s is already near the limit.
- Suggested game tolerances: green ≤ 3°, yellow 3-7°, red > 8-10°, scaled by landing width.

### Gaps
- I found no official FIS numbers for kicker or landing width.
- I found no NSAA, Snow Park Technologies or Swiss park design width tables.

## Q4. Can the edge hold a carve on a steep kicker at 50-60 km/h?

### Takeoff
The lateral acceleration needed is v²/R. At 15 m/s with R = 20 m that is about 1.15 g, which firm snow and high normal loads can supply: the transition's curvature adds to the normal load, and ski racers reach up to about 5 BW. However, an *ideal* (purely sidecut-driven) carve on a snowboard has a radius R ≤ R_sidecut (about 6-8 m). The balance-limited speed for ideal carving is about √(g·R_sc·cosα) ≈ 7-8 m/s. So at 50-60 km/h a rider's "carve" into a kicker is a large-radius turn with some skid or low edge angle, not a pure sidecut carve. Washout happens when the edge's shear demand exceeds the snow's shear strength, which happens sooner on soft snow.

### Cited Findings
- Snowboard sidecut radius can be as low as 6-8 m, compared with about 16 m for carving skis. Jentschura & Fahrbach's ideal-carving equation relates speed, the trajectory angle to the horizontal and the instantaneous radius, with slope, g and sidecut radius as parameters — [Jentschura & Fahrbach, arXiv physics/0310086](https://arxiv.org/abs/physics/0310086); [Scholars' Mine](https://scholarsmine.mst.edu/phys_facwork/933)
- Komissarov (2018): ideal carving implies a maximum speed for lateral balance, regardless of the athlete's strength. A torque-balance analysis gives an upper bound of about √(g·R_sc·cosα) — [Komissarov arXiv 1812.02539](https://arxiv.org/pdf/1812.02539); [White Rose preprint](https://eprints.whiterose.ac.uk/158134/1/pend-v2.pdf)
- Howe (2001) relates turn radius to edge angle; the agreement with measured minimum radii is good — [Frontiers / edge-angle review](https://frontiersin.org/articles/10.3389/fspor.2020.00025/pdf)
- Peak ground reaction forces can reach 5× body weight in competitive skiing, against 1.5-2 BW in recreational carving (Scheiber 2012; Supej 2004) — [PMC4541126](https://pmc.ncbi.nlm.nih.gov/articles/PMC4541126); [Frontiers Physiol 2019](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2019.00111/pdf)
- Lieu & Mote (1985) give the edge-angle and attack-angle definitions:
  - A carving edge point follows the track of the points ahead of it.
  - A skidding edge point shears through new snow.
  - Both can coexist along a single ski — [Springer s12283-021-00340-7](https://link.springer.com/article/10.1007/s12283-021-00340-7)
- Machining-theory edge model: turning force depends on snow shear strength, penetration depth and shear angle. At the same penetration, more edge angle gives less force, and there is an optimum edge angle. Switching between carving and skidding can destabilise penetration depth — [Sponet record](https://www.sponet.de/sponet/Record/3042480?lng=en)
- Snow fractures when shear stress exceeds a critical value. Loose snow limits carving to small inclinations — [White Rose carving.pdf](https://eprints.whiterose.ac.uk/168379/1/carving.pdf)
- Snowboard simulation: a smaller sidecut radius increases the snow particles' attack angle and so the reaction force — [SciTePress 2018](https://www.scitepress.org/Papers/2018/68964/68964.pdf)

### Inferences (DERIVATION)
- **Ideal-carve speed limit.** v_max ≈ √(9.81 × 7 × cos30°) ≈ 7.7 m/s (28 km/h) for R_sc = 7 m on a 30° ramp. At 15-17 m/s, a pure sidecut carve (R ≤ 7 m, a_lat ≥ 3 g) cannot be balanced. Any edge curvature on a fast kicker approach must therefore be a large-radius (20-100 m), partly skidded "drift carve".
- **Lean and friction demand on the ramp.**
  - Normal acceleration: a_n = g·cosθ + v²/R_t, where R_t is the vertical transition radius.
  - Required effective grip: μ_req = (v²/R)/a_n, and the lean angle is φ = atan(μ_req).
  - Example at v = 15 m/s, θ = 30°, R_t = 20 m: a_n ≈ 8.5 + 11.25 ≈ 19.7 m/s² (2.0 g).
    - R = 20 m: a_lat = 11.25 m/s², μ_req ≈ 0.57, lean ≈ 30°. Feasible on firm snow.
    - R = 10 m: a_lat = 22.5 m/s², μ_req ≈ 1.14, lean ≈ 49°. Marginal. It needs edge bite (shear strength), not Coulomb friction, and is likely to wash out on soft snow.
    - On the flat ramp section, before the transition (no v²/R_t term): R = 20 m gives μ_req ≈ 1.3, which is likely to wash out.
- **Game rule.** Allow carve curvature κ = 1/R only while v²·κ ≤ μ_edge·a_n, with μ_edge ≈ 0.6-1.0 on hardpack and 0.3-0.5 on soft snow (ESTIMATE). Beyond that limit, convert the excess into skid: lateral slip velocity, speed loss, and a smaller Δψ than the input asked for.

### Gaps
- I found no measured edge-grip limit or shear-strength value specific to kicker ramps.
- I found no snowboard-specific lateral force measurements at 50-60 km/h.

## Q5. How does yaw angular momentum at takeoff relate to the degrees achieved?

### Takeoff
Degrees = (180/π)·∫ L/I(t) dt. With L fixed at takeoff, the rotation is about (L/I_eff)·T. Measured I_yaw values for snowboarders were not found. My estimate is about 1.5 kg·m² tucked and 2.5-3.5 kg·m² open, including the board and a wide stance. Riders control the final degrees through I(t), by tucking and grabbing to speed up and opening to slow down.

### Cited Findings
- Angular momentum is constant in the air, and pulling the arms in speeds rotation (L = Iω) — [Scientific American](https://www.scientificamerican.com/article/olympic-big-air-snowboarders-use-physics-to-their-advantage/); [UAF physics page](https://ffden-2.phys.uaf.edu/212_spring2011.web.dir/robert_burdick/Momentum.html)
- Estes et al. 1999 sagittal-plane snowboarder model tabulated segment inertias: torso/head/arms about 9.05 kg·m², pelvis about 0.29, each leg about 1.0. These are sagittal-plane values, not yaw, and the table text was garbled in extraction — [Estes J Biomech Eng 1999](https://hull.bme.ucdavis.edu/files/2011/07/Estes_JBiomechE_1999.pdf)
- A 2020 freestyle snowboarding study computed the full inertia tensor from motion capture and used its trace as a posture descriptor. The snippet did not include per-axis values — [J Human Kinetics 72 (2020)](https://johk.pl/wp-content/uploads/2023/03/10078-72-2020-v72-2020-03.pdf)
- Moment of inertia is a key performance indicator for the amount of rotation — [ResearchGate 368779247](https://www.researchgate.net/publication/368779247)

### Inferences (ESTIMATE)
- Example: L = 15 kg·m²/s with 0.3 s open at I = 3 (ω = 5 rad/s) and then 2.2 s tucked at I = 1.6 (ω = 9.4 rad/s) gives 0.3×5 + 2.2×9.4 ≈ 22.2 rad ≈ 1270°. That is enough for a 1260.
- Ratio of tucked to open spin rate: about 1.6-2×.
- Game: for a target rotation N·180°, solve for L given the airtime T and the posture schedule. The carve contributes L_c = I_open·v/R, about 1-3 kg·m²/s, or about 60-180° of rotation. It is a "bonus", not the main source.

### Gaps
- I found no published measured I_yaw, takeoff L or peak spin rates for big-air snowboarders. The likely sources are the Applied Sciences 2025 and Merz 2025 full texts, which could not be retrieved.
