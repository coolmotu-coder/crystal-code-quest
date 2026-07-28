“This planning package is input for Claude’s Superpowers specification-writing workflow. It is research and planning material, not the final authoritative specification.”

# Claude handoff — The Crystal Adventure

Research date: 28 July 2026.

Use this handoff with:

- `product-research.md` for product rationale, child experience, and approval questions;
- `technical-research.md` for verified facts, technology/licence evaluation, and sources;
- `architecture-plan.md` for contracts, data flow, persistence, deployment, and risk register;
- `delivery-plan.md` for ordered, one-card implementation phases.

Do not turn this planning package itself into the final specification. The formal specification should resolve or explicitly surface the approval decisions below.

## Product summary

The Crystal Adventure is a local, collaborative educational platform game for two children. Linus creates bounded stages and learns an AI-assisted iteration loop:

> Idea → Prompt → Generate → Review → Test → Improve → Publish

Lucas, a Kindergarten learner, plays only stable published stages to collect English, Maths, and Science Crystals. He never sees prompts, development tools, drafts, model errors, or terminal output. A parent stewards approved content, difficulty, privacy, publication, model settings, history, and backup.

The product goal is cooperation: Linus is proud that Lucas can enjoy a working stage, Lucas experiences learning as part of an adventure, and both are recognised for completing the create/play loop.

## Agreed product direction

- “Vibe coding” in MVP means expressing intent, reviewing structured changes, testing, and publishing responsibly. It does not mean accepting arbitrary generated code.
- Creator scaffolding progresses from three visual ideas → safe customisation → prompt blanks → guided questions → independent prompt → semantic review → preview → improvement → publish.
- Linus may return to more scaffolded modes; parent override/readiness policy remains.
- Lucas has large controls, pictures, short instructions, 3–4 choices, letter/number tiles, tap alternatives to drag, clear hints, and no free-text answers.
- Learning questions cause world actions and retain the scene context rather than appearing as disconnected tests.
- Incorrect answers do not remove progress, rewards, routes, or attempts. No lives, score penalty, leaderboard, competition, or first-try bonus.
- The normal route is always completable without a Power Question.
- AI is an optional Creator dependency; Player Mode and all published stages work while the model is unavailable.

## Recommended MVP scope

Include:

- local profiles/roles for Linus, Lucas, and parent;
- responsive React application and one reusable Phaser side-view adventure engine;
- laptop keyboard and iPad touch controls;
- one Lucas character with idle/walk/jump/celebration, one guide, one heavy rock, three crystals;
- forest/bridge, cave, and castle/garden environment templates;
- one parent-approved deterministic stage each for English, Maths, and Science;
- normal question plus optional Power Question;
- Super Strength lasting for exactly one eligible rock and opening only a bonus path;
- approved question templates and content packs;
- Creator scaffold, local-model ideas/stage generation/change explanation;
- structural and semantic validation;
- draft, preview, immutable publication, history, rollback;
- Creator, Player, and Team Stars;
- SQLite persistence/backup/restore and Parent Mode;
- OCI packaging with Podman, one-replica Kind deployment, private home-Wi-Fi/iPad access.

## Explicit non-goals

- AI-generated or executed code, patches, scripts, HTML, shaders, URLs, assets, dependencies, or infrastructure.
- Direct browser-to-model calls.
- OpenRouter or any silent cloud fallback.
- Internet accounts, public sharing/hosting, remote multiplayer, social/chat, ads, telemetry, purchases, leaderboard, currency, or app-store packaging.
- Free-text answers for Lucas.
- A general-purpose level editor, Tiled workflow, Phaser Editor, or per-stage container build.
- Separate preview/production Kubernetes deployments or namespaces.
- PostgreSQL, Redis, multiple backend replicas, or an ingress controller without demonstrated need.
- Speech recognition, camera, microphone, location, biometrics, formal assessment, or teacher replacement.
- Hermes, Jarvis, code-server, Kubernetes credentials, or terminal access at runtime.

