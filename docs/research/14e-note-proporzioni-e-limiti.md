# Proporzioni, centro di massa e limiti articolari per un rider articolato (IK + molle smorzate)

> **Note on method and reliability (read first).** In this session WebSearch worked but WebFetch was blocked for almost every host (theorangeduck.com, wiki.has-motion.com, nbviewer.jupyter.org, ebm.ufabc.edu.br, physio-pedia.com, shura.shu.ac.uk). Fetching them needs those hosts allowed in the session's network settings. So no primary table was read in full. Each value below is tagged:
> - **[S]** confirmed by a search-result snippet from the cited source;
> - **[T]** a standard textbook value I am reproducing from my own knowledge of the cited book or paper. It agrees with the snippets where they overlap, but I did not read the original table in this session, so check it before treating it as authoritative;
> - **ESTIMATE**: my own derivation or design suggestion.
>
> H = standing height, M = body mass. Positions are in metres if H is in metres.

---

## 1. Segment-length fractions (Drillis & Contini 1966, as reproduced in Winter)

### Takeaway
The Drillis & Contini figure from Winter's book is the standard set of length ratios for a rig built from H alone. For a game rig, use the *joint heights* (ankle 0.039H, knee 0.285H, hip 0.530H, shoulder 0.818H) as the primary data and derive the segment lengths from them, so the chain closes exactly.

