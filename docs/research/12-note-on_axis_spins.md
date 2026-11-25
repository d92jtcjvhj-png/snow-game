# On-axis (flat) snowboard spins off kickers: naming, mechanics, grabs, landings, numbers

SOURCING NOTE: WebFetch was blocked in this session. en.wikipedia.org, www.fis-ski.com and ipfs.ssi.eecc.de all failed with ENOTFOUND (hosts not on the network allowlist), so I stopped trying to fetch pages. Every citation below comes from search-engine snippets or summaries, not from full text. Where the snippet was clearly a paraphrase, I describe the claim instead of quoting it. Items marked **DERIVATION** or **ESTIMATE** are my own arithmetic and have no source. I don't repeat the content of docs/research/01, 02 and 05 (takeoff edges, approach shape, off-axis, carve-induced yaw, Applied Sciences 2025 takeoff findings), but I build on them.

## Q1. Trick naming (frontside/backside, switch, cab, 180 → 2340)

### Takeaway
A spin's name has four parts: stance at takeoff (regular or switch), direction (frontside or backside, set by which way the rider faces after the first 90°), degrees in 180° steps, and grab. "Cab" means switch frontside and "half cab" means cab 180. An odd multiple of 180 (180, 540, 900, 1260, 1620, 1980, 2340) lands in the opposite stance. An even multiple (360, 720, 1080, 1440, 1800, 2160) lands in the same stance. The current competition maximum is 2340, but those elite rotations are corked (off-axis), not flat.