## Recommended architecture

Use a modular monolith:

```text
Laptop/iPad browser
  └─ React routes and accessible overlays
      └─ Phaser AdventureScene for world/physics
           │ same-origin /api
One Fastify backend
  ├─ role/profile boundary
  ├─ stage/version/preview/publication service
  ├─ Zod + semantic validation
  ├─ deterministic question engine
  ├─ progress/reward service
  ├─ provider-neutral model gateway
  └─ SQLite repositories, audit, backup/health
           │ backend-only
OpenAI-compatible local model on Mac host
```

React owns navigation, Creator/Parent forms, review cards, and accessible question/reward overlays. Phaser owns rendering, scene lifecycle, player physics, collisions, camera, and world consequences. Connect them through a small typed event bridge; do not mirror the whole game in React.

Fastify is the system authority. Browser validation is for usability only. The backend validates every candidate, derives question truth, controls publication, stores progress, and mediates the model.

Use fixed engine behaviour plus data-driven stages. Prove a fixed Maths stage first, then extract the schema/interpreter. Use code-defined environment templates with named safe slots and a pre-proven route graph. Defer Tiled until bespoke human-authored maps are demonstrably needed.

## Selected technologies

| Technology | Decision and role |
|---|---|
| TypeScript (Apache-2.0) | Required across browser/backend/contracts, strict mode |
| React (MIT) | Required for modes, forms, review, and accessible overlays |
| Phaser 3 (MIT) | Required for 2D scenes, Arcade Physics, input, animation, scale |
| Vite (MIT) | Required browser build/dev tooling |
| Node.js (MIT plus bundled notices) | Required backend/build runtime; choose maintained LTS at implementation |
| Fastify (MIT) | Required single backend and production static serving |
| Zod (MIT) | Required developer-owned runtime contract and JSON Schema emission |
| SQLite (public domain) | Required one-household persistence |
| Vitest (MIT) | Required unit/component tests |
| Playwright (Apache-2.0) | Required browser E2E; WebKit signal plus physical iPad gate |
| Git (GPL-2.0) | Required development tool, not runtime |
| Podman (Apache-2.0) | Required at packaging phase; early development may run directly |
| Kind/Kubernetes (Apache-2.0) | Required local delivery target only, not daily product dependency |
| Krita (GPL-3.0) | Optional preferred original-art/general editor |
| LibreSprite (GPL-2.0) | Optional pixel-sprite editor |
| Audacity (GPL-2.0 per official manual) | Optional after audio plan approval |

Pin exact versions, base image digest, model ID, prompt versions, content-pack versions, and schema versions during implementation, after device/runtime compatibility tests.

## Rejected or deferred technologies

- **Tiled:** deferred. Phaser supports its JSON, but a second map format/workflow and arbitrary layouts undermine the smallest bounded MVP. Later it may author fixed engine templates; the model should not author raw Tiled maps.
- **code-server:** rejected for runtime/children; it exposes files and terminal-like development power.
- **Phaser Editor:** not needed; the framework is open source but the separate editor has different commercial packaging and adds a workflow.
- **PostgreSQL/Redis:** rejected absent multi-household or concurrency evidence.
- **Ingress/Gateway controller:** rejected for one HTTP service; NodePort plus Kind port mapping is simpler.
- **Separate deployments/namespaces for preview:** rejected; access-controlled immutable records provide real separation.
- **Per-stage rebuilds:** rejected; stages are validated records interpreted by a fixed engine.
- **OpenRouter/cloud:** deferred; adds internet, credentials, cost, privacy, and automatic provider fallback behaviour. If later evaluated, require explicit parent opt-in and visible provider/cost/data policy; never activate silently.
- **Controlled code patches:** deferred into a separate future sandbox/review learning design.

## Major design decisions

