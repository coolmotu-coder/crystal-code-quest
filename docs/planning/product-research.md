# The Crystal Adventure — Product Research

Status: research and planning input only. This is not an MVP specification and is not a Superpowers specification.

Research date: 28 July 2026.

## Product vision

The Crystal Adventure is a private, home-network game in which two children make something together. Linus, the Creator, learns an age-appropriate version of AI-assisted software creation: express an intention, inspect a bounded change, try it, improve it, and deliberately publish it. Lucas, the Player, experiences only a coherent adventure and Kindergarten learning interactions. The product succeeds when Lucas enjoys playing something Linus is proud to have made, and Linus can explain what he asked for, what changed, and why the published stage works.

The central loop is:

> Idea → Prompt → Generate → Review → Test → Improve → Publish

“Vibe coding” should mean iterative intent-setting and critical review, not trusting arbitrary generated code. In the MVP, AI changes structured stage data inside engine-owned limits. It does not write or execute game code.

## Users and contexts

### Linus — Creator

- Approximate design level: eight-year-old; exact age and reading ability require parent confirmation.
- Devices: laptop first; iPad supported for all core Creator actions.
- Needs: short language, visible choices, examples, undo, comparison with the prior draft, a safe preview, and a clear distinction between “saved draft” and “published for Lucas.”
- Must learn: prompts communicate intent; specific requests produce more predictable changes; AI can be wrong; validation and testing matter; publishing is a deliberate responsibility.

### Lucas — Player

- Kindergarten learner.
- Device: laptop or iPad browser.
- Needs: large touch targets, minimal reading, spoken instructions where helpful, icons plus text, no free-text answers, no loss of progress for mistakes, and immediate visual feedback.
- Must never see prompts, raw model responses, validation errors, development tools, terminal output, or drafts.

### Parent or carer — Steward

- Chooses approved content, difficulty, privacy/retention settings, model configuration, and whether publishing needs explicit adult approval.
- Can inspect stage history, restore a published version, manage local profiles, and disable AI generation without disabling play.
- Is not expected to administer Kubernetes during ordinary family use.

## Learning goals

### Linus

1. Turn an idea into a concrete request.
2. Add useful constraints such as subject, setting, obstacle, and intended player experience.
3. Recognise the difference between a request, generated result, validation, test, and publication.
4. Review a semantic change summary rather than accept an opaque result.
5. Test a stage from Lucas’s perspective.
6. Improve a prompt in response to observed behaviour.
7. Publish only a working, suitable stage.

### Lucas

