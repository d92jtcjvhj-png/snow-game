# Set-up turn at big-air speed and how hard a snowboard speed check can brake

Method note: every full-text host tried (frontiersin.org, link.springer.com, eprints.whiterose.ac.uk, arxiv.org, boris.unibe.ch) was unreachable from this session (DNS blocked by the session's network allowlist). All findings below come from **search-engine snippets** of those pages. Numbers were not checked against the full text unless stated. Derivations are labelled **[DERIVATION]** and were computed by me (python, g = 9.81 m/s²).

## A1. Turn radii and lateral accelerations reachable on an edge at 55–75 km/h on firm snow

### Takeaway
I found no peer-reviewed field study giving measured snowboard turn radius, lateral g or edge angle at 55–75 km/h. Snowboard force-plate studies exist, but only their abstracts were visible. The best anchors come from the geometry R = R_sc·cos(edge), from ski GS data (minimum radius about 16 m at about 20 m/s, peak GRF up to about 5 BW in alpine skiing) and from basic dynamics. At 60–70 km/h, a set-up turn of 15–40 m radius (lateral acceleration 0.7–2 g) is the physically plausible envelope. A freestyle board (sidecut about 7–8 m) cannot cleanly carve a radius that large, so the set-up arc is necessarily partly skidded or drifted.

### Cited Findings
- Inclination-dependent sidecut radius: R(φ) = R_SC·cos φ ≤ R_SC (Jentschura & Fahrbach, "Physics of Skiing: the ideal-carving equation"). The relation goes back to Howe, *Skiing Mechanics*. — [arXiv physics/0310086](https://arxiv.org/pdf/physics/0310086); [ar5iv](https://ar5iv.labs.arxiv.org/html/physics/0310086)
- The same ideal-carving model "can be applied to snowboarding as well". The snowboard sidecut radius "may assume values as low as 6–8 m at a typical chord length between 150 cm and 160 cm". — [arXiv physics/0310086](https://arxiv.org/pdf/physics/0310086) (snippet)
- "You can't carve a turn whose radius is larger than your board's sidecut radius." The sidecut radius is approximately the maximum radius that can be cleanly carved. — [Snowboard Sidecut & Carve Radius Calculator](https://natewaddoups.github.io/SidecutCalculator.html) (hobbyist tool, not peer-reviewed)
- A physicsforums user questions whether R_sc·cos(edge) still holds on an inclined slope. The thread gives no resolution. — [physicsforums](https://physicsforums.com/threads/turning-radius-of-curved-plane-on-an-inclined-plane.875063)
- Snowboard carving worked example: a 12 m sidecut radius at 10 m/s pairs with an edge angle of about 58.3°. — [Michaud & Duncumb, "Physics of a Snowboard Carved Turn" (Bomber)](https://bomberonline.3dcartstores.com/assets/images/PDFs/Physics-of-a-Snowboard-Carved-Turn.pdf) (manufacturer white paper)
- Simulation of a snowboard turn: a smaller sidecut radius raises the board's attack angle and the lateral force, so the turn gets sharper. As the attack angle grows further, the force in the global direction can fall and "the turn becomes a skid turn". — [Simulation of Snowboarding, SciTePress 2018](https://www.scitepress.org/Papers/2018/68964/68964.pdf)
- Lieu & Mote (ski model): at attack angles of about 11° or more, every point along the ski is in skid mode. — snippet via [PMC7739813](https://pmc.ncbi.nlm.nih.gov/articles/PMC7739813/)
- Ski slalom measurement: maximum edge angles of 65.7 ± 1.7° and 71.0 ± 1.9°, minimum turn radii of 3.96 ± 0.23 m and 4.94 ± 0.59 m for 10 m and 13 m gate spacing. These agree with Howe's edge-angle prediction. This is the low-speed slalom regime, not big-air speed. — [PMC7739813](https://pmc.ncbi.nlm.nih.gov/articles/PMC7739813/)
- FE ski study: for edge angles above about 50°, the calculated radius levels off, whereas Howe's model tends to zero. — [ResearchGate FE parameter study](https://www.researchgate.net/publication/224891596_Parameter_Study_using_a_Finite_Element_Simulation_of_a_Carving_Alpine_Ski_to_Investigate_the_Turn_Radius_and_its_Dependence_on_Edging_Angle_Load_and_Snow_Properties)
- Ski GS GNSS data:
  - One GS course had a minimum turn radius of 16 m. — [Sensors 2020, 20(15):4232 / related GNSS GS work](https://doi.org/10.3390/s20154232) (snippet; the attribution to that exact paper is uncertain)
  - In elite GS, the "typical speed [is] around 20 m/s". — [PMC6282051](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6282051/)
  - Average speed in a medium GS section was 49.77 km/h (U12) to 65.33 km/h (U21). — [PMC7739688](https://pmc.ncbi.nlm.nih.gov/articles/PMC7739688/)
- Peak ground reaction forces in alpine skiing can reach about 5× body weight, and GS is among the highest. — snippet summarised from [Supej/Kugovnik/Nemec, hrcak](https://hrcak.srce.hr/file/6863) and [Hébert-Losier, Supej & Holmberg review](https://skiersynergy.com/images/pages/Docs/documents/Biomechanical%20Factors%20Influencing%20the%20Performance%20of%20Elite%20Alpine%20Ski%20Racers.pdf). The search tool merged these, so the exact attribution is uncertain.
- Alpine snowboard PGS course: 120–200 m long, 20–25 m between gates, 7–12 m between the two parallel courses. — [Human Kinetics excerpt](https://canada.humankinetics.com/blogs/excerpt/snowboarding)
- Swiss team GNSS study of snowboard PGS (Wijnkoop et al., ICSS 2023):
  - Speed was lowest on steep terrain and higher on flatter slopes.
  - On flat and medium slopes, a larger smallest turn radius meant a better section time.
  - "Maintaining speed with a larger minimum turn radius is more important… than aiming for a long gliding phase."
  - No km/h or radius values were visible in the snippet. — [boris.unibe.ch 180600](https://boris.unibe.ch/180600)
- Snowboard force measurement exists, but no numbers were visible:
  - Akita University: 6-axis sensors between board and bindings measured snow reaction force during carving, and the force differed by skill level. — [ScienceDirect S1877705812017420](https://www.sciencedirect.com/science/article/pii/S1877705812017420); [ResearchGate 309324200](https://www.researchgate.net/publication/309324200_A_Study_on_Motion_Analysis_of_Carving_Turns_in_Snowboarding_by_Measurement_of_Reaction_Force_from_Snow_Surface)
  - A static carved-board model validated on a lab bench. — [Sports Eng. 10.1007/s12283-019-0307-4](https://link.springer.com/article/10.1007/s12283-019-0307-4)
- Big air and slopestyle speeds (context for "approach speed"):
  - Conference slides on Milano-Cortina 2026 give big-air takeoff at about 55 km/h with an in-run at about 80 km/h, and slopestyle takeoff at 50–70 km/h. — [LTS KTP26 slides, Vainio](https://www.lts.fi/media/lts_tapahtumat/ktp26-tiedostot/juhani_vainio_jaettava_esitys_www_ktp26.pdf) (not peer-reviewed)
  - Wolfsperger et al. ran drag trials at 35, 60 and 85 km/h on slopestyle and big-air athletes. — [serval.unil.ch](https://serval.unil.ch/resource/serval:BIB_9092E5EAD56F.P001/REF)

### Inferences
- **[DERIVATION]** a_lat = v²/R. The radius needed for a given lateral acceleration:

  | v | 5 m/s² (0.5 g) | 10 m/s² (1 g) | 15 m/s² (1.5 g) | 20 m/s² (2 g) |
  |---|---|---|---|---|
  | 55 km/h | 46.7 m | 23.3 m | 15.6 m | 11.7 m |
  | 60 km/h | 55.6 m | 27.8 m | 18.5 m | 13.9 m |
  | 65 km/h | 65.2 m | 32.6 m | 21.7 m | 16.3 m |
  | 70 km/h | 75.6 m | 37.8 m | 25.2 m | 18.9 m |
  | 75 km/h | 86.8 m | 43.4 m | 28.9 m | 21.7 m |

- **[ESTIMATE]** A total GRF of about 2–2.5 BW over a short arc is realistic for a strong rider, given that ski GS peaks reach about 5 BW. That gives a_lat ≈ 1.7–2.3 g and a minimum radius of about 14–19 m at 60–70 km/h. A comfortable set-up turn is nearer 0.5–1 g, or R ≈ 25–75 m.
- **[DERIVATION]** These radii are 2–10× larger than a freestyle board's sidecut (about 7–8 m). A pure carve with R = R_sc·cos θ would give at most about 8 m.
  - Consequence 1: a clean carve at 60–70 km/h would mean a_lat = v²/(R_sc cos θ). That is 34 m/s² (3.5 g) or more at 60 km/h with R = 8 m, which no rider can hold.
  - Consequence 2: the set-up turn is therefore a low-edge-angle "drifted" or "scrubbed" arc. The board runs at a small attack angle, partly skidding, and the rider holds a modest edge angle.
  - This matches the SciTePress simulation: as the attack angle grows, lateral force grows but the turn becomes a skid.
- **For the game:** the existing sidecut/edge model (radius from sidecut and edge angle) only produces radii of 8 m or less. Big-radius set-up arcs need either a skid/drift component (attack angle with anisotropic friction) or a clamp on lateral acceleration (for example a_lat ≤ 1–1.5 g). The second option is a design choice, not a measured value.

### Gaps
- No measured snowboard edge angle, lateral g or turn radius at 55–75 km/h was found. The Akita force studies and Wijnkoop's PGS GNSS full text, which would hold the numbers, were unreachable.
- No direct measurement exists of how much speed a set-up turn costs (see A2).

## A2. Is the pre-jump set-up turn skidded, drifted or carved, and how much speed does it cost?

### Takeaway
I found no source that describes the pre-kicker set-up turn quantitatively. Ski racing research consistently links skidding to friction losses and speed reduction, and links carving to speed preservation. The physics in A1 implies that a big-radius turn at these speeds on a short-sidecut board must be drifted or skidded. Its speed cost scales with the attack angle and how long it lasts.

### Cited Findings
- Elite ski racing review: performance gains in GS come from reducing ski–snow friction, through earlier turn initiation, smoother force application and favouring carving over skidding. Skidding is tied to energy dissipation. — [Hébert-Losier, Supej, Holmberg review (pdf)](https://skiersynergy.com/images/pages/Docs/documents/Biomechanical%20Factors%20Influencing%20the%20Performance%20of%20Elite%20Alpine%20Ski%20Racers.pdf); [Epistemonikos record](https://www.epistemonikos.org/en/documents/9fabcd738fdea2fb63768effad06cda7e1b88d55)
- Supej: friction is enhanced in skidded turns and produces significant speed reduction. Hybrid turns (pivot and skid, then carve) can keep speed below a critical limit on steep slopes. — [ResearchGate "A skidding model for carving skis"](https://www.researchgate.net/publication/235935020_A_skidding_model_for_carving_skis) / [Frontiers fspor.2020.589257](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.589257/full) (snippet; the exact attribution between these two is uncertain)
- During skidding, the effective friction coefficient is high and varies through the turn, peaking mid-turn. A Coulomb fit gives "very high values, up to about 0.3". Sahashi & Ichino reported even higher values. Some authors argue the cause is snow machining rather than true friction. — snippets from [Komissarov, "Modelling of carving turns" arXiv 1812.02539](https://arxiv.org/pdf/1812.02539) and [Komissarov, side-slipping theory, Sports Eng. 2021](https://link.springer.com/article/10.1007/s12283-021-00340-7)
- Gliding friction for a snowboard is μ = 0.026 ± 0.008 to 0.143 ± 0.017 depending on snow (field kinematics with a drag model). The legacy μ of 0.06 sits inside this range. — [Frontiers Mech. Eng. 10.3389/fmech.2021.728722](https://www.frontiersin.org/journals/mechanical-engineering/articles/10.3389/fmech.2021.728722/pdf)
- A 2024 skier–ski–snow model fitted a tangential friction parameter of 0.06 (beginner) to 0.19 (intermediate), and a normal-direction parameter of 0.55 to 0.9. The higher beginner value was linked to skidding. — [arXiv 2411.08056](https://arxiv.org/pdf/2411.08056)
- Coaching: riders make "one or two speed checks, then start straightlining for the last bit before the jump" to get balanced and line up the shoulders. A last-second check is discouraged. — [snowboardingforum thread](https://www.snowboardingforum.com/threads/scrubbing-speed-before-jumps.35209/); [snomie](http://snomie.com/snowboard-jumping-mistake-beginner/)

### Inferences
- **[ESTIMATE]** Drag in a drifted arc ≈ μ_eff(β)·N along the travel direction. A very rough proxy is μ_eff ≈ μ_glide + k·sin β, where β is the attack angle.
  - With μ_eff ≈ 0.15–0.3 and N ≈ 1.5 BW, the deceleration is about 2–4.5 m/s².
  - Over a set-up arc lasting 0.7–1.3 s (see A3), that removes about 1.5–6 m/s (5–20 km/h).
  - This is an order-of-magnitude estimate, not measured. A cleaner set-up (small β) would cost only about 1–5 km/h.
- In practice the set-up turn ends with a straight-line run-in (coaching sources). The game's approach logic should finish the lateral move before the final straight section.

### Gaps
- No measured speed loss for a freestyle set-up turn exists in the sources found.
- No snowboard-specific skid-angle data was found.

## A3. Run-out distance needed to shift laterally by 1–3 m at 60–70 km/h

### Takeaway
**[DERIVATION]** With a bang-bang lateral profile (accelerate sideways, then decelerate sideways, ending parallel to the original line), the shift takes t = 2√(d/a) and covers a forward distance L = v·t. At 0.5–1 g, a 1–3 m shift needs about 10–30 m of approach. At about 1.6 g (two opposite 20 m arcs) it needs 8–17 m. Add transition time for each edge change.

### Cited Findings
- No source covers this specific question. The inputs (speed, lateral g) come from A1.

### Inferences
- **[DERIVATION]** Forward distance L needed for each lateral shift:

  | a_lat | d | t | L at 60 km/h | L at 70 km/h |
  |---|---|---|---|---|
  | 5 m/s² | 1 m | 0.89 s | 14.9 m | 17.4 m |
  | 5 m/s² | 2 m | 1.26 s | 21.1 m | 24.6 m |
  | 5 m/s² | 3 m | 1.55 s | 25.8 m | 30.1 m |
  | 10 m/s² | 1 m | 0.63 s | 10.5 m | 12.3 m |
  | 10 m/s² | 2 m | 0.89 s | 14.9 m | 17.4 m |
  | 10 m/s² | 3 m | 1.10 s | 18.3 m | 21.3 m |
  | 16 m/s² | 1 m | 0.50 s | 8.3 m | 9.7 m |
  | 16 m/s² | 2 m | 0.71 s | 11.8 m | 13.7 m |
  | 16 m/s² | 3 m | 0.87 s | 14.4 m | 16.8 m |

- **[DERIVATION]** The equivalent S-curve of two opposite arcs of radius R (constant a = v²/R) gives a lateral offset d with L ≈ 2√(R·d). For example, R = 20 m and d = 2 m gives L ≈ 12.6 m, which matches the a = 16 m/s² row at 64 km/h.
- **[ESTIMATE]** Edge-to-edge transitions (flattening the board, then re-edging) add roughly 0.2–0.4 s, or 3–8 m at these speeds. Add the coaching advice of a straight run-in of a few board lengths. A set-up starting about 25–40 m before the lip is a reasonable design value for a 1–3 m shift at moderate (≤1 g) lateral acceleration. The transition time is not sourced.

### Gaps
- No measured time for a snowboard edge transition at speed was found.

## B1. Deceleration of a heelside skid, hockey stop or sideslip, on flat and steep slopes; effective friction coefficient

### Takeaway
The key source is Komissarov (Sports Engineering 2021, a snow-machining model of side-slipping). It gives an effective friction coefficient μ_eff = tan Ψ, where Ψ is the edge angle: μ_eff = 1 at 45°. For a hockey stop at Ψ = 45° it predicts deceleration of about 7.1 m/s² (0.72 g), braking time of 1.4 s and braking distance of 7.0 m. It also mentions a case at about 14 m/s². These are model predictions that agree with practice, not direct measurements. Field "Coulomb" fits of skidding give μ ≈ 0.3 or more. On a 35° slope, a fall-line sideslip only decelerates when the edge angle exceeds the slope angle. At Ψ = 60° the model gives about 8 m/s².

### Cited Findings
- Komissarov 2021, "Mechanics of side-slipping in alpine skiing. Braking and skidded traversing", Sports Engineering 24.
  - It applies snow-machining theory to fall-line side-slipping, traversing and the hockey stop.
  - Orthogonal case: "effective kinetic friction coefficient μ_eff = tan Ψ", and "μ_eff = 1 for Ψ = 45°, which is consistent with the very efficient braking during the so-called 'hockey stop'".
  - Hockey stop: "(8) predicts a = 7.1 m/s², T_br = 1.4 s, and L_br = 7.0 m if Ψ = 45°".
  - A second case with a = 14 m/s² is cut off in the snippet. Its conditions (probably a higher edge angle) were not visible.
  - The model "explain[s] the abnormal 'friction' reported in several field studies".
  - The author says the theory still needs rigorous testing.
  - Sources: [Springer s12283-021-00357-y](https://link.springer.com/article/10.1007/s12283-021-00357-y); [White Rose PDF](https://eprints.whiterose.ac.uk/id/eprint/169742/1/Komissarov2021_Article_MechanicsOfSide-slippingInAlpi.pdf); [White Rose record 178608](https://eprints.whiterose.ac.uk/178608)
- Companion paper: on hard snow, side-slipping removes a thin top layer of snow (machining). The model was tested against lab results on ice and snow. — [Springer s12283-021-00340-7](https://link.springer.com/article/10.1007/s12283-021-00340-7)
- Fall-line side-slip relation: a = g·cos α·(tan α − tan Ψ), so the rider slows when Ψ > α. — quoted in a game-dev issue summarising Komissarov ([GitHub SnowboardAnywhere #98](https://github.com/drewkeriazes/SnowboardAnywhere/issues/98)). This is not peer-reviewed and I could not verify it against the paper. Note that at α = 0 it gives 9.81 m/s² for Ψ = 45°, not the paper's hockey-stop 7.1 m/s². So the hockey-stop formula (8) contains other terms, such as a non-orthogonal geometry or the rider's turning phase.
- A Coulomb fit of skidded turns gives "very high values, up to about 0.3". Sahashi & Ichino found even higher. — snippet, [Komissarov arXiv 1812.02539](https://arxiv.org/pdf/1812.02539) / [Sports Eng. 2021](https://link.springer.com/article/10.1007/s12283-021-00340-7)
- Coaching: in a sideslip, "the steeper your board is angled, the slower you will be moving". The edge angle acts as a throttle. — [Snowboard Addiction, How to sideslip](https://snowboardaddiction.com/blogs/riding/how-to-sideslip)
- Steep terrain (ski guide): sideslip straight down, then set the edges with a quick flick of the knees. Lingering in the fall line on steep slopes picks up "too much speed too fast". — [Frommer's, Lito's tech tip](https://www.frommers.com/trip-ideas/winter-sport/litos-tech-tip-safety-on-the-steeps)

### Inferences
- **[DERIVATION, using the unverified fall-line relation]** a = g·cos α·(tan α − tan Ψ). Negative values mean deceleration:

  | slope α | Ψ = 45° | Ψ = 60° | Ψ = 70° |
  |---|---|---|---|
  | 0° | −9.8 m/s² | −17.0 m/s² | −27.0 m/s² |
  | 25° | −4.7 m/s² | −11.3 m/s² | −20.3 m/s² |
  | 35° | −2.4 m/s² | −8.3 m/s² | −16.5 m/s² |
  | 40° | −1.2 m/s² | −6.7 m/s² | −14.3 m/s² |

  - The larger values (above about 15 m/s², or 1.5 g) exceed what the rider's legs and balance can sustain, since the normal force rises accordingly. A practical cap is about 1–1.5 g. **[ESTIMATE]**
  - Yes, a rider can stop or slow down on a 35° slope by skidding, provided the edge angle relative to the snow clearly exceeds 35°. That fits coaching practice (sideslipping couloirs).
- A credible game range is μ_eff for a skidding edge ≈ 0.3 (field Coulomb fits) up to about 1 (hockey stop at Ψ = 45°), giving decelerations of about 3–10 m/s² on gentle park slopes. Komissarov's 7.1 m/s² is a good single reference value for a full hockey stop.
- This sits far above gliding μ (0.03–0.14). The anisotropic friction model in `src/physics` should let the cross-board coefficient reach about 0.5–1 when the board is skidded hard sideways.

### Gaps
- I found no direct field measurement (IMU or GNSS) of snowboard hockey-stop deceleration. The 7.1 m/s² figure is a ski-based model prediction. The board's longer edge may change the snow-machining force, which is unknown.
- I could not read the conditions of the 14 m/s² case or the steep-slope cases in Komissarov's paper (host blocked).

## B2. How much speed a typical speed check before a kicker removes, and how long it lasts

### Takeaway
No source gives a km/h figure or a duration for a pre-kicker speed check. Coaching sources describe it as "a quick heel or toe edge slide… without turning", done early, followed by a straight run-in. Combining the B1 deceleration with a plausible duration gives an estimate of roughly 5–15 km/h per check.

### Cited Findings
- Definition: "Put in a quick heel or toe edge slide to slow down and scrub some speed without turning your snowboard. This is usually done before a jump if you're coming in too hot." — [The Manual, snowboard slang guide](https://www.themanual.com/outdoors/snowboard-slang-guide-for-beginners/)
- Riders make "one or two speed checks, then start straightlining for the last bit before the jump". If you are scrubbing just before the ramp, it is too late. — [snowboardingforum, scrubbing speed before jumps](https://www.snowboardingforum.com/threads/scrubbing-speed-before-jumps.35209/)
- A last-minute extra speed check "is only going to cause you to 'come up short' and it's going to hurt". — [snomie](http://snomie.com/snowboard-jumping-mistake-beginner/)
- Speed is dialled in by feel over 2–3 runs, and coming in too slow is a common cause of injury. — [Shred School / edshreds](https://www.edshreds.com/how-to-jump-on-a-snowboard/); [CoachUp](https://www.coachup.com/nation/articles/snowboarding-going-off-jumps)

### Inferences
- **[DERIVATION/ESTIMATE]** Δv = a·t.
  - With a = 4–7 m/s² (partial to full hockey-stop intensity, from B1) and a check lasting 0.3–0.6 s, Δv ≈ 1.2–4.2 m/s, or about **4–15 km/h** per check.
  - A typical moderate check (a ≈ 5 m/s², 0.4 s) removes about 7 km/h and uses about 7 m of approach at 65 km/h.
  - The durations are assumed, not measured.
- **For the game:** an analog speed check whose deceleration scales with input from gliding friction up to about 7 m/s² (about 0.7 g; the cap is a design choice) matches the literature anchor. The approach geometry should leave a straight segment after the last check, as the coaching sources recommend.

### Gaps
- No measured duration or speed drop of a park speed check was found, whether from GNSS, video analysis or coaching data.
- Snowboard Addiction and AASI pages specific to speed checks did not appear in the results with numbers.