1. Model output is untrusted candidate data, never executable code.
2. Zod structure validation is necessary but not sufficient; catalogue, content, geometry, reachability, question, power, and publication validators follow.
3. The question engine, not the model, determines answer correctness and hints from approved templates/values.
4. Engine constants control physics, collision, rewards, completion, power duration, and security.
5. Normal route reachability is a publish invariant; Super Strength affects one optional rock only.
6. Draft/published separation is data and authorisation, not separate infrastructure.
7. Published versions are immutable; a stage points to one current published version; rollback changes the pointer atomically.
8. One backend replica is required while using SQLite/local PV.
9. One public same-origin app reduces CORS, routing, and exposure.
10. Player Mode has a separate safe response projection and remains model-independent.
11. Placeholders validate mechanics first; later use one licence-cleared pack or a minimal original asset set with an asset register.
12. Local HTTP may be acceptable only on trusted home Wi-Fi with parent acknowledgement and no required secure-context APIs; otherwise make local HTTPS a separate requirement.

## Stage-schema recommendation

The versioned `StageDefinition` should contain:

- server-managed `schemaVersion`, `stageId`, version/hash metadata outside or alongside content;
- bounded title and story intro/goal/completion;
- subject;
- allowlisted environment template, palette, and decoration IDs;
- player spawn/goal slot IDs;
- allowlisted platforms and obstacles placed in named template slots;
- normal question: encounter slot, approved template ID, approved parameters, 3/4 backend-canonical answer choices, backend-canonical hint sequence/policy, normal world reward ID;
- optional Power Question: encounter/template/parameters, backend-canonical answer choices and hints, fixed `super_strength`, fixed one-eligible-obstacle duration, target rock, optional bonus-path ID, skip-after-attempts;
- optional bonus path with safe entrance/exit slots and non-competitive bonus;
- engine-owned completion kind and crystal;
- Kindergarten metadata: Foundation band, bounded level, skill tags, quantity cap, reading support, approved content-pack version.

Prefer slot IDs over arbitrary coordinates. The conceptual validated definition contains answer choices and hints, but the model-facing candidate omits them; the backend injects them deterministically from the approved template/content-pack version. Never store model-authored authoritative choices, correct answers, or hints.

### Ownership

- **Linus:** bounded story/title, approved subject/theme/environment and question topic/template choices, safe customisation, prompt.
- **Model may propose:** those same allowlisted fields and safe slots/parameters.
- **Engine/backend:** IDs/hashes/timestamps/status, physics, route graph, spawn safety, answer derivation, hints, power rules, completion, rewards, publication, roles.
- **Parent approval:** content packs, difficulty band, asset pack, publication policy, names/data, cloud use later.
- **Never model-controlled:** correct truth, executable behaviour/code, URLs/file paths/assets outside catalogue, HTML/Markdown, physics constants, arbitrary collision geometry, power duration, mandatory route, reward amounts, IDs/version/status, authentication, database/network/model configuration.

Validation order: transport → exact Zod structure → catalogue → question canonicalisation → content/Kindergarten limits → geometry → normal-route reachability → power invariants → completion/reward → exact-version publication policy.

## Kindergarten-content recommendation

Use controlled templates populated only with approved values. This is safer than fully generated questions and more useful than a finite fixed bank alone.

Initial templates may include:

- count objects 1–10;
- recognise numeral;
- compare collections;
- case match;
- initial-sound picture;
- approved CVC letter tiles;
- living/non-living;
- plant needs;
- AB/ABB visual pattern.

Each versioned content-pack template needs deterministic prompt/choices/answer, distractor uniqueness, ordered visual hints, alt text and approved visual assets, curriculum/difficulty tags, instruction limits, attempt/skip rules, and review record. A model may select/propose template/parameters but may not certify correctness or Kindergarten suitability.

