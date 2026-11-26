# Catalogue of real snowboard landing outcomes (stomped → slam) for game modelling

> **Access note (important).** This session was heavily limited:
> - Every WebFetch failed with DNS block (en.wikipedia.org, www.burton.com). No full text was read.
> - Search then hit a hard usage limit after 4 queries.
>
> Everything below comes from **search-engine snippets** (as summarised by the search tool) or from sources already cited in the earlier project note `docs/research/12-note-landing_outcomes.md`. Those are marked **[prev. note]** and not re-explained.
>
> Planned queries on Snowboard Addiction, Whitelines, Red Bull, injury mechanisms and Shaun White / Amped / Steep / Riders Republic / Tony Hawk were **not run**. They are listed under Gaps. Inferences are marked **[INFERENCE]** and design guesses **[ESTIMATE]**.

## Q1. For each outcome: trigger conditions, visual, recovery or fall direction, frequency

### Takeaway
Real landings form a graded ladder:
1. Stomped
2. Sketchy, skid or scrub
3. Hand drag
4. Two hands down or heavy hand
5. Revert from instability
6. Butt check
7. Full body contact or fall (washout, edge catch, slam)

The triggers come from a small set of variables: yaw or rotation error at touchdown, edge vs flat base, fore-aft balance (nose or tail first), and landing location (knuckle, flat or table vs slope).

An edge that **slides out** (washout) is the opposite of an edge that **digs in** (edge catch):
- A washout drops the rider onto the uphill side, usually sitting or hip.
- An edge catch throws the rider violently over the downhill edge: toe edge sends them face-first, heel edge sends them backward.

Only one study gives frequency data: about 21% of park jumps end in a fall, and most falls go backward, toward the tail and heel edge [prev. note].

### Cited Findings