### Cited Findings
- Snowboarding has four spin directions: frontside, backside, switch frontside ("cab") and switch backside. Frontside means you face downhill after the first 90° of rotation; backside means your back faces downhill — [NBC Olympics glossary](https://www.nbcolympics.com/news/snowboarding-101-glossary); [KXAN](https://www.kxan.com/news/snowboarding-101-trick-names-and-terms-to-know/)
- Snowboarders use "cab" for any switch frontside spin. Skateboarding is stricter: a true cab must be a fakie backside rotation — [Caballerial (Wikipedia, via search)](https://en.wikipedia.org/wiki/Caballerial); [snowboardingdays](https://www.snowboardingdays.com/what-does-cab-mean-in-snowboarding/)
- A half cab is a switch frontside 180 ("Cab 180"); a full cab is the 360 — [Caballerial (Wikipedia, via search)](https://en.wikipedia.org/wiki/Caballerial); [getitwrite](https://getitwrite.ca/2022/02/17/snowboard-jargon/)
- Names chain direction, rotation and grab together (e.g. "switch backside triple cork 1440 Japan grab"). Switch backside is generally considered the hardest direction — [NBC Olympics glossary](https://www.nbcolympics.com/news/snowboarding-101-glossary)
- Most riders find switch spins about 50% harder: a switch 360 feels roughly as hard as a regular 540 (coaching-site opinion) — [trick-tips.com](https://www.trick-tips.com/snowboarding/how-to-360-540-and-720-frontside-or-backside)
- Records: Hiroto Ogiwara landed the first backside 2160 (6 rotations) at The Nines, Crans-Montana, in April 2022 — [GearJunkie](https://gearjunkie.com/winter/snowboarding/video-hiroto-ogiwara-worlds-first-2160-snowboarding). He also landed the first 2340 in competition at X Games Aspen in January 2025 — [Hiroto Ogiwara (Wikipedia, via search)](https://en.wikipedia.org/wiki/Hiroto_Ogiwara). A Teton Gravity article credits Ian Matteoli with a "first 2160" in Stubai in 2024, which conflicts with the Ogiwara claim, probably over direction or axis — [TGR](https://www.tetongravity.com/worlds-first-2160-landed-on-a-snowboard/). Footage of the 2160 sparked debate over whether it was a quintuple cork, i.e. off-axis — [GearJunkie](https://gearjunkie.com/winter/snowboarding/video-hiroto-ogiwara-worlds-first-2160-snowboarding)

### Inferences
- **DERIVATION** Landing stance = takeoff stance XOR (degrees/180 is odd). So FS 180 from regular lands switch (fakie), and cab 540 lands regular.
- **DERIVATION** For a game, a spin can be encoded as (stance0 ∈ {regular, switch}, dir ∈ {FS, BS}, nHalf ∈ ℕ, grab). The name is `[switch|cab] [FS|BS] (180·nHalf) [grab]`, where "cab" replaces "switch FS" and "half cab" = switch FS 180.
- Inference: the elite 1620–2340 tricks in the sources are all corked. Flat on-axis spins in a game should top out around 1080–1440 to stay plausible. I found no source that ranks flat 1440s as elite; this is a judgment call.

### Gaps
- I couldn't read the FIS trick list (www.fis-ski.com blocked), so I have no official naming rules (e.g. how underrotated tricks are named or credited).
- I found no source on when the first flat 1080 or 1440 was done.

## Q2. How rotation is generated and controlled (pre-wind, release, inertia, stalling, opening up)

### Takeaway
All the spin comes from the takeoff: shoulders pre-wind on the approach, unwind at the pop, and the lower body follows. In the air, angular momentum L is conserved, and the rider only redistributes it. Tucking (arms and knees in, board pulled close) speeds the spin up; extending (arms out, legs straight, opening up) slows it down. Riders tuck mid-spin and open up near the landing to stop the rotation. Grabs can speed up a spin if they pull the board in, or kill it if the upper body twists back to reach the board (counter-rotation).

### Cited Findings
- Spin is set at takeoff and cannot change in the air. Pulling the arms in spins you faster and extending them slows you; total L is constant apart from a small loss to air drag — [Scientific American](https://www.scientificamerican.com/article/olympic-big-air-snowboarders-use-physics-to-their-advantage/); [Live Science](https://www.livescience.com/61854-physics-olympics-winter-tricks-spin.html)
- The rotation created just before lift-off is all the athlete has for the trick (freestyle skiing biomechanics explainer) — [The Conversation](https://theconversation.com/how-do-olympic-freestyle-skiers-produce-their-amazing-tricks-a-biomechanics-expert-explains-176544)
- Pre-wind: the rider winds the arms and shoulders up on the approach and releases at the lip — [Snowboard Addiction, FS 360 on park jumps](https://snowboardaddiction.com/blogs/training-education/how-to-frontside-360-on-park-jumps). A deeper shoulder pre-wind on the approach and a stronger unwind at the pop let the lower body follow — [Progresspedia FS 360](https://progresspedia.org/courses/snowboarding/frontside-360/) (via search summary)
- For a BS 360, the lead shoulder initiates the spin just before the lip — [Snowboard Addiction, rotation vs counter-rotation](https://snowboardaddiction.com/blogs/training-education/rotation-vs-counter-rotation) (via search summary)
- Counter-rotation means the upper and lower body turn in opposite directions (as in a shifty or speed check). If a FS 180 feels like it does a 90 and gets stuck in the air, the rider is counter-rotating — [Snowboard Addiction, rotation vs counter-rotation](https://snowboardaddiction.com/blogs/training-education/rotation-vs-counter-rotation); [SA, FS 180 guide](https://snowboardaddiction.com/blogs/news/16927500-the-ultimate-guide-to-frontside-180s-on-a-snowboard)
- Pulling the arms and knees in speeds rotation (figure-skater physics) and extending slows it. A common mistake is staying extended through the air, which leaves the rider about 270° around and landing diagonally. The fix is to tuck tight, spot past 270° and extend the legs to open up and land — [Progresspedia FS 360](https://progresspedia.org/courses/snowboarding/frontside-360/); [ripplimpactgear](https://ripplimpactgear.com/blogs/news/ultimate-snowboard-tricks-guide) (informal)
- Head and eyes steer the spin: looking for the landing at about 90° stops the body from rotating, because the body follows the head (forum, anecdotal) — [snowboardingforum](https://www.snowboardingforum.com/threads/improving-rotation-for-360s.30460/)
- On big spins, the rider can pull the nose toward the body to speed up the middle of the spin, then let go and open up to slow the rotation into the landing. Tail grabs do the same on tricks over 540 — [Snowboard Dojo Wiz](http://www.snowboarddojowiz.com/blog/how-to-do-a-controlled-spin-with-a-grab). Grabbing can "speed up rotations and flips" and keep the rider from going off-axis — [Ridestore](https://www.ridestore.com/mag/how-to-do-snowboard-grabs/)
- The opposite view: reaching for a grab mid-spin can twist the upper body back, so the hips stop following and the spin dies ("by doing a grab, you lose speed and you can't complete the spin"). The fix is to keep the upper body pulling the spin — [Snowboard Dojo Wiz](http://www.snowboarddojowiz.com/blog/how-to-do-a-controlled-spin-with-a-grab)
- Don't rotate too early off the lip — [Snowboard Addiction FS 360 problems](https://snowboardaddiction.com/blogs/training-education/16098668-top-3-problems-when-learning-how-to-frontside-360-on-a-snowboard) (via search summary)
- Biomechanics: a markerless video vs IMU comparison found angular velocity was the key indicator for increasing rotation, while airtime had a comparatively small influence — [ResearchGate 390411706](https://www.researchgate.net/publication/390411706_Comparative_analysis_of_inertial_measurement_units_and_markerless_video_motion_capture_systems_for_assessing_rotational_parameters_in_snowboard_freestyle) (via snippet). The Applied Sciences 2025 study found that moment of inertia at takeoff increased with trick difficulty (counter to expectations), along with higher rotational energy and upper-trunk twist velocity — [MDPI 15(12):6618](https://www.mdpi.com/2076-3417/15/12/6618) (via snippet; see also doc 05)
- Twisting theory (Yeadon): in a twisting somersault, twist rate p = Ω(A/C − 1) sin θ, with A/C the ratio of transverse to longitudinal moment of inertia. Reported A/C values are 16.0 with arms at the sides, 20.3 with one arm overhead and 25.1 with both arms overhead. An 11° reduction in arm abduction raises twist rate by only ~2% — [ResearchGate "Twist within a somersault"](https://www.researchgate.net/publication/284136535_Twist_within_a_somersault) (via snippet). This applies to off-axis or flip tricks. For a pure on-axis spin, the relevant quantity is simply L = I_long·ω.

### Inferences
- **ESTIMATE (moment of inertia about the spin axis, rider + board, 75 kg, 1.55 m board ~3 kg)**:
  - Body longitudinal axis, arms at the sides: ~1.0–1.5 kg·m². Textbook skater models give 0.36 kg·m² for a slim cylinder model with arms down, but that model ignores the hips and shoulder width — [collegephysicsanswers](https://collegephysicsanswers.com/openstax-solutions/calculate-moment-inertia-skater-given-following-information-600-kg-skater). I picked 1.0–1.5 by judgment because I found no measured whole-body value.
  - Arms fully extended: about +2 kg·m². The same skater model goes from 0.363 to 2.34 kg·m² with arms out — [collegephysicsanswers](https://collegephysicsanswers.com/openstax-solutions/calculate-moment-inertia-skater-given-following-information-600-kg-skater).
  - Board: a rod about its centre, perpendicular to the spin axis, I = mL²/12 ≈ 3·1.55²/12 ≈ 0.6 kg·m² (DERIVATION). It is always present, because the feet are strapped in.
  - Legs: in a flat spin, a crouched, knees-up stance brings the boots and the bent legs' mass nearer the axis. Legs stretched wide (e.g. a poke or boned-out grab) push mass outward. This effect is unquantified in the sources.
  - So for the game: I_open (arms out, legs extended) ≈ 3.5–4.5 kg·m², I_neutral ≈ 2.5 kg·m², I_tucked (arms in, knees up, grab pulled in) ≈ 1.8–2.2 kg·m². The tuck/open ratio is about 1.7–2.2, so a tuck speeds the spin up by roughly 1.5–2× relative to fully open, and by roughly 1.2–1.4× relative to neutral. These are ESTIMATES, not measured values.
- **DERIVATION (angular momentum needed)**: L = I·ω. A 720 in 1.3 s of effective spin time (ω ≈ 9.7 rad/s) at I ≈ 2.2 kg·m² gives L ≈ 21 kg·m²/s. A 1440 in 2.3 s (ω ≈ 10.9 rad/s) needs about the same order. Higher spins mainly use more airtime, not dramatically higher ω (see Q3).
- **Game model suggestion**: at takeoff, set L = f(charge, pre-wind) along the trajectory-normal yaw axis. In the air, ω = L / I(pose), with I interpolated between open and tucked from the player's tuck/grab input. Near the landing, an "open up" pose raises I and slows ω, which helps the rider match the landing heading. This mirrors the real stall/open technique. Small air drag can be ignored, since the sources say L is nearly constant.

### Gaps
- I found no measured whole-body plus board moment of inertia for snowboard poses, and no measured in-air ω profile (tuck vs open) for snowboard spins. The MDPI 2025 tables were not readable.
- I found no quantified effect of a grab on spin rate. Sources conflict qualitatively (speeds up vs slows down).

## Q3. Quantitative spin rates, airtime, rotation per jump size

### Takeaway
Elite big air gives about 2.5–3.1 s of airtime. A 2340 (6.5 rev) took about 2.5 s, which means about 940°/s on average. Park jumps give roughly 1–1.5 s, so a 360 runs about 250–360°/s and a 720 about 500–700°/s. Measured, sourced deg/s values were not found; everything below is arithmetic from airtimes.

### Cited Findings
- A 2340 (6.5 spins) was completed in about 2.5 s of air from roughly 65 ft up — [Defector](https://defector.com/how-big-can-big-air-go)
- Christophe Schmidt logged 3.1 s of hang time on the 2006 Red Bull Gap Session jump, and a physicist suggests ~3 s is near the practical limit for spinning off a jump — [Snowboarder](https://www.snowboarder.com/snowboarders/we-got-a-physicist-to-calculate-how-many-corks-are-possible-on-a-snowboard)
- A study of BS 720/1080/1440/1800 on a dry slope with airbag landings found that harder tricks came with higher takeoff height and faster rotational speed — [MDPI Applied Sciences 2025](https://www.mdpi.com/2076-3417/15/12/6618) (via snippet, no numbers)
- Figure skaters peak at roughly 2 rev/s (≈720°/s) in jumps — [ResearchGate figure-skating biomechanics](https://www.researchgate.net/publication/324858169_Biomechanics_in_Figure_Skating) (snippet). This is a useful human upper bound comparison; skaters have I ≈ 1 kg·m² tight and no board.
- Bigger jumps give more airtime, so riders need less effort and spin rate to complete a rotation — [Progresspedia FS 360](https://progresspedia.org/courses/snowboarding/frontside-360/)

### Inferences
- **DERIVATION**: 2340° / 2.5 s ≈ 940°/s average (≈16 rad/s, 2.6 rev/s). This is corked, so it isn't purely about one axis, but it gives an upper bound for the game.
- **DERIVATION**: Assume ~80% of airtime is actual spinning (the last part is spotting and opening). Then the average spin rate is ω ≈ degrees / (0.8·t_air):

| Trick | Typical jump (ESTIMATE) | t_air (s, ESTIMATE) | ω avg (°/s) |
|---|---|---|---|
| 180 | small park 6–9 m | 0.8–1.0 | 225–280 |
| 360 | small/medium park | 1.0–1.3 | 350–450 |
| 540 | medium park 10–15 m | 1.2–1.5 | 450–560 |
| 720 | medium/large 15–20 m | 1.4–1.8 | 500–640 |
| 1080 | large/big air 20+ m | 1.8–2.4 | 560–750 |
| 1440 | big air | 2.3–2.8 | 640–780 |
| 1800 (corked in practice) | big air | 2.5–3.0 | 750–900 |

  The airtime column is my ESTIMATE, consistent with the 2.5–3.1 s big-air figures cited above. Check it against the airtimes in docs/research/03 and the in-game kicker geometry.
- Game tuning implication: on any given kicker, the reachable rotation is mostly set by airtime × ω_max(tucked). Capping ω_tucked at about 800–950°/s keeps elite counts plausible on big-air-size jumps. A 1080 on a 1.2 s park jump would need ~1100°/s, which is implausible, so the game should refuse it naturally.

### Gaps
- I found no direct measurement of instantaneous angular velocity for flat spins (IMU studies exist, but I couldn't read their numbers).

## Q4. Takeoff mechanics: FS vs BS, blind side, spotting, landing (switch/regular, under/over-rotation)

### Takeaway
FS spins open the chest downhill first and are generally easier to learn. BS spins hide the landing for longer, but on a 360 the rider sees the landing about 270° in. "Blind" means the rider lands without seeing the landing in the final part of the spin: BS 180, FS 360 (last 90° blind), FS 720 and BS 540 all have blind landings. The rider spots the landing at about 270° of each 360, keeps the head and shoulders turning, and lands on an edge (often the toe edge for BS) to stop residual rotation.

### Cited Findings
- FS 360: a blind landing — you look at the landing rather than the direction you're heading; the knuckle and the landing come into view in the second half of the rotation — [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/how-to-frontside-360-on-park-jumps)
- Spot the landing over the trailing shoulder at about 270°, with the head and eyes leading — [Whitelines FS 360 (Ben Kilner)](https://whitelines.com/snowboarding-advice/trick-tips/kicker/snowboard-fs-360-ben-kilner.html); [nollie.zone](https://nollie.zone/snowboarding/snow-frontside-360/) (via search summary)
- Land slightly on the tail so a few degrees of error correct themselves, and extend the legs at the end of the spin to stomp — [search summary of FS 360 guides](https://pushdalimit.com/tutorial/how-to-frontside-360-on-a-snowboard/)
- Which 360 is harder? Sources conflict. Progresspedia says BS is often considered harder because more of the spin is blind — [Progresspedia BS 360](https://progresspedia.org/courses/snowboarding/backside-360/). Pushdalimit says FS 360 is harder because the landing is blind — [pushdalimit](https://pushdalimit.com/tutorial/how-to-frontside-360-on-a-snowboard/). Forum riders say BS 360 feels easier, especially on the landing, and that the heel-edge approach feels natural — [SnowJapan forum](https://www.snowjapan.com/community/index.php?/topic/1268-backside-or-frontside-360s/). A coaching source says FS is the easier spin direction overall — [CoachUp](https://www.coachup.com/nation/articles/snowboarding-how-to-360-2)
- BS 360 under-rotation: the rider stalls at 270° because seeing the landing makes them instinctively stop rotating, so they land diagonal or on the heel edge. The fix is to keep the head and shoulders rotating after seeing the landing — [Progresspedia BS 360](https://progresspedia.org/courses/snowboarding/backside-360/)
- Land on an edge, not flat, to stop the rotation, and look directly down at the spot — [snowboardingforum](https://www.snowboardingforum.com/threads/360-landing-flat-rather-than-on-an-edge.95425/) (anecdotal)
- BS 180: keep the head looking uphill or at the tail rather than peeking downhill, because peeking disrupts the rotation. How much of the uphill view has disappeared tells the rider how far they've rotated. Land on the toe edge to stop the rotation (a heel-edge landing tends to make the rider revert). Leave the lip straight, not angled — [Red Bull how to BS 180](https://www.redbull.com/us-en/how-to-backside-180-snowboard); [Ridestore BS 180](https://www.ridestore.com/mag/how-to-do-your-first-backside-180-on-a-snowboard/); [Snowboard Addiction BS 180](https://snowboardaddiction.com/blogs/spins/17257876-improve-your-backside-180s)
- FS 540 lands open, spotted after a full 360; FS 720 spots at the same place, then keeps turning another 180 and lands blind — [trick-tips.com](https://www.trick-tips.com/snowboarding/how-to-360-540-and-720-frontside-or-backside)
- Judges count blind landings and switch takeoffs or landings as difficulty modifiers — [FIS Judges Manual Snowboard 2016/17](https://www.apul.cz/media/uploads/sekce_snowboarding/dokumenty/fis_judges_manual_snowboard.pdf) (via snippet)

### Inferences
- **DERIVATION (blind/open per spin, regular takeoff)**: In FS rotation, the chest faces downhill at 90°, so the landing is in view from about 90° to 270° of each turn. A trick that ends at 180 + 360k (FS 180, 540, 900) lands while the rider sees the landing ("open"). One that ends at 360k (FS 360, 720, 1080) has the last ~90° blind. In BS rotation, the back faces downhill at 90°, so BS 180 lands blind. BS 360 spots at ~270°, and the final 90° is open toward the landing over the lead shoulder. BS 540 ends blind again. This is consistent with the cited FS 540/720 and BS 180 statements. Exact angular windows are my derivation.
- Game: an "under-rotation" tolerance window is natural. The cited "slightly on the tail" and "land on an edge" tips suggest real riders absorb roughly ±20–30° of heading error. Larger errors cause a washout or a revert (ESTIMATE, no source for the number). Landing on the toe edge for BS and heel edge for FS stops residual spin; this follows the BS 180 sources, and the FS direction is my inference.

### Gaps
- I found no source with a numeric heading-error tolerance at landing.
- No dedicated BS 540 tutorial came up in the searches.

## Q5. Grab catalogue, tweaks, shifties, butters, judging value

### Takeaway
Grabs are defined by which hand (front or rear) and where on the board (toe edge, heel edge, nose, tail; between or outside the bindings). The core eight are indy, mute, melon, stalefish, nose, tail, method and Japan. Sources agree on these, while seatbelt, nuclear, crail and chicken salad have conflicting definitions. FIS judging rewards grabs that are held long and properly and tweaked ("poke" = extending a leg), and penalizes "tindy", tailfish and boot grabs. A shifty is a 90° counter-rotation of the board under a stable upper body, returned before landing.

### Cited Findings (grabs; front hand = leading hand)
- **Indy**: rear hand, toe edge between the bindings — [Red Bull infographic / search summary](https://www.redbull.com/int-en/learning-snowboard-tricks-the-easy-way-infographic); [Snowboard Addiction basic grabs](https://snowboardaddiction.com/blogs/grabs/basic-grabs-on-a-snowboard)
- **Mute**: front hand, toe edge between the bindings — [Snowboard Addiction basic grabs](https://snowboardaddiction.com/blogs/grabs/basic-grabs-on-a-snowboard)
- **Melon**: front hand, heel edge between the feet — [Snowboard Addiction basic grabs](https://snowboardaddiction.com/blogs/grabs/basic-grabs-on-a-snowboard)
- **Stalefish**: rear hand reaches around the outside of the rear knee to the heel edge between the bindings (FIS tricks-list wording per search snippet) — [FIS tricks list](https://www.fis-ski.com/DB/snowboard/park-and-pipe/tricks-list.html) (unread, snippet only)
- **Method**: front hand on the heel edge (a melon), knees bent, board lifted behind the back toward head level; "a tweaked melon" — [Wikipedia list mirror (snippet)](https://ipfs.ssi.eecc.de/ipns/en.wikipedia-on-ipfs.org/wiki/List_of_snowboard_tricks); [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/112716804-the-complicated-world-of-snowboard-grabs)
- **Japan**: a mute (front hand, toe edge) tweaked so the board is pulled up behind the back, front knee pulled toward the board — [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/112716804-the-complicated-world-of-snowboard-grabs); [snowboardingprofiles](https://snowboardingprofiles.com/snowboards-tricks-definitions)
- **Nose**: front hand on the nose. **Tail**: rear hand on the tail — [NBC Olympics glossary](https://www.nbcolympics.com/news/snowboarding-101-glossary)
- **Crail**: rear hand on the toe edge in front of the front foot or on the nose. Some call the nose version a "nose crail" or "real crail" — [NBC Olympics glossary](https://www.nbcolympics.com/news/snowboarding-101-glossary); [snowboardingprofiles](https://snowboardingprofiles.com/snowboards-tricks-definitions)
- **Truck driver**: both hands at once. Most sources say indy + melon; one says mute + stalefish (others call that a "drunk driver") — [search summary of glossaries](https://snowboardingprofiles.com/snowboards-tricks-definitions); [en-academic list](https://en-academic.com/dic.nsf/enwiki/5096404)
- **Roast beef**: rear hand reaches between the legs to the heel edge between the bindings, rear leg boned (straightened) — [snowboardingprofiles](https://snowboardingprofiles.com/snowboards-tricks-definitions); [en-academic list](https://en-academic.com/dic.nsf/enwiki/5096404)
- **Chicken salad**: hand through the legs to the heel edge. Snowboard Addiction says front hand; Wikipedia-style lists say rear hand with the front leg boned (conflict) — [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/112716804-the-complicated-world-of-snowboard-grabs); [en-academic list](https://en-academic.com/dic.nsf/enwiki/5096404)
- **Seatbelt** and **nuclear**: definitions conflict across glossaries (seatbelt: front hand on the tail, or rear hand on the nose, etc.; nuclear: rear hand on the heel edge in front of the front foot, or rear hand on the nose) — [search summary of snowboardingprofiles / everybodywiki](https://en.everybodywiki.com/List_of_snowboard_tricks)
- **Tindy** (tail + indy, rear hand on the toe edge behind the rear binding) is a controversial or "bad" grab — [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/112716804-the-complicated-world-of-snowboard-grabs). Olympic guidance names the tindy, tailfish and any boot grabs as poor form that judges deduct for — [snowmagazine big air guide](https://www.snowmagazine.com/news/big-air-event-guide-winter-olympics)
- **Canadian bacon**: back hand goes behind the legs to the toe edge (reverse of the taipan). Only Snowboard Addiction lists it — [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/112716804-the-complicated-world-of-snowboard-grabs)
- **Tweak / poke**: during the grab, push one leg out (bone it). Judges reward it — [snowmagazine](https://www.snowmagazine.com/news/big-air-event-guide-winter-olympics). The grab or tweak should be applied in the air, not before the trick — [snomie](http://snomie.com/snowboard-jump-tip-big-mistake-learning-shifty/)
- **Judging**: grabs can change a trick's difficulty, and "it is difficult to maintain a held grab" — [FIS SB/FK Judges Handbook 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf). Difficulty modifiers include switch takeoffs and landings, FS vs BS, heel vs toe takeoff, different grabs and blind landings — [FIS Judges Manual 2016/17](https://www.apul.cz/media/uploads/sekce_snowboarding/dokumenty/fis_judges_manual_snowboard.pdf). Grabs should be held properly and for as long as possible — [NBC scoring](https://gtr.nbcolympics.com/news/snowboarding-101-scoring). The FIS criteria are Execution, Difficulty, Amplitude, Variety and Progression, weighted equally. In big air, the two counting tricks must differ — [FIS Handbook 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf)
- **Shifty**: in the air, the lower body and board rotate about 90° while the upper body stays stable (counter-rotation), then return for the landing. It can be FS or BS and is a style trick — [sportslingo](https://www.sportslingo.com/sports-glossary/s/shifty/); [Snowboard Addiction how to shifty](https://snowboardaddiction.com/blogs/training-education/how-to-shifty)
- **Butter/press off the lip**: I found no source in this session (Burton glossary appeared but its definition was not extracted) — [Burton glossary](https://www.burton.com/en-us/blogs/the-burton-blog/snowboarding-terms)

### Inferences
- **Game encoding** (ESTIMATE): grab = (hand ∈ {front, rear, both}, location ∈ {toe-between, heel-between, nose, tail, toe-front, heel-through-legs}). Each grab gets an I multiplier: compact grabs pulled in (mute, indy, melon, nose and tail pulled to the chest) give I ≈ I_tucked. Boned or tweaked grabs (method, Japan, stalefish with poke, roast beef) give I higher than tucked, so the spin is slower but scores more style.
- A shifty conserves total L. The board counter-rotates relative to the upper body, so in a single-rigid-body physics game it should be animation only, with the net yaw unchanged.
- Score: the longer a grab is held (as a fraction of airtime) and the more it's tweaked, the higher the execution score. Bad grabs (tindy, boot) get a penalty. Blind or switch landings increase difficulty. These follow the FIS modifiers; any numeric weights would be game design, not sourced.

### Gaps
- I found no source on typical grab duration in seconds, or on numeric judge weights per grab.
- Butters and presses off the lip, and nose/tail-press-initiated spins, are uncovered (no reliable snippet).

## Q6. Standard vs advanced vs elite on-axis tricks

### Takeaway
The recommended progression is flat 180 → jump 180 → flat 360 → jump 360 → jump 540 → jump 720. The 720 is called the first "pro-level" spin. Switch and cab variants, blind landings and held, tweaked grabs push each rung up a level. Elite competition today is 1440–2340, almost always corked.

### Cited Findings
- Progression, without skipping steps: flat 180s → jump 180s → flat 360s → jump 360s → jump 540s → jump 720s — [trick-tips.com](https://www.trick-tips.com/snowboarding/how-to-360-540-and-720-frontside-or-backside) (via search summary)
- The 720 is described as the first "pro-level" spin — [snowboardbible](https://snowboardbible.com/list-of-snowboarding-tricks/) (via search summary)
- Learn a solid 180 before a 360, which needs a bigger wind-up and pop and must carry through a full circle without stalling — [Progresspedia FS 360](https://progresspedia.org/courses/snowboarding/frontside-360/)
- Records and elite levels: 2160 (2022), 2340 (2025) — see Q1 sources.

### Inferences
- Suggested tiers for the game (my synthesis, not sourced as a formal scale): **Standard**: FS/BS 180, FS/BS 360, half cab, with a basic grab (indy, mute, melon, nose, tail). **Advanced**: 540 and 720 in both directions, cab 360 and 540, switch BS, tweaked grabs (method, Japan, stalefish), blind landings. **Elite**: flat 900, 1080 and 1440, switch BS 900+, cab 1080, long-held tweaked grabs.

### Gaps
- I found no authoritative tier list (e.g. from FIS or national federations) for flat spins.
