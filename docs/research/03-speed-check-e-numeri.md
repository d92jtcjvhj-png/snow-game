# Speed check before a snowboard kicker and numbers for an approach/takeoff simulation

NOTE ON METHOD: WebFetch was blocked for every host tried (mdpi.com, arxiv.org, ar5iv, link.springer.com, engrxiv.org, jyx.jyu.fi), so the numbers below come from search-engine summaries of the cited pages, not from reading full texts. Values marked ESTIMATE / DERIVED come from my own calculation and have no source.
Intended destination: /tmp/claude-0/-home-user-snow-game/b1e6677e-06d3-5a0d-9e66-3730e4d75ca5/scratchpad/research_notes/Approccio al kicker snowboard/speedcheck_numbers.md (not written because plan mode was active; copy these notes there).

## 1. How a speed check before a jump is done and how much it slows the rider

### Takeaway
A speed check is a short skid: the rider pivots the board across the fall line, usually heelside, then returns to a straight run before the takeoff. Coaching sources agree on the technique: check early, use as few checks as possible, and make no late adjustments near the lip. I found no measured deceleration or km/h removed per check, so those values below are estimates.

### Cited Findings
- A speed check means building speed as if going for the jump, then turning to the side instead of launching. It shows the rider how fast they need to be — [CoachUp](https://www.coachup.com/nation/articles/snowboarding-going-off-jumps)
- Too many checks on the approach drain speed, so the rider lands short on the deck or knuckle — [Snowboard Addiction, fall line jumps](https://snowboardaddiction.com/blogs/jumping/fall-line-jumps)
- Ride straight to the jump without last-second checks, because they can cause an edge catch — [Dope Snow](https://www.dopesnow.com/mag/how-to-jump-on-a-snowboard/)
- Mark a fixed drop-in point you would ride straight from with no check. Adjusting speed on the fly while rolling into the line usually goes badly. Keep the last check near the start/fence, not near the lip. Undershooting is worse than overshooting — [snowboardingforum "Judging jump speeds"](https://www.snowboardingforum.com/threads/judging-jump-speeds.19933/), [snowboardingforum "Going to bigger jumps"](https://www.snowboardingforum.com/threads/going-to-bigger-jumps.182129/) (anecdotal)
- Many riders get hurt hitting jumps too slowly — [CoachUp](https://www.coachup.com/nation/articles/snowboarding-going-off-jumps)
- Heelside skid technique: a common fault is sitting back to shed speed on the heelside. The fix is to pull the toes up and edge progressively — [NZSIA learning](https://learning.nzsia.org/?p=14880)
- Sideslip-to-straight pivot drill (heelside sideslip, then pivot the nose downhill) builds the movement used to come out of a check — [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/fall-line-jumps)
- Riders gauge their speed by following someone who is already hitting the jump, and by riding smaller jumps first to read the day's snow speed — [snowboardingforum](https://www.snowboardingforum.com/threads/help-with-my-kicker-jumps.260711/)
- Some parks measure in-run speed with a radar gun before a jump (Boreal) — [Tahoe Daily Tribune](https://www.tahoedailytribune.com/news/tahoe-terrain-park-physics-computer-to-the-snowcat/)
- Energy loss from skidding: side-skidding (short-radius) turns increase mechanical energy dissipation. In giant slalom, energy dissipated per turn was about −5.0 to −10.5 kJ, mostly from ski–snow friction rather than drag — [Supej, MSSE 2008](https://journals.lww.com/acsm-msse/Fulltext/2008/05001/Mechanical_Energy_Dissipation_and_Performance_in.1424.aspx), [NTNU document](https://www.ntnu.no/documents/11601816/18800355/Lars-Luca-Tekstil-alpint-aerodynamikk.pdf)

### Inferences (ESTIMATES, not sourced)
- **Model:** treat a check as a skid where the board's longitudinal axis sits at a yaw angle β to the velocity. Deceleration is roughly a ≈ g·(μ_lat·sin β·cos α_slope + μ_long) − g·sin α_slope. Effective lateral "plowing" friction of an edge set across the snow is ESTIMATED at μ_lat ≈ 0.3–0.6 (no snow-skid data found), against μ_long ≈ 0.03–0.1 for gliding.
- **Typical pre-jump check:** board rotated about 45–80° to the direction of travel for about 0.3–0.8 s. Deceleration about 2–5 m/s² (0.2–0.5 g), which removes about 1–3 m/s, or 4–11 km/h, per check. A hard skid-stop can reach roughly 0.5–0.8 g. ESTIMATE.
- **Placement:** the last check is typically at the top of the in-run, roughly 20–60 m before the lip on medium/large jumps (ESTIMATE). After it, the rider needs a straight, flat-based run long enough to settle (≥ about 2–3 s).
- **Why checks near the lip are discouraged:** (a) on the transition, edge pressure rises (centripetal load), so an edged board can catch or chatter; (b) the rider cannot stabilise posture before the pop; (c) speed lost there cannot be recovered, so the rider knuckles. The edge-catch and knuckle risks are sourced above. The mechanism in (a) is an inference.
- **Feel/sound for game feedback (ESTIMATE):** a scraping "shhh" with a snow spray plume on the downhill side of the board. Spray is larger on soft snow and smaller on ice, where chatter dominates.

### Gaps
- No measured km/h per check, no deceleration in g, no duration and no yaw angle in any source found. No AASI/BASI document with numbers was reachable.
- No data on heelside vs toeside frequency. Coaching sources imply heelside is the default because it is easier and more stable, but this is not quantified.

## 2. Takeoff speeds and jump geometry by size

### Takeaway
Measured elite big-air takeoff speeds are about 14.7–16.4 m/s (53–59 km/h) on a dry-slope big-air ramp. Popular sources put pro big air at about 48–72 km/h. Design papers use 7–14 m/s for park jumps. FIS sets a 25° minimum takeoff angle for big air.

### Cited Findings
- **Elite big air (11 Chinese national-team riders, dry slope with airbag):** resultant takeoff velocity 14.7 ± 0.5 m/s (Bs 720) to 16.4 ± 0.5 m/s (Bs 1800). Vertical velocity 7.27 ± 0.84 m/s (Bs 720) to 9.14 ± 0.42 m/s (Bs 1800). The largest changes occur from 1080 to 1440. Takeoff time and vertical velocity are key to progression — [Applied Sciences 2025, 15(12):6618](https://doi.org/10.3390/app15126618)
- Ruka Park study (5 riders, Bs 360/540/720 on the biggest kicker): centre-of-mass vertical velocity rose with difficulty for every subject. Horizontal velocity varied by rider (individual styles). Values not retrieved — [JYX thesis 2022](https://jyx.jyu.fi/jyx/Record/jyx_123456789_81576)
- Fenway Big Air 2016: an Olympian described "almost 40 mph" (~64 km/h) before launch — [Boston Globe](https://apps.bostonglobe.com/graphics/2016/01/big-air/)
- Pro big-air takeoff about 30–45 mph (48–72 km/h), with some setups near 50 mph (80 km/h). Popular explainer, weak source — [thesportscast](https://thesportscast.net/2026/02/11/how-fast-do-snowboarders-go-in-big-air-speeds-physics-what-makes-it-possible/)
- Forum anecdote: about 60–70 km/h for a 20 m jump, about 90 km/h for a 44 m jump — [snowboardingforum](https://www.snowboardingforum.com/threads/how-fast-is-fast.36826/) (anecdotal)
- Design speeds in the papers: 14 m/s (~50 km/h) used as a design takeoff speed; a nominal takeoff of about 7.2 m/s (~26 km/h) for a medium jump — [Safety-Conscious Design of Terrain Park Jumps (engrXiv)](https://engrxiv.org/preprint/download/1585/version/2410/3268/2398), [Petrone et al. 2017, Sports Eng.](https://link.springer.com/article/10.1007/s12283-017-0253-y)
- Shealy et al. 2010 measured takeoff speed with a laser speed trap (±0.11 m/s) on two tabletops (Snow Summit, Mammoth). Correlation of speed with landing distance was weak (R² = 0.16 on the larger jump) — [ASTM JAI](https://dl.astm.org/jai/article-abstract/7/10/1/5279/Jumper-Kinematics-on-Terrain-Park-Jumps?redirectedFrom=fulltext)
- On one measured jump, a takeoff speed increase of only 1.14 m/s pushed EFH above 1.5 m, so speed control is critical — via [ResearchGate summary of related work](https://www.researchgate.net/publication/257778802_Designing_tomorrow's_snow_park_jump)
- EFH is the kinetic energy of the landing-velocity component normal to the surface, divided by mg. A shaped landing gives constant EFH for any takeoff speed up to the design (maximum) speed — [Petrone, Cognolato, McNeil 2017](https://link.springer.com/article/10.1007/s12283-017-0253-y); [Hubbard, Safer ski jump landing surface design](https://trailism.com/wp-content/uploads/2013/02/JumpLandingDesignLimitsNormalImpactVelocity.pdf)
- **FIS big air:** minimum takeoff angle 25°, ≥15 m from takeoff to landing, drop-in ramp ≥30 m long — [NBC Olympics](https://www.nbcolympics.com/news/snowboarding-101-what-know-about-olympic-big-air)
- **Big Air Shougang (Beijing 2022):** ramp 60–64 m high, 160–164 m long; kicker-to-landing distance adjustable 20–27 m (about 22 m expected for the Olympics) — [Wikipedia](https://en.wikipedia.org/wiki/Big_Air_Shougang), [FIS preview](https://www.fis-ski.com/freeski-park-and-pipe/news/2021-22/beijing-2022-freeski-big-air-and-slopestyle-preview). Vertical drop: start 155 ft above ground, landing 13 ft below, 168 ft (~51 m) in total — [NBC](https://www.nbcolympics.com/news/industrial-backdrop-eileen-gus-historic-big-air-performance)
- **Example expert kicker in a research paper:** table 17 m, transition angle 20°, kick height 2.5 m — via [search summary of jump-design literature](https://www.researchgate.net/publication/257778802_Designing_tomorrow's_snow_park_jump) (exact attribution unverified)
- Landing run about 2× the table length — [Scheumann & Rues snowpark manual](http://www.terrainparkconsulting.com/uploads/1/0/5/3/10533260/snowparks_manual_english.pdf)

### Inferences (DERIVED)
- **Minimum speed to reach the knuckle** (same height, no drag, no pop), from v = √(g·d / sin 2θ):
  - 8 m table at 25°: ~10.1 m/s (36 km/h)
  - 15 m at 30°: ~13.0 m/s (47 km/h)
  - 20 m at 30°: ~15.1 m/s (54 km/h)
  - 25 m at 30°: ~16.8 m/s (61 km/h)
  The sweet spot sits roughly 5–15% above these. This agrees with the measured 14.7–16.4 m/s.
- **Suggested game classes (ESTIMATE):**
  - Small park: 5–8 m table, lip 20–25°, takeoff 30–40 km/h
  - Medium: 10–14 m, 25–28°, 40–50 km/h
  - Large: 15–20 m, 27–32°, 48–58 km/h
  - Big air (WC/Olympic): 20–27 m, ≥25° (often about 30°+), 55–65 km/h
  - Landing slopes about 30–35° (ESTIMATE; dirt-jump guide says about 30° — [Pinkbike](https://www.pinkbike.com/news/How-to-Build-a-Kicker-2012.html))

### Gaps
- No full-text US (NSAA) or Swiss park standard with lip/landing angle tables was reachable. No measured run-in length or angle tables per jump size.

## 3. Carving physics numbers

### Takeaway
Park boards have sidecut radii of about 7.6–8.4 m. Snow friction μ is about 0.02–0.14 depending on snow. Snowboarder CdA is about 0.35–0.55 m², set mainly by posture. Carved snowboard turns still include some skid.

### Cited Findings
- **Park-board sidecut radius:**
  - Capita DOA: ~7.6 m (148 cm) to 8.4 m (164 cm) — [Capita](https://capitasnowboarding.com/products/doa-2026), [the-house](https://www.the-house.com/1114581.html)
  - Lib Tech Box Knife: 8.0 m (148) to 8.3 m (157/160) — [Backcountry](https://www.backcountry.com/lib-technologies-box-knife-snowboard)
  - Burton Process Off-Axis: 7.7 m (152) to 8.4 m (162), with an asymmetric sidecut deeper on the heel side — [Backcountry](https://www.backcountry.com/burton-process-off-axis-snowboard)
  - Capita Super DOA 154: 7.9 m — [evo](https://www.evo.com/snowboards/capita-super-doa-snowboard-2024)
- Snowboard sidecut can be as low as 6–8 m at a 150–160 cm chord. This source gives the ideal-carving model with no slip — [Physics of Skiing: Ideal-Carving Equation](https://www.researchgate.net/publication/2169650_Physics_of_Skiing_The_Ideal-Carving_Equation_and_Its_Applications)
- A full-scale snowboard carving test used a 7.05 m constant sidecut radius and measured 2-component ground reaction — [Sports Eng. 2019](https://link.springer.com/article/10.1007/s12283-019-0307-4). A constant-radius sidecut gives discontinuous edge-pressure distribution — [Sports Eng. 2022](https://link.springer.com/article/10.1007/s12283-022-00380-7)
- Carving example (secondary, unverified): 12 m sidecut at ~10 m/s and ~58° edge gives ~6.3 m turn radius, consistent with R ≈ Rsc·cos(edge angle) (12·cos58° = 6.36 m) — [Physics of a Snowboard Carved Turn (Michaud & Duncumb, Bomber)](https://bomberonline.3dcartstores.com/assets/images/PDFs/Physics-of-a-Snowboard-Carved-Turn.pdf)
- Carved snowboard turns contain skidding components, with a higher average skid angle than skiing (steeper slope needed). Skiing references: carved turn average skid about 4.1°, outer leg 1–2°, inner leg 7–8° — [Klous et al., via semantic scholar](https://pdfs.semanticscholar.org/05fe/7f3c06430d37a8edb01371201ae619fdd180.pdf)
- Recreational carving ground reaction is about 1.5–2 body weights (ski data, secondary citation); outside leg carries 60–75% — [same](https://pdfs.semanticscholar.org/05fe/7f3c06430d37a8edb01371201ae619fdd180.pdf)
- **Snow friction (freestyle skis/snowboards):** μ = 0.026–0.143 for snowboards (0.023–0.139 for skis), predicted from snow parameters. About 0.02–0.04 on optimal icy slopes, about 0.10 on soft/wet snow. μ varies with speed; on wet snow speed tops out at about 12 m/s, and at 8.5 m/s on very wet new snow — [Frontiers Mech. Eng. 2021](https://www.frontiersin.org/journals/mechanical-engineering/articles/10.3389/fmech.2021.728722/full)
- Design papers use μ_kinetic about 0.04–0.12 and CdA 0.279–0.836 m², with a lift/drag ratio of 0–0.1. Drag is negligible for jumps under about 12 m — [Designing tomorrow's snow park jump (McNeil, Hubbard, Swedberg 2012)](https://scispace.com/pdf/designing-tomorrow-s-snow-park-jump-3obde3yr43.pdf)
- **Wind tunnel (3 snowboarders, 35/60/85 km/h):** CdA 0.35–0.55 m², dominated by posture, then apparel. Apparel changes CdA by −8% to +15% in the mid posture; a low posture gives about −41% versus mid — [PubMed 34059467, "Towards more valid simulations of slopestyle and big air jumps"](https://pubmed.ncbi.nlm.nih.gov/34059467/)
- Simple textbook value: waxed base on snow μ ≈ 0.05 — [College Physics Answers](https://collegephysicsanswers.com/openstax-solutions/calculate-deceleration-snow-boarder-going-50circ-slope-assuming-coefficient)

### Inferences (ESTIMATES)
- **Edge angles:** recreational/park carving about 30–50°; aggressive carving 60°+ (the Bomber example uses 58°).
- **Lateral acceleration in a balanced carve:** a_lat = g·tan(lean). At 45° that is about 1 g; at 60° about 1.7 g.
- **Turn radius:** a 7.8 m sidecut at a 40° edge gives R ≈ 6.0 m; at 60°, R ≈ 3.9 m.
- **Mass:** rider plus gear about 75–85 kg.
- **Air density:** ρ = 1.0–1.2 kg/m³ at altitude.

### Gaps
- No snowboard-specific measured lateral-g or edge-angle time series found. No skid (lateral) friction coefficient found.

## 4. Takeoff biomechanics (pop, timing, angular momentum)

### Takeaway
Pop is a bounded velocity added at the lip. Field-derived pop is −2.48 to +1.12 m/s (Shealy data, about 240 jumpers). Snowboarder pop has an upper bound of about 2.2 m/s. Elite big-air vertical takeoff velocity is about 7–9 m/s, which includes the ramp component.

### Cited Findings
- Pop speeds of −2.48 to +1.12 m/s explain the range of landing distances measured by Shealy et al. for over 240 jumpers. Pop is modelled as a velocity added to the no-pop takeoff velocity, which changes both speed and direction — [McNeil 2012, ASTM STP104240](https://store.astm.org/stp104240.html); repeated in [Petrone et al. 2017](https://link.springer.com/article/10.1007/s12283-017-0253-y)
- **Snowboarder pop bound:** a "reasonable upper bound" of about 0.25 m jump height, which corresponds to about 2.21 m/s — [Hubbard, Safer landing design](https://trailism.com/wp-content/uploads/2013/02/JumpLandingDesignLimitsNormalImpactVelocity.pdf) (context partly unverified)
- Elite big-air vertical takeoff velocity is 7.27 ± 0.84 (Bs 720) to 9.14 ± 0.42 m/s (Bs 1800). Harder spins need a longer takeoff time and more angular momentum — [Applied Sciences 2025](https://doi.org/10.3390/app15126618)
- IMU work (Harding et al.) on halfpipe measured total air time and average degree of rotation with a gyroscope. Board-mounted IMUs are valid for rotation measurement — [Harding et al.](https://www.researchgate.net/publication/29470225_Feature_extraction_of_performance_variables_in_elite_half-pipe_snowboarding_using_body_mounted_inertial_sensors), [PMC11548732](https://pmc.ncbi.nlm.nih.gov/articles/PMC11548732)

### Inferences (DERIVED / ESTIMATE)
- **Vertical velocity:** with a 30° lip at 15.5 m/s, the ramp alone gives about 7.75 m/s vertical. The measured 7.3–9.1 m/s therefore implies a pop or added extension of roughly 0–1.5 m/s, consistent with McNeil's bounds.
- **Airtime check:** 9 m/s vertical gives a time to apex of about 0.92 s, so airtime is about 2–2.5 s on big air. A 1800 (5 rev) in about 2.2 s means about 2.3 rev/s, or about 14 rad/s mean spin rate.
- **Game pop:** use 0.5–1.5 m/s normal to the lip, applied over an extension phase of about 0.1–0.25 s. ESTIMATE, as no takeoff duration value was retrieved.

### Gaps
- No angular momentum values (kg·m²/s) or takeoff durations retrieved; they are in the MDPI and JYX full texts, which were blocked.

## 5. Radius/lateral extent of the pre-jump set-up turn

### Takeaway
I found no quantitative data on set-up turn radius or lateral extent. Coaching sources describe entry paths for spins: heelside/toeside set-up and straight run-in. Numbers below are estimates.

### Cited Findings
- Snowboard Addiction describes entry paths for spinning: a carve or set-up line into the takeoff, with the rider going straight or nearly straight on the lip — [Snowboard Addiction, entry paths for spinning](https://snowboardaddiction.com/blogs/training-education/entry-paths-for-spinning)
- Ride straight to the lip; no late adjustments — [Dope Snow](https://www.dopesnow.com/mag/how-to-jump-on-a-snowboard/)

### Inferences (ESTIMATES)
- **Set-up carve:** radius about 8–20 m (a gentle edge of 20–40° on a 7.8 m sidecut gives 6–7 m pure-carve radius; real set-up turns are skid-carved and wider). Lateral offset from the kicker centreline about 1–4 m. Finishes about 5–15 m (about 0.4–1 s at 50 km/h) before the lip.
- **Final segment:** straight, flat base, or a slight edge for spin pre-wind.
- **Speed loss in a clean set-up carve:** small, about 0.5–2 km/h.

### Gaps
- No video-analysis or measured data found for set-up turn geometry.