**Stomped / clean**
- "Stomped" means a trick landed cleanly, "usually without falter or wobble". Another glossary says "to perfectly execute and land a trick". The Bend Bulletin lingo list gives "bolts" as a synonym — [Montec mag snowboard slang](https://www.montecwear.com/mag/snowboard-slang/); [Air Kayaks glossary](https://www.airkayaks.com/snowboarding-terms/); [Bend Bulletin lingo](https://bendbulletin.com/?p=714094) (snippets)
- The judging ideal is to land "with full control, with the trick already completed (no reverts, no hand drags)" — [LEX18 Snowboarding 101](https://www.lex18.com/news/snowboarding-101-scoring) [prev. note]
- Good technique, from coaching sources [prev. note]:
  - Land base-flat, then roll onto the edge you want.
  - Spot the landing at about 270° of a 360.
  - Legs extend slightly before contact and flex on impact.
  - Sources: [abom.com](https://abom.com/how-to-jump-on-a-snowboard/); [snowboardbible](https://snowboardbible.com/list-of-snowboarding-tricks/)
- Board pitch at touchdown in 704 observed NZ park jumps: tail-first 57%, flat 32%, nose-first 11%. Tail-first is considered favourable — [SPONET, McAlpine et al. 2008](https://sponet.de/sponet/Record/3042548?lng=en) [prev. note]

**Sketchy / loose / skid-out ("slide it out", "scrub")**
- "Sketchy" is defined inconsistently. Montec: unsafe or "close to crashing". Air Kayaks: "looks or feels unsafe, unstable, or poorly executed". Bend Bulletin: "almost stomping a trick, but not quite", with "loose" as a synonym — [Montec](https://www.montecwear.com/mag/snowboard-slang/); [Air Kayaks](https://www.airkayaks.com/snowboarding-terms/); [Bend Bulletin](https://bendbulletin.com/?p=714094) (snippets; sources conflict on severity)
- No source found defining "scrub" or "slide it out" as landing slang. The search returned no definition (see Gaps).

**Hand drag (one hand touches)**
- FIS 2019/20 lists the hand drag as a *small* landing mistake, 1–9 points out of 100. The spring-2022 update calls "extended hand drags" a *medium* mistake — [FIS handbook 2019/20 (FSUK copy)](https://www.freestylesnowsports.co.uk/+documents/Judge%20Training/FIS%20Judges%20Manual.pdf) [prev. note]; [FIS SB/FK Judges Handbook update spring 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf) (snippet)
- The only "hand drag" definition found came from a wakeskate glossary: "touch the water, don't do it if you are landing something and claiming it as legit". This is the same convention by analogy, not a snowboard source — [Alliance Wake glossary](https://alliancewake.com/skate/ultimate-wakeskate-glossary/) (snippet)

**Two hands down / heavy hand**
- FIS 2019/20 lists two hands down as a *medium* mistake, 10–19 points. The spring-2022 update lists "heavy hand" and "light touch-downs" as medium, 6–15 points (garbled snippet) — [FIS 2019/20](https://www.freestylesnowsports.co.uk/+documents/Judge%20Training/FIS%20Judges%20Manual.pdf); [FIS spring 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf) [prev. note]

**Revert (instability revert vs intentional revert)**
- The World Snowboard Federation glossary defines a landing revert as "landing and immediately sliding/pivoting to correct direction" and lists it as a deduction — [WSF glossary](https://www.worldsnowboardfederation.org/glossary/) (snippet)
- The FIS handbook, per the search summary, describes a revert as a landing where the board slides to realign. FIS 2019/20 classes "reversing the trick due to instability" as medium, 10–19 points — [FIS spring 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf) (snippet); [FIS 2019/20](https://www.freestylesnowsports.co.uk/+documents/Judge%20Training/FIS%20Judges%20Manual.pdf)
- A different, neutral meaning exists. Canada Snowboard, REI and Burton use "revert" for switching between regular and switch while the board stays on the ground, as a trick in its own right. A game should separate an *intentional* revert from an *instability* revert — [Canada Snowboard terms](https://www.canadasnowboard.ca/en/about/snowboarding/); [REI glossary](https://www.rei.com/learn/expert-advice/snowboarding-glossary.html); [Burton glossary](https://www.burton.com/discover/s/article/snowboarding-terms) (snippets)
- Snowboard Addiction says backside 360s often land with a revert or washout. The causes it gives are takeoff edge, hip position and head movement — [Snowboard Addiction blog](https://snowboardaddiction.com/blogs/training-education/why-your-backside-360-isn-t-working-live-coaching) [prev. note, snippet]

**Butt check (sit-down and bounce up)**
- WSF defines the butt check as "landing and briefly sitting/bouncing off the snow" and lists it as a deduction. The FIS handbook snippet describes it as "momentarily sits on the snow and bounces back up" and classes it as a **major** deduction — [WSF glossary](https://www.worldsnowboardfederation.org/glossary/); [FIS spring 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf) (snippets)
- Whitelines advises that fighting a shaky landing can lead to a harder edge catch later, so it is sometimes better to let the butt check happen — [Whitelines ultimate guide to slams](https://whitelines.com/archive/features/ultimate-guide-snowboard-slams.html) [prev. note, snippet]

**Washout (the edge slides out)**
- Washout is the opposite of an edge catch: the edge slides instead of gripping. Rocker boards feel "washed out" because the rider can pivot on the centre of the board — [The Manual, snowboard profiles](https://themanual.com/outdoors/snowboard-profiles-explained) (snippet)
- Anecdotal (r/snowboarding):
  - Changing edge angle during touchdown, or too much back-foot pressure, causes a washout.
  - The advice is to commit to one edge.
  - Source: [r/snowboarding via redlib](https://redlib.ssps.io/r/snowboarding/comments/1hx48ja/what_am_i_doing_wrong_lol/m67kibz/?context=3) [prev. note]

**Edge catch → slam**
- An edge digs in and converts forward speed into rotation, so the impact is "sudden and violent". A toe-edge catch sends the rider forward, face-first. A heel-edge catch sends the rider backward — [Science Insights](https://scienceinsights.org/what-is-catching-an-edge-in-snowboarding/) (snippet)
- Fall technique, by direction [same source, snippet]:
  - Falling backward: tuck the chin, round the back.
  - Falling forward: make fists and land on the forearms rather than the palms.
- Detuning edges lowers the chance of a catch but does not prevent it — [Burton detune](https://www.burton.com/blogs/the-burton-blog/detune-snowboard) (snippet)

**Under- and over-rotation, landing "on the side"**
- The rule that the trick must be completed before landing means under-rotation is a fault — [LEX18](https://www.lex18.com/news/snowboarding-101-scoring) [prev. note]
- Spins raise fall risk compared with straight airs, and "incorrect board positioning at landing" significantly predicts falls — [Kurpiers et al., Injury 2017](https://pubmed.ncbi.nlm.nih.gov/28865874/) [prev. note]
- Landing on an edge while still rotating throws the spin off-axis and often ends on the back — [snowboardingforum](https://www.snowboardingforum.com/threads/landing-a-jump.35099/) [prev. note, anecdotal]

**Nose-first / face plant; tail / backseat**
- Nose-first touchdown predicts falls, with OR 4.01 (95% CI 2.26–7.11). A typical fall goes toward the tail and heel edge, with the trailing hand touching first. 51% of falls are posterior — [McAlpine PhD 2010](https://researchspace.auckland.ac.nz/handle/2292/6655); [SPONET](https://sponet.de/sponet/Record/3042548?lng=en) [prev. note]
- Backward falls after a failed landing are a leading cause of spinal fractures — [PMC7223356](https://pmc.ncbi.nlm.nih.gov/articles/PMC7223356/) [prev. note]

**Knuckle / flat / table (location errors)**
- Landing on the flat or the knuckle significantly predicts falling. Of observed landings, 35% hit the knuckle and 20% the flat top — [Kurpiers 2017](https://pubmed.ncbi.nlm.nih.gov/28865874/); [SPONET](https://sponet.de/sponet/Record/3042548?lng=en) [prev. note]
- Landing just past the knuckle can cause an inverting pitch of about 60°. Overshooting onto flat ground gives a very high EFH (equivalent fall height, the impact severity) — [Levy et al. 2015](https://link.springer.com/article/10.1007/s12283-015-0182-6) [prev. note]

**Chatter**
- PSIA-AASI (The Snow Pros) has a "Cause-and-Effect Correction" article on snowboard chatter. It was found in search, but its content was not retrieved — [thesnowpros.org](https://thesnowpros.org/?p=3914)

### Inferences
- **[INFERENCE]** Severity ladder (outcome → typical trigger → visual → recovery):
  1. **Stomped.**
     - Trigger: yaw error near 0 (mod 180°), base flat, landing on the slope, mild tail-first pitch.
     - Visual: deep knee flex, upper body quiet.
     - Recovery: rides away.
  2. **Sketchy / skid.**
     - Trigger: moderate yaw or small residual spin.
     - Visual: board skids sideways for a moment, arms flail.
     - Recovery: rider stays up and loses speed.
  3. **Hand drag.**
     - Trigger: same as sketchy, plus the CoM low or back.
     - Visual: trailing hand brushes the snow.
     - Recovery: rides away.
  4. **Two hands / heavy hand.**
     - Trigger: larger lean or yaw error.
     - Visual: torso drops toward the snow on one side.
     - Recovery: pushes back up.
  5. **Instability revert.**
     - Trigger: residual spin with the board near 90° or a little short of 180°.
     - Visual: rider lets the board keep pivoting to the nearest stable direction.
     - Recovery: rides away, regular or switch.
  6. **Butt check.**
     - Trigger: backseat or heel-side lean, or high EFH.
     - Visual: butt touches the snow and bounces.
     - Recovery: rides away.
  7. **Washout.**
     - Trigger: edged landing with too little grip, or an edge change at contact.
     - Visual: board slides out and rider lands on hip or butt on the uphill side.
     - Recovery: usually stops; the rider may slide.
  8. **Edge catch → slam.**
     - Trigger: downhill edge gripping while lateral velocity is still present.
     - Visual: violent whip over that edge, face-first on the toe edge, backward (head snap) on the heel edge.
     - Recovery: run ends.
  9. **Nose-dive / knuckle.**
     - Trigger: nose-down pitch, landing short.
     - Visual: forward pitch, possibly a tumble.
     - Recovery: run ends.
  10. **Flat / overshoot.**
      - Trigger: high EFH.
      - Visual: compressed into the snow, often a butt check or fall.
      - Recovery: depends on EFH.
- **[INFERENCE]** Washout vs edge catch has the same upstream cause, a sideways velocity component at touchdown. Which one happens depends on whether the loaded edge is the **trailing** one (it slides, so washout to the uphill side) or the **leading/downhill** one (it digs, so catch and throw). This fits the project's anisotropic friction model:
  - Lateral friction saturating → washout.
  - The edge biting while the CoM keeps moving → tipping moment → catch.
- **[INFERENCE]** Most falls are posterior (51%, mostly to the tail and heel). If a game has no other cue for fall direction, it should default ambiguous failures to a heel-side, backward fall.

### Gaps
- No source gives the relative frequency of each *rideable* outcome (hand drag vs butt check vs revert). The only data is the total fall rate (about 21%) [prev. note].
- "Scrub" or "slide it out" as landing slang was not confirmed by any source found.
- "Losing a ski" has no snowboard equivalent in any source. The closest would be a binding failure or a foot ejected, and nothing was found on it.
- Chatter on landing: the PSIA article was found but not read.
- Tomahawk, scorpion, yard sale and other slam slang: the query was blocked by the search limit.
- Whitelines, Red Bull, Transworld and injury-mechanism detail for each fall type were not retrieved this session.

## Q2. Which outcomes are "rideable" and which end the run; how judges classify them

### Takeaway
The judging line runs at body contact:
- Hand touches (one hand) and wobbles are minor.
- Two hands, heavy hand or instability revert are medium.
- Butt check, body contact and fall are major.

The labels are rideable (all minor and medium, plus the butt check, which bounces back) versus run-ending (falls, edge catches, slams, inverted landings).

### Cited Findings
- FIS 2019/20 bands, out of 100 [prev. note] — [FIS 2019/20](https://www.freestylesnowsports.co.uk/+documents/Judge%20Training/FIS%20Judges%20Manual.pdf):
  - Small, 1–9: hand drag, small hand touch.
  - Medium, 10–19: two hands down, reversing due to instability.
  - Major, 20–29: body contact with the snow.
- FIS spring 2022 update (garbled snippet):
  - Small, 1–9: hand drags.
  - Medium, 6–15: reverts, light touch-downs, heavy hand.
  - Major, 16–20: hard touch-downs, falls.
  - The handbook text also classes the butt check as major and "extended hand drags" as medium.
  - Source: [FIS spring 2022](https://assets.fis-ski.com/f/252177/7c81eac52f/fis_sb_fk-judgeshandbook_update_spring-2022.pdf) (snippets; this conflicts in part with the 2019/20 bands)
- WSF glossary lists the butt check and the landing revert as deductions — [WSF glossary](https://www.worldsnowboardfederation.org/glossary/) (snippet)
- Older 10-point scale (2016/17): 0.1–0.9 minor, 1.0–1.9 medium, 2.0–2.9 major — [FIS manual 2016/17](https://www.apul.cz/media/uploads/sekce_snowboarding/dokumenty/fis_judges_manual_snowboard.pdf) [prev. note]

### Inferences
- **[ESTIMATE]** Proposed game mapping:

  | Game label | Deduction | Run continues? |
  |---|---|---|
  | Pulito (clean) | 0 | yes |
  | Incerto (wobble) | −3 | yes |
  | Mano a terra | −5 to −9 | yes |
  | Due mani / Revert | −10 to −15 | yes, speed loss |
  | Butt check | −20 | yes, larger speed loss and brief control lock |
  | Caduta: washout / spigolo / testa avanti | trick void, ragdoll | no |

### Gaps
- Official current (2023+) band values could not be read (the FIS PDF host was blocked here and in the previous session).

## Q3. How video games represent landing quality and bails; what players find fair or fun

### Takeaway
Little new was found. SSX ties landings to reward and risk:
- A landed trick banks boost and points.
- A bail resets the multiplier "back to zero".

Reviewers of SSX (2012) disagree about whether landings are too forgiving or too strict. Earlier findings: Steep and Riders Republic offer landing-assist modes, and Shredders is criticised for outcomes that feel random [prev. note]. No commercial game documents its angle tolerances.

### Cited Findings
- SSX series: "landing a trick meant higher rewards, bailing meant you ended up back to zero" — [Operation Sports on SSX 3](https://www.operationsports.com/ssx-3-the-open-world-pivot-that-made-snowboarding-sims-soar/) (snippet)
- SSX Tricky: tricks fill the boost meter. The speedrun knowledge base notes you cannot lose the "Tricky" state while actively tricking — [SDA KB SSX (2012)](https://kb.speeddemosarchive.com/SSX_(2012)) (snippet; the page concerns the 2012 game)
- SSX (2012) review: you can release a grab and straighten "a fraction of a second before hitting the snow", which makes aerial tricks easy. This is an implicit short auto-correction or landing window — [GamesRadar SSX review](https://www.gamesradar.com/ssx-review) (snippet; attribution among the results uncertain)
- Other SSX (2012) reviewers say the timing has "a steep learning curve" in judging how much fits in the air, or that the system is "too forgiving". Player opinion conflicts — [VideoGamer](https://www.videogamer.com/reviews/ssx-review); [Giant Bomb user review](https://www.giantbomb.com/ssx/3030-33393/user-reviews/2200-22249/) (snippets)
- Steep: landing-surface angle matters most, flat ground rarely gives a clean landing, and there is a default option blocking unlandable tricks — [Twinfinite](https://twinfinite.net/guides/steep-how-to-land/) [prev. note]
- Riders Republic has Manual (perfect-landing bonus), Auto and Steep-style landing modes — [Gamepur](https://gamepur.com/?p=246506) [prev. note]
- Shredders: outcomes "left to chance". After a bail there is no get-up, only rewind or reset — [GameGrin](https://www.gamegrin.com/reviews/shredders-review/); [PixelDie](https://pixeldie.com/2022/03/30/shredders-review) [prev. note]
- skate. players ask for more forgiving landings on big tricks — [EA forums](https://forums.ea.com/discussions/skate-en/please-more-forgiving-ways-to-land-big-tricks/12727259)

### Inferences
- **[INFERENCE]** The pattern across games:
  - A last-moment "straighten up" input acts as a forgiveness window.
  - A bail costs the combo or multiplier, not just time.
  - Optional assist modes satisfy both casual and sim players.
  - Opaque or random outcomes are what players call unfair (Shredders).

  For this project, where the player never steers, the landing outcome should come visibly from quantities the player controls (pop timing, charge, speed check). A visible graded result (FIS-style label) helps the outcome feel deserved.

### Gaps
- Nothing retrieved on Shaun White Snowboarding, Amped, Snowboard Kids, Tony Hawk (balance and bail model), or Riders Republic / Steep dev interviews. The search limit was reached before these queries.
- No GDC talks or dev blogs on landing tolerance windows were found.