Incorrect answers retain progress, show a visual hint, and allow retry. Dragging has tap-to-select/place. Colour is not the only cue. Power questions use a separately approved small stretch and always permit the normal route.

## AI integration recommendation

Use an internal `ModelProvider` with:

- health/capabilities;
- generate(task, messages, output schema, limits, abort signal);
- an initial OpenAI-compatible Chat Completions adapter;
- backend-only base URL, model ID, optional credential, timeout, token/output limits, structured-output mode, concurrency 1, fallback `none`.

Flow:

1. Validate/rate-limit Creator intent.
2. Build a versioned task-specific prompt from sanitised fields and approved catalogues.
3. Request non-streaming, low-variance structured output.
4. Enforce deadline/cancel.
5. Deterministically extract and parse JSON.
6. Zod plus all semantic validators.
7. Permit one repair request only, then validate from the beginning.
8. Save a new immutable draft only if valid; never mutate prior state.
9. Compute the semantic diff in application code; the model may simplify it but cannot invent changes.
10. Record safe metadata/hashes and validation codes; full prompts/raw responses default off or short retention.

MVP model tasks:

- include three idea suggestions;
- include idea/change → structured stage candidate;
- include child-friendly explanation grounded in computed diff;
- include one invalid-output repair;
- defer all code patches.

On timeout/outage/malformed output, tell Linus the last draft is safe. Never alter Lucas’s published stage and never silently use cloud.

## Preview and publishing recommendation

Use one deployment and immutable records:

- drafts are Creator/Parent only;
- preview loads one exact draft version/hash in the real Player engine with a Creator banner;
- preview checklist records normal-route, instruction, hint, power, and completion checks;
- publishing revalidates the exact hash under current validators/content pack and checks optional parent approval;
- one transaction marks publication, moves `current_published_version_id`, writes audit, and awards Creator Star idempotently;
- Player list resolves only the pointer;
- rollback revalidates compatibility and changes the pointer to an earlier immutable published version;
- never rebuild a container or modify the version in place.

## Persistence recommendation

SQLite is sufficient for one household, one backend writer, and modest concurrency. Use a local filesystem, not a network filesystem. Keep one application replica.

Minimum records:

- profiles/parent credential if approved;
- stages and immutable stage versions;
- validation, preview, publication/rollback events;
- question instances/attempts;
- play sessions, completions, rewards;
- Power Question attempts and one-use power consumption;
- creator/player progress;
- model request/prompt metadata under retention policy;
- parent settings and audit;
- schema migrations.

Use foreign keys, transactions, unique idempotency constraints, short writes, migration checksums, safe pre-migration backup, and integrity checks. Use SQLite backup API or `VACUUM INTO`; do not copy only a live main DB file. Backups live outside the Kind node/live data directory. Restore while writes are stopped, preserve the suspect original, validate backup, migrate, and run integrity checks.

## Cooperative rewards

- **Creator Star:** one per exact version after Linus previews/checks and publishes a valid stage; no reward for model call count.
- **Player Star:** one per exact published version when Lucas completes it; no reduction for hints, retries, normal route, or skipped Power Question.
- **Team Star:** one when that version has both Creator and Player Stars.
- No leaderboard, currency, streak, time bonus, sibling comparison, or loss.
- Approval needed: whether a meaningfully changed version can earn another Team Star and how “meaningful” is determined.

## Deployment recommendation

Production-like local topology:

```text
iPad/laptop → http://<Mac-private-IP>:8080
  → Mac firewall (trusted network only)
  → Kind extraPortMapping host 8080 to node 30080
  → Kubernetes NodePort 30080
  → one Fastify pod serving built UI + /api
  → SQLite local PV
  → backend-only model connection to Mac host
```

Use Podman to build the OCI image. On macOS Podman uses a VM and Kind nodes are containers. Test `host.containers.internal` from a normal container, Kind node, and application pod; do not assume it reaches the Mac model. If needed use an explicit documented host gateway or narrowly bound relay. If the model is bound beyond loopback, firewall it to the private container path.