### Cited Findings
- The Drillis & Contini (1966, New York University) model estimates segment lengths from stature and is the most widely used model of its kind. Winter (2005) presents it. — [CNB2025 abstract](https://cnb2025.tecnico.ulisboa.pt/prog_cnb2025_web/abstracts_cnb225/ID_387_794_Resumo%20CNB2025%20-%20Drillis%20%20Contini_Final.pdf); [ISBS proceedings](https://ojs.ub.uni-konstanz.de/cpa/article/view/292/249) [S]
- A Human Kinetics lab manual has a figure titled "Body segment lengths expressed as a fraction of body height H", adapted from Drillis & Contini. — [Human Kinetics excerpt](https://us.humankinetics.com/blogs/excerpt/anthropometry-measurements-lab-activity) [S]
- The ratios are average segment/stature ratios. The landmarks behind each ratio are not always clear: for example, the thigh is measured from the greater trochanter to the knee joint cleft. — [Penn State OpenLab, proportionality constants](https://www.openlab.psu.edu/2018/02/05/proportionality-constants) [S]
- The original report allows deviations of up to about 2 cm. The ratios fit children poorly, under-predicting arm and forearm length and over-predicting shoulder width. — [CNB2025 abstract](https://cnb2025.tecnico.ulisboa.pt/prog_cnb2025_web/abstracts_cnb225/ID_387_794_Resumo%20CNB2025%20-%20Drillis%20%20Contini_Final.pdf); [lida.sport-iat.de record](https://lida.sport-iat.de/twm/Record/3040184?lng=en) [S]

**Table 1: Drillis & Contini fractions (Winter, Fig. 4.1) [T]**

| Quantity | Fraction of H | For H = 1.75 m | Notes |
|---|---|---|---|
| Ankle height (floor to lateral malleolus) = "foot height" | 0.039 | 0.068 m | |
| Knee height | 0.285 | 0.499 m | |
| Hip height (greater trochanter) | 0.530 | 0.928 m | The hip joint centre sits about 0.01H lower and more medial (ESTIMATE) |
| Shoulder height (acromion) | 0.818 | 1.432 m | |
| Chin height | 0.870 | 1.523 m | |
| Eye height | 0.936 | 1.638 m | |
| Elbow height (arm hanging) | 0.630 | 1.103 m | |
| Wrist height (arm hanging) | 0.485 | 0.849 m | |
| Fingertip height (arm hanging) | 0.377 | 0.660 m | |
| **Shank** (knee to ankle) | 0.246 | 0.431 m | 0.285 − 0.039 |
| **Thigh** (hip to knee) | 0.245 | 0.429 m | 0.530 − 0.285 |
| **Upper arm** (shoulder to elbow) | 0.186 | 0.326 m | |
| **Forearm** (elbow to wrist) | 0.146 | 0.256 m | |
| **Hand** (wrist to fingertip) | 0.108 | 0.189 m | |
| **Head** (chin to vertex) | 0.130 | 0.228 m | |
| **Neck** (shoulder line to chin) | 0.052 | 0.091 m | 0.870 − 0.818 |
| **Trunk** (hip to shoulder) | 0.288 | 0.504 m | 0.818 − 0.530 |
| Shoulder width (bi-acromial) | 0.259 | 0.453 m | |
| Hip width (bi-trochanteric) | 0.191 | 0.334 m | |
| Foot length | 0.152 | 0.266 m | |
| Foot width | 0.055 | 0.096 m | |

**Table 1b: Derived rig dimensions (ESTIMATE)**

| Rig quantity | Fraction of H | Derivation |
|---|---|---|
| Distance between hip joint centres | ≈0.10 | The joint centres sit inside the trochanters. Commonly ~0.17–0.18 m in adults. ESTIMATE |
| Distance between shoulder joint centres | ≈0.20 | Bi-acromial width (0.259H) minus about 0.03H on each side. ESTIMATE |
| Pelvis bone (hip-centre midpoint to L5/S1) | ≈0.06 | Splits the trunk into pelvis plus spine. ESTIMATE |
| Spine chain (L5 to C7) | ≈0.23 | 0.288 − 0.06. Use 2–3 bones (lumbar, thoracic, upper thoracic). ESTIMATE |
| Neck bone (C7 to head pivot, roughly C1) | ≈0.05 | |

### Inferences
- The two leg segments are almost equal (thigh 0.245H, shank 0.246H). A symmetric two-bone IK with l1 = l2 ≈ 0.245H is a good approximation, and it simplifies the law-of-cosines step.
- Arm reach from the shoulder is 0.186 + 0.146 = 0.332H to the wrist and 0.44H to the fingertips. That matters for grabs: in a tuck (crouch) the hand has to reach the board edge, which sits about 0.039H below the ankle.

### Gaps
- I could not open Winter's Fig. 4.1 itself. The numbers above are the well-known values and should be checked against the book (Winter, 4th ed., ch. 4).

---

## 2. Segment masses and centres of mass (Dempster/Winter; de Leva 1996)

### Takeaway
Use de Leva (1996) for the mass fractions and CoM positions, because it gives separate male and female values and refers to joint centres. Winter/Dempster is a valid alternative and simpler to apply. Standing whole-body CoM ≈ **0.55H** (about 0.554H in men and 0.551H in women in a small measured sample).

### Cited Findings
- de Leva, "Adjustments to Zatsiorsky-Seluyanov's segment inertia parameters", J Biomech 29(9):1223–1230 (1996). It gives mass, CoM position and radii of gyration for college-age Caucasian men and women, with endpoints moved from bony landmarks to joint centres. — [search on de Leva](https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf) [S]
- de Leva mass fractions, male: head 0.0694, trunk 0.4346, thigh 0.1416, shank 0.0433, foot 0.0137. Head CoM, male: 0.5002 of segment length. — [Visual3D wiki (snippet)](https://wiki.has-motion.com/Adjusted_Zatsiorsky-Seluyanov%27s_segment_inertia_parameters) [S]
- Dempster-based mass fractions: foot 0.0145, leg 0.0465, thigh 0.1000, head-neck 0.0810. Thigh CoM at 0.433 from proximal (GTR–KJC). — [Marcos Duarte BMC notebook](https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/BodySegmentParameters.ipynb); [Visual3D Segment Mass](https://wiki.has-motion.com/Segment_Mass) [S]
- Thigh 0.100 and CoM 0.433 are used as the Winter (1979) reference in a validation paper. — [Kent KAR document](https://kar.kent.ac.uk/id/document/972636) [S]
- Other tables (Plagenhoef 1983, Clauser) give thighs of 0.105–0.1175, so the values depend on the source. — [PMC9602786 table](https://pmc.ncbi.nlm.nih.gov/articles/PMC9602786/table/healthcare-10-02054-t004) [S]
- Measured standing CoM height: women 91.2/165.5 cm, men 99.2/179.2 cm (n = 11 and 13). That is about 0.551H and 0.554H (my division). — [PMC8343014 table](https://pmc.ncbi.nlm.nih.gov/articles/PMC8343014/table/T2) [S]

**Table 2a: Winter / Dempster (one set for both sexes) [T, partly S]**

| Segment | Mass fraction of M | CoM from proximal (fraction of length) | Endpoints |
|---|---|---|---|
| Hand | 0.006 | 0.506 | wrist to knuckle II of the middle finger |
| Forearm | 0.016 | 0.430 | elbow to wrist |
| Upper arm | 0.028 | 0.436 | shoulder to elbow |
| Foot | 0.0145 [S] | 0.50 | ankle to metatarsal II head |
| Shank (leg) | 0.0465 [S] | 0.433 | knee to ankle |
| Thigh | 0.100 [S] | 0.433 [S] | hip to knee |
| Head + neck | 0.081 [S] | 1.000 (from C7–T1 to the ear, i.e. CoM about at the ear) | |
| Trunk | 0.497 | 0.50 | greater trochanter to glenohumeral joint |
| HAT (head + arms + trunk) | 0.678 | 0.626 from hip | |

Check: 2·(0.006+0.016+0.028+0.0145+0.0465+0.100) + 0.081 + 0.497 = 1.000.

**Table 2b: de Leva 1996, male (H 1.741 m, M 73.0 kg) and female (H 1.735 m, M 61.9 kg) [T; head, trunk, thigh, shank and foot masses for men are S]**

| Segment | Mass M ♂ | Mass M ♀ | CoM % from proximal ♂ | CoM % from proximal ♀ | Endpoints (proximal → distal) |
|---|---|---|---|---|---|
| Head (+neck) | 6.94 % | 6.68 % | 50.02 % [S] | 48.41 % | vertex → C7 (cervicale) |
| Trunk | 43.46 % | 42.57 % | 51.38 % | 49.64 % | C7 → hip-centre midpoint |
| Upper arm | 2.71 % | 2.55 % | 57.72 % | 57.54 % | shoulder → elbow |
| Forearm | 1.62 % | 1.38 % | 45.74 % | 45.59 % | elbow → wrist |
| Hand | 0.61 % | 0.56 % | 79.00 % | 74.74 % | wrist → 3rd metacarpal |
| Thigh | 14.16 % | 14.78 % | 40.95 % | 36.12 % | hip → knee |
| Shank | 4.33 % | 4.81 % | 44.59 % | 44.16 % | knee → ankle (lateral malleolus) |
| Foot | 1.37 % | 1.29 % | 44.15 % | 40.14 % | heel → toe tip |

Note: de Leva's head CoM figure depends on the endpoint convention; it is about 59.8 % if measured from the vertex to the gonion midpoint. Check Table 4 of the paper.

**Table 2c: Whole-body CoM height**

| Posture | CoM height | Source |
|---|---|---|
| Standing, men | ≈0.554H | [PMC8343014](https://pmc.ncbi.nlm.nih.gov/articles/PMC8343014/table/T2) [S, derived] |
| Standing, women | ≈0.551H | same |
| Rider in an athletic stance (knees about 40–60° flexed) | ≈0.45–0.50H above the board | ESTIMATE, from the segment model above |
| Tuck/grab (hips about 90°, knees about 100°) | ≈0.30–0.35H | ESTIMATE |

### Inferences
- For the code: compute the CoM as a weighted sum of the segment CoMs from Table 2a or 2b each frame, then check that the pose keeps it above the board (ankles and inserts). In the air, the CoM is the point the rig has to rotate around. Spin and flip pivot on it, not on the pelvis.
- For the "realistic" low-poly model: the thighs carry about 28 % of the mass, so lowering the pelvis moves the CoM more than moving the arms does. This matches the pose-dependent inertia I(pose) in `src/physics/spin.ts`.

### Gaps
- de Leva's Table 4 was not opened (host blocked). The female values and the upper-limb CoMs are from memory [T].

---

## 3. Active range-of-motion limits (AAOS, Norkin & White)

### Takeaway
The AAOS and Norkin & White values agree to within about 10°, except for hip extension (AAOS 30° vs 10–20° elsewhere), thoracolumbar rotation (AAOS 45° vs about 30°) and elbow flexion (150° vs 140°). For a game, take the AAOS value as the hard limit and add a soft limit at about 80 % of it, where the spring stiffness rises.

### Cited Findings
- Ankle: dorsiflexion 0–20°, plantar flexion 0–50° (neutral = 0). Other charts give DF 30 / PF 20–40 because they use other conventions. — [PMC9218764 table](https://pmc.ncbi.nlm.nih.gov/articles/PMC9218764/table/T1); [WikEM joint ROM](https://wikem.org/wiki/Joint_ROM_(Table)) [S]
- Hip, extended: internal rotation 40°, external rotation 50° (common chart). — [SNCC ROM table](https://www.sncc.ca/resources/Documents/Dragon%20Boat/2024%20CCWCs/range%20of%20motion%20normal%20values.pdf) [S]
- Cervical rotation 80°, cervical lateral flexion 45°, thoracolumbar rotation 30°, lateral flexion 25° (Physio-pedia). The AAOS-style chart gives thoracolumbar rotation 45° and lateral flexion 35°. — [Physio-pedia](https://www.physio-pedia.com/Range_of_Motion_Normative_Values); [Brainscape flashcards (weak source)](https://www.brainscape.com/flashcards/normative-range-of-motion-values-19149980/packs/22938770) [S]
- Shoulder abduction 180° (consistent across sources). Elbow flexion 140° (SNCC) vs 150°. CDC measured about 145–150°. — [SNCC](https://www.sncc.ca/resources/Documents/Dragon%20Boat/2024%20CCWCs/range%20of%20motion%20normal%20values.pdf); [CDC Joint ROM Study](https://archive.cdc.gov/www_cdc_gov/ncbddd/jointrom/index.html) [S]
- Norkin & White, *Measurement of Joint Motion*, has an appendix of average ranges of motion. — [Schweitzer catalogue](https://www.schweitzer-online.de/en/buch/Norkin/Measurement-Joint-Motion/9780803609723/A28313829/) [S]
- The CDC published normative ranges by age and sex from 674 subjects. — [CDC Joint ROM](https://archive.cdc.gov/www_cdc_gov/ncbddd/jointrom/index.html) [S]

**Table 3: ROM limits for the rig (degrees; 0 = anatomical neutral standing pose)**

| Joint / movement | AAOS | Norkin & White / others | **Value for the code** | Status |
|---|---|---|---|---|
| Ankle dorsiflexion | 20 | 20 | 20 (barefoot); see §4 for the boot | S |
| Ankle plantar flexion | 50 | 50 | 50 (barefoot); in a boot, about 0 relative to the highback | S |
| Knee flexion | 135 | 135–140 | 140 (passive in a deep crouch: 150) | T |
| Knee extension | 0 | 0 | 0 (hyperextension 0–5) | T |
| Hip flexion | 120 | 120 | 120 (125 with the knee flexed) | T |
| Hip extension | 30 | 10–20 | 15 | T |
| Hip abduction | 45 | 40–45 | 40 | T |
| Hip adduction | 30 | 20–30 | 25 | T |
| Hip internal rotation | 45 | 40–45 | 40 | S (40) |
| Hip external rotation | 45 | 45–50 | 45 | S (50) |
| Thoracolumbar flexion | 80 | 60–80 | 80, spread over 2–3 spine bones | T |
| Thoracolumbar extension | 25 | 20–30 | 25 | T |
| Thoracolumbar rotation (each side) | 45 | 30 | 40 | S (conflict) |
| Thoracolumbar lateral bend | 35 | 25 | 30 | S (conflict) |
| Cervical rotation (each side) | 80 | 80 | 75 (keep 5° in reserve for the soft limit) | S |
| Cervical flexion / extension | 45 / 45 | 45 / 45 | 45 / 45 | S |
| Cervical lateral bend | 45 | 45 | 40 | S |
| Shoulder flexion | 180 | 180 | 170 (the last 10–20° need help from the scapula) | T/S |
| Shoulder extension | 60 | 50–60 | 55 | T |
| Shoulder abduction | 180 | 180 | 170 | S |
| Shoulder internal / external rotation | 70 / 90 | 70 / 90 | 70 / 90 | T |
| Elbow flexion | 150 | 140–150 | 145 | S (conflict) |
| Forearm pronation / supination | 80 / 80 | 80 / 80 | 80 / 80 | T |
| Wrist flexion / extension | 80 / 70 | 80 / 70 | 70 / 60 | T |

### Inferences
- In-air rotation (spin) uses about 40° of trunk rotation plus about 75° of neck rotation. The head can "look ahead" up to about 115° relative to the pelvis, which is why riders look over their shoulder before a 180. This is a real limit to clamp in the procedural pose (ESTIMATE).
- For the **knee**, a single hinge with [0°, 140°] is enough. For the **hip**, a swing-twist decomposition with a swing cone (flexion −15…120°, abduction −25…40°) and twist limited to ±40–45° works well.

### Gaps
- I did not read the AAOS (Greene & Heckman 1994) or Norkin & White tables directly. The values marked T come from my knowledge of those books.

---

## 4. Snowboard boots and bindings: how much the ankle moves

### Takeaway
Inside a soft boot the ankle moves mainly in dorsiflexion. The highback sets the **minimum shin angle**: the shin cannot go behind the forward-lean setting. Highback forward lean is **0–22°** depending on the model, typically 5–15°. Practical model: shank angle relative to the board normal ∈ [forward lean, forward lean + about 15–20°] (ESTIMATE).

### Cited Findings
- Burton measures lean as the angle between the board and the highback: 90° = neutral, below 90° = positive lean. Suggested settings: about 75–85° on groomed runs (= 5–15° of forward lean) and 85–90° in heavy or powder snow. — [Burton blog](https://www.burton.com/blogs/the-burton-blog/how-to-adjust-snowboard-bindings) [S]
- K2 Clicker X HB: forward lean adjustable 0–7°. Bent Metal: presets of 10, 14, 18 and 22°. — [K2](https://k2snow.com/it-it/p/clicker-x-hb-men-s-snowboard-bindings-2026); [Buckman's, Bent Metal](https://buckmans.com/product/35113/bent-metal-joint-bindings-mens) [S]
- Field measurements in soft boots and step-in boots: the two ankles rotate asymmetrically, mostly in **dorsiflexion, eversion and external rotation**. — [uOttawa thesis](https://ruor.uottawa.ca/items/5828b166-f717-4d15-852d-df6a06afa0e0) [S]
- On a splitboard, the boot model significantly changes ankle ROM. The highback lean setting does not significantly change ankle or knee ROM. — [Montana State thesis](https://scholarworks.montana.edu/items/cb3ded2c-ba50-4d27-a3a1-bf7cdc959b1b) [S]
- In landings, subtalar inversion is 14° in new boots vs 18° in boots one season old (back foot). — [ISBS proceedings](https://ojs.ub.uni-konstanz.de/cpa/article/view/3775/3495) [S]
- Patents describe the highback pivot as sitting below the ankle's dorsiflexion axis, so it is not ideally positioned across the whole lean range. — [USPTO 6382641](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/6382641) [S]

**Table 4: Ankle model in the boot (ESTIMATE, except where noted)**

| Parameter | Value | Note |
|---|---|---|
| Highback forward lean (default freestyle setting) | 8–12° | Range 0–22° [S]; park/freestyle riders often use low lean |
| Minimum dorsiflexion (shin against the highback) | = forward lean | Hard limit: the highback blocks it |
| Maximum dorsiflexion in a soft boot | ≈ forward lean + 15–20° → 25–35° total | Limited by the boot's stiffness (flex) and the barefoot 20° plus the soft tissue of the boot. ESTIMATE |
| Ankle inversion/eversion in the boot | ±10–15° | Order of magnitude from the 14–18° subtalar values [S] |
| Ankle internal/external rotation | ±5° | ESTIMATE; foot locked by the straps |
| Spring stiffness at the boot limit | high, not infinite | Lets the knee "fold" into the boot on landing |

### Inferences
- In IK the foot is **rigidly fixed to the board** at the binding angles (e.g. +15/−15 duck). The ankle only has to absorb the knee and hip angles inside the window in Table 4. If IK asks for more, move the pelvis (lower or shift it), never the foot.
- The highback is why a rider can lean back on the heel edge without falling. In the rig, a lean behind the forward-lean angle has to be transmitted to the board as edge angle, not as ankle rotation. This is consistent with "the edge is a parameter" in CLAUDE.md.

### Gaps
- No study gives a numeric ankle dorsiflexion ROM in a soft boot as a function of forward lean. The full Ottawa and Montana State texts could not be opened.

---

## 5. Two-bone IK, joint limits and molle per il pose blending

### Takeaway
Use analytic two-bone IK (law of cosines plus a pole vector) for the legs and arms, clamping the target distance to [|l1−l2|+ε, (l1+l2)·0.999] and the hinge angle to the ROM in Table 3. Blend poses with Holden's **critically damped springs** parametrised by **halflife**. The exact formula depends on dt only through exponentials, so it stays stable and deterministic at STEP = 1/120 s.

### Cited Findings
- Method: from the bone-length triangle (law of cosines) compute the middle joint, use the pole vector to define the bending plane, rotate the root towards that point, then the middle joint towards the target. Without a pole vector the bending plane is arbitrary and flips when the chain crosses its axis. — [WitShells TwoBoneIKSolver](https://sulaiman281.github.io/Reusable-Unity-Scripts-Packages/api/WitShells.WitPose.Editor.Core.TwoBoneIKSolver.html) [S]
- Maya's ik2Bsolver uses a rotate-plane, with the bending plane defined by the pole vector projected onto the chain. — [Autodesk Maya SDK](https://help.autodesk.com/cloudhelp/2022/CHS/Maya-SDK/cpp_ref/ik2_bsolver_2ik2_bsolver_8cpp-example.html) [S]
- Unreal Control Rig TwoBoneIK takes root, effector, pole vector, optional bone lengths and stretch. — [Unreal FRigUnit_TwoBoneIKSimple](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/ControlRig/FRigUnit_TwoBoneIKSimple) [S]
- Holden: the exponential damper is `lerp(x, goal, 1 − 2^(−dt/halflife))`. Changing the decay rate is equivalent to scaling dt. — [Spring-It-On, theorangeduck](https://theorangeduck.com/page/spring-roll-call) [S, snippet]
- Holden: halflife → damping `d = 4·ln2 / halflife`, and in the critically damped spring `y = d/2`. Critically damped springs are the main building block of his code-driven displacement model, with 3 parameters per mode. — [Fitting Code Driven Displacement](https://theorangeduck.com/page/fitting-code-driven-displacement) [S]
- Critical damping returns to equilibrium in the shortest time without oscillating. — [Wikipedia, Damping](https://www.wikipedia.org/wiki/Damping) [S]
- Unreal also has a ready-made `FCriticalDamper` (GameplayCameras). — [Epic docs](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayCameras/FCriticalDamper) [S]

**Two-bone IK pseudocode (ESTIMATE, a standard implementation)**
```
// root A, mid B, end C; target T; lengths l1=|AB|, l2=|BC|; pole P
d   = clamp(|T−A|, |l1−l2|+1e-4, (l1+l2)*0.999)    // avoid a locked straight limb / NaN
cosK = (l1² + l2² − d²) / (2 l1 l2)                  // interior angle at the knee/elbow
kneeFlex = π − acos(clamp(cosK,−1,1))                // 0 = straight limb
kneeFlex = clamp(kneeFlex, ROM_min, ROM_max)         // Table 3; if clamped, recompute d
cosA = (l1² + d² − l2²) / (2 l1 d)                   // angle at the hip/shoulder
n    = normalize(cross(T−A, P−A))                    // normal of the bending plane
B    = A + rotate(normalize(T−A), axis=n, angle=acos(cosA)) * l1
```
- After the hinge clamp the end no longer reaches T. For the legs, *move the pelvis* (lowering it by Δ) until it does, rather than accepting a gap at the foot.
- Knee pole: in front of the knee, along the direction of the board's nose and toes. Elbow pole: behind and outwards. Interpolate the pole too (with a spring), otherwise the knee "snaps" during switch/revert.

**Critically damped spring, exact form (Holden), per scalar or per angle component**
```
y  = (4·ln2 / halflife) / 2          // = 2·ln2/halflife ≈ 1.386/halflife
j0 = x − goal
j1 = v + j0·y
e  = exp(−y·dt)
x  = goal + (j0 + j1·dt)·e
v  = (v − j1·y·dt)·e
```
For quaternions, apply the same formula to the log of the delta rotation (scaled-angle-axis). Holden covers this in the same article (not verified here).

**Table 5: Halflife values suggested for the rider (ESTIMATE, from game-animation practice; no source with numbers found)**

| Channel | Halflife | Why |
|---|---|---|
| Pelvis height / crouch (speed check, charge) | 0.08–0.12 s | Has to follow the input in about 2–3 frames at 60 fps |
| Knee/hip via IK target | 0.04–0.06 s | Absorb terrain without lag |
| Trunk (lean into a turn, counter-rotation) | 0.12–0.20 s | A small delay reads as "weight" |
| Head / gaze | 0.15–0.25 s | Lags behind the trunk: secondary animation |
| Arms (balance, free arms) | 0.10–0.20 s; or an underdamped spring with ζ ≈ 0.6–0.8 | A small overshoot makes them look alive |
| Grab (hand to edge) | 0.06–0.10 s | Has to look intentional and quick |
| Landing (knee compression) | Overdamped hit: impulse on v, then halflife 0.15 s | Proportional to the impact speed from `landing.ts` |

Rule of thumb (ESTIMATE): after 1 halflife, 50 % of the distance remains; after 3 halflives, 12.5 %; after 4, about 6 %. A halflife of 0.1 s therefore "settles" in about 0.3–0.4 s.

### Inferences
- The closed form above is exact for any dt and contains no integration. At a fixed 1/120 s it is deterministic, consistent with rule 3 of the project. It belongs in `src/physics` or in a three-free module if it drives anything physical. If it is visual only, it can live in `src/render`, but it should still run on the fixed step.
- Apply the ROM clamps **after** the spring, on the target rather than the state: clamp the spring's goal to the ROM, and add a final hard clamp to avoid overshoot outside the limit.

### Gaps
- theorangeduck.com was blocked: I only saw search snippets of "Spring-It-On", not the full text. I found no GDC talk with recommended halflife numbers; Table 5 is all ESTIMATE.

---

## 6. Height and mass of elite snowboarders (big air / slopestyle)

### Takeaway
Elite freestyle snowboarders are of medium height and lean. Men are about **172–180 cm** and **65–75 kg**; women are about **160–168 cm** and **55–62 kg** (ESTIMATE from the data below). Recommended rider defaults: **H = 1.76 m, M = 70 kg (♂); H = 1.65 m, M = 59 kg (♀)**.

### Cited Findings
- Mark McMorris (slopestyle/big air, three Olympic bronzes): 5'11", 159 lb ≈ 180 cm, 72 kg. — [ESPN Olympics profile](https://africa.espn.com/olympics/winter/2018/athletes/_/athlete/50854); [Olympedia](https://www.olympedia.org/athletes/127529) [S]
- Female freestyle snowboard and freeski athletes (Europa Cup and World Cup): 165.3 ± 2.8 cm, 60.43 ± 2.9 kg. — [Jyväskylä thesis](https://jyx.jyu.fi/bitstreams/3be756ee-041c-434b-8bd4-a4f5632f01c5/download) [S]
- Vernillo et al. 2018 (review): mean height of elite snowboarders 165.7–183.4 cm across studies. Snowboard cross men about 181 cm and 77 kg. Canadian SBX men about 86 kg, women about 64 kg. The authors note a lack of comprehensive anthropometric data. — [Frontiers in Physiology 2018](https://www.frontiersin.org/articles/10.3389/fphys.2018.00770/full) [S]
- Sands et al. (2021): 834 tests on 234 US National Team athletes, comparing disciplines. Discipline-level results were not visible. — [SHURA PDF](https://shura.shu.ac.uk/31319/1/Body%20Size%20and%20Composition%20US%20National%20Team%20Skiers%20and%20Snowboarders.pdf) [S]

**Table 6: Rider data**

| Profile | H (m) | M (kg) | Source |
|---|---|---|---|
| McMorris (real) | 1.80 | 72 | ESPN [S] |
| Freestyle women, mean | 1.653 | 60.4 | Jyväskylä [S] |
| Snowboard cross men (not freestyle, heavier) | 1.81 | 77–86 | Vernillo [S] |
| **Game default ♂** | 1.76 | 70 | ESTIMATE |
| **Game default ♀** | 1.65 | 59 | ESTIMATE |

### Inferences
- With H = 1.76 m: knee at 0.50 m, hip at 0.93 m, shoulder at 1.44 m, standing CoM at about 0.97 m. Thigh mass 0.10–0.14·70 = 7–10 kg per leg.
- Big air and slopestyle favour lighter athletes than snowboard cross (less inertia, higher ω = L/I). This is consistent with the spin model.

### Gaps
- I found no reliable height/mass data for Su Yiming, Kokomo Murase or Zoi Sadowski-Synnott. The Sands et al. 2021 table by discipline could not be read.

---

## 7. Cartoon / low-poly conventions for small screens

### Takeaway
No source gives numeric proportions. The consensus in practitioner sources is that the silhouette and large shapes (head, hands, feet, board) matter more than detail on small screens. Proposal (ESTIMATE): keep the **realistic** joint lengths (Table 1) for the IK and physics, and exaggerate only the **visual volumes**: head ×1.2–1.35, hands ×1.3–1.5, boots ×1.2, shoulder width ×1.1. The rider comes out at about 6–6.5 heads tall instead of 7.5.

### Cited Findings
- Stylized games put readability first and exaggerate proportions and silhouettes. Silhouette matters most for small models or ones seen at a distance. — [RocketBrush style guide](https://rocketbrush.com/blog/the-ultimate-character-art-style-guide-for-artists-and-developers) [S]
- On mobile, large shapes read better than fine detail is lost. Merging fingers is suggested to save joints. — [Polycount thread](https://polycount.com/discussion/comment/2142480) [S]
- The character has to be recognisable on a small screen. — [inkl, mobile 3D characters](https://www.inkl.com/news/how-to-build-quality-3d-characters-within-the-constraints-of-mobile-game-fidelity) [S]
- Contrast helps readability at small sizes (anecdotal). — [PixelJoint forum](https://pixeljoint.com/forum/forum_posts.asp?TID=26937) [S]
- Oversized hands are only justified if the whole body is stylized consistently. — [GameDev.net](https://ehe.gamedev.net/tutorials/game-design/game-design-and-theory/how-do-you-avoid-mistakes-at-the-initial-stage-of-drawing-characters-r5743) [S]
- The Alibaba "product insights" articles on exaggerated proportions are unsourced opinion and should not be used. — [example](https://www.alibaba.com/product-insights/why-do-video-game-characters-have-exaggerated-proportions-art-style-or-tech-limits.html) [S, low quality]

**Table 7: Visual exaggeration for the rider (ESTIMATE)**

| Element | Real | Cartoon proposal | Reason |
|---|---|---|---|
| Head (height) | 0.130H (≈7.7 heads) | 0.155–0.17H (≈6–6.5 heads); helmet included | Shows facing direction and spin orientation |
| Hands / gloves | 0.108H long | ×1.3–1.5 in volume, a "mitten" with no fingers | Grabs readable; fewer polygons |
| Boots | foot 0.152H | ×1.2 in volume | Anchor point on the board |
| Board | real (about 0.85–0.9H long) | ×1.0–1.1, contrasting colour | The most important element for reading rotations |
| Shoulders | 0.259H | ×1.1 (puffy jacket) | Trunk rotation readable |
| Limbs | real | slightly thicker (puffy clothing) | They must not "disappear" while moving |
| Joint lengths for IK/physics | Table 1 | **unchanged** | Mesh and collider from the same data (rule 7) |

### Inferences
- Exaggerating only the volumes keeps the CoM and inertia physically correct. The physics uses Tables 2a/2b, not the mesh. The inertia I(pose) does not change.
- A low-poly budget for phones (ESTIMATE): about 600–1500 triangles for the rider, 15–20 bones (pelvis, 3 spine, neck, head, 2×(upper arm, forearm, hand), 2×(thigh, shank, foot)), with flat shading using `flat(color)`.

### Gaps
- No authoritative source (GDC or a studio style guide) with numeric head/body ratios was found.
