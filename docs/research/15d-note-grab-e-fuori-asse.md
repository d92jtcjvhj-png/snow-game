# Grabs, body shape and off-axis rotations (corks, rodeos, mistys, underflips, flips)

ACCESS NOTE: every page fetch failed with a DNS block in this session: arxiv.org, ar5iv.labs.arxiv.org, core.ac.uk, whitelines.com, ojs.ub.uni-konstanz.de (and, in earlier notes, lboro.ac.uk, snowboardaddiction.com, redbull.com, en.wikipedia.org). Every cited finding below comes from search-engine snippets or summaries of the linked pages, not from full reads. Formulas quoted from Yeadon come from those snippets and match the standard rigid-body result. Anything marked **ESTIMATE** or **DERIVATION** is my own calculation, not a sourced value.

Already covered in `docs/research/12-note-off_axis_tricks.md`, `12-trick-fase-3.md` and `14c-note-posa-in-aria-e-grab.md`, so only summarised here: cork naming, the tilt set at takeoff, Yeadon's 4–8° arm tilt, "a late grab over-rotates (DC 1080 → 1260)", the inertia ratios straight 19.8 / pike 5.9 / tuck 3.8 kg·m², and the Chinese big-air finding that inertia at takeoff rises with trick difficulty.

## Q1. Physics of a combined twist + somersault with fixed angular momentum: does a tuck change the flip/spin balance and the axis tilt?

### Takeoff
With L fixed, the visible rotation axis is ω = I⁻¹·L, and it is **not** parallel to L. A tuck cuts the somersault inertia A much more than the twist inertia C. The flip component of ω therefore grows much more than the spin component, and the effective axis leans further toward the flip: the cork "tightens". Opening does the reverse. A symmetric shape change does not create tilt from zero (that needs asymmetry, or a tilt already set at takeoff). It does change how many twists happen per somersault, and changing the pike angle can even stop or reverse the twist (Yeadon).