Required deployment evidence:

- app works through Mac host port;
- pod can reach model;
- iPad cannot reach raw model, Kubernetes API, database, or Podman socket;
- no router forwarding, UPnP, public tunnel, load balancer, or public exposure;
- data survives pod replacement;
- backup is outside disposable cluster storage;
- model outage disables Creator generation only.

Physical iPad Safari validation is mandatory. Use Pointer Events, large controls (target ≥56 CSS pixels for Player Mode), device-width viewport, safe areas, tap alternatives, explicit Start gesture for audio, resize/orientation handling, and no hover dependence. Playwright WebKit is not a replacement for the real device.

## Security requirements for the formal specification

- Enforce roles/server authorisation on every protected route; hiding UI is insufficient.
- Use separate Player-safe API projections with no draft/prompt/model/admin data.
- Browser never learns raw model base URL or credential.
- No model tool access to filesystem, database, shell, network, package manager, Git, Podman, or Kubernetes.
- Reject unknown stage keys and any code/HTML/Markdown/URL/path field.
- Bound payloads, strings, arrays, model tokens, total timeout, retries, repair, and generation concurrency.
- Validate content catalogue, difficulty, geometry, route, power, completion, and exact hash before publication.
- Keep prior published pointer on every failure; maintain immutable history and verified backup.
- Collect minimal local data, prefer pseudonyms, no telemetry/ads, explicit retention/export/delete, redacted logs.
- No kubeconfig, Podman socket, terminal, code-server, or mutation service-account token in application.
- Expose only the app port on trusted LAN; no port forwarding; require a negative raw-model exposure test.
- Reassess Australian privacy requirements before packaging or internet exposure. The OAIC’s Children’s Online Privacy Code was still being finalised at research time.

The detailed likelihood/impact/MVP/later treatment for direct model exposure, arbitrary code, unsuitable content, malformed/broken stages, secrets, Kubernetes credentials, terminal access, outages/timeouts/exhaustion, SQLite corruption, public exposure, child privacy, history loss, and iPad compatibility is in `architecture-plan.md`.

## Testing requirements

### Unit

- stage structure/semantics/unknown keys;
- question correctness, distractors, and Kindergarten hard limits;
- hints/repeated attempts/no punishment;
- reward idempotency;
- Power Question optionality;
- Super Strength activation and exactly-one consumption;
- normal-route reachability;
- stage immutability/publication/rollback rules.

### Integration

- Fastify ↔ deterministic fake model;
- opt-in selected local model conformance;
- JSON extraction, schema/semantic invalidity, timeout, cancel, transient retry, one repair;
- SQLite migrations/repositories;
- draft/preview/publish/rollback;
- progress/reward/power recording;
- safe backup, integrity, and restore.

### End-to-end

With a deterministic fake model: Linus chooses idea → draft generated → validation → semantic review → preview → publish → Lucas sees published version → normal question/hint/correct → optional Power success/skip variants → one rock breaks → completion → rewards/progress stored. Include invalid later draft and rollback paths. Run Chromium and WebKit.

### Manual family/device

- Linus completes scaffold levels and explains request/change/draft/published.
- Lucas plays laptop/iPad with touch, hints, skip, tap alternative, orientation changes, and no adult translation target.
- Parent configures, approves, rolls back, exports, and rehearses restore.
- Test Wi-Fi interruption, Mac sleep/wake, model stopped, and physical iPad Safari.
- Positive app port and negative model/admin/database/Kubernetes exposure tests.

## Ordered delivery phases

Each is intended as one independently testable/reviewable/reversible Kanban card:

