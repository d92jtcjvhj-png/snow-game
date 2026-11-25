# Full speed check / hockey stop / heelside stop: technique and physics on flat and steep slopes

> **Access note.** Most primary hosts were unreachable from this session (DNS blocked): link.springer.com, rd.springer.com, eprints.whiterose.ac.uk, researchgate.net, pubmed.ncbi.nlm.nih.gov, snowboardaddiction.com, thesnowpros.org, humankinetics.com, learning.nzsia.org, turnlab.co. Unless marked "fetched", findings come from **search-engine snippets**. Only github.com could be fetched in full.
>
> This file adds to `docs/research/03-speed-check-e-numeri.md` and `07b-note-presa-e-speed-check.md` and does not repeat them. Its main new result: **the conditions behind Komissarov's hockey-stop numbers are now identified (15° slope, 10 m/s), and they match a = g·cosα·(tanα − tanΨ) exactly.** That resolves the inconsistency flagged in 07b-B1.

## Q1. Technique: rotation, pivot speed, edge, body position, braking modulation, full stop

### Takeaway
In a hockey stop the board is pivoted to an angle of attack of about 90° to the direction of travel, i.e. perpendicular to the fall line when stopping straight down. It is pushed ahead of (downhill of) the centre of mass while the body leans back into the hill onto the uphill edge. The heel edge is used for the standard stop: toe edge is possible but not the default.

The rider modulates braking with edge angle and pressure, absorbed through ankles, knees and hips. Stiff, straight legs cause chatter. Near zero speed the rider stands up and stays still on the edge.

I found no measured pivot time. The only figure is a game-sim design target of about 0.2–0.3 s for 80–90° (not real-world data).