The initial content should stay within a parent-approved Foundation/Kindergarten band. Australian Curriculum Version 9 Foundation materials support learning with familiar, multimodal contexts. Foundation Mathematics includes connecting number names and quantities, counting, repeating patterns, comparing objects, and familiar shapes; Foundation Science emphasises observing plants, animals, materials, and movement. English develops phonological awareness, letter–sound relationships, and familiar vocabulary. These are curriculum reference points, not a claim that the game provides formal assessment. See the [ACARA Foundation parent information sheet](https://v9.australiancurriculum.edu.au/content/dam/en/curriculum/ac-version-9/parent-information/AC_Parents-Carers_Information-Sheet_Foundation.pdf), [English overview](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/english), and [Foundation Mathematics work sample and achievement standard](https://www.australiancurriculum.edu.au/resources/work-samples/mathematics/foundation/ws04-lets-pack-a-picnic).

MVP learning interactions should draw from:

- English: uppercase/lowercase matches, initial sounds, picture–word matches, constrained CVC tile assembly, familiar words and names.
- Maths: quantities 1–10 at first, numeral recognition, more/fewer, basic shapes, AB/ABB visual patterns, and concrete picture addition within a parent-approved range.
- Science: observable living/non-living distinctions, basic plant needs, familiar weather, day/night cues, common plants/animals, and simple material classification.

The content system must treat curriculum alignment as metadata reviewed by an adult, not something inferred conclusively by a model.

## Kindergarten experience

### Interaction principles

- Put the learning interaction in the world: count fireflies to lower a bridge, match a letter to open a gate, or identify what a seed needs to grow a vine. Avoid a separate “quiz screen” when an in-world overlay can preserve context.
- Use one short instruction at a time. Pair text with a guide animation, picture, optional narration, and a replay button.
- Use three choices by default and four only when the discrimination is clear.
- Make Player controls visually distinct from answer controls.
- Use large targets. WCAG 2.2 sets a 24 by 24 CSS-pixel minimum and requires a non-drag alternative for dragging interactions; for this young audience the design target should be materially larger, approximately 56 CSS pixels or more with generous spacing. Apple recommends at least 44 by 44 points. See [WCAG 2.2 input modality additions](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) and [Apple’s UI design guidance](https://developer.apple.com/design/tips/).
- Every drag-and-drop action also needs tap-to-select then tap-to-place.
- Do not require precision platforming to reach mandatory learning content. Use forgiving movement, wide platforms, coyote time, buffered jump input, safe respawn, and no lives counter.
- An incorrect answer keeps the learner in place, shows one visual hint, reduces irrelevant choices where appropriate, and permits another attempt.
- Never label Lucas “wrong,” remove a crystal, reset the stage, reduce a score, or make the normal route unavailable.
- Audio starts only after an explicit “Start adventure” gesture because mobile browsers restrict audible autoplay.
- Keep the full mandatory path completable without a Power Question.

### Suggested session shape

1. Select Lucas’s profile.
2. Choose one stable, published stage represented by a large picture card.
3. Hear or see a one-sentence story goal.
4. Explore for roughly 3–7 minutes.
5. Encounter one normal learning interaction integrated with an obstacle or helper.
6. Optionally attempt one Power Question.
7. Reach the crystal and celebrate.
8. Show the cooperative reward and a simple replay/home choice.

## Creator learning progression

The Creator interface should progressively remove scaffolding while keeping the same underlying generate–review–test cycle.

| Level | Linus’s action | Product scaffold | Evidence of learning |
|---|---|---|---|
| 1. Choose | Pick one of three visual ideas | Three short cards, each with subject, place, and goal | Can state which idea he chose |
| 2. Customise | Change 1–3 safe attributes | Chips for environment, creature, obstacle, question type | Sees choices reflected in the draft |
| 3. Complete | Fill blanks in a prompt | “Make a ___ stage where Lucas ___.” | Supplies concrete nouns/actions |
| 4. Answer | Answer guided questions | One question at a time: who, where, learning goal, reward | Understands prompt ingredients |
| 5. Write | Compose his own prompt | Examples and optional checklist, not forced sentence starters | Expresses a bounded intent |
| 6. Review | Inspect the proposed changes | Before/after cards for story, layout, question, power path | Can identify at least one change |
| 7. Test | Play in Preview Mode | Creator-only watermark and checklist | Completes mandatory route and checks controls |
| 8. Improve | Revise the prompt or a safe field | “What should be different?” reflection suggestions | Connects observed issue to revised request |
| 9. Publish | Send a validated version to Lucas | Publish checklist and optional parent gate | Distinguishes draft from published |

Progression is mastery-gated but reversible. Linus may always return to more scaffolding. A parent can unlock a level; the application should not infer readiness solely from usage counts.

### Language for an eight-year-old

- Prefer verbs and concrete outcomes: “Add,” “Move,” “Choose,” “Test,” “Fix,” and “Share.”
- Use “The stage needs a fix” rather than model/schema terminology.
- Keep prompts and explanations to one idea per sentence.
- Translate validation messages into actionable cards, for example: “The rock blocks the only path. Move it or add another path.”
- Preserve an expandable adult/developer detail view in Parent Mode, not Creator Mode.
- Never present model confidence as truth.

### Review and testing

The review screen should be semantic, not a raw JSON diff:

- “Story changed from … to …”
- “Forest changed to cave.”
- “The counting question now uses 7 fireflies.”
- “A bonus path and heavy rock were added.”
- “No game rules or approved answers changed.”

Each change is labelled as requested, engine-adjusted for safety, or not applied. Linus can accept the draft, ask for another change, or discard it. Undo returns to the prior draft version.

Preview Mode uses the real Player engine with a prominent Creator-only banner. A short checklist asks:

- Can Lucas reach the normal question?
- Can the normal route be completed?
- Is the instruction easy to understand?
- Does the hint help?
- If Super Strength is earned, does it break only one rock?
- Does the crystal celebration appear?

Publishing is unavailable until automated validation passes. Whether a parent must also approve every publication is an unresolved product decision.

## Cooperative reward design

Rewards should recognise complementary contributions, never compare the children or reward first-try correctness.

### Creator Star

Award one Creator Star when Linus publishes a validated stage after previewing it and completing the publish checklist. Do not award extra stars for generating many discarded drafts or using more model calls. The star represents care and iteration, not output volume.

### Player Star

Award one Player Star when Lucas completes a published stage. Attempts, hints, use of the normal route, and skipping the Power Question do not reduce it. Replay gives celebration and practice but does not farm additional stars for the same published version.

### Team Star

Award one Team Star to the pair when both conditions occur for the same immutable stage version: Linus earned its Creator Star and Lucas later earned its Player Star. Present it as “You made and completed this adventure together.”

### Reward rules

- Stars are milestones, not currency or a leaderboard.
- No streaks, public rankings, time pressure, sibling comparison, or loss mechanics.
- The Power Question may unlock a bonus-path animation or collectible, but not a better Player Star.
- A new published version can earn a new Team Star only if it contains a meaningful, validated change; define the exact rule before implementation to prevent version spam.

## Story structure

Use a simple three-crystal arc:

1. **English Crystal — Forest and bridge:** sounds, letters, or familiar words help repair a path.
2. **Maths Crystal — Cave:** counting, shapes, patterns, or picture addition illuminates a route.
3. **Science Crystal — Castle garden:** observations about plants, animals, weather, materials, or day/night restore the final crystal.

The order should be parent-configurable, even if the default is English → Maths → Science. Each stage is independently replayable. Collecting all three restores the Crystal Castle and plays a team celebration. Story text and environment can vary within approved asset and content sets; the crystal identities and cooperative finale remain engine-owned.

## Power Question mechanic

The first MVP power is Super Strength.

- It is explicitly optional and only slightly above Lucas’s configured normal difficulty.
- The Power Question appears naturally, such as a guide offering a glowing challenge before a fork.
- A correct answer activates Super Strength for one eligible obstacle.
- The player receives a visible power badge and short, non-blocking animation.
- Contact or an explicit smash button consumes the power on exactly one heavy rock.
- That rock opens a bonus path; the normal path always remains open.
- An incorrect answer does not consume progress or close a route. It produces a visual hint and permits another attempt.
- After a parent-configurable small number of attempts, default 2, offer “Try again” and “Take the normal path.” Never force repeated attempts.
- Leaving or restarting the stage clears an unused temporary power unless the product later explicitly defines resume semantics.
- The bonus path can contain delight or a non-competitive collectible, never mandatory curriculum content or a stronger completion reward.

## Keeping learning inside the adventure

Each question should be triggered by and act upon an in-world object:

- Count visible objects to create the same number of bridge planks.
- Choose an initial sound to call the matching animal helper.
- Select what a plant needs so a vine grows into a platform.
- Complete a visual pattern to light cave crystals.

The overlay should retain the background scene, guide character, and world consequence. A question is complete only when its deterministic rule evaluates the answer and the associated world action finishes. This lets the game feel causal rather than like travel interrupted by a worksheet.

## Recommended MVP product scope

### In scope

- Local, private family profiles for Linus, Lucas, and a parent role.
- One reusable side-view platform-adventure engine with forest, bridge, cave, and castle/garden visual variants.
- One Lucas character with idle, walk, jump, and celebration animations.
- One guide, one breakable heavy rock, crystals, a normal route, and a bonus route.
- Large keyboard and touch controls.
- One approved, playable stage in each subject by the end of MVP delivery.
- Approved, deterministic question templates with picture, choice, number-tile, letter-tile, and accessible tap alternatives.
- Creator scaffolding from three ideas through independent prompting.
- Local-model idea suggestions, structured stage generation, and child-friendly change explanation.
- Schema, semantic, content, asset, reachability, and publication validation.
- Draft preview, immutable published versions, rollback, and stable Player listing.
- Creator Star, Player Star, and Team Star.
- SQLite persistence, local backup/restore, Parent Mode, container packaging, Kind deployment, and private home-Wi-Fi access.

### Explicit non-goals

- A final formal specification in this planning package.
- AI-generated executable code, runtime code patches, arbitrary scripts, shaders, URLs, assets, or Kubernetes changes.
- Browser access to the raw model endpoint.
- OpenRouter or silent cloud fallback.
- Internet accounts, remote multiplayer, public sharing, app-store packaging, chat, social features, leaderboards, purchases, ads, or telemetry.
- Free-text answers for Lucas.
- A general-purpose level editor or full Tiled workflow.
- Separate preview/production clusters, namespaces, or per-stage deployments.
- Container rebuilds for stage publication.
- Speech recognition, camera, microphone, location, or biometric data.
- Formal educational assessment or replacement of a teacher.
- Hermes, Jarvis, code-server, or a terminal as game runtime dependencies.

## Assumptions to validate with the family

- Linus can read short instructions and type a short prompt with help.
- Lucas can recognise the chosen symbols/pictures and use tap controls.
- The family is comfortable using first names or pseudonyms stored locally.
- The MacBook remains awake while other devices play.
- All devices share a trusted private Wi-Fi network.
- A suitable local model and OpenAI-compatible endpoint can respond with adequate structured output on the available Mac hardware.
- One concurrent Creator generation and a small number of Player sessions are sufficient.
- English is the initial interface language.
- Parent-selected question packs are pedagogically reviewed before use.
- Landscape orientation is acceptable for Player Mode on iPad.

## Questions requiring parent approval

1. What are Linus’s and Lucas’s actual reading, motor, attention, and curriculum needs?
2. Which exact Foundation/Kindergarten curriculum or school programme should content align with?
3. Which names, likenesses, voices, and family-specific words may be stored or sent to the local model?
4. Must every publication receive a parent PIN approval, or only first publication/new content categories?
5. May Linus edit question topic and template parameters, or only story and layout?
6. Which approved asset pack and asset licences are acceptable, including attribution obligations?
7. Which local model runtime/model will be used, and may it download updates or models from the internet?
8. How long should prompt history, attempts, and progress be retained?
9. Should Power Question attempt counts be visible to the parent, stored only in aggregate, or not retained?
10. Is local HTTP on trusted Wi-Fi acceptable for MVP, or is locally trusted HTTPS required before iPad use?
11. Should audio narration use recorded family audio, synthetic audio prepared offline, or text only?
12. What is the maximum Player session length and desired movement difficulty?
13. May a meaningful revised published version earn another Team Star, and what counts as meaningful?
14. Does Parent Mode need a PIN in the MVP, and how should PIN recovery work?

## Product research references

- [Australian Curriculum V9 — English](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/english)
- [Australian Curriculum V9 — Mathematics](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/mathematics)
- [Australian Curriculum V9 — Science](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/science)
- [ACARA Foundation information for parents and carers](https://v9.australiancurriculum.edu.au/content/dam/en/curriculum/ac-version-9/parent-information/AC_Parents-Carers_Information-Sheet_Foundation.pdf)
- [W3C WCAG 2.2: dragging and target size](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Apple: UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)
- [OAIC: children and young people](https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/children-and-young-people)
- [OAIC: Children’s Online Privacy Code work](https://www.oaic.gov.au/privacy/privacy-for-kids/privacy-for-kids-childrens-online-privacy-code)

