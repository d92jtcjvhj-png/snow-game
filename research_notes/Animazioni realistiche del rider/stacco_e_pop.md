# Takeoff body motion on a big air / slopestyle kicker: load, pre-wind, pop, rotation start

Research context and limits. The session's network blocked full-text fetches of every primary source (mdpi.com, pmc.ncbi.nlm.nih.gov, jyx.jyu.fi, snowboardaddiction.com, fis-ski.com all failed DNS). Every finding below comes from **search-result snippets** of the cited pages, so exact numbers were not checked against tables. To verify them, allow those hosts and re-read: Jiang et al. 2025 (MDPI Appl. Sci. 15(12):6618), the halfpipe IMU paper (PMC13618448), the Jyväskylä big-air thesis, and Thelen et al. 2024 (ISBS). Angle convention: "flexion X°" means X° away from straight (0° = straight leg). "Included angle" means the joint angle itself (180° = straight). Both are given where possible. Earlier project notes (`docs/research/01`, `02`, `08b`) already cover edges and entry lines. This file adds only the body/kinematic layer.

## Q1. Crouch / load on the kicker ramp (knee, hip, ankle flexion, depth, duration)

### Takeaway
No study gives snowboard big-air crouch angles per joint. The best measured numbers are from halfpipe (rear-knee flexion about 29–64° on the run-up, deeper on the heel edge) and from ski jumping and aerials (knee included angle about 120–150° near takeoff). Coaching consistently puts the lowest crouch at the start of the transition (bottom of the ramp), with extension up the face.