1. Repository foundation — **recommended first task**
2. React, TypeScript, and Vite foundation
3. Phaser integration
4. Character movement and collision
5. One playable Kindergarten counting stage
6. Question interaction
7. Reward and completion
8. Optional Power Question
9. Super Strength and breakable rock
10. Structured stage schema
11. Creator Mode without AI
12. Provider-neutral local-model gateway
13. AI-generated structured stage
14. Preview and publishing
15. Stage versioning and rollback
16. SQLite progress storage
17. Parent controls
18. English stage
19. Science stage
20. Container packaging
21. Kind deployment
22. Home-network and iPad validation

Use the objective, user-visible result, dependencies, expected files/components, acceptance criteria, tests, manual checks, risks, and rollback written for every phase in `delivery-plan.md`.

## Decisions still requiring approval

1. Linus’s/Lucas’s actual reading, motor, attention, and curriculum needs.
2. Exact curriculum/school alignment and approved English/Maths/Science content.
3. Original project licence and package manager.
4. Selected local model runtime/model, hardware budget, allowed downloads, and prompt/raw-output retention.
5. Whether every publish requires parent PIN/approval; Parent PIN and recovery semantics.
6. Which fields Linus may customise, especially question topic/template.
7. Approved asset pack, attribution, AI-art policy, likeness/names, and audio/narration plan.
8. Player session/movement difficulty, iPad models/Safari versions, and landscape requirement.
9. HTTP-on-trusted-Wi-Fi acceptance versus locally trusted HTTPS.
10. Data retention, backup frequency/location, deletion/export, and whether detailed Power attempts are retained.
11. Power retry/skip default (planning candidate: offer normal path after two attempts).
12. Whether meaningful revised versions earn another Team Star and the anti-version-spam rule.
13. Crystal order and whether it is parent-configurable.
14. Exact NodePort/host port and reliable Kind-to-Mac model route discovered on the target Mac.

## Official research sources

- [Australian Curriculum V9 English](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/english), [Mathematics](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/mathematics), and [Science](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/science)
- [ACARA Foundation parent information](https://v9.australiancurriculum.edu.au/content/dam/en/curriculum/ac-version-9/parent-information/AC_Parents-Carers_Information-Sheet_Foundation.pdf)
- [WCAG 2.2 dragging and target size](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) and [Apple touch target guidance](https://developer.apple.com/design/tips/)
- [OAIC children and privacy](https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/children-and-young-people) and [Children’s Online Privacy Code work](https://www.oaic.gov.au/privacy/privacy-for-kids/privacy-for-kids-childrens-online-privacy-code)
- [Official Phaser React/TypeScript/Vite template](https://github.com/phaserjs/template-react-ts), [Arcade Physics](https://docs.phaser.io/phaser/concepts/physics/arcade), [Scale Manager](https://docs.phaser.io/phaser/concepts/scale-manager), and [MIT licence](https://phaser.io/download/license)
- [React](https://react.dev/learn), [Vite browser support](https://vite.dev/guide/), [Fastify validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/), and [Zod](https://zod.dev/)
- [SQLite overview](https://sqlite.org/about.html), [WAL constraints](https://sqlite.org/wal.html), and [safe backup/corruption guidance](https://sqlite.org/howtocorrupt.html)
- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility), [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs), [`llama.cpp` server](https://github.com/ggml-org/llama.cpp/tree/master/tools/server), and [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Playwright browser engines](https://playwright.dev/docs/browsers) and [Vitest](https://vitest.dev/guide/features.html)
- [Podman](https://docs.podman.io/en/latest/markdown/podman.1.html), [Kind port mapping](https://kind.sigs.k8s.io/docs/user/configuration/), [Kind rootless Podman](https://kind.sigs.k8s.io/docs/user/rootless/), and [Kubernetes NodePort](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Tiled](https://github.com/mapeditor/tiled), [LibreSprite](https://github.com/LibreSprite/LibreSprite), [Krita licence](https://krita.org/en/about/license/), [Audacity licence](https://manual.audacityteam.org/man/license.html), and [code-server](https://github.com/coder/code-server)