### Cited Findings
- Yeadon's twist-rate formula for sustained tilt twist: ψ̇ = (h/C − h/A)·sin θ. A = transverse (somersault) moment of inertia, C = longitudinal (twist) moment of inertia, h = angular momentum, θ = tilt. A second form is ψ̇ = (h/C − φ̇)·sin θ, with φ̇ the somersault rate. — [Yeadon, Loughborough twist physics](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/twistphysics00.pdf); [Yeadon papers, core.ac.uk](https://core.ac.uk/download/288388971.pdf) (snippets)
- A plain somersault becomes a somersault with sustained twist only when the tilt angle moves away from zero. — [Yeadon, core.ac.uk](https://core.ac.uk/download/288388471.pdf) (snippet)
- Adding twist to a somersault changes the somersault rate by less than 1%. — [Yeadon, core.ac.uk](https://core.ac.uk/download/288388971.pdf) (snippet)
- Changing the pike angle can switch the motion between modes, "and this permits the twist to be increased or stopped or even reversed". Delaying extension out of a pike can raise the twist rate. — [Yeadon, Loughborough nutation paper](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/nutation.pdf); [ProQuest abstract](https://search.proquest.com/docview/2312420089) (snippets)
- Nutation: tilt and twist rate have local minima at every half twist and maxima at the quarter and three-quarter positions. Well-timed arm adduction exploits this to boost the initial tilt and the twist rate. — [Yeadon, nutation.pdf](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/nutation.pdf) (snippet)
- Even in movements where the twist was visible at takeoff, aerial techniques that increased the tilt were the major contributors. — [Yeadon, aerial00.pdf](https://www.lboro.ac.uk/microsites/ssehs/biomechanics/papers/aerial00.pdf) (snippet)
- Yeadon's classification of twist mechanisms: counter-rotation (cat) twist with zero angular momentum, tilt twist, and direct (contact) twist from takeoff. — [Frohlich / Yeadon summaries, core.ac.uk](https://core.ac.uk/download/288388471.pdf) (snippet)
- Frohlich (Am J Phys 1979) gave the first correct account: a diver starting in a pure somersault can start twisting mid-flight through shape changes, without violating conservation of angular momentum. — [Dullin & Tong, "Twisting Somersault", arXiv 1510.08046](https://arxiv.org/pdf/1510.08046) (snippet)
- Dullin & Tong: the tuck greatly lowers the somersault-axis inertia, "leading to the intuitive result that more twists require larger angular momentum when airborne time is the same". They derive an exact "master twisting-somersault formula" linking airborne time, time spent in each stage, and the numbers of somersaults and twists. — [Dullin & Tong, arXiv 1510.08046](https://arxiv.org/pdf/1510.08046); [Macquarie record](https://researchers.mq.edu.au/en/publications/twisting-somersault/) (snippets)
- Model diver inertia tensor used by Dullin & Tong: (20, 21, 1) kg·m² with arms up (somersault, frontal, twist). The twist axis is about 20× smaller than the somersault axis. One somersault per second needs about 2π·20 kg·m²/s. — [The Diver with a Rotor, arXiv 1510.02978](https://pdf.arxiv.org/pdf/1510.02978) (snippet; model values, not measurements)

### Inferences
- **DERIVATION.** For small to moderate tilt, φ̇ ≈ h/A and ψ̇ ≈ h·(1/C − 1/A)·sin θ, so twists per somersault ≈ (A/C − 1)·sin θ. A tuck lowers A by ~3–5×, while C changes little, so the ratio falls. A gymnast's tuck makes A approach C (a near-sphere), and the twist almost stops. That is why gymnasts and aerial skiers twist in layout and somersault fast in tuck.
- A snowboarder with the board on never reaches A ≈ C. With the board, C is large (about 2–2.5 kg·m² in this project), and a grabbed tuck still has A ≈ 4–5 kg·m² (**ESTIMATE**, see Q5), so A/C ≈ 2. A tuck shifts the trick toward the flip but does not kill the spin. This matches what riders see: a grabbed cork still spins.
- **DERIVATION, effective axis tilt.** With body-frame components ω_spin = L_s/C and ω_flip = L_f/A, the visible axis leans from vertical by atan[(L_f/L_s)·(C/A)]. Tucking raises C/A, so the axis leans more toward the flip ("tighter, more inverted cork"). Opening lowers C/A and the axis rises toward vertical. This is the physics behind the project rule "opening levels the cork axis". In the real 3D problem, L is fixed in space and the body precesses about it, so this picture is a simplification. The direction is right, but the exact angle is not.
- A symmetric grab cannot create tilt from zero. An asymmetric grab can add a few degrees (one-arm reach, Yeadon's 4° with equipment). A grab mainly changes the rates and the ratio between them, not the direction of L.

### Gaps
- No full text was readable, so I could not check Yeadon's exact tilt/twist values for snowboard-like inertia, or the Dullin & Tong tuck examples.
- No source gives measured A and C for a rider with the board on.

## Q2. Snowboard corks: "grab to tighten the cork", long grabs in doubles and triples, letting go to open and land

### Takeoff
Coaching agrees with the physics in Q1. The grab comes early (about 360°) and is held through the inversions, which keeps the somersault inertia small and the flip fast enough to fit 2–3 inversions into ~2–2.5 s of air. Releasing (opening) slows everything and brings the axis upright for the landing. Grabbing late (about 540°) adds speed late and over-rotates. Open too early and you are "stuck in the cork" (from earlier notes). I found no snowboard source with numbers on how a grab changes inversions relative to spin degrees.

### Cited Findings
- Double cork forum tips: practise fast cork 5s/7s on a small jump first, and spot the landing as early as possible to judge whether there is air and tuck for a second cork. A grab taken around 540° is too late and turns the trick into a 1260. — [Newschoolers, How to double cork part 1](https://newschoolers.com/news/read/How-Double-cork-Part-1-double-cork-trampoline); [Newschoolers amp 49105](https://www.newschoolers.com/news/amp/49105) (snippets, anecdotal)
- Going into the second cork, one rider pulls the legs in with the grabbing arm, abs and legs, and says this lets them "cork in and out of the grab" more quickly. Another notes that grabbing later makes the cork slower. — [How to double cork part 2 (mirror)](https://schoolers.pages.dev/posts/how-to-double-cork-part-2); [Newschoolers](https://www.newschoolers.com/news/amp/49105) (snippets, anecdotal). **Conflict:** "a later grab makes the cork slower" and "a grab at 540 over-rotates into a 1260" can both hold. A late grab delays the speed-up, so the early part is slower, but it can still add spin degrees at the end. The snippets do not make this clear.
- Snowboard Addiction treats the BS double cork 1080 as advanced and requires consistent 720s and 900s plus trampoline work first. The page snippet gives no grab-timing numbers. — [Snowboard Addiction EP 14, BS double cork 1080](https://snowboardaddiction.com/blogs/training-education/how-to-backside-double-cork-1080-learn-to-jump-ep-14) (snippet)
- A full tuck with the knees to the chest is the "neutral" grab position that makes most grabs reachable. Wait until you are fully airborne before you reach. — [Ridestore Mag, How to do snowboard grabs](https://www.ridestore.com/mag/how-to-do-snowboard-grabs) (snippet)
- Cork flips on a bike (analogy): "tuck into a ball more to speed up your rotation; if you want to slow down your rotation, stretch out". Pulling in later gives more control over spin speed. — [Pinkbike, cork trick tip](https://www.pinkbike.com/u/JarrettM/blog/tricktip.html) (snippet; MTB, not snowboard)
- Red Bull describes a cork as the body turning on the spin and flip axes at the same time. — [Red Bull, trick explanations Burton US Open](https://redbull.com/us-en/trick-explanations-for-slopestyle-burton-us-open) (snippet)
- Big air, 11 Chinese national-team riders, BS 720 to 1800: the moment of inertia at takeoff rose with difficulty. Riders take off extended and compact afterwards. — already in [14c](../../docs/research/14c-note-posa-in-aria-e-grab.md)

### Inferences
- **DERIVATION from trick names** (rotations ÷ inversions): DC 1080 = 3 spin turns / 2 inversions (1.5); DC 1440 = 4 / 2 (2.0); TC 1440 = 4 / 3 (1.33); TC 1800 = 5 / 3 (1.67); quad 1800 = 5 / 4 (1.25). Over ~2.3 s of air, a DC 1080 averages about 470°/s of spin and about 310°/s of inversion. Adding inversions at the same degrees means a larger flip share, so the rider needs more L_f and/or a longer, tighter tuck.
- Why long grabs in doubles and triples: under ω_flip = L_f/A, the fraction of the flight spent tucked sets the inversion count for a given L_f. Holding the grab through both corks keeps A at its minimum during the phase that has to deliver two or three inversions. The release comes only once the last inversion is "made", and then opening slows the flip and levels the axis for the spot. Japan and mute are front-hand toe-side grabs that keep the body compact and the shoulders over the board, so they suit this (**inference**: no source links Japan/mute to doubles for mechanical reasons, and style and judging probably matter too).
- The grab is a **throttle on both rates**, but a stronger one on the flip. Timing changes the outcome. An early grab adds inversion speed mid-air. A late grab adds speed in the second half, which over-rotates the spin.

### Gaps
- No snowboard coaching source with grab release angles in degrees for doubles and triples (e.g. "let go at 900 of a 1080").
- I could not verify any claim that a specific grab (Japan vs mute) changes the cork mechanically.

## Q3. Underflip, rodeo, misty: mechanics and typical grabs

### Takeoff
These are flips with a smaller spin share. The misty starts like a front flip with a shoulder dip, the rodeo is a back flip with spin, and the underflip is a backflip with a frontside 180, where the body passes under the board. The grab pairings I could confirm come only from tutorial titles: backside rodeo 540 melon (Whitelines) and cab underflip (Whitelines, grab not visible in the snippet). I could not confirm the pairings "rodeo with Japan/indy, misty with mute/indy, underflip with indy" from any reachable source.

### Cited Findings
- Misty: often confused with FS/BS rodeo, but "uses more of a frontflip motion upon initiating". The rider throws a shoulder down to the left or right, starting a spin while head and body invert. Also described as an off-axis backside 540. — [Wikipedia, Misty flip](https://en.wikipedia.org/wiki/Misty_flip) (snippet)
- Underflip: "a backflip with a frontside 180 on the y axis". The name may come from the body flipping under the board. — [snowboardingprofiles.com trick definitions](https://snowboardingprofiles.com/snowboards-tricks-definitions); [Newschoolers forum](https://www.newschoolers.com/web/forums/readthread/thread_id/394560) (snippets)
- Rodeo: an invert done riding forward or fakie that rotates frontside or backside while flipping. — [snowboardingprofiles.com](https://snowboardingprofiles.com/?p=1531985) (snippet)
- ESPN glossary, corkscrew/misty: the board spins more than it flips. — [ESPN snowboarding glossary](https://www.espn.com/extreme/winterx00/s/glossarysnowboarding.html) (snippet)
- Tutorials that exist (titles only): "How to backside rodeo 540 melon" and "Slo-mo trick tips: cab underflip". — [Whitelines BS rodeo 540 melon](https://whitelines.com/snowboarding-advice/trick-tips/kicker/how-to-backside-rodeo-540-melon.html); [Whitelines cab underflip](https://whitelines.com/snowboarding-advice/trick-tips/kicker/slo-mo-trick-tips-cab-underflip.html) (titles)
- Japan: front hand on the toe edge between the feet, front knee pulled down toward the board. — [snowboardingprofiles.com](https://snowboardingprofiles.com/snowboards-tricks-definitions) (snippet; definitions conflict, see 14c)

### Inferences
- Mechanically, all three are "flip-dominant" rotations with low spin degrees (540–720). The tuck from the grab speeds up the inversion, which is the hard part, and a 540/720 needs only a modest spin share. A compact grab on the side of the body that leads the flip keeps the rider tight. In the game, any compact grab can serve them.

### Gaps
- Typical grab per trick: not verified (fetches blocked). The earlier edge conflicts for rodeo, misty and underflip are in docs/research/02.

## Q4. Front and back flips: tuck vs layout speed, and a snowboarder who cannot lay out fully

### Takeoff
In gymnastics and diving, the tuck has about 3–5× less somersault inertia than the straight body, so at the same L it rotates about 3–5× faster. A snowboarder carries a board ~0.8–0.9 m from the centre of mass when extended, cannot point the feet, and in practice flips in a semi-open "neutral" pose. **ESTIMATE:** the usable ratio is about 2× between neutral and grabbed tuck, and about 2.5–3× between open and tuck.

### Cited Findings
- Somersault-axis inertia, adult male: straight 19.8, piked 5.9, tucked 3.8 kg·m² (ratio straight/tuck ≈ 5.2). — [U. Toronto, Physics of Somersaulting and Twisting](https://www.physics.utoronto.ca/~phy189h1/Physics%20of%20Somersaults%20and%20Twists.pdf) (already in 14c)
- Diving: standing 11.3 (12.3 per Whittsett), tuck 3.4 (4.7), pike about 5.6–5.8 kg·m² (ratio ≈ 2.6–3.3). — [IOP 2024, Splashing physics of springboard diving](https://iopscience.iop.org/article/10.1088/1361-6552/ad9fcb) (already in 14c)
- Teaching example: layout ≈ 14, tuck ≈ 4 kg·m² (≈ 3.5×). "Moment of inertia can change by a factor of 3–5 just by changing body position." — [Fiveable, rotational movements in sports](https://fiveable.me/sports-biomechanics/unit-5/rotational-movements-sports-eg-gymnastics-diving/study-guide/ByhOkVbnXjKLFHOb) (snippet; teaching values)
- A posture-difficulty study takes layout as the reference and rates each posture by its transverse inertia divided by the layout inertia. — [Konstanz CPA, somersault postures](https://ojs.ub.uni-konstanz.de/cpa/article/view/6056/5536) (snippet; table not reached)
- Angular velocity in the air depends only on the inertia about the somersault axis. — [Konstanz CPA](https://ojs.ub.uni-konstanz.de/cpa/article/view/5312/4883) (snippet)

### Inferences
- **ESTIMATE, rider + board about the somersault (lateral = board-length) axis.** The board's own inertia about its long axis is ~0, but at offset d it adds m·d² (3 kg).
  - Open (legs nearly straight, arms out): human ≈ 12–14, board at d ≈ 0.85 m adds ≈ 2.2, total ≈ **13–16 kg·m²**.
  - Neutral (knees bent ~90–110°, arms mid): human ≈ 7–8, board at d ≈ 0.6 m adds ≈ 1.1, total ≈ **8–9**.
  - Grabbed tuck (knees to chest, hand on edge): human ≈ 3.8–4.5, board at d ≈ 0.35–0.4 m adds ≈ 0.4, total ≈ **4.2–5**.
  - Ratios open : neutral : tuck ≈ **3 : 1.9 : 1**.
- For off-axis flips with a cartwheel (frontal-axis) component, such as rodeo and misty, the board adds its full mL²/12 ≈ 0.6 kg·m² plus the offset. The frontal-axis inertia is therefore higher than the lateral one, and the tuck ratio is similar or slightly smaller (**ESTIMATE**).
- Coaching takeaway: a snowboard backflip is always done tucked or grabbed. A "layout" backflip on a snowboard is a style variant, slower, and needs more pop.

### Gaps
- No measured inertia for a rider with the board on, on any axis.

## Q5. Freestyle aerials as quantitative support

### Takeoff
Aerial skiers (with skis and boots, like a snowboarder with a board) twist in layout, with 4–6 twists over 3 somersaults, using two or three phases of arm asymmetry. The equipment roughly halves the tilt an arm can create (8° → 4°), but at a given tilt it slightly helps the twist (2.0 → 2.2 twists per somersault at 8°). This supports two points: in-air tilt control with equipment is small, and the tilt must be set at takeoff.

### Cited Findings
- Simulation of freestyle aerials: 4–6 twists can be produced during three somersaults. The main limit is the larger whole-body frontal inertia from the equipment, which restricts the tilt an asymmetric arm movement can generate. Lighter equipment would be unlikely to push past those limits. — [Yeadon 2013, J Biomech, The limits of aerial twisting techniques](https://repository.lboro.ac.uk/articles/journal_contribution/The_limits_of_aerial_twisting_techniques_in_the_aerials_event_of_freestyle_skiing/9624755); [pdf](https://dspace.lboro.ac.uk/dspace-jspui/bitstream/2134/12037/4/yeadon2013a.pdf) (snippets)
- Triple layout somersault: four twists can be started in flight with two phases of asymmetric arm movement, and five twists need three phases. Competitors often spread the twists out, e.g. "full – double full – full". — [Loughborough, aerials](https://dspace.lboro.ac.uk/dspace-jspui/handle/2134/8685) (snippet)
- With skis, at 8° tilt, twists per somersault rise from 2.0 to 2.2, but the same arm movement gives only ~4° of tilt instead of 8°. "For a given tilt angle there is an advantage to twisting with ski boots and skis." — [Yeadon, Application of simulation to freestyle aerial skiing, Konstanz CPA](https://ojs.ub.uni-konstanz.de/cpa/article/view/3076) (snippet)
- Calgary 1988 Olympic aerials, 6 jumps: two started the twist at takeoff, two in the air, two combined both. — [Yeadon 1989, Twisting techniques used in freestyle aerial skiing, IJSB 5(2):275](https://www.sciencegate.app/document/10.1123/ijsb.5.2.275) (snippet)
- Chinese aerials studies: none found in this session.

### Inferences
- With ski-type equipment, a ~4° arm tilt yields about 1 twist per somersault (from 2.0–2.2 at 8°, with sin θ roughly linear; **DERIVATION**). A snowboard cork has roughly 1.25–2 spin turns per inversion, so its tilt must be large and set at the lip. In-air pose changes rates, not the axis set at takeoff, except for small corrections.

### Gaps
- No Chinese aerials kinematic data reached. No measured angular velocities in tuck vs layout for aerialists.

## Q6. Implications for the game model (spin L, off-axis L_f, ω = L / I(pose))

### Takeoff
Yes: the flip axis should have its own inertia ratios, steeper than the spin axis. Today `SPIN.I_TUCK/I_NEUTRAL/I_OPEN = 2.0/2.5/3.5` (ratio open/tuck 1.75) is applied to both L and L_f. The physics says the tuck should speed up the flip about 2× from neutral, against 1.25× for the spin. This also gives the "grab tightens the cork, release opens it" behaviour automatically, with no extra rule.

### Cited Findings
- Current code: one inertia table for both rates — `src/core/config.ts` (`SPIN.I_TUCK 2.0, I_NEUTRAL 2.5, I_OPEN 3.5`, `OFF_MAX 520`, `OMEGA_MAX 760`) and `src/physics/spin.ts` ("ω = L / I(pose) for both").
- Supporting ratios: somersault straight/tuck 3–5× ([U. Toronto](https://www.physics.utoronto.ca/~phy189h1/Physics%20of%20Somersaults%20and%20Twists.pdf); [IOP 2024](https://iopscience.iop.org/article/10.1088/1361-6552/ad9fcb)). The twist axis changes much less, because it is dominated by arms and board ([Dullin & Tong model (20, 21, 1)](https://pdf.arxiv.org/pdf/1510.02978); project spin estimates in docs/research/12).

### Inferences (all ESTIMATE)
- **Proposed flip-axis inertia** (lateral/frontal mix, rider + board): `IF_TUCK 4.5`, `IF_NEUTRAL 8.5`, `IF_OPEN 13` kg·m² (ratios 1 : 1.9 : 2.9). Keep the spin table at 2.0 / 2.5 / 3.5. Only the ratios matter for ω, because `OFF_MAX` is calibrated at neutral: ω_f = OFF_MAX·push·(IF_NEUTRAL/IF_pose).
- **Gameplay softening option.** A full 1.9× flip boost from a grab may feel twitchy on a phone. A compromise of `IF_TUCK : IF_NEUTRAL : IF_OPEN = 1 : 1.6 : 2.4` (e.g. 5.3 / 8.5 / 12.7) keeps the flip effect clearly stronger than the spin effect (1.25×) while staying controllable.
- **Worked example (DERIVATION)** at full charge and full push, with the proposed values:
  - Neutral: ω_s = 760°/s, ω_f = 520°/s, effective axis ≈ atan(520/760) ≈ 34° from vertical.
  - Tuck: ω_s = 950°/s, ω_f = 520·8.5/4.5 ≈ 980°/s, axis ≈ 46°. The cork tightens and inverts about 1.9× faster.
  - Open: ω_s = 543°/s, ω_f = 520·8.5/13 ≈ 340°/s, axis ≈ 32°. Slower and a bit more upright, which matches "open to land". The existing `LEVEL_RATE`/spot logic still closes the flip.
- **Consequences for tuning.** Because the grab now drives inversions, `OFF_MAX`/`OFF_MIN` may need to come down so an un-grabbed full push does not exceed what the tuck allows. Check that DC 1080 (3 spins / 2 inversions over ~2.3 s) needs a held grab for about 50–70% of the flight at moderate push, and that a triple needs a long grab plus a strong push. Late-grab over-rotation emerges by itself.
- **Mixed trick families.** For straight flips (`FLIP_MAX 320`) and flip-dominant tricks (rodeo, misty, underflip), use the same flip-axis table. A grabbed backflip then rotates about 1.9× faster than a neutral one. No real "layout": the open pose is the slowest, about 0.65× neutral.
- **What not to model.** Grabs should not change the takeoff axis set by L/L_f direction, apart from an optional small (≤ 4–5°) asymmetric-grab tilt nudge, in line with Yeadon's 4° with equipment. Twist-per-somersault coupling through sin θ (true rigid-body precession) can stay out, because the two-rate model reproduces the coaching-level effects.
- Per project rule 4, the new values belong in `src/core/config.ts` and need a Vitest test, for example: "a grab raises ω_f/ω_s; opening lowers it; a held grab gives more inversions at equal L_f".

### Gaps
- No snowboard measurement exists to validate the ratios. They are derived from gymnastics and diving data plus a board-offset calculation.