### Cited Findings
- Halfpipe in-field pilot study (1 athlete, 32 jumps, IMU + GNSS + insoles): back-leg knee flexion ranged from 29 ± 2° to 54 ± 6° on toe-edge run-ups and from 37 ± 4° to 64 ± 4° on heel-edge run-ups. COM speed was 5.0–13.0 m/s and peak rear-foot load was 1269 ± 123 N. — [Thelen et al., ISBS 2024, "In-field biomechanics of halfpipe snowboarding: a pilot study"](https://commons.nmu.edu/isbs/vol42/iss1/87/); [ResearchGate PDF](https://www.researchgate.net/publication/382452736_IN-FIELD_BIOMECHANICS_OF_HALFPIPE_SNOWBOARDING_A_PILOT_STUDY)
- Halfpipe IMU kinematics: knee flexion "gradually decreased during the first 70% of the take-off phase", and the rear knee changed more sharply than the front. In the last 30%, one knee (left/rear) flexed again while the other kept extending. — [Take-off and landing techniques in snowboard halfpipe based on IMUs (PMC13618448)](https://pmc.ncbi.nlm.nih.gov/articles/PMC13618448)
- Snowboard big air (Chinese national team, 11 athletes, backside 720/1080/1440/1800 onto an airbag from a dry slope, 3D motion capture): knee flexion at the end of takeoff rose significantly with trick difficulty. The snippets mention "+36.4%" for knee angle and "+99.4%" for hip sagittal angle at the end of takeoff, and a "total gain of 55.4%" in knee flexion. Another passage reports lower hip, knee and elbow flexion in a higher-difficulty comparison. **The snippets conflict and the phase each number belongs to is unclear.** — [Jiang et al. 2025, MDPI Applied Sciences 15(12):6618](https://www.mdpi.com/2076-3417/15/12/6618); [library record](https://matdisc.unitech.ac.pg/Record/doaj-art-25bc0faeada0432fb6681bbe172355a5/Description)
- Big-air thesis (Jyväskylä): average back-leg knee angles increased with jump difficulty. Front-leg changes were subject-dependent. — [JYX thesis 123456789/81576](https://jyx.jyu.fi/jyx/Record/jyx_123456789_81576)
- Freestyle-ski aerials (secondary citation of Ma et al. 2012): the optimal hip included angle at takeoff is 120.44–144.49° and the knee is 119.61–148.28°. — [Int. J. Morphol. 2025 (cites Ma 2012)](https://intjmorphol.com/wp-content/uploads/2025/08/Art_31_434_2025.pdf) (secondary source, unverified)
- Ski jumping proxy: knee included angle at takeoff is about 140–145° (one paper). From takeoff to early flight, the hip opens 86→109° and the knee 136→171°, and the trunk forward lean goes from 49° to 41°. — [Take-off analysis, Olympic HS-106 m](https://www.researchgate.net/publication/24260109_Take-off_analysis_of_the_Olympic_ski_jumping_competition_HS-106_m); [Konstanz ISBS "Three techniques of ski jump take-off"](https://ojs.ub.uni-konstanz.de/cpa/article/view/1647)
- Aerials takeoff simulation: a forward-leaning posture at the start of the kicker produced more angular velocity at takeoff. Passive ski torque and an extra ankle torque before takeoff largely govern takeoff conditions. — [Jones, Loughborough thesis 2012](https://dspace.lboro.ac.uk/2134/10784)
- Coaching timing: lowest crouch "just as you come to the transition leading up to the jump", then extend up the face to be fully extended at the lip. — [Snowboardingforum: proper jump procedure](https://www.snowboardingforum.com/threads/proper-jump-procedure.136777/) (anecdotal; already in `docs/research/01`)
- Off the board, the BS 360 drill is to set the toe edge and "absorb with your knees" before the throw. Edge angle comes from "pushing your hips and knees forward rather than leaning over your edge". — [Snowboard Addiction, BS 360 on park jumps](https://snowboardaddiction.com/blogs/training-education/how-to-backside-360-on-park-jumps) (snippet)

### Inferences
- A rider in a moderate athletic stance on the in-run probably has about 30–40° knee flexion, sinking to about 55–70° at the bottom of the transition (the deepest point, where centripetal load peaks). This is consistent with the halfpipe 29–64° range, with heel side deeper than toe side. **ESTIMATE**
- Hip flexion is probably about 40–60° at the deepest point, with the trunk pitched forward about 20–30° over the board. Ankle dorsiflexion is about 15–25°, limited by the boots: snowboard boots allow much less than barefoot. **ESTIMATE**, no snowboard ankle data found.
- The rear knee is more flexed than the front (rear-loaded stance before the tail pop). The halfpipe force split of about 65/35 rear/front at straight-jump takeoff supports a rear-biased load. — [Force characteristics at take-off and landing, halfpipe training runs](https://www.sponet.de/sponet/Record/4075893?lng=en)
- The "hold" is not a static pause. The crouch is reached at the transition and released progressively up the ramp face. On a big-air kicker at about 15 m/s with a face 6–10 m long, the face takes about 400–650 ms. **ESTIMATE** (geometry × speed)

### Gaps
- No measured snowboard ankle angles and no measured big-air crouch depth in degrees (the MDPI table values could not be read).
- No measured crouch hold duration.

## Q2. Pop timing: start of extension relative to the lip, duration, angular velocities; ollie vs flat pop

### Takeaway
Extension is a progressive drive up the ramp face that ends at the lip. The ski-jumping proxy gives a powered extension of about 300 ms, peak knee extension velocity of about 9 rad/s (about 530°/s) and the peak located right at the table edge. Jiang et al. measured peak hip and knee angular velocities in big air and found they increase with difficulty, but the values were not readable. On big kickers, a two-footed pop on a slight edge is the usual spin takeoff. An ollie (tail pop) is common on straight airs and FS heel-side tail pops.

### Cited Findings
- Ski jumping: takeoff velocity peaks about 0.3 s after the start of the takeoff, and rapid knee extension is the key action. — [Biomechanics review summary (PMC4780482)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4780482)
- Ski jumping: knee extension velocity averaged 9.2 ± 0.8 rad/s (≈ 527°/s, my conversion) and was not significantly related to distance. — [Wisconsin thesis: knee joint angle, SSC and jump distance](https://minds.wisc.edu/items/3d2d7166-88e9-4984-8e1a-6d77b3357798)
- Peak knee angular velocity occurs close to the edge of the takeoff table in all jumpers. — [Konstanz ISBS "Three techniques of ski jump take-off"](https://ojs.ub.uni-konstanz.de/cpa/article/view/1647)
- Knee angular velocity at release is one of 3 predictors of distance (82.3% of variance) on a medium hill. — [Japan J. Phys. Educ. 62(2)](https://www.jstage.jst.go.jp/article/jjpehss/62/2/62_16085/_article/-char/en)
- Big air (Jiang et al. 2025): reports maximal angular velocities of upper-trunk twist, hip flexion and knee flexion/extension per difficulty. Greater hip and knee range of motion and higher hip-flexion angular velocity are linked to better force transfer, higher takeoff and faster rotation. Values not visible in snippets. — [MDPI 15(12):6618](https://www.mdpi.com/2076-3417/15/12/6618)
- Halfpipe IMU: after leaving the wall, the knee flexion angle decreases faster than hip flexion (knee-driven takeoff). — [PMC13618448](https://pmc.ncbi.nlm.nih.gov/articles/PMC13618448)
- Halfpipe force plates between board and binding: at straight-jump takeoff the force split is about 65/35 rear/front, varying between individuals. — [Force characteristics at take-off and landing (sponet)](https://www.sponet.de/sponet/Record/4075893?lng=en)
- Coaching: the spin is generated "in the split second before takeoff" by the arm throw plus back-foot pop. — [SA, spins on large jumps](https://snowboardaddiction.com/blogs/training-education/10481297-how-to-spin-frontside-180s-360s-540s-720s-on-large-jumps) (snippet)
- Pop vs ollie is a style split: a two-foot pop is more stable, an ollie gives more control off the lip. An ollie removes the edge you spin against. FS heel-side spins "spring upwards off the tail". — [Forum pop vs ollie](https://www.snowboardingforum.com/threads/pop-vs-ollie-off-jumps.23688/); [Forum ollie on edge](https://www.snowboardingforum.com/threads/ollie-while-on-an-edge.279235/); see `docs/research/01`, `02`
- Misty / kicker tip: "approach slightly on your toe edge and ollie hard off the lip". — [Whitelines, 9 kicker tricks](https://whitelines.com/snowboarding-advice/trick-tips/kicker/9-relatively-simple-kicker-tricks-you-should-try.html/5) (snippet)

### Inferences
- Animation timing: extension starts about 250–350 ms before the lip and finishes at the lip. The fast "snap" part (knee 70°→20° flexion) takes the last about 150–200 ms. At 15 m/s, 200 ms is the last 3 m of the ramp. **ESTIMATE**, derived from the ski-jump 0.3 s window plus the speed of the snowboard approach.
- Peak knee extension velocity is about 400–600°/s and hip extension about 300–500°/s. **ESTIMATE** (ski-jump proxy; snowboard values exist in Jiang et al. but were unreadable).
- Legs never reach full extension on a snowboard pop. Leave about 10–20° of knee flexion at the lip (included angle about 160–170°). This matches the ski-jump 136→171° opening into early flight. **ESTIMATE**
- Ollie variant: in the last about 100 ms the front knee flexes (nose lifts) while the rear leg extends (tail flex), so the board pitches nose-up by about 5–10° at release. Flat pop: both legs extend together and the board stays parallel to the ramp. **ESTIMATE**

### Gaps
- No snowboard-specific extension duration in ms, and no published contact-time profile on a big-air kicker.
- Takeoff speed: no peer-reviewed snowboard big-air measurement found in snippets. One ski-service slide gives 55 km/h (≈ 15.3 m/s) takeoff at Milano-Cortina 2026 big air. — [LTS presentation (Vainio)](https://www.lts.fi/media/lts_tapahtumat/ktp26-tiedostot/juhani_vainio_jaettava_esitys_www_ktp26.pdf). Wolfsperger et al. (JSAMS 2021) note "considerable uncertainties" in modelling takeoff speed. — [cited via PMC7745909 / serval](https://serval.unil.ch/resource/serval:BIB_9092E5EAD56F.P001/REF)

## Q3. Pre-wind (counter-rotation) for FS and BS spins: amount, unwind timing, arms, head

### Takeaway
All coaching sources describe winding the shoulders and arms against the spin direction on the ramp, then releasing them explosively at the lip together with the pop, with the head leading toward the spin. No source gives a wind-up angle in degrees. Jiang et al. measured more upper-trunk twist and shoulder rotation with harder tricks, but the snippets give no values.

### Cited Findings
- "Pre-wind is when you rotate your shoulders slightly backside to generate more rotation, before you release in the opposite direction" (FS context). Release the wind-up of arms and shoulders as you leave the lip. "The faster you release your wind up, the quicker you will spin." — [SA, how to spin frontside from the toe edge](https://snowboardaddiction.com/blogs/training-education/how-to-spin-frontside-from-the-toe-edge); [SA BS 360 park jumps](https://snowboardaddiction.com/blogs/training-education/how-to-backside-360-on-park-jumps) (snippets)
- To over-rotate less, reduce the arm wind-up. To rotate more, pop harder off the back foot and wind up the shoulders more. — [SA BS 360](https://snowboardaddiction.com/blogs/news/how-to-backside-360-on-park-jumps) (snippet)
- The wind-up twists the upper body against the spin and loads the back foot. Head, shoulders and core throw together, "smooth and blended". For a 540, put extra energy into releasing shoulders, hips and knees at the lip. Arms should release horizontally around the body. A diagonal release goes "corked". During the pre-wind, keep the back arm just behind the back hip. — [SA FS 540](https://snowboardaddiction.com/blogs/jumping/how-to-frontside-540); [SA large-jump spins](https://snowboardaddiction.com/blogs/training-education/10481297-how-to-spin-frontside-180s-360s-540s-720s-on-large-jumps); [Ski and Board FS 180](https://issuu.com/thinkpublishing/docs/skiandboard_febmar_2023/s/20150376) (snippets)
- Whitelines (Kilner FS 360): "Keep the board in a straight line and pre-wind your shoulders ... then gently dig your toe edge into the kicker and pop hard into the spin, unleashing your arms." — [Whitelines FS 360 Kilner](https://whitelines.com/snowboarding-advice/trick-tips/kicker/snowboard-fs-360-ben-kilner.html) (from `docs/research/01`)
- BS: keep shoulders level and look over the shoulder (separation), held for "a split second" so you don't scrub the takeoff. — [Brainscape flashcards](https://brainscape.com/flashcards/start-11845115/packs/19795169) (low-quality source)
- Head: for FS spins, turn the head toward the spin with the eyes over or just in front of the lead shoulder until 360°. "Lead with your head and let the rest of your body follow". — [SA FS cork 540 / FS 540 snippets](https://snowboardaddiction.com/blogs/training-education/how-to-frontside-cork-540); [Skimag corkscrew 720](https://www.skimag.com/uncategorized/how-to-corkscrew-720/?scope=anon) (ski)
- Big air (Jiang et al. 2025): with rising difficulty, athletes show more upper-trunk twist and shoulder rotation at takeoff, tied to rotational momentum. — [MDPI 15(12):6618](https://www.mdpi.com/2076-3417/15/12/6618)
- Project note 01: a 180 needs little or no pre-wind. Bigger rotations get more pre-wind, a faster release and a stronger pop, not a harder carve. — `docs/research/01-lamine-e-approccio-spin.md`

### Inferences (all ESTIMATE)
- Wind-up amount: shoulders rotated against the spin relative to the board/hips by about 20–30° (180/360), 40–60° (540–720) and up to about 70–90° (1080+), with the lead arm across the chest and the rear arm behind the rear hip. Hips rotate counter about half as much as the shoulders. The rider winds up during the crouch on the ramp face, about 500–300 ms before the lip.
- Unwind: starts with the leg extension (about 200–250 ms before the lip). The fastest shoulder swing happens in the last about 100 ms and continues through the lip. The shoulders pass neutral around the lip and lead the hips by about 30–60° in the spin direction at about 100 ms after the lip. The head leads the shoulders by about 20–45°.
- Arms: the lead arm swings horizontally in the spin direction and the rear arm follows. The arms then pull in toward the body within about 200–300 ms after the lip to cut I (consistent with the spin model ω = L/I(pose) in `src/physics/spin.ts`).
- FS vs BS: FS winds the shoulders backside (lead arm pointed toward the toe side / back over the heel edge) and opens toward the chest. BS winds frontside (lead arm across the chest, back arm pointing downhill/toe side) and releases blind with the head looking over the lead shoulder.

### Gaps
- No measured counter-rotation angle or unwind timing for snowboard spins. Jiang et al. likely has trunk twist ranges and angular velocities (unreadable here).

## Q4. Edge at takeoff and body lean at the lip

### Takeaway
FS = heel edge with weight back toward the tail; BS = toe edge with the hips and knees driven forward and the torso upright. Lean is small: riders build edge angle by angulating knees and hips, not by tilting the whole body. Leaning back on a BS toe-edge takeoff unintentionally corks the spin.

### Cited Findings
- BS: build edge angle "by moving hips and knees forward rather than leaning over the edge", stay upright. Put "a bit of pressure on your toes ... don't lean back or you will go into a cork". — [SA BS 360](https://snowboardaddiction.com/blogs/training-education/how-to-backside-360-on-park-jumps); [Whitelines BS 360 tail](https://whitelines.com/snowboarding-advice/trick-tips/how-to-backside-360-tail.html) (snippets)
- FS: shift weight to the heels on the approach, "spring upwards off the tail, throwing the spin with your arms". — [SA FS 180](https://snowboardaddiction.com/blogs/training-education/how-to-frontside-180-on-park-jumps) (from note 01)
- Halfpipe: heel-edge run-ups show deeper rear-knee flexion (37–64°) than toe-edge run-ups (29–54°). — [Thelen et al. ISBS 2024](https://commons.nmu.edu/isbs/vol42/iss1/87/)
- Edge and approach geometry are already covered in `docs/research/01` and `08`, and the game uses `TAKEOFF_EDGE` in `src/core/config.ts`.

### Inferences (ESTIMATE)
- Edge angle at the lip is low: about 5–15°. Whole-body inclination toward the inside of the edge is about 5–10° at the lip. Most of the angulation is at the knees and ankles. Heel side sits deeper and a little back (COM behind the bindings centre by about 5–10 cm), toe side is taller and forward over the toes.

### Gaps
- No measured edge angle or body inclination at the lip.

## Q5. Off-axis takeoff (cork, rodeo, misty, underflip): shoulder drop and head

### Takeaway
The off-axis tilt comes from the upper-body direction at the throw. The lead shoulder or arm goes down and across instead of level, and the head drops to look toward the opposite hip or the rear foot. How much the rider drops controls how far off axis the trick goes. The misty and rodeo differ at takeoff mainly in pitch: frontflip-like for the misty, backflip-like for the rodeo and FS cork.

### Cited Findings
- Cork 720 (ski, but same mechanics): pop off the edge, reach forward with the lead arm and "drop your head looking toward your [opposite] hip". Spot the landing at about 540°. — [Skimag, How to corkscrew 720](https://www.skimag.com/uncategorized/how-to-corkscrew-720/?scope=anon)
- FS cork 540: "drop your lead shoulder into a back flipping motion as you initiate your frontside spin". Lean back at the lip, pop off the heel edge and tail, drive the back leg toward the lead shoulder. — [SA FS cork 540](https://snowboardaddiction.com/blogs/jumping/how-to-frontside-cork-540) (snippet; also note 02)
- BS cork 540: "pop up from your toe edge and follow the momentum of your initiating arm". Throw the lead arm and shoulder down toward the rear foot. "The more that downward motion goes into the initiation, the more off axis you will be." — [SA BS cork 540](https://snowboardaddiction.com/blogs/training-education/how-to-backside-cork-540) (note 02)
- A diagonal arm release turns a flat spin into a cork. — [SA large-jump spins](https://snowboardaddiction.com/blogs/training-education/10481297-how-to-spin-frontside-180s-360s-540s-720s-on-large-jumps)
- Misty: toe edge only. The rider spins frontside, then snaps the trailing shoulder toward the lead foot while the lead shoulder "releases towards the sky". The takeoff uses a more frontflip-type motion than a FS rodeo. — [FIS tricks list](https://www.fis-ski.com/DB/snowboard/park-and-pipe/tricks-list.html); [Snowboarding Profiles](https://snowboardingprofiles.com/snowboards-tricks-definitions) (snippets)
- BS rodeo takeoff "a bit like launching into a backflip", moving up before sideways. — [Whitelines Next Level](https://whitelines.com/snowboard-culture/scene/interviews/next_level.html); [Whitelines BS rodeo 540 melon](https://whitelines.com/snowboarding-advice/trick-tips/kicker/how-to-backside-rodeo-540-melon.html)
- Cab underflip: flip starts just after the lip as a "barrel roll"; pull the legs in to speed it up. — [Whitelines slo-mo cab underflip](https://whitelines.com/snowboarding-advice/trick-tips/kicker/slo-mo-trick-tips-cab-underflip.html) (note 02)

### Inferences (ESTIMATE)
- Cork: at the lip the lead shoulder is about 20–40° below the rear shoulder (roll of the shoulder line), the head is pitched down about 30–45° toward the opposite hip or rear foot, and the lead arm sweeps down and across. Legs extend as for a flat spin, but the back leg drives up toward the lead shoulder in the first about 150 ms.
- Rodeo/backflip-type (heel): trunk pitched back about 10–20° at the lip, chin up, shoulders open to the sky. Misty/frontflip-type (toe): trunk pitched forward about 20–30°, head tucks to the chest, trailing shoulder snaps to the lead foot.
- The off-axis drop starts with the unwind (about 100–150 ms before the lip). Most of the tilt is visible within about 100–200 ms after the lip.

### Gaps
- No measured shoulder-drop angle or head pitch for any off-axis trick.

## Q6. Time from the lip to the compact in-air pose

### Takeaway
No direct measurement exists. Ski jumping and halfpipe data show the legs keep moving (knees flexing back up) within the first few hundred ms after takeoff. Coaching says "spring up and pull your knees towards your body" as you leave. Animation estimate: about 150–300 ms to the tuck or grab.

### Cited Findings
- Halfpipe IMU: knee flexion decreases faster than hip after takeoff (knee-driven). In the last 30% of takeoff the rear knee already re-flexes. — [PMC13618448](https://pmc.ncbi.nlm.nih.gov/articles/PMC13618448)
- Ski jumping: hip and knee keep opening from takeoff into early flight (knee 136→171°). Early flight is a defined phase lasting a few tenths of a second. — [Olympic HS-106 m take-off analysis](https://www.researchgate.net/publication/24260109_Take-off_analysis_of_the_Olympic_ski_jumping_competition_HS-106_m); [Kinematic characteristics of the early flight phase](https://www.researchgate.net/publication/242339954_Kinematic_characteristics_of_the_early_flight_phase_in_ski-jumping)
- "As you leave the kicker, spring up and pull your knees towards your body." — [Whitelines kicker tricks](https://whitelines.com/snowboarding-advice/trick-tips/kicker/9-relatively-simple-kicker-tricks-you-should-try.html/5)
- Keep the knees tucked to aid stability and rotation speed (540). — [SA FS 540](https://snowboardaddiction.com/blogs/jumping/how-to-frontside-540)

### Inferences (ESTIMATE)
- 0–80 ms after the lip: legs at peak extension. 80–250 ms: knees and hips flex up (knee to about 90–110° flexion, hip about 90–100°). Hand to board by about 300–400 ms for a grab. On a 2–3 s big-air flight, the compact pose is reached in about 10% of the airtime.

### Gaps
- No video-timed or IMU-timed tuck onset found for snowboard big air.

## Q7. Synthesis: timed key-pose sequence for the animator (all timings ESTIMATE unless noted)

t = 0 at the lip (last board contact). Negative = before the lip. Big-air kicker, approach about 15 m/s (≈ 55 km/h, [LTS slide](https://www.lts.fi/media/lts_tapahtumat/ktp26-tiedostot/juhani_vainio_jaettava_esitys_www_ktp26.pdf)). Angles are flexion from straight. Ankle values are dorsiflexion. Shoulder twist is relative to the pelvis: negative = wound against the spin, positive = toward the spin.

### Common legs/trunk (straight air baseline)
| Key | t (ms) | Duration to next | Knee (rear/front) | Hip | Ankle | Trunk pitch fwd | Notes |
|---|---|---|---|---|---|---|---|
| K0 In-run stance | −1200 | 500 | 35 / 30 | 35 | 15 | 15° | Athletic, arms relaxed low-forward |
| K1 Load (lowest, bottom of transition) | −700 | 350 | 65 / 55 | 55 | 25 | 25° | Deepest point; halfpipe range 29–64° (measured, Thelen 2024) |
| K2 Drive start (mid-face) | −350 | 200 | 55 / 48 | 48 | 22 | 22° | Extension begins; ski-jump window ≈300 ms (measured proxy) |
| K3 Snap (last 3 m) | −150 | 150 | 30 / 28 | 25 | 12 | 12° | Peak knee ext. velocity ≈ 400–600°/s (ski-jump 527°/s, proxy) |
| K4 Lip / release | 0 | 80 | 15 / 15 | 12 | 5 | 8° | Not fully straight (ski-jump knee ≈140–171° included) |
| K5 Float/extend | +80 | 170 | 20 / 20 | 20 | 8 | 10° | Arms rising |
| K6 Compact | +250 | hold | 95 / 95 | 95 | 20 | 30° | Tuck/grab by +300–400 ms |

Ollie variant (straight air, FS heel pop): at −100→0 the front knee re-flexes to 35–40° while the rear stays at 15–20° (tail pop, nose up 5–10°).

### Frontside spin (heel edge, lead arm/shoulders wound backside)
| Key | t (ms) | Shoulder twist vs pelvis | Pelvis vs board | Head vs shoulders | Arms | Edge / lean |
|---|---|---|---|---|---|---|
| K1 Load + wind | −700→−350 | −20° (360) / −45° (540–720) / −75° (1080+) | −10 to −30° | 0 | Lead arm back over heel side, rear arm behind rear hip | Heel edge 5–15°, COM slightly back |
| K2 Unwind start | −250 | same | same | +10° toward spin | Arms start forward | Weight back on tail |
| K3 Throw | −100 | ≈ 0 | ≈ −5° | +25° | Lead arm sweeping horizontally | Pop off heels and tail |
| K4 Lip | 0 | +30 to +45° | +10° | +30 to 45° (eyes over lead shoulder) | Lead arm leading, rear arm following | Release |
| K5 | +150 | +60° | board follows | spotting | Arms pull in | — |

### Backside spin (toe edge, wound frontside)
As FS but mirrored. The wind turns the shoulders frontside, with the lead arm across the chest and the back arm pointing downhill. Torso stays upright and level: hips and knees forward, no lean back (sourced: SA, Whitelines). The head turns blind over the lead shoulder at K3–K4 (+30–45°). Same twist magnitudes.

### Off-axis modifiers (applied on top of the FS/BS rows from K3)
| Trick | Edge (sourced) | K3–K4 upper body | Head at K4 | Trunk pitch at K4 |
|---|---|---|---|---|
| FS cork | Heel | Lead shoulder drops 20–40° below rear (backflip-like) | Pitched down 30–45° toward the opposite hip | Lean back 5–15° |
| BS cork | Toe | Lead arm/shoulder thrown down toward the rear foot, 20–40° drop | Down toward the rear foot | Upright, slight forward |
| Rodeo (BS, backflip-type) | Heel (disputed, note 02) | Shoulders open up and back, then sideways | Chin up/back 20–30° | Back 10–20° |
| Misty (FS, frontflip-type) | Toe (sourced) | Trailing shoulder snaps to the lead foot, lead shoulder to the sky | Tucked down 40–60° | Forward 20–30° |
| Underflip | Toe (forum) | Barrel-roll throw just after the lip | Down/sideways | Forward-sideways |

The drop starts with the unwind at about −150 to −100 ms. Most of the tilt is visible by +100 to +200 ms.

### Cited Findings
- The numeric anchors in the tables come from the sources in Q1–Q6: halfpipe knee 29–64° (Thelen 2024), the ski-jump takeoff window of about 0.3 s, knee extension velocity of 9.2 rad/s and peak at the table edge, the ski-jump knee 136–171° into early flight, a takeoff speed of 55 km/h, and the coaching cues for edge, wind and drop. — see sources above.

### Inferences
- Everything else in the tables (twist degrees, head angles, ms offsets, compact timing) is **ESTIMATE**, built to be consistent with the sourced anchors and the game's physics model (L fixed at the pop, ω = L/I). The tuck at +250 ms should coincide with the drop in I that raises ω in `src/physics/spin.ts`.

### Gaps
- To replace the estimates with measured values, read Jiang et al. 2025 (tables of hip/knee/elbow angles, trunk twist and peak angular velocities for BS 720–1800) and the Jyväskylä thesis (big-air takeoff joint angles). Both were unreachable from this session because of network restrictions.