### Cited Findings
- **≈90° angle of attack, board pushed ahead of the CM:** "The skis are pivoted to an angle of attack of about 90 degrees and pushed ahead of the center of mass" (hockey stop description). — snippet, [Komissarov 2021, Sports Eng. 24, s12283-021-00357-y](https://link.springer.com/article/10.1007/s12283-021-00357-y)
- **Force split by angle of attack γ:** braking component F_b = F_c·sin γ and turning component F_t = F_c·cos γ. Braking is therefore maximal at γ = 90°: a fully perpendicular board is the most efficient brake, and a partial pivot also turns the rider. — snippet, [Komissarov 2021](https://link.springer.com/article/10.1007/s12283-021-00357-y)
- **Snow-machining theory supports the hockey stop "as the most effective way of braking".** — snippet, [White Rose record 178608](https://eprints.whiterose.ac.uk/178608)
- **Coaching: rotate to 90°.** "Quickly rotate your upper body so your hips and the board follow, bringing the board to 90 degrees across the fall line." Press hard into the uphill edge and keep weight slightly uphill so the downhill edge does not catch. Sequence: pivot, set the edge, then skid. — snippets, [climeradar, Mastering snowboard stopping techniques](https://climeradar.com/blog/mastering-snowboard-stopping-techniques); [snowfeetstore, Hockey stops on snow](https://www.snowfeetstore.com/blogs/snowfeet_skiskates_skiboards_snowblades_skiblades_mini_skis_short_skis/hockey-stops-on-snow-can-you-do-them-on-skiskates) (low-authority blogs)
- **Snowboard Addiction "How To Heel Side Fast Stop":**
  - Start by picking up speed straight down the fall line, bent at the hips rather than locked at the knees.
  - Absorb the pressure of the stop through ankles, knees and hips.
  - "When you feel yourself coming to the stop, begin to stand back up."
  - "Chatter is from the underneath of the snowboard gaining too much pressure due to the rider having stiff and straight legs when trying to slow down/stop."
  - Letting weight drift too far back can catch you on the back edge.
  - snippets, [Snowboard Addiction, Pressure control through turns](https://snowboardaddiction.com/blogs/training-education/43777284-pressure-control-through-turns)
- **Leaning back is a "major mistake" because it weakens edge grip.** — snippet, [climeradar](https://climeradar.com/blog/mastering-snowboard-stopping-techniques). This does not conflict with "lean into the hill": the fault is shifting the hips back toward the tail or sitting down, as opposed to tilting the whole body uphill over the edge.
- **NZSIA snowboard manual:**
  - "Looking straight down the fall line often brings riders into a sideslip on the heelside or leaves turns incomplete on the toeside."
  - It lists as a fault: "Rider butt checks when shutting down speed on their heelside". Dropping the butt, i.e. "sitting", is a coached error, not the technique.
  - snippets, [learning.nzsia.org](https://learning.nzsia.org/?p=14880)
- **Steep terrain:** keep the knees bent so the body matches the slope pitch. Drive the edge into the slope with the legs and shift weight toward the uphill side. A low stance leaves room to correct the edge angle. — search summary over [ncstate pressbooks, Turning and speed control](https://ncstate.pressbooks.pub/skiingandsnowboarding/chapter/turning/), [REI How to snowboard](https://www.rei.com/learn/expert-advice/how-to-snowboard.html), [humankinetics excerpt](https://shop.humankinetics.com/blogs/excerpt/learning-how-to-stop-on-the-snowboard). The snippet attribution to each page is not precise.
- **Modulation by tilt:**
  - AASI task definitions: skidded turns control speed "through turn shape and management of skid".
  - Garlands (NSP glossary): "Linked transitions from a sideslip to a forward sideslip, then back to a sideslip… without stopping, and by adjusting edge angles and pressure".
  - Sideslip is "speed controlled by tilt".
  - CASI: "sideslip as necessary to slow down".
  - snippets, [AASI L1 Riding Turn Tasks](https://thesnowpros.org/download/western/snowboard_member_library/snowboard_level_1/AASI-L1-Riding-Turn-Tasks.pdf); [NSP Snowsports Glossary](https://www.nspcentral.org/wp-content/uploads/2024/09/Snowsports-Glossary.pdf); [CASI Reference Guide](https://issuu.com/casintc/docs/casi_ref_guide_2016_en_web_lores/178)
- **Pivot timing:**
  - A hobby game sim (SnowboardAnywhere) that implemented Komissarov's model set a design target of 80–90° in about 0.2–0.3 s. It implemented about 84° in 0.25 s.
  - The edge angle ramps to max(45°, slope + 12°).
  - Below 1 m/s the board stays across the hill and the rider can stand still on the edge.
  - Board 1.55 × 0.25 m.
  - This is **a design choice, not a measurement**. — fetched, [GitHub SnowboardAnywhere #98](https://github.com/drewkeriazes/SnowboardAnywhere/issues/98)
- **Ice-hockey analogy:** the skater "will rapidly pivot their hips 90 degrees". — snippet, [howtohockey](https://howtohockey.com/?p=246) (analogy only)

### Inferences
- **For the game:**
  - Pivot to γ ≈ 90° relative to the velocity vector in about 0.25 s (range 0.2–0.4 s).
  - The upper body and head stay facing downhill or the direction of travel. The hips and board rotate beneath them, as in the "rotate upper body, hips and board follow" cue.
  - The body tilts uphill (heelside: backwards, over the heels) by roughly the edge angle relative to the slope normal (see Q2). Knees and hips flex more as pressure rises.
  - At the stop, the rider extends to standing on the heel edge, with the board still across the slope.
  - Do **not** animate a "butt check"/sit-down: coaches flag it as an error. Bent knees with an uphill lean is the correct read of "sitting on the heels".
- **Analog input to edge angle:** more input gives more Ψ, which gives more braking. γ stays about 90° once the rider is across the fall line, so intensity comes from Ψ and pressure, not from a partial pivot. A partial pivot (γ < 90°) mixes braking and turning (F_b ∝ sin γ), which suits light checks.

### Gaps
- No measured snowboard pivot duration (video or IMU) was found. The 0.2–0.3 s figure is a game-design target.
- No AASI/BASI/CASI full text on the "hockey stop" was reachable (thesnowpros.org and issuu blocked). Ed Shred / Shred School did not show up in the results for this topic.

## Q2. Physics: deceleration vs edge angle and slope angle; stopping on 35°; hockey-stop decelerations and stopping distances

### Takeaway
Komissarov's snow-machining model gives a cutting force F_c = N·tanΨ, so μ_eff = tanΨ·sinγ. For a board across the fall line this gives **a = g·cosα·(tanα − tanΨ)**: the rider slows when Ψ > α, holds speed when Ψ = α, and accelerates when Ψ < α.

The paper's hockey-stop examples are a 15° slope at 10 m/s:
- Ψ = 45°: 7.1 m/s², 1.4 s, 7 m.
- Ψ = 60°: 14 m/s², 0.7 s, 3.5 m.

Both reproduce from this formula (6.9 and 13.9 m/s²). A full stop on 35° is therefore physically possible with Ψ clearly above 35°. For example, Ψ = 60° gives 8.3 m/s² and stops a rider from 60 km/h in about 2 s over about 17 m. The cost is a total snow reaction of about 1.6·mg.

### Cited Findings
- **Cutting force and effective friction:** "Fc = N tan Ψ, is similar to Coulomb's law of friction, with the effective kinetic friction coefficient μeff = tan Ψ". The hockey stop is cited as "μeff = 1 for Ψ = 45°". — snippet, [Komissarov 2021, s12283-021-00357-y](https://link.springer.com/article/10.1007/s12283-021-00357-y)
- **Lab fit in the companion paper:** "solid lines correspond to Fc = (tan Ψ + 0.2)N", compared with measured machining forces. The real force may therefore be about 0.2·N higher than tanΨ alone. — snippet, [Komissarov 2021, theory of machining snow and ice, s12283-021-00340-7](https://link.springer.com/article/10.1007/s12283-021-00340-7)
- **Fall-line side-slip (paper text via snippet):** "The component of Eq. (6) along i determines the magnitude of the CM acceleration, a = g cos α (tan α − tan Ψ)… the edge angle allows control of side-slipping." Constant-speed side-slip occurs at Ψ = α, which agrees with the shank orientation seen in practice. — snippet, [Komissarov 2021](https://link.springer.com/article/10.1007/s12283-021-00357-y) / [ResearchGate full text](https://www.researchgate.net/publication/354588146_Mechanics_of_side-slipping_in_alpine_skiing_Braking_and_skidded_traversing). This is now confirmed from the paper itself, not only from the GitHub issue cited in 07b.
- **Hockey-stop examples and their conditions:** "15° slope, 10 m/s":
  - Ψ = 45° gives 7.1 m/s², a 1.4 s stop over 7 m.
  - Ψ = 60° gives 14 m/s², a 0.7 s stop over 3.5 m.
  - The paper calls these plausible but untested experimentally.
  - Braking time T = V₀/a and distance L = V₀²/(2a) are "crude estimates".
  - fetched secondary summary, [GitHub SnowboardAnywhere #98](https://github.com/drewkeriazes/SnowboardAnywhere/issues/98); T/L formulas in a snippet of [Komissarov 2021](https://link.springer.com/article/10.1007/s12283-021-00357-y)
- **The model explains the "abnormal friction" of field skid studies** and "still needs rigorous experimental testing". — snippet, [White Rose 178608](https://eprints.whiterose.ac.uk/178608)
- **Measured stopping performance (on-slope, recreational, 70 runs: 37 snowboarders, 33 skiers):**
  - Mean reaction time is 420 ms, plus 470 ms more before braking actually starts.
  - Snowboarders took "significantly more time to prepare for braking", took longer to stop and "exhibited significantly less deceleration during braking compared to skiers".
  - Numeric m/s² values were not visible.
  - A different listing reports expert reaction times of 856 ms (ski) and 1056 ms (snowboard) at Mammoth. Its relation to the 420 ms figure is unclear.
  - snippets, [Schmitt/Muser et al., PubMed 24444201](https://pubmed.ncbi.nlm.nih.gov/24444201/), [Semantic Scholar](https://www.semanticscholar.org/paper/Investigating-reaction-times-and-stopping-of-skiers-Schmitt-Muser/367d92988442551d0503c381bff7fab678b28333), [ResearchGate 273217718](https://www.researchgate.net/publication/273217718_Reaction_Times_of_Skiers_and_Snowboarders)
- **Gliding (flat-base) friction for comparison:** snowboard kinetic μ ≈ 0.024–0.042 (boardercross boards) and about 0.04 (freestyle). — snippets, [ResearchGate 264942244](https://www.researchgate.net/publication/264942244_Kinetic_Friction_of_Boardercross-snowboards), [ResearchGate 354621408](https://www.researchgate.net/publication/354621408_The_Snow-Friction_of_Freestyle_Skis_and_Snowboards_Predicted_From_Snow_Physical_Quantities)

### Inferences
- **[DERIVATION] The paper's numbers are consistent with the fall-line formula** with α = 15°:
  - Ψ = 45°: g·cos15°·(tan15° − tan45°) = −6.94 m/s², so T = 10/6.94 = 1.44 s and L = 7.2 m.
  - Ψ = 60°: −13.9 m/s², so T = 0.72 s and L = 3.6 m.
  - These match the quoted 7.1 / 1.4 s / 7 m and 14 / 0.7 s / 3.5 m to rounding. The inconsistency noted in 07b-B1, which assumed α = 0, is therefore resolved: the examples are on 15°, not flat.
- **[DERIVATION] Deceleration table** for a board across the fall line, γ = 90°. Values are a in m/s² (negative = braking), from a = g·cosα·(tanα − tanΨ):

  | α \ Ψ | 35° | 40° | 45° | 50° | 55° | 60° | 65° |
  |---|---|---|---|---|---|---|---|
  | 0° | −6.9 | −8.2 | −9.8 | −11.7 | −14.0 | −17.0 | −21.0 |
  | 15° | −4.1 | −5.4 | −6.9 | −8.8 | −11.0 | −13.9 | −17.8 |
  | 25° | −2.1 | −3.3 | −4.7 | −6.4 | −8.6 | −11.3 | −14.9 |
  | 35° | 0.0 | −1.1 | −2.4 | −4.0 | −5.8 | −8.3 | −11.6 |
  | 40° | +1.0 | 0.0 | −1.2 | −2.7 | −4.4 | −6.7 | −9.8 |

- **[DERIVATION] Stopping on a 35° drop-in.** Values are time T and distance L, from V₀ = 10 m/s / 60 km/h / 80 km/h, ignoring pivot time and aero drag:

  | Ψ | decel | 10 m/s | 60 km/h (16.7 m/s) | 80 km/h (22.2 m/s) | total snow force / mg = cosα/cosΨ |
  |---|---|---|---|---|---|
  | 40° | 1.1 | 9.0 s, 45 m | 14.9 s, 124 m | 19.9 s, 221 m | 1.07 |
  | 45° | 2.4 | 4.2 s, 21 m | 6.9 s, 58 m | 9.2 s, 102 m | 1.16 |
  | 50° | 4.0 | 2.5 s, 13 m | 4.2 s, 35 m | 5.6 s, 63 m | 1.27 |
  | 55° | 5.8 | 1.7 s, 9 m | 2.8 s, 24 m | 3.8 s, 42 m | 1.43 |
  | 60° | 8.3 | 1.2 s, 6 m | 2.0 s, 17 m | 2.7 s, 30 m | 1.64 |
  | 65° | 11.6 | 0.9 s, 4 m | 1.4 s, 12 m | 1.9 s, 21 m | 1.94 |

  - The "total snow force" column is the normal force N = mg·cosα combined with the cutting force N·tanΨ, which gives |F| = mg·cosα/cosΨ. **[DERIVATION]**
  - Consequence: on 35° the rider must hold Ψ ≥ about 50° to brake meaningfully, and about 60° for a "hard" stop. The legs then carry about 1.3–1.6 g, which is plausible for a strong rider. Ψ = 65° (about 2 g) is a practical upper bound **[ESTIMATE]**.
  - Once stopped, holding still needs a static edge grip. The paper's Ψ = α equilibrium refers to constant-speed slipping, so a stationary rider on 35° needs Ψ > 35° plus a bite into the snow **[INFERENCE]**.
- **[DERIVATION] Flat-ish park (α = 15°) from 60 km/h:** Ψ = 45° gives 2.4 s and 20 m. Ψ = 60° gives 1.2 s and 10 m.
- **[DERIVATION] Body lean.** For moment balance, the resultant snow force (N, N·tanΨ) must pass through the CM. Its direction is tilted from the slope normal by exactly Ψ, so the body axis leans uphill by about Ψ relative to the slope normal. Equivalently, the body is roughly perpendicular to the board base. This matches the paper's remark about the shanks during constant-speed slipping. For the animation, "pressing harder on the heels" = more Ψ = more uphill lean of the body.
- **[ESTIMATE] Aero drag** at 60 km/h with CdA about 0.5 m², ρ = 1.0–1.2 kg/m³ and a 75 kg rider: about 84 N, or about 1.1 m/s². It is a minor extra term that grows with v², so it helps more at 80 km/h (about 2 m/s²).
- **[ESTIMATE] Game mapping:**
  - Analog input u ∈ [0, 1] maps to Ψ = lerp(Ψ_min, Ψ_max, u), with Ψ_max ≈ 60–65° and Ψ_min = 0, i.e. a flat-based skid with only gliding μ.
  - On slope α, the deceleration across the fall line is g·cosα·(tanΨ − tanα) along velocity, plus drag.
  - Optionally add the companion paper's +0.2 to tanΨ. On 35° this means Ψ = 45° gives about 3.9 m/s² instead of 2.4.
  - For a board that is not perpendicular, use the general form μ_eff = tanΨ·sin γ for the braking component, with the cos γ part turning the rider.

### Gaps
- No **measured** snowboard hockey-stop deceleration was found. The Schmitt et al. study has numbers, but its m/s² values were not visible in snippets.
- No visible information on how Komissarov treats Ψ limits from boot-out, binding angles or snow strength. On soft snow the machining force will saturate, since the edge sinks and plows instead of cutting. That model is not covered.
- The +0.2 offset is from lab machining data on ice and snow. Whether it applies to a snowboard edge (longer and wider) is unknown.

## Q3. High speed (60–80 km/h): can riders stop quickly, chatter, time to stop

### Takeaway
Physically, the same formula gives stops from 60 km/h on a 15° slope in 1.2–2.4 s (Ψ = 60–45°) and on 35° in 2–4 s (Ψ = 60–50°). Coaching sources say high-speed, high-pressure skids tend to **chatter**: the edge skips and bounces. This happens when legs are stiff or the rider pushes against a high edge angle. The fix is absorbing through the joints or reducing the edge angle so the board skids instead of skipping. Real riders therefore usually shed high speed with progressive skidded turns or checks, not one instant 90° slam. I found no data on maximum speeds for hockey stops.

### Cited Findings
- "Chatter is from the underneath of the snowboard gaining too much pressure due to the rider having stiff and straight legs when trying to slow down/stop". The fix is to absorb with ankles, knees and hips. — snippet, [Snowboard Addiction](https://snowboardaddiction.com/blogs/training-education/43777284-pressure-control-through-turns)
- "When the board is trying to slice across the hill on edge and the rider pushes against that edge, the board will chatter." Heelside chatter is managed by reducing the pressure that builds at the bottom of the turn. — snippets, [PSIA-AASI The Snow Pros, What's all the snowboard chatter about?](https://thesnowpros.org/?p=3914); [podcast ep. 96 Heel chatter](https://poddtoppen.se/podcast/1476378937/all-i-really-need-to-know-i-learned-from-snowboarding/96-heel-chatter-causes-tactics-and-how-to-manage-it)
- Ski analogue: "Reduce edge angle in the finishing phase of the turn, so that the skis skid instead of skip." — snippet, [The Snow Pros, How to stop ski chatter](https://thesnowpros.org/?p=2515)
- Heel vibration travels along the board, and poor high-speed edge control is linked to the board's torsional behaviour. — snippet, [MDPI Mechanics 3(3):59](https://www.mdpi.com/2673-3161/3/3/59/htm)
- Speed on steep ground is shed through turn shape and crossing the fall line. A hockey stop needs some momentum to slide. — snippets, [ncstate pressbooks](https://ncstate.pressbooks.pub/skiingandsnowboarding/chapter/turning/); [snowfeetstore](https://www.snowfeetstore.com/blogs/snowfeet_skiskates_skiboards_snowblades_skiblades_mini_skis_short_skis/hockey-stops-on-snow-can-you-do-them-on-skiskates)
- Recreational snowboarders brake less hard and take longer to stop than skiers. — snippet, [PubMed 24444201](https://pubmed.ncbi.nlm.nih.gov/24444201/)

### Inferences
- **[ESTIMATE] Game:**
  - Add a chatter effect (camera/board micro-vibration, edge "skip" audio, slightly noisy deceleration) when Ψ is high and speed is high.
  - A suggested threshold is Ψ > 50° and v > 40 km/h. These thresholds are design choices, not sourced.
  - Optionally cap usable Ψ at high speed so the 80 km/h stop takes about 2–3 s rather than 1.5 s.
  - With pivot (0.25 s) and human reaction (about 0.4–0.9 s from Schmitt et al.) added, a realistic "see obstacle → stopped" from 60 km/h on 15° is about 2–3.5 s.

### Gaps
- No measured stopping times or distances from 60–80 km/h for snowboarders. No source on whether experts perform full 90° hockey stops at those speeds or always pre-scrub with turns.
