# Rider body motion on big air / slopestyle landings and falls: key poses and timings for animation

> Scope: what is NEW for animation (poses, joint angles, durations). The outcome thresholds (yaw/pitch bands, EFH, FIS deductions, 57% tail-first, about 4 BW) are already in `docs/research/13-atterraggio-realistico.md`, `13a-note-biomeccanica-atterraggio.md` and `13b-note-catalogo-esiti.md`. They are only referenced here.
>
> Method caveat: in this session WebFetch could not reach any host (pmc.ncbi.nlm.nih.gov, bjsm.bmj.com and whitelines.com all failed DNS: they are not in the session's allowed network). Every finding below comes from **search-result snippets/summaries**, not full texts. Treat the numbers as "reported in the abstract/snippet" and check them against the originals before they go into `docs/research/`.
>
> Labels: **[ESTIMATE]** = my number, not from a source. **[DERIVED]** = computed from cited numbers with simple physics. Joint angles use the clinical convention: 0° = straight knee/hip, larger = more flexed. Ankle angles are dorsiflexion from neutral.

## Q1. Clean landing absorption: joint sequence, peak flexion, time to peak, recovery, trunk and arms

### Takeaway
No snowboard study with full joint-angle time series was retrievable. Drop-landing and ski-jumping/aerials data give a usable template:
- A short pre-landing preparation, with the legs extending slightly and the knees starting to move about 0.16 s before contact.
- Contact absorption lasting about 0.15–0.25 s to peak knee flexion, which sits around 90° for a soft landing and around 40–55° of range for a stiff one.
- A return to riding stance over a few hundred ms.

Elite snowboarders use **more** knee flexion on switch and 360 landings than on regular straight airs.

### Cited Findings
**Timing**
- Ski jumping review: landing preparation starts about **0.4–0.5 s before impact**, when the main ankle and hip movements happen. The athlete starts moving the **knees about 0.16 s before impact**. Trunk, hip and knee flexion angles are **steady from 0.10 s before impact** — [Frontiers in Physiology 2022, ski-jump landing](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2022.994818/full) (search summary)
- Freestyle aerials (simulation study with camera-measured landings): the mean **landing balancing phase was 0.16 ± 0.04 s**. Knee and ankle angles at the start and end of this phase were measured, but the values were not in the snippet — [MDPI Applied Sciences 2019, 9(18):3713](https://www.mdpi.com/2076-3417/9/18/3713) (snippet)
- Drop/jump landing table (Journal of Athletic Training): **time to peak knee flexion about 0.23 ± 0.07 s**, with **peak knee flexion about 91.5° ± 16.4°**. The table snippet was garbled, so the exact task and group are uncertain — [JAT 52(11), UKY copy](https://chs.uky.edu/sites/default/files/2023-12/1062-6050-52.11.25.pdf) (snippet)
- The high-frequency impact peak of vertical GRF is conventionally analysed in the **first 50 ms** after contact — [BMC Musculoskelet Disord 13:235 and related, search summary](https://bmcmusculoskeletdisord.biomedcentral.com/articles/10.1186/1471-2474-13-235/tables/1) (snippet; running context, used here only for the impact-window convention)

**Angles**
- "Soft landing" (DeVita & Skelly) = **knee flexion greater than 90°** after a 59 cm drop. It gives lower vGRF, impulse, and hip and knee extensor moments than a stiff landing — [review citing DeVita & Skelly, PMC5243232](https://pmc.ncbi.nlm.nih.gov/articles/PMC5243232) (snippet)
- Soft landings use larger hip **and** knee flexion together. Less-flexed knee and hip joints give higher external knee abduction/flexion moments — [same search set, PMC5243232 / PMC12269904](https://pmc.ncbi.nlm.nih.gov/articles/PMC12269904) (snippet)
- Hip flexion at landing impact was 50.1° (ACL-rupture group) vs 25.8° (controls). This is a general-population landing study, not snowboarding — [Frontiers 2022 search set](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2022.994818/full) (snippet; attribution uncertain)
- Single-leg 0.3 m landings: females reached peak hip and knee flexion sooner than males (48% and 78% of the male time). This shows time-to-peak varies a lot between people — [search set, PMC5763249](https://pmc.ncbi.nlm.nih.gov/articles/PMC5763249) (snippet)
- Limited ankle dorsiflexion raises peak vGRF because it inhibits knee flexion during shock absorption. So the ankle is the first link in the chain. Snowboard boots limit it, but a highback/forward lean still allows some — [St Mary's, Howe ankle dorsiflexion](https://research.stmarys.ac.uk/2975/3/Howe-Ankle-Dorsiflexion.pdf) (snippet)

**Snowboard-specific**
- Elite freestyle snowboarders (Noonan 2018, LJMU MPhil): **switch and 360 landings used more overall knee flexion**, with higher peak quadriceps activity. **Regular straight-air landings used less knee flexion** and had the largest peak board accelerations. The analysis windows were **200 ms pre-contact** (EMG) and the **first 100 ms post-contact** — [LJMU eprint 9585](https://researchonline.ljmu.ac.uk/id/eprint/9585/); [slides](https://www.slideshare.net/slideshow/the-biomechanical-demands-of-elite-freestyle-snowboard-athletes-mphil-presentation/129210321) (snippets)
- McAlpine 2012: "during landing the snowboarder is forced into flexion at the ankle and knee". Single-limb analyses cannot describe snowboard landings, because the front and rear legs load differently — [ISBS 2012](https://ojs.ub.uni-konstanz.de/cpa/article/view/5172/4748) (snippet)
- Tail-first contact (57%) is associated with lower impact loads [prev. note 13a] — [SPONET record](https://sponet.de/sponet/Record/3042548?lng=en)

**Coaching cues for upper body and eyes**
- Lock the eyes on the landing spot. Opening the head to keep looking around makes the rider over-rotate — [Snowboard Addiction / Ridestore rotation guides, search summary](https://www.ridestore.com/mag/how-to-rotate-on-a-snowboard/) (snippet)
- Legs extend slightly before contact and flex on impact [prev. note 13b] — [abom.com](https://abom.com/how-to-jump-on-a-snowboard/)

### Inferences
**[DERIVED] Time to peak compression vs EFH** (from the 13a stroke model, a = v_n²/2d):
- EFH 1.5 m, about 0.4 m hip drop: about **150 ms**.
- EFH 0.5 m: about **260 ms**.

These bracket the drop-landing value of about 230 ms and the aerials balancing phase of about 160 ms. So a big landing compresses *faster*, not slower, and deeper.

**[ESTIMATE] Clean landing key-pose timeline (big air, regular stance, t = 0 at first board contact)**

| Key | t (ms) | Board | Ankles (dorsiflex.) | Knees | Hips | Trunk | Arms / head |
|---|---|---|---|---|---|---|---|
| K0 Spot | −500…−300 | trick done, 0–10° nose-up vs slope | ~10° | 40–60° (grab released) | 40–60° | upright, facing travel or slightly closed | head turned to the landing, eyes on the landing spot; grab hand releases |
| K1 Reach | −160…−50 | still nose-up | 10–15° | open to **20–30°** (legs reach for the snow) | 20–30° | about 10–20° forward lean | arms forward-out, low, about 30–45° from torso, elbows soft ~30° |
| K2 Tail touch | 0 | tail contacts (57% case) | ~15° | 25–30° | 25–30° | as K1 | as K1 |
| K3 Slap-down | 30–80 | nose comes down flat (pitch rotates down) | 20–25° (ankles first) | 45–60° | 35–45° | lean grows to 25–35° | arms drop slightly, hands ahead of knees |
| K4 Peak compression | 150 (big) – 250 (small) | flat, loaded | ~25° (boot limit) | **80–100°** soft / **50–60°** stiff | **60–80°** | 35–45° forward, chest over the front knee, back flat | hands at knee height, forward and to the sides; head level, eyes on the run-out |
| K5 Rebound | 250–450 | flat, riding out | 15–20° | 60° → 40° | 50° → 35° | 25° | arms rise back to mid-height |
| K6 Ride-away stance | 500–800 | on chosen edge | ~15° | ~30–40° | ~30° | ~15–20° | arms relaxed, slightly out |

Rules for the timeline:
- Joint order on compression: ankle → knee → hip. Ankle first by about 10–30 ms, then knee, then hip slightly lagging.
- Stiff landings (straight airs per Noonan) peak at about 50–60° knees, with a shorter phase of about 120–150 ms.
- Switch and 360 landings: deeper, about 90–100°.
- Asymmetry: the rear leg flexes first and more on tail-first contact. The front leg catches up during slap-down (K3).
- Recovery time to stance is about 0.5–0.8 s total. Unsourced; it fits the drop-landing time to peak plus the extension rebound.

**[ESTIMATE] Scaling:** peak knee ≈ 50° + 30°·clamp((EFH − 0.3)/1.2, 0, 1) + 10° for switch/spin. Time to peak ≈ 2d/v_n with d = 0.3–0.45 m.

### Gaps
- No retrieved snowboard joint-angle time series: Noonan's knee-angle values and McAlpine's kinematics are behind full text.
- The 0.23 s / 91.5° drop-landing values have uncertain attribution (garbled table).
- No source gives arm angles during landing. The arm poses above are coaching convention plus estimate.
- Trunk forward-lean angles at peak are unsourced.

## Q2. Measured landing kinetics relevant to animation (forces, stiffness)

### Takeaway
Already covered in 13a: about 4.1 BW per foot (McAlpine), 2.0 × body mass in ski slopestyle insoles, 1.1–5.3 BW in ski jumping, and stiff vs soft drop landings at 2.6 vs 1.6 BW. New here: the force peak happens inside the **first 50–100 ms**. That is where Noonan and the GRF literature look. Visually it is the "slap" frame (K3), not the deepest crouch (K4).

### Cited Findings
- Impact-peak window: first 50 ms after contact — [BMC Musculoskelet Disord 13:235 (definitions)](https://bmcmusculoskeletdisord.biomedcentral.com/articles/10.1186/1471-2474-13-235/tables/1) (snippet)
- Snowboard post-contact analysis window: first 100 ms. A higher peak board acceleration goes with knee flexion and knee angular velocity at initial contact — [Noonan 2018](https://ljmu-9.eprints-hosting.org/id/eprint/9585/1/2018NoonanMPhil.pdf) (snippet)
- Pilot snowboard field GRF: 4.79 ± 0.66 and 3.74 ± 0.30 BW [prev. note 13a] — [ISBS pilot](https://ojs.ub.uni-konstanz.de/cpa/article/view/232/191)

### Inferences
- **[ESTIMATE] Animation cue:**
  - Put the camera shake and snow spray at K2–K3 (0–80 ms).
  - Put the deepest crouch at K4 (150–250 ms).
  - A stiff landing should show a *smaller, faster* crouch with a bigger shake. That is the visual opposite of what intuition suggests.

### Gaps
- Force-time curves (time to peak in ms) for snowboard landings were not retrievable.

## Q3. Sketchy landings: hand drag, two hands down, butt check, washout

### Takeaway
No source gives durations or joint angles for hand drags or butt checks. What is sourced:
- Field falls go mostly backward (51% posterior, toward the tail).
- The **uphill hand** is the first body contact.
- For experienced park/pipe riders, about half of falls land on the back or bottom.
- Coaching says to let a butt check happen rather than fight it.

The animation sequences below are therefore **[ESTIMATE]**s built on those anchors.

### Cited Findings
- 704 table-top jumps, 21% falls, **51% posterior/toward the tail**. The text says "it is not surprising that the first body contact point was the up hil[l] hand". The term looks like a typo for *uphill* — [McAlpine, Kurpiers & Kersting, SPONET](https://sponet.de/sponet/Record/3042548?lng=en); [BISp](https://www.bisp-surf.de/Record/PU201111009632) (snippets)
- Experienced riders in halfpipe/terrain park: **50% of falls were onto the back or bottom** — [Cooper & Greenwald, ASTM STP 2006](https://store.astm.org/stp39642s.html) (search summary)
- Butt check = "momentarily sits on the snow and bounces back up" (FIS, major deduction). Hand drag is a small deduction and two hands down a medium one [prev. note 13b] — [WSF glossary](https://www.worldsnowboardfederation.org/glossary/)
- Whitelines: fighting a shaky landing can produce a harder edge catch later, so it is sometimes better to let the butt check happen [prev. note 13b] — [Whitelines slams guide](https://whitelines.com/archive/features/ultimate-guide-snowboard-slams.html) (snippet; not re-fetched, host blocked)
- Washout: the edge slides out instead of biting. Causes are changing edge angle during touchdown or too much back-foot pressure [prev. note 13b] — [The Manual](https://themanual.com/outdoors/snowboard-profiles-explained)
- Heel-side landing over-rotation: "landing on the heel edge of your board can cause you to keep rotating after you've landed and result in you losing your balance". Keep pressure on the toes — [Snowboard Addiction, how to backside 180](https://snowboardaddiction.com/blogs/training-education/how-to-backside-180) (snippet)
- In posterior lab falls from standing, the hands contacted the ground in **every** fall. In over 70% of falls with pelvis contact, **hand and pelvis impact were less than 50 ms apart** — [Hsiao & Robinovitch 1998, J Biomech, via review PMC2562433](https://pmc.ncbi.nlm.nih.gov/articles/PMC2562433) (secondary snippet)

### Inferences
**[INFERENCE] Which hand drags.** On a slope the uphill hand is closest to the snow when the rider leans back into the hill:
- Heel-side lean: the rear/uphill hand behind the hips.
- Toe-side lean: the front hand or both hands in front.

Since most sketchy landings go toward the tail/heel, the default is the **trailing (rear) hand dragging behind and to the heel side**. This is consistent with McAlpine's "uphill hand first".

**[ESTIMATE] Hand drag (one hand, rideable)**, t = 0 at board contact:
- 0–150 ms: normal K2–K4 compression, but the CoM sits about 10–20 cm behind the board centre or uphill. Trunk leans 20–35° toward the heel side or back.
- 120–200 ms: the uphill/rear arm extends down and back with the elbow nearly straight (0–20°). Fingertips or palm skim the snow behind the rear binding. The knees stay deep (90–110°) to lower the hip toward the snow.
- Contact lasts **150–400 ms**. Longer = "extended hand drag", a medium deduction.
- 300–600 ms: push off with the hand, the trunk rights itself, then back to K5/K6 by about 0.8–1.0 s.

**[ESTIMATE] Two hands down (rideable)**:
- Same as the hand drag, but both hands go behind the hips on the heel side, or both in front of the toes. The hips drop to about 30–40 cm above the snow, with knees at 110–120°.
- Hand contact lasts 200–500 ms. A visible push-up straightens the arms from 60–90° elbow flexion to straight.
- Back to stance at about 1.0–1.3 s.

**[ESTIMATE] Butt check (bounce, rideable)**:
1. 0–150 ms: tail-first, CoM behind the tail. The knees collapse to more than 120° and the hips go fully flexed, about 100–120°.
2. 150–250 ms: the buttocks touch the snow behind the rear binding. One or both hands touch within about 50 ms of the pelvis, by analogy with Hsiao & Robinovitch. Trunk is upright to slightly back, chin tucked.
3. Sitting contact lasts **100–300 ms** ("momentarily"). The board keeps sliding, base flat or on the heel edge.
4. 300–700 ms: the rider bounces or rolls the weight forward over the feet. Arms swing forward and up, the trunk folds forward to about 40°, and the legs extend.
5. Riding stance by about 1.0–1.5 s.

**[ESTIMATE] Washout (slide-out, usually a fall to the uphill hip/bum)**:
- 0–100 ms: the board lands on an edge, then the edge lets go. The board slides sideways downhill out from under the rider.
- 100–350 ms: the feet go downhill and the body drops onto the uphill side. Lands on the hip/glute (heel washout) or the knees/forearms (toe washout).
- Rotation is slow compared with an edge catch, because the body falls more or less straight down (about 1 m of hip height). Free-fall time about √(2·0.8/9.81) ≈ 0.4 s [DERIVED].
- Then the rider slides with the board for 0.5–2 s, depending on speed.

### Gaps
- No measured duration of hand drags, butt checks or washouts. A frame-by-frame video analysis of competition footage would be needed. Search returned none.
- The McAlpine first-contact table, with the hand-vs-pelvis breakdown, was not retrieved.

## Q4. Falls: toe-edge catch, heel-edge catch, nose dive, sideways/hip, inverted; protective postures; duration; injury evidence

### Takeaway
Snowboard falls in the park are dominated by **backward-pitching falls** (77% of World Cup snowboard head-impact cases), with the **back of the head** hit in 69%. The first head impact is usually the worst.

The arm motion is a reflex **FOOSH**:
- In backward falls the elbow is **more extended** than in forward falls.
- The forearm meets the snow at about **75°**, at about **3 m/s**, with 3–5 kg of effective mass per wrist.
- Backward falls give higher wrist forces and about twice the wrist-injury likelihood of forward falls.

From standing, a fall takes about **700 ms** to touchdown. An edge catch at speed is much faster ([DERIVED] about 0.2–0.4 s), so protective arm moves are often late and the head whips into the snow at 6.8–10 m/s normal to the slope.

### Cited Findings
**Direction and head**
- FIS World Cup video analysis of 57 head-impact cases, 2006–2016. Snowboarders had **backward-pitching falls in 77%** (freestyle skiers 53%), mainly with **impacts to the rear of the helmet (snowboard 69%)**. The **first head impact was the most severe in 71%** of cases — [Steenstrup et al., BJSM 2018; OSTRC project page](https://klokavskade.no/en/projects/head-injury-mechanisms-in-fis-world-cup-alpine-freestyle-skiers-and-snowboarders) (search summary)
- Four reconstructed cases, snowboard/freestyle: all occipital impacts. Normal-to-slope pre-impact velocity was **above 6.8 m/s** in all four (above the strictest helmet test) — [Steenstrup et al., "Head impact velocities in FIS World Cup snowboarders and freestyle skiers"](https://klokavskade.no/en/projects/head-impact-velocities-in-fis-world-cup-snowboarders-and-freestyle-skiers-do-real-life-impacts-exceed-helmet-testing-standards); [Lingnan scholars record](https://scholars.ln.edu.hk/en/publications/head-impact-velocities-in-fis-world-cup-snowboarders-and-freestyl/) (search summary)
- Instrumented Hybrid-III dummy on a snowboard at about 30.5 km/h, tripped into a backward fall. Head velocity **normal to the slope peaked at 37.1 km/h and was 29.1 km/h (≈ 8.1 m/s) at snow contact**. Resultant head velocity peaked at 54.3 km/h and was 38.2 km/h at contact — [Richards, Carhart, Scher, ASTM STP](https://store.astm.org/stp47472s.html) (search summary). A secondary summary gives 9.08 m/s normal and 10.61 m/s resultant — [UBC FIB wiki, skull fractures](https://wiki.ubc.ca/Documentation:FIB_book/Prevention_of_Skull_Fractures_in_Snowboarding) (secondary)
- Numerical reconstruction: mean normal head impact speed **28 ± 6 km/h** in snowboard backward falls — [Bailly et al. 2017, Scand J Med Sci Sports, PubMed 27185578](https://pubmed.ncbi.nlm.nih.gov/27185578/) (search summary)
- "Opposite-edge phenomenon": the backside/toe edge catches and throws the rider backward onto the occiput. One secondary source attributes 68% of snowboard head injuries to backward falls (not verified) — [UBC FIB wiki](https://wiki.ubc.ca/Documentation:FIB_book/Prevention_of_Skull_Fractures_in_Snowboarding) (secondary)

**Arms and wrist (FOOSH)**
- Lab study, 18 volunteers, 741 self-initiated falls, 6 scenarios. **Elbow more extended at impact in backward than in forward falls**. Wrist angle at impact was similar in both. The proposed wrist-guard test is **3–5 kg effective mass per wrist, forearm at 75° to the ground, 3 m/s impact** — [Schmitt et al., Sports Biomech 2012;11:57–72, SPONET](https://www.sponet.de/sponet/Record/4024622?lng=en) (abstract)
- On-slope study, 128 falls by 20 snowboarders: **backward falls gave significantly higher max wrist force than forward falls** (p = 0.038) — [J Sports Eng Tech, SAGE 10.1177/1754337113482706](https://journals.sagepub.com/doi/full/10.1177/1754337113482706) (search summary)
- Reflex outstretched arms in both forward and backward falls. Wrist injuries are about twice as likely in backward falls. A hand landing **behind the back** gives more complex/comminuted fractures. The mechanism is compressive load on a **hyperextended wrist** (distal radius, then scaphoid). Lunate/perilunate injuries occur in experts after backward falls from aerials — [UBC FIB wiki, wrist injuries](https://wiki.ubc.ca/Documentation:FIB_book/Wrist_Injuries_and_Injury_Prevention_Methods_in_Snowboarding_Falls); [UBC FIB wiki, arm kinetics](https://wiki.ubc.ca/Documentation:FIB_book/Kinetics_of_Arm_Injuries_in_Snowboarding_Falls); [Thieme review 10.1055/s-0041-1731702](https://thieme-connect.de/products/ejournals/html/10.1055/s-0041-1731702) (secondary / snippets)
- Wrist is 20–40% of snowboard injuries, typically from a fall onto an outstretched hand — [Mass General Brigham, snowboarding safety](https://www.massgeneralbrigham.org/en/health-wellness/snowboarding-safety) (snippet)

**Fall timing (non-snowboard lab data)**
- Young adults on a translated mattress: about **700 ms** from perturbation to touchdown. Reviews estimate **715–1200 ms** from loss of balance to impact. Hands contacted in every fall, and hand-to-pelvis was under 50 ms in over 70% of posterior falls. **Lateral perturbations caused marked trunk rotation**, so the rider avoids a direct hip impact — [Hsiao & Robinovitch 1998, "Common protective movements govern unexpected falls from standing height", via reviews](https://pmc.ncbi.nlm.nih.gov/articles/PMC2562433) (secondary)
- A squat during a backward fall reduced impact velocity by up to 18%, depending on when it starts — [Robinovitch et al. 2004, via review](https://pmc.ncbi.nlm.nih.gov/articles/PMC2562433) (secondary)
- Real-life video, long-term care: 32% of sideways falls rotated to land backward, which cut hip-impact odds 10× — [Yang et al.](https://researchgate.net/profile/Yijian-Yang-2/publication/280867105_Risk_factors_for_hip_impact_during_real-life_falls_captured_on_video_in_long-term_care/links/55ce394708aee19936fc36dc/Risk-factors-for-hip-impact-during-real-life-falls-captured-on-video-in-long-term-care.pdf) (older adults; posture analogy only)

**Coaching protective postures**
- Forward falls: land on the knees first, then the **forearms**, with fists. Avoid flat palms. Backward falls: bend the knees, **sit onto the buttocks**, **tuck the chin**. The back of the head can still hit at the end of a sit-down fall. Relax instead of going stiff — [Science Insights, edge catch](https://scienceinsights.org/what-is-catching-an-edge-in-snowboarding/) [prev. note]; [Ripp impact gear, how to fall](https://au.ripplimpactgear.com/blogs/news/how-to-fall-properly-on-a-snowboard); [snowboardingdays](https://www.snowboardingdays.com/?p=5356) (snippets)
- The rear fall is the most painful because athletes tense and land flat. Most rear-fall injuries are to the head — [Special Olympics Wisconsin, Snowboarding Falling](https://www.specialolympicswisconsin.org/wp-content/uploads/2015/08/Snowboarding-Falling.pdf) (snippet)
- Burton's fall-prevention conditioning names "tuck, roll and recover" (bear crawls, controlled backward rolls) — [Burton blog](https://www.burton.com/blogs/the-burton-blog/get-fit-snowboard-injury-prevention) (snippet)

### Inferences
**[DERIVED] Edge-catch fall duration.** When the edge bites, the feet stop and the CoM (about 0.9–1.0 m above the board) pivots over the edge at roughly ω ≈ v_perp / h. Rotating 90° to the snow takes t ≈ (π/2)/ω:
- v_perp = 5 m/s gives about 0.3 s.
- v_perp = 10 m/s gives about 0.15 s, plus gravity.

So the edge catch to first body impact takes about **0.15–0.35 s**, versus about 0.7 s for a fall from standing. This matches the dummy's 8 m/s normal head speed and explains why riders get "slammed". It also explains why arm protection is often incomplete. The 150–200 ms reaction time is my ESTIMATE, not retrieved.

**[ESTIMATE] Fall key-pose sequences** (t = 0 at the event that triggers the fall)

**Heel-edge catch / backward slam** (most common: 51–77%):
1. 0–50 ms: the heel edge bites and the board decelerates. Knees snap from about 40° to about 20–30° as the body pivots over the heels. Ankles go to plantar-flex limits (highback stop).
2. 50–200 ms: the trunk rotates backward 60–90°. Arms fling back and down, elbows near straight (Schmitt). Hands reach behind the hips. Chin tuck if the rider has time.
3. 150–300 ms: hands and buttocks hit almost together (within about 50 ms), with forearm about 75° to the snow and wrist hyperextended.
4. 200–400 ms: the upper back hits, then the head whips into the occiput (the head is the last link, fastest). In the worst case the first head impact is the hardest one.
5. 400–1500 ms: slide on the back, board downhill or flipped up. One or two small rebounds (about 10–20 cm), then stop. Animate the bounce with a decreasing amplitude.

**Toe-edge catch / forward slam**:
1. 0–50 ms: the toe edge bites. The body pitches downhill over the toes, knees driven into the snow.
2. 50–200 ms: the trunk goes forward and down 60–90°. Arms come forward, elbows more flexed than in a backward fall (Schmitt), hands or fists ahead of the head.
3. 150–300 ms: knees hit first (they are closest), then forearms/hands. The face or chest hits last if the arms collapse.
4. Possible roll or somersault at high speed. Slide face-down, 0.5–2 s.

**Nose dive (over the nose)**:
- Nose-first touchdown (11% of landings, OR about 4 for falls). The nose digs and the board stops or decelerates hard.
- The body pitches forward over the front binding at about 0.15–0.3 s, like a toe catch but straight along the board axis.
- Front-knee flexion spikes to 110°+. The front hand or both hands go forward.
- At high speed there is a full forward roll (head tucked) over 0.5–1 s, then a sideways or seated slide.

**Sideways / hip fall (washout or edge chatter)**:
- The board slides out and the body drops vertically onto the uphill hip and the forearm on that side, in about 0.3–0.5 s.
- Trunk rotation of 20–45° turns a pure side impact into a back/buttock impact. This is a natural protective move per Hsiao & Robinovitch / Yang.

**Inverted landing (under-rotated flip / backflip):**
- Under-rotated backflip: tail lands at 20°+ nose-up and the body keeps rotating backward → back/neck/occiput slam (see the 13a pitch bands). Duration about 0.2–0.3 s from tail touch to back impact.
- Truly inverted contact (head or shoulders first) is rare but catastrophic. Animate a shoulder-first impact with the head tucked to the side, then a ragdoll tumble.

**Protective-move blending rule [ESTIMATE].** Start the protective motions (arm reach, chin tuck, knee bend) about 150 ms after the trigger. At fast edge catches (impact < 250 ms) they are only half-completed. At slow washouts they complete, giving "graceful" sit-downs.

### Gaps
- No snowboard-specific frame-by-frame fall kinematics with joint angles over time. Steenstrup's video papers give direction and impact site, not angle traces.
- No measured "edge catch to impact" duration. The 0.15–0.35 s figure is DERIVED.
- Reaction time for the arm protective response in snowboarding was not found.
- The Whitelines slams guide could not be fetched in this session, so nothing new was taken from it.

## Q5. Over- and under-rotation at landing: body reaction

### Takeaway
Coaching is consistent:
- Over-rotation is stopped by the eyes and shoulders: lock the eyes on the landing spot and stop the shoulders at about 90° to the board.
- Pressure on the leading edge for the direction of spin (toe edge on a backside 180) blocks residual rotation.
- Landing on the heel edge lets the spin continue → spin-out or revert, then possibly a fall.

Riding away switch (a "blind" landing) is the accepted way to absorb a little extra rotation.

### Cited Findings
- Landing on the heel edge "can cause you to keep rotating after you've landed and result in you losing your balance". Keep pressure on the toes. In the training progression, ensure the toe edge engages first — [Snowboard Addiction, how to backside 180](https://snowboardaddiction.com/blogs/training-education/how-to-backside-180) (snippet)
- Rotating the shoulders beyond 90° makes it "really easy to revert after a backside 180 and keep spinning as you land" — [Ridestore / SA search summary](https://www.ridestore.com/mag/how-to-do-your-first-backside-180-on-a-snowboard/) (snippet)
- Locking the eye line on the landing spot "blocks the rotation". Opening the head keeps the rotation going — [Ridestore, how to rotate](https://www.ridestore.com/mag/how-to-rotate-on-a-snowboard/) (snippet)
- Too much speed → over-rotation. Too little → under-rotation — [same source](https://www.ridestore.com/mag/how-to-rotate-on-a-snowboard/) (snippet)
- Counter-rotation should come from the upper-body wind-up, not forced shoulder movement. Riding away switch on blind landings avoids over-rotating — [Snowboard Addiction, rotation vs counter-rotation](https://snowboardaddiction.com/blogs/training-education/rotation-vs-counter-rotation); [SA, counter-rotate a 360](https://snowboardaddiction.com/blogs/training-education/how-to-counter-rotate-a-360-on-a-snowboard) (snippets)
- Landing on an edge while still rotating throws the spin off-axis and often ends on the back [prev. note 13b] — [snowboardingforum](https://www.snowboardingforum.com/threads/landing-a-jump.35099/)

### Inferences
**[ESTIMATE] Over-rotation (residual spin in the trick direction):**
1. 0–100 ms: the board touches with 20–60° of extra yaw. The head is already locked on the landing.
2. Shoulders and arms counter-rotate. The arms sweep 30–60° *against* the spin while the hips keep turning. That gives a visible torso–hip twist of 30–45° for about 150–300 ms.
3. If the edge grips (toe-side for a backside spin): the board stops and the upper body unwinds back over 200–400 ms → stomp.
4. If the heel/trailing edge is engaged: the board pivots on the base (revert or slide-out, about 0.3–0.6 s, an extra 90–180°). Arms flail outward and the trunk leans back.
5. Failing that: heel-edge catch → backward slam (Q4).

**[ESTIMATE] Under-rotation (board short of the travel direction):**
1. The rider lands with the shoulders ahead of the board, "pre-wound" in the spin direction.
2. 0–200 ms: the board skids sideways and the hips are forced to finish the rotation. The upper body leads, then waits.
3. Hands reach toward the downhill or uphill side, depending on which edge carries the load. The trailing hand drags if the lean is toward the uphill.
4. More than about 45° short with an edge biting: edge catch. If the leading edge is downhill, it is a slam (Q4).

**[ESTIMATE] Spin-out.** On a flat-base landing with high residual ω, the board keeps rotating on the snow at a decaying rate (13a derived friction stop: 360°/s stops in 25–40 ms on an edge, much longer on a flat base). The body follows passively with the arms out wide. It ends switch or seated (washout).

### Gaps
- No source quantifies counter-rotation angles or durations during landings. All the numbers above are estimates for tuning.
- No source compares body reactions to over- vs under-rotation with video measurements.
