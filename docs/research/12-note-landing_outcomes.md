# Landing outcomes in snowboard big air: what decides a clean landing vs a fall

> Access note: every full-text host tried was blocked in this session (DNS fail): ar5iv/arxiv, link.springer.com, engrxiv, core.ac.uk, assets.fis-ski.com, PMC, whitelines.com, bcsnowboard.com, snowboardaddiction.com. Everything below comes from **search-engine snippets / abstracts**, not full texts. Numbers that could only be partly verified are flagged. Derivations are marked **[DERIVED]**, design guesses **[ESTIMATE]**.

## Q1. Landing alignment: board yaw vs travel direction, edge vs flat base, under/over-rotation, switch landings

### Takeaway
No peer-reviewed or coaching source gives a numeric yaw tolerance in degrees. The evidence says: "incorrect board positioning at landing" is a significant predictor of falls. Spins raise fall risk compared with straight airs. Coaches want the base flat and the board on the landing line, with the landing spotted early (about 270° into a 360). Landing on an edge mid-rotation leads to washouts, edge catches and backward falls. A board landed ~180° off is a normal "switch" landing, and it is clean as long as the trick was completed and the rider does not revert because of instability.

### Cited Findings
- Observational study of 704 table-top jumps (New Zealand parks, video): 151 (21%) ended in a fall. Board contact at touchdown: tail-first 57%, flat 32%, nose-first 11%. The authors call tail-first favorable, since earlier kinetic data showed lower impact loads. 51% of falls went posterior / toward the tail — [McAlpine, Kurpiers, Kersting, "Jump landings in snowboarding: an observational study" (Science & Skiing IV, 2008), SPONET record](https://sponet.de/sponet/Record/3042548?lng=en)
- The 2017 follow-up on the same dataset found "landings made on the flat or knuckle of the snow jump as well as incorrect board positioning at landing were found to be significant predictors of falling". It also found that "spinning jumps [are] associated with a greater fall risk when compared to non spinning jumps." Fall rate was about 1 per 5 attempts — [Kurpiers, McAlpine, Kersting, *Injury* 2017, PubMed 28865874](https://pubmed.ncbi.nlm.nih.gov/28865874/); [ScienceDirect abstract](https://www.sciencedirect.com/science/article/abs/pii/S0020138317305727)
- One summary snippet says spins increased fall incidence by 290% compared with straight jumps. This is unverified, from a conference-abstract summary seen only in a search snippet — [SPONET record](https://sponet.de/sponet/Record/3042548?lng=en)
- Nose-first touchdown predicted falls with OR 4.01 (95% CI 2.26–7.11). A "typical fall after jumping is directed toward the tail and heel edge of the snowboard with the trailing hand making first contact" — [McAlpine PhD thesis, Univ. Auckland 2010](https://researchspace.auckland.ac.nz/server/api/core/bitstreams/f0920606-59d9-4a6e-80c1-775702d00aa7/content) ([handle](https://researchspace.auckland.ac.nz/handle/2292/6655))
- Coaching advice: spot the landing at about 270° for a 360 and about 450° for a 540. Land with the base flat, not on an edge: an edge landing sends the spin off-axis and often ends on your back. Land flat, then roll onto the edge you want — [snowboardbible list of tricks](https://snowboardbible.com/list-of-snowboarding-tricks/); [abom.com how to jump](https://abom.com/how-to-jump-on-a-snowboard/); [snowboardingforum "Landing a jump"](https://www.snowboardingforum.com/threads/landing-a-jump.35099/)
- Legs act as suspension: extend slightly before touchdown, then flex on contact — [abom.com](https://abom.com/how-to-jump-on-a-snowboard/)
- Snowboard Addiction says backside 360 landings often revert or wash out. It traces the cause to the takeoff edge, hip position and head movement, and the fix is spotting the landing earlier — [Snowboard Addiction blog](https://snowboardaddiction.com/blogs/training-education/why-your-backside-360-isn-t-working-live-coaching) (snippet only)
- Rider forum (anecdotal): changing the board angle while touching down invites a washout, so commit to one edge. Too much back-foot pressure caused a washout. An upper body left open after landing is linked to a heel-edge catch — [r/snowboarding thread](https://redlib.ssps.io/r/snowboarding/comments/1hx48ja/what_am_i_doing_wrong_lol/m67kibz/?context=3); [same thread](https://redlib.ssps.io/r/snowboarding/comments/1hx48ja/what_am_i_doing_wrong_lol/m6b9ods/?context=3)
- An edge catch turns forward speed into rotation and can be violent. Ice, steep or choppy snow raise the risk — [Science Insights](https://scienceinsights.org/what-is-catching-an-edge-in-snowboarding/)
- Whitelines: if you fight a shaky landing you can catch an edge harder later, so sometimes it is better to let the butt-check happen — [Whitelines, ultimate guide to slams](https://whitelines.com/archive/features/ultimate-guide-snowboard-slams.html) (snippet only)
- An under-rotated rider can end up "blind" in the air. The advice is to feel for the contact gradually — [r/snowboarding](https://lr.in.psf.lt/r/snowboarding/comments/1bkkppy/who_is_at_fault/kvzvvl3/?context=3)
- Over-rotated landings are linked to forced ankle dorsiflexion ("snowboarder's fracture" mechanism). This is a weak source (Wikipedia) — [Wikipedia: Snowboard binding rotating device](https://en.wikipedia.org/wiki/Snowboard_binding_rotating_device)
- In judging, a revert caused by instability counts as a landing fault (see Q4). A clean switch landing is normal, since every half-rotation spin (180, 540, 900…) lands switch by definition — [FIS Judges Handbook 2019/20 (FSUK copy)](https://www.freestylesnowsports.co.uk/+documents/Judge%20Training/FIS%20Judges%20Manual.pdf); [Olympic explainer: "land with full control, with the trick already completed (no reverts, no hand drags)"](https://www.lex18.com/news/snowboarding-101-scoring)

### Inferences
- **[ESTIMATE]** Game tolerance bands. These are not sourced; they are derived from the physics of attrito anisotropo. Error is the yaw between the board axis and the velocity, measured mod 180° so that 180° counts as switch.
  - Below about 10–15°: clean. The board is a skate and the cross friction straightens it in a few tenths of a second.
  - About 15–30°: "sketchy" or skid-out. Speed is lost, a hand drag is likely, and the landing is still rideable.
  - About 30–45°: washout or butt-check, depending on which edge carries the load.
  - Above about 45°: fall. With the board near perpendicular, catching the downhill/leading edge throws the rider over that edge.
  These bands should be tuned in playtest. With the project's anisotropic friction model, lateral deceleration ≈ μ_lat·g·sin(yaw), so the band edges can come out of the physics instead of being hard thresholds.
- The fall direction (posterior, toward the tail and heel edge) suggests that a "too far back" or under-rotated landing should default to a heel-side butt-check or back fall. Nose-first is the riskiest board pitch (OR 4) and tail-first is the most common safe one.
- Base flat at touchdown, then edge: the game should penalise an edge angle at touchdown (the project already treats the lamina as a parameter), especially when the edge is the downhill one relative to the residual sideways velocity.

### Gaps
- No numeric yaw tolerance found in research, coaching material or game documentation.
- Exact odds ratios for flat/knuckle and for "incorrect board position" in Kurpiers 2017 were not retrievable (full text blocked).
- No source quantifies the rotation residual (degrees under/over) that is still landable.

## Q2. Drifting off-line: landing across the landing, off-centre, off the edge, soft snow / fences

### Takeaway
I found no source with numbers on lateral off-line landings. Physically, the board's alignment with the **velocity** and the normal impact relative to the **local surface** are what matter. Heading across the fall line on the prepared slope is fine if the board is aligned with travel. The local slope seen along the travel direction is shallower, which raises the normal impact (EFH). Landing off the groomed width puts the rider on side walls or ungroomed terrain and makes the result unpredictable.

### Cited Findings
- 55% of observed jumps touched down in zones of suboptimal impact attenuation (knuckle 35%, flat top 20%, landing ramp only 45%) — [SPONET record of McAlpine et al.](https://sponet.de/sponet/Record/3042548?lng=en)
- EFH is defined from the velocity component **normal to the landing surface**: EFH = (v·n)²/(2g), i.e. the normal KE divided by mg — [Petrone et al. 2017 / arXiv 1611.04448](https://arxiv.org/abs/1611.04448); [Levy et al. 2015](https://link.springer.com/article/10.1007/s12283-015-0182-6)
- Québec terrain-park feature compliance study (exists; details not retrieved) — [ResearchGate](https://www.researchgate.net/publication/340699583_Terrain_park_feature_compliance_with_Quebec_ski_area_safety_recommendations)
- Earlier project notes 04/05 already cover lateral drift (coaching and physics) — `/home/user/snow-game/docs/research/04-deriva-laterale-coaching.md`, `05-deriva-laterale-fisica.md`

### Inferences
- **[DERIVED]** Take a landing of slope angle α and a rider whose horizontal heading makes angle φ with the fall line. The slope seen along that heading is atan(tan α · cos φ). The descent angle stays the same while the effective landing slope gets shallower, so v_n and EFH grow. Example: α = 30°, φ = 30° gives an effective slope of 26.6°. At 18 m/s with a 35° descent, the mismatch grows from 5° to 8.4°, v_n goes from 1.57 to 2.63 m/s, and EFH from 0.13 m to 0.35 m. The exact game approach is to use the full 3D dot product with the surface normal of h(x,z) (the vincolo neve already has it), and no special case is needed.
- **[DERIVED]** Board aligned with travel but travel across the fall line: on touchdown, gravity's downslope component is not along the board. The rider then has to set an edge (uphill edge) to hold the line or let the board turn downhill. This is a normal carve or traverse, not a fault. The project rule "il giocatore non sterza" means the existing edge/curve model handles it.
- **[ESTIMATE]** Outside the groomed width: model it as surface-type zones. In soft or deep snow, use higher drag and sink, plus a higher fall chance if yaw or edge is off. Hitting a fence or boundary is a collision (Rapier), which is a crash. No source gives thresholds.

### Gaps
- No study or coaching source quantifying acceptable cross-landing angle, landing width, or outcomes of landing in soft snow beside the landing.

## Q3. Impact severity: EFH thresholds, knuckle (short) and flat (long) landings

### Takeaway
EFH (normal-component fall height) is the standard severity metric. A leg-absorbable limit of about **1.5 m** (attributed to Minetti et al. 2010) is the reference design value. A shaped landing keeps EFH constant. Knuckle landings risk an inverting pitch rotation and high EFH, and flat-bottom landings after overshooting give very high EFH. Landing configuration (inverted or backward) can matter more than EFH for spine injury.

### Cited Findings
- EFH is "the kinetic energy associated with the landing velocity component perpendicular to the landing surface divided by mg" — [arXiv 1611.04448 (Petrone, Cognolato, McNeil, Hubbard)](https://arxiv.org/abs/1611.04448)
- Petrone et al. cite Minetti et al. (2010) for the claim that the normal component a rider's legs can absorb is only about 1.5 m EFH. Minetti, Ardigò, Susta, Cotelli, *Ergonomics* 2010, "Using leg muscles as shock absorbers"; the original was not retrieved — [arXiv 1611.04448 via search snippet](https://pdf.arxiv.org/pdf/1611.04448)
- Example from the same paper: a triple-cork landing carried about 16 m of total EFH-equivalent energy. Only about 1.2 m was in the normal component and about 14.8 m was tangential — [arXiv 1611.04448](https://pdf.arxiv.org/pdf/1611.04448) (snippet)
- Press summary: people can absorb an EFH of about 1.5 m but suffer significant injury at about 10 m — [Digital Trends](https://www.digitaltrends.com/outdoors/italian-safer-ski-jump/) (secondary)
- Hubbard: assume the probability of severe injury correlates with the normal impact velocity, or EFH. Surfaces that cap EFH satisfy a first-order ODE — [Hubbard, JAI 2009, ASTM](https://store.astm.org/jai101630.html); [Hubbard PDF (trailism mirror)](https://trailism.com/wp-content/uploads/2013/02/JumpLandingDesignLimitsNormalImpactVelocity.pdf)
- A constant-EFH jump was built at Tognola (San Martino di Castrozza) and measured with accelerometers. The approach is robust to "uncontrollable" factors — [Petrone et al., Sports Eng. 2017](https://link.springer.com/article/10.1007/s12283-017-0253-y); [ResearchGate: robust to uncontrollable factors](https://www.researchgate.net/publication/277681996_Design_of_Terrain_Park_Jump_Landing_Surfaces_for_Constant_Equivalent_Fall_Height_Is_Robust_to_Uncontrollable_Factors)
- EFH h = 0.5 m is described as a relatively gentle landing surface — [search snippet of EFH literature (arXiv 1611.04448)](https://arxiv.org/abs/1611.04448)
- On a measured jump, a 1.14 m/s increase in takeoff speed pushed EFH above 1.5 m (already in project notes) — [Designing tomorrow's snow park jump, ResearchGate](https://www.researchgate.net/publication/257778802_Designing_tomorrow's_snow_park_jump)
- Landing just before the knuckle or deep in the landing gives large-EFH, unsafe impacts. Landing just past the knuckle can cause an inverting rotation of about 60°, "sufficiently large to pose a potential injury risk" — [EFH/inversion literature, ASTM STP (McNeil/Hubbard)](https://store.astm.org/stp20120062.html); [Levy et al. 2015](https://link.springer.com/article/10.1007/s12283-015-0182-6) (snippets)
- Crash-test work on backward-rotated landings: "landing configuration is more important than EFH in determining injury likelihood of cervical spine" — [ASTM STP "Would Limiting Equivalent Fall Height Reduce Spine Injuries?"](https://dl.astm.org/stps/book/242/chapter-abstract/64973/Terrain-Park-Jump-Design-Would-Limiting-Equivalent?redirectedFrom=fulltext) (snippet)
- Alberta study: the primary injury cause was a takeoff error giving a jump that was too high and then a flat landing — [Injuries and terrain park feature use among snowboarders in Alberta](https://www.researchgate.net/publication/50891469_Injuries_and_terrain_park_feature_use_among_snowboarders_in_alberta)
- Niigata, Japan, 11 years of data: jumps in terrain parks were the most common factor in 113 (66.1%) snowboard spinal injuries. Backward falls after failed landings are a leading mechanism of spinal fracture — [PMC7223356](https://pmc.ncbi.nlm.nih.gov/articles/PMC7223356/)
- Landing slopes on big-air features can reach about 40° — [Scientific American](https://www.scientificamerican.com/article/olympic-big-air-snowboarders-use-physics-to-their-advantage/)
- A jump-monitoring patent describes undershoot (landing on the table or in the gap) and overshoot (past the landing onto the flatter run-out) — [USPTO 8482417](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8482417)

### Inferences
- **[DERIVED]** v_n = |v|·sin(θ), where θ is the mismatch between the trajectory and the landing slope. EFH = v_n²/(2g), so 1.5 m corresponds to v_n ≈ 5.4 m/s and 0.5 m to v_n ≈ 3.1 m/s. At |v| = 20 m/s, EFH 1.5 m is reached at θ ≈ 15.7°, and 0.5 m at θ ≈ 9°. At 15 m/s, EFH 1.5 m is reached at θ ≈ 21°.
- **[ESTIMATE]** Game severity bands for a skilled rider:
  - EFH < 0.5 m: soft and clean.
  - 0.5–1.5 m: absorbable; above about 1.0 m, show compression animation and a small speed loss.
  - 1.5–3 m: "hard landing", with a high chance of butt-check or hand-down, especially if combined with yaw, edge or pitch errors.
  - Above about 3 m (e.g. flat-bottom after overshoot, or from the table top): fall.
  Pitch (nose-first, inverted) should multiply fall probability independently of EFH, as the spine study notes.
- Knuckle and table landings: the rider loses support under the tail or nose and pitches forward/inverts (about 60° at the knuckle, per the snippet). In a game, a touchdown on the convex knuckle region with nose-down pitch should mean a forward fall. A short landing on the table means a high EFH plus a stall.

### Gaps
- Primary Minetti 2010 values and McNeil/Hubbard design recommendations could not be read in full; the 1.5 m figure is second-hand via Petrone et al.
- No data linking specific EFH levels to *fall* probability (as opposed to injury).

## Q4. Judging: FIS landing deductions and how landing maps to score

### Takeaway
FIS judges use an overall impression score (0–100, six judges, high and low dropped). The landing is one of four criteria (difficulty, execution, amplitude, landing). Landing faults have deduction bands: small faults like a hand drag cost about 1–9 points, medium faults like two hands down or a revert from instability cost about 10–19, and major faults like body contact or a fall cost about 20–29. The band values changed between editions.

### Cited Findings
- FIS Judges Handbook 2019/20: 1–9 points for small landing mistakes ("hand drag, small hand-touch, etc."). 10–19 for medium mistakes ("two hands down, reversing the trick due to instability"). 20–29 for major mistakes ("body contact with the snow") — [FIS Judges Handbook SB & FK 2019/20 (FSUK copy)](https://www.freestylesnowsports.co.uk/+documents/Judge%20Training/FIS%20Judges%20Manual.pdf); [readkong copy](https://www.readkong.com/page/judges-handbook-snowboard-freeski-edition-2019-2020-2850854)
- Spring 2022 update (snippet garbled, verify): 1–9 small (hand drags); 6–15 medium (reverts, light touch-downs, heavy hand); 16–20 major (hard touch-downs, falls, complete falls) — [FIS SB/FK Judges Handbook update spring 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf)
- Older snowboard manual 2016/17 on a 10-point scale: 0.1–0.9 minor (hand drag), 1.0–1.9 medium, 2.0–2.9 major (body contact with snow) — [FIS Judges Manual Snowboard 2016/17](https://www.apul.cz/media/uploads/sekce_snowboarding/dokumenty/fis_judges_manual_snowboard.pdf)
- Unofficial 2020-21 pocket guide: 1–9 minor (hand touch, drag, off balance), 20–29 major — [Centurione pocket guide, BC Snowboard](https://www.bcsnowboard.com/wp-content/uploads/MC-Pocket-Guide-to-SB-Freestyle-Judging-2020-21.pdf)
- A latest handbook exists (clean/fall 2023) but was not retrievable — [FIS SB/FK judges handbook clean fall 2023](https://assets.fis-ski.com/f/252177/298852da13/fis_sb_fk-judgeshandbook_clean-fall-2023.pdf)
- Olympic explainer: six judges, highest and lowest dropped, four averaged, scored 1–100. Criteria are difficulty, amplitude, landing and style. Riders "must land with full control, with the trick already completed (no reverts, no hand drags)" — [LEX18 "Snowboarding 101: scoring"](https://www.lex18.com/news/snowboarding-101-scoring)
- Judges weigh landing stability and whether the trick was completed before landing. Too much or too little amplitude is "dangerous and will be taken into account" — [NBC Olympics rules](https://www.nbcolympics.com/news/snowboarding-101-rules); [Red Bull: how to judge slopestyle](https://www.redbull.com/ca-en/how-to-judge-snowboard-slopestyle)
- Judging is subjective, with no fixed points per trick — [ESPN 2022](https://africa.espn.com/olympics/story/_/id/33293241/olympics-2022-why-hard-judge-snowboarding-explaining-mistakes-failures-admissions)

### Inferences
- Suggested game mapping (Italian UI labels), in order of increasing severity:
  - Pulito: no deduction.
  - Mano a terra: hand drag, about -5.
  - Incerto / Due mani / Revert: about -15.
  - Butt check / Body touch: about -25.
  - Caduta: run scored low or zero.
  This mirrors the 2019/20 bands.
- "Trick completed before landing" means a measured under-rotation at touchdown should be both a score penalty and a physics yaw error.

### Gaps
- Current 2023+ official band values unverified (PDF blocked; spring-2022 snippet garbled).

## Q5. Landing tolerances in snowboard video games

### Takeaway
None of the games checked (SSX, Steep, Riders Republic, Shredders) publishes landing tolerance values. What is documented: bad landing leads to a wipeout and a broken combo (SSX). Steep and Riders Republic offer landing-assist modes and make the landing surface angle important. Shredders aims at realism and leaves the outcome partly to chance.

### Cited Findings
- SSX 3: landing tricks poorly, or hitting an object mid-air, causes a wipeout — [Wikipedia SSX 3](https://en.wikipedia.com/wiki/SSX3)
- SSX (2012): tumbling, hitting an obstacle or a bad landing loses the current trick string — [Wikipedia SSX 2012](https://en.wikipedia.com/wiki/SSX:_Deadly_Descents)
- Steep: the angle of the ground you land on is the most important factor, and flat ground makes a clean landing unlikely. A default-on option blocks tricks you are unlikely to land — [Twinfinite: Steep how to land](https://twinfinite.net/guides/steep-how-to-land/)
- Riders Republic has landing modes: Manual (perfect-landing chain bonus), Auto and "Steep" (assist after trick release) — [search summary; Twinfinite/Gamepur guides](https://gamepur.com/?p=246506)
- Shredders: landing prep is a held multi-input. The reviewer says outcomes sometimes feel left to chance, with the player floating sideways — [GameGrin review](https://www.gamegrin.com/reviews/shredders-review/). There is no "get up" after a bail, only rewind (Re-Shred) or reset — [PixelDie review](https://pixeldie.com/2022/03/30/shredders-review)
- Players of EA skate. complain that big-trick landings are unforgiving — [EA forums](https://forums.ea.com/discussions/skate-en/please-more-forgiving-ways-to-land-big-tricks/12727259)

### Inferences
- Common game practice is a forgiving yaw window plus a surface-angle check. Graded outcomes (perfect, OK, sketchy, bail) are better received than binary bails, and that fits the FIS deduction bands.

### Gaps
- No documented degree thresholds for any commercial game; GDC talks / dev blogs not found within budget.
