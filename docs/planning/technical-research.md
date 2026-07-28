# The Crystal Adventure — Technical Research

Status: research and planning input only. This is not an MVP specification and does not authorise implementation.

Research date: 28 July 2026. External claims below were checked against current official project documentation, repositories, standards, and Australian government sources on that date. Recommendations and assumptions are labelled separately from confirmed facts.

## Executive recommendation

Use a TypeScript monorepo with a React/Vite browser application, a Phaser 3 game canvas, and a Node.js/Fastify backend. Share Zod schemas between browser and backend, but make the backend the authority for validation, publication, questions, and model access. Persist one low-concurrency family installation in SQLite. Use Vitest for unit/component tests and Playwright for cross-browser flows. Package the built frontend and backend as one web application image with Podman, then deploy one application replica to a single-node Kind cluster with a host-backed persistent volume.

Do not use a visual map editor, browser IDE, separate preview deployment, per-stage container build, PostgreSQL, Redis, ingress controller, or cloud model gateway for the MVP. Use code-defined environment templates and structured stage data first. Keep Tiled available as a later escape hatch if handcrafted layouts outgrow the constrained template system.

## Confirmed technical facts

- React renders component-based DOM interfaces. Phaser renders and updates a game canvas. Phaser’s official React/TypeScript/Vite template demonstrates a React component that owns the Phaser instance and an event bus for communication.
- Phaser Arcade Physics is a lightweight rectangle/circle physics system intended for platformers and similar games. Phaser’s Pointer abstraction covers mouse and touch, and its Scale Manager provides fixed logical size plus `FIT` scaling.
- Phaser can parse Tiled JSON, but Tiled is not required to create a Phaser map.
- Zod is a TypeScript-first runtime validation library, has no external dependencies, works in modern browsers and Node.js, and can convert schemas to JSON Schema.
- Fastify supports schema-based request validation and response serialization. Untrusted schemas must not be compiled as application schemas; the application’s schemas remain developer-owned.
- SQLite is an in-process, self-contained, transactional, single-file database whose source is in the public domain. It does not require a database server.
- SQLite WAL mode requires all processes using the database to be on the same host and is not suitable over a network filesystem.
- Safe live SQLite backups include `VACUUM INTO` and the backup API. Copying only the main file during an active transaction can produce a corrupt backup.
- Ollama implements parts of the OpenAI API and exposes `/v1/chat/completions`; its native API can constrain output with a JSON schema. `llama.cpp` provides OpenAI-compatible chat routes and schema-constrained JSON. “OpenAI-compatible” is therefore useful but not proof that every provider implements the same structured-output fields.
- OpenAI’s documentation distinguishes JSON mode from Structured Outputs: valid JSON alone does not guarantee schema adherence. Independent application validation is still required.
- Kind nodes are containers. `extraPortMappings` map a host port into a Kind node across platforms. Kubernetes `NodePort` exposes a fixed port on each node; an Ingress requires an ingress controller and more routing configuration.
- Kind can use rootless Podman, but the Kind documentation identifies additional rootless setup and possible logging/PID-limit issues. On macOS, Podman itself runs Linux containers in a VM.
- Podman documents `host.containers.internal` and `host.docker.internal` for reaching the host, but macOS/VM resolution involves `gvproxy`. Connectivity from a Kubernetes pod nested inside a Kind node must be proven on the actual machine rather than assumed.
- Ollama binds to `127.0.0.1:11434` by default; changing its bind address can make it reachable elsewhere. Any wider bind therefore needs a firewall boundary.
- Vite development assumes a modern browser; production targets can be configured. Playwright runs Chromium, Firefox, and WebKit and can emulate tablet/mobile viewports, but emulated WebKit is not a replacement for a real iPad test.
- Service workers require HTTPS except on locally trusted loopback origins such as `localhost`. An iPad visiting `http://<Mac-LAN-IP>` is not visiting its own localhost, so secure-context-only features must not be assumed. The core MVP does not require a service worker.
- Audible media and Web Audio commonly require a user gesture. Player Mode needs an explicit start action before sound.

## Technology comparison

“Required” means recommended for the planned implementation. “Optional” means useful when a defined need appears. “Deferred” means deliberately excluded from the MVP implementation path. Licence statements describe the tool itself; asset and transitive-dependency licences still require an inventory.

| Technology | Purpose | Open-source licence | Status | Appropriateness and operational complexity | Simpler alternative | Final recommendation |
|---|---|---:|---|---|---|---|
| TypeScript | Shared browser/backend types and safer game/content contracts | Apache-2.0 | Required | One language across UI, engine integration, gateway, and schemas; compiler/config adds low complexity | JavaScript with JSDoc | Use strict TypeScript; do not treat types as runtime validation |
| React | Creator, Parent, navigation, forms, semantic overlays | MIT | Required | Strong fit for form-heavy accessible UI; medium conceptual complexity when combined with a game loop | Vanilla DOM or Preact | Use React for app chrome and question/review UI, not frame-by-frame game state |
| Phaser 3 | 2D rendering, scenes, input, animation, collision, camera | MIT | Required | Removes large custom-engine burden; medium complexity; mature Arcade Physics and touch abstraction | Canvas API, PixiJS plus custom systems | Use Phaser 3 with Arcade Physics and a small number of engine-owned scenes; do not adopt Phaser Editor |
| Vite | Browser dev server and production bundling | MIT | Required | Fast, conventional React/TS integration; low operational complexity | esbuild scripts or Rollup | Use Vite for browser build; configure a conservative production target after device testing |
| Node.js | Backend runtime and build tooling | MIT plus bundled third-party notices | Required | Same language and schema types; low family-scale operations | Deno or Bun | Use a maintained Node.js LTS available at implementation time; pin exact version then |
| Fastify | HTTP API, static serving, model gateway, validation hooks | MIT | Required | Small, typed, high-performance server; plugin discipline adds low/medium complexity | Node `http`, Express, Hono | Use one Fastify service; serve built UI and same-origin `/api` in production |
| Zod | Stage, request, model-output, and config validation | MIT | Required | Single developer-owned runtime contract, refinements, inferred TS types; low complexity | JSON Schema + Ajv, TypeBox | Use Zod as source of application contracts and emit a supported JSON Schema subset for models |
| SQLite | Profiles, versions, progress, settings, audit records | Public domain | Required | Ideal for one backend replica and modest writes; very low operations; requires disciplined backup and local filesystem | Atomic JSON files | Use SQLite with migrations, foreign keys, transactions, integrity checks, and one writer service |
| Vitest | Unit and component tests | MIT | Required | Shares Vite transforms/config; low complexity; Browser Mode optional | Node test runner | Use for pure rules, schemas, repositories, and selected React components |
| Playwright | Browser integration/end-to-end tests | Apache-2.0 | Required | Chromium/Firefox/WebKit plus tracing; browser downloads increase CI/storage complexity | Manual tests only; WebdriverIO | Use focused E2E tests, WebKit project, touch-like viewport; still test a physical iPad |
| Podman | OCI image build and local container operations | Apache-2.0 | Required for packaging, optional in early development | Daemonless/rootless design; macOS needs a VM; medium complexity | Docker or direct Node process | Use at packaging phase, not for every early edit; record architecture and base-image digests |
| Kind | Local single-node Kubernetes target | Apache-2.0 | Required as a delivery target, deferred until core app works | Useful deployment rehearsal; nested-container networking/storage add high relative complexity | Podman Compose or one container | Meet the stated Kind goal with one node/namespace/app replica; do not make it a daily prerequisite |
| Kubernetes | Declarative local deployment resources | Apache-2.0 | Required only for Kind milestone | Adds manifests, health probes, storage, and networking; excessive for the product itself | Direct Podman run | Use the minimum resources: Deployment, Services, PVC/PV or host mount, ConfigMap/Secret as needed |
| Git | Version control and review | GPL-2.0 | Required development tool | Essential, low operational complexity | None credible | Use normal small commits later; no runtime dependency |
| Tiled | Visual tile-map authoring and JSON export | Primarily GPL-2.0; repository includes components under additional open licences | Deferred | Excellent for bespoke maps but creates a second stage format/workflow and weakens bounded generation | Code-defined templates and stage JSON | Defer until repeated authored maps demonstrate the need; never accept raw model-authored Tiled JSON directly |
| LibreSprite | Pixel art and sprite animation | GPL-2.0 | Optional | Focused sprite-sheet workflow; manual asset pipeline and macOS compatibility need validation | Existing licensed pack, Krita | Use only for small edits or original pixel animations if a tested build is available |
| Krita | Painting, concept art, environment and sprite editing/animation | GPL-3.0 | Optional | Capable and actively documented; heavier than a pixel editor | LibreSprite, existing packs | Preferred open-source general art editor; output artwork is not forced under Krita’s licence |
| Audacity | Trim/normalise recorded narration and effects | GPL-2.0 according to official manual | Optional | Good offline audio editing; unnecessary if MVP is silent or uses pre-cleared assets | OS audio editor, no audio | Use only after the family approves an audio plan |
| code-server | Browser-hosted VS Code-like IDE | MIT | Deferred | Powerful but exposes files/terminal and adds authentication/network risk; wrong abstraction for an eight-year-old Creator | Purpose-built Creator Mode | Do not expose to either child and do not deploy with the game |

### Additional evaluated model runtimes

| Option | Confirmed capabilities | Complexity | Recommendation |
|---|---|---|---|
| Existing OpenAI-compatible local endpoint | Depends on installed provider; must be capability-tested | Lowest if already present | Preferred product contract: accept a configured base URL/model and probe it |
| Ollama | Partial OpenAI compatibility; native structured outputs accept JSON Schema; default loopback bind | Low on macOS, but Kind-to-host networking requires care | Good first tested adapter/runtime if the family has not selected one; do not hard-code the product to it |
| `llama.cpp` server | Lightweight OpenAI-compatible routes and schema-constrained JSON | More model/file/flags ownership | Supported later through the same provider contract; useful fallback runtime, not silent fallback model |
| OpenRouter | Cloud routing, provider selection, and automatic fallbacks | Adds internet, account, secrets, cost, privacy, and potentially silent provider changes | Deferred. If evaluated later, require explicit parent opt-in, visible active provider, data policy, cost ceiling, and `allow_fallbacks: false` unless separately approved |

## Framework and game-engine recommendations

### React–Phaser boundary

Use one React component to create and destroy one Phaser `Game` instance. React owns:

- routes and mode selection;
- Creator and Parent forms;
- accessible question/reward overlays;
- model progress and validation messages;
- draft/published lists and settings.

Phaser owns:

- world rendering and camera;
- scene lifecycle;
- player physics, collisions, animation, and world triggers;
- world consequences such as bridge movement, rock breaking, crystal collection, and celebration particles.

Use a typed, narrow event bridge:

- Phaser → React: `QUESTION_REQUESTED`, `POWER_QUESTION_REQUESTED`, `STAGE_COMPLETED`, `PREVIEW_EVENT`.
- React → Phaser: `QUESTION_RESOLVED`, `POWER_ACTIVATED`, `PAUSE`, `RESUME`, `RESTART`.

Do not mirror the whole Phaser world in React state. Do not let React rerenders create scenes. Question answers go to the backend-authoritative question engine before the result event returns to Phaser.

### Fixed scenes versus data-driven stages

Recommended progression:

1. Prove one fixed counting scene and movement feel.
2. Extract one `StageDefinition` interpreted by one reusable `AdventureScene`.
3. Add allowlisted environment templates and object types.
4. Add only those schema fields demonstrated by real stages.

The MVP should have fixed engine behaviour and data-driven instances. A stage can select template parameters, placements within safe regions, approved content references, and story text. It cannot define executable behaviours.

### Maps

Start with code-defined environment templates: logical regions, static platform rectangles, spawn anchors, question/rock/exit slots, and decorative layers. This directly maps to the bounded stage schema and is easiest to validate for reachability. Defer Tiled until humans need irregular, art-directed tile maps. If adopted later, treat human-authored, versioned map templates as engine assets; the model may select a template and safe slots, not emit arbitrary map files.

### Movement, collision, input, and scaling

- Phaser Arcade Physics with axis-aligned bodies is sufficient for a forgiving platformer.
- Use deterministic engine constants for speed, gravity, jump velocity, coyote time, jump buffer, maximum fall speed, and collision body sizes. These must not be model-controlled.
- Keyboard: arrows or A/D plus Space/Up; touch: large left/right/jump buttons with pointer events and multi-pointer support.
- Set `touch-action: none` only on the game/control surface, not on the full application.
- Provide a non-platforming interaction fallback if family testing reveals motor difficulty.
- Use a fixed logical landscape canvas (a candidate such as 960×540, subject to device testing), `Phaser.Scale.FIT`, and centre it. DOM overlays share the same bounded container.
- Respect safe-area insets and browser chrome. Pause on visibility loss, resize/orientation change, and modal question display.
- Do not require fullscreen; mobile fullscreen support and gestures vary.

## Character and animation research

### Options

| Approach | Strengths | Risks/costs | MVP use |
|---|---|---|---|
| Purchased/free sprite pack | Fastest coherent animation and environments | Licence/attribution, style mismatch, missing needed poses, redistribution terms | Recommended if one pack covers character and core environments with an explicit game-distribution licence |
| AI-generated concept art | Rapid visual direction and variants | Provenance, inconsistent frames, unclear training/licensing terms, hard animation cleanup | Concepts only after parent approval; do not use unreviewed output as final child-facing assets |
| LibreSprite | Precise pixel frames, onion skin, sprite-sheet export | Manual effort, tool availability/support | Optional for small frame edits |
| Krita | Strong painting and animation, good for guide/crystals/backgrounds | Larger tool and workflow | Preferred original-art editor if custom art is necessary |
| Sprite sheets | Simple Phaser loading and frame animation | Wasted transparent space, manual metadata | Good for the small MVP character set |
| Texture atlases | Efficient packing and flexible frames | Requires packing pipeline/metadata | Optional optimisation after assets stabilise |
| Procedural/placeholders | Fast, licence-safe, excellent for mechanics tests | Not emotionally engaging enough for family validation | Required early; replace selectively before MVP acceptance |

### Recommended asset sequence

1. Use coloured shapes and simple original placeholders to prove scale, collisions, questions, and the rock rule.
2. Select one licence-cleared, stylistically coherent pack or create a minimal original set.
3. Produce exactly:
   - Lucas: idle (2–4 frames), walk (4–8), jump/fall (1–2), celebrate (3–6);
   - guide: idle and one gesture;
   - rock: intact, crack feedback, broken;
   - three crystals plus glow/collection effect;
   - modular forest, bridge, cave, castle/garden backgrounds and platforms.
4. Keep animation frame rate, keys, origin, hitbox, scale, and asset identifier in an engine-owned asset manifest.
5. Maintain an asset register containing source URL/vendor, author, licence/SPDX where possible, purchase receipt if applicable, attribution, modification notes, and child-use approval.

Custom portrait creation, lip-sync, skeletal animation, procedural world generation, and large texture-atlas optimisation can wait.

## Question-system options

| Option | Correctness and safety | Variety | Operations | Decision |
|---|---|---:|---:|---|
| Fixed approved question banks | Strong when reviewed; deterministic | Limited; authoring burden | Low | Safe, but less generative than needed alone |
| Fully AI-generated questions | Model can be wrong, unsuitable, ambiguous, or visually impossible | High | High review burden | Reject |
| AI-generated questions with validation | Structural checks help but semantic truth and age level remain hard | High | High; needs review/evaluation | Defer for controlled trials only |
| Controlled templates populated with approved values | Deterministic truth, bounded difficulty, reusable visuals | Good within designed domains | Moderate upfront template design | Recommend for MVP |

The model should select or propose a template ID and approved parameters. The backend question engine canonicalises them and derives the prompt, choices, correct answer, hint sequence, difficulty metadata, and visual assets. The model must never supply the authoritative `correctChoiceId`.

Template examples:

- `count_objects`: approved object asset, quantity 1–10, distractor strategy.
- `compare_collections`: two bounded quantities, asks more/fewer.
- `initial_sound_picture`: approved phoneme/grapheme and picture set.
- `case_match`: approved uppercase/lowercase pair.
- `cvc_tiles`: approved word and decoy letters, with tap alternative.
- `living_or_nonliving`: approved item and category.
- `plant_need`: approved need/non-need picture set.
- `repeat_pattern`: approved AB or ABB elements.

Every template needs deterministic answer generation, uniqueness checks, alt text, visual hint logic, maximum instruction length, allowed attempt policy, curriculum tags, and parent approval version.

## AI integration options and recommendation

### Provider-neutral contract

Define an application interface conceptually like:

```text
ModelProvider
  health(): ProviderHealth
  generate(task, messages, outputSchema, limits): ModelResult
  capabilities(): { jsonMode, jsonSchema, modelList }
```

Configuration belongs on the backend:

- provider adapter (`openai-compatible` initially);
- base URL;
- model identifier;
- optional credential reference;
- connect/overall timeout;
- maximum input/output tokens or provider equivalents;
- structured-output mode;
- generation concurrency (recommend 1 initially);
- explicit fallback policy (`none` for MVP).

Do not expose the base URL or credential through browser configuration endpoints.

### Request and response flow

1. Authenticated Creator action reaches Fastify.
2. Backend checks task type, length, rate/concurrency limit, content restrictions, and current stage version.
3. A versioned developer-owned prompt template receives only necessary, sanitised fields.
4. Adapter sends a non-streaming request with low temperature and the smallest supported JSON-schema constraint.
5. An abort controller enforces the deadline.
6. Adapter extracts one response body and records safe metadata.
7. Parse JSON once; if wrappers/fences are present, permit one deterministic extraction attempt.
8. Validate with Zod.
9. Run semantic validators: allowlists, question canonicalisation, content limits, geometry, reachability, power rules, asset references, and completion.
10. If invalid, optionally make one repair request containing the validation issues and schema, then revalidate from the beginning.
11. Store the attempt/validation result. Never mutate the current draft or published pointer until a valid candidate is saved as a new draft version.
12. Return a child-friendly explanation and review cards.

### Reliability policy

- Health check: backend-only `/api/model/health` reports configured/reachable/model-available/capability status, never raw provider internals to Player Mode.
- Timeout: candidate starting values are 5 seconds to connect and 45–60 seconds total on family hardware; calibrate with the selected model.
- Retry: no retry for validation/content errors; at most one retry for transient connection/5xx failure with small jitter; at most one schema-repair request. Cap total work and allow cancellation.
- Malformed output: deterministic JSON extraction → Zod validation → one model repair → fail safely and retain prior draft.
- Safe failure: Creator sees “The model didn’t make a usable stage. Your last draft is safe.” Player Mode is unaffected.
- Audit: task type, prompt-template version, local model ID, timing, outcome, validation codes, draft ID, and hashes. Store full prompt/response only under an explicit parent retention setting; redact secrets and unnecessary child data.
- Content restrictions: short maximum strings, allowlisted vocabulary/assets/environments/actions, no URLs/HTML/Markdown in stage fields, no personal data request, no frightening/violent/sexual/commercial content, and parent review where configured.

### Model task scope

| Task | MVP decision | Reason |
|---|---|---|
| Suggest three ideas | Include | Low consequence; validate subject/environment/template references |
| Convert selected idea into stage definition | Include | Core Creator learning loop, bounded by schema and deterministic content |
| Explain semantic changes to Linus | Include, but derive a factual diff first | Model may simplify developer-owned facts; it may not invent changes |
| Repair invalid structured output | Include once, backend-only | Improves local-model reliability without loops |
| Produce controlled code patches | Defer | Executable code expands security/review scope and contradicts safe data-driven MVP |

## Persistence options

### SQLite sufficiency

SQLite is sufficient because the target is one household, one backend replica, modest records, and low write concurrency. PostgreSQL adds service administration, credentials, backups, and networking without a demonstrated requirement. Redis adds no necessary capability. Reconsider only if the product becomes multi-household, multi-writer, remotely hosted, or needs high concurrent writes.

Use:

- one backend process/replica with all database access;
- a local filesystem volume, not NFS;
- foreign keys and explicit transactions;
- WAL mode only after validating the actual mounted filesystem and backup procedure;
- `busy_timeout` and short write transactions;
- numbered, forward-only migrations applied once at startup under a lock;
- a pre-migration safe backup and schema-version check;
- periodic `quick_check` and an on-demand `integrity_check`;
- safe backup through the library backup API or `VACUUM INTO`, never a naive live file copy;
- restore while the application is stopped, preserving the corrupt/original file for recovery.

JSON files are initially simpler but become error-prone for immutable versions, relational progress, transactions, migrations, and rollback. They are suitable for seed content, not the authoritative mutable store.

## Testing tools and strategy

### Unit tests with Vitest

- Zod structural bounds and unknown-key rejection.
- Semantic stage validation and safe allowlists.
- Template-derived correct answers and unique choices.
- Kindergarten quantity, text, template, and difficulty limits.
- hint progression and repeated-attempt/no-punishment rules.
- Creator/Player/Team Star idempotency.
- Power Question availability, activation, one-obstacle consumption, and normal-route invariant.
- stage version immutability, publish preconditions, and rollback pointers.
- geometry/reachability checks for every engine-owned template.

### Integration tests

- Fastify repository/database layer against a temporary SQLite database.
- Backend to a deterministic fake OpenAI-compatible server.
- A separately tagged opt-in test against the actual local model.
- valid output, fenced JSON, malformed JSON, schema mismatch, semantic mismatch, timeout, transient error, repair success/failure, and cancellation.
- draft creation, validation results, preview token/access, publish transaction, rollback, and progress recording.
- migrations from every supported prior schema and backup/restore rehearsal.

### Playwright end-to-end tests

Run focused flows in Chromium and WebKit:

1. Linus selects an idea.
2. A deterministic fake model returns a draft.
3. The backend validates it.
4. Linus reviews and previews it.
5. Linus publishes it.
6. Lucas sees only the published version.
7. Lucas moves, answers a normal question, and completes the normal route.
8. In a second path Lucas earns Super Strength, consumes it on one rock, and completes the bonus path.
9. Progress and all three reward types are stored idempotently.
10. An invalid later draft never changes Lucas’s listing.

Do not depend on a stochastic live model in ordinary E2E tests.

### Manual family/device tests

- Linus completes each scaffold level on laptop and iPad without adult translation; observe where he asks what a term means.
- Linus identifies a deliberately introduced semantic change and a validation rejection.
- Lucas starts, moves, jumps, answers, uses hints, skips the Power Question, and finishes without reading free text.
- Repeat with tap-to-place instead of drag.
- Test iPad landscape/portrait transition, Safari tab background/return, audio start, accidental multi-touch, browser toolbar changes, and Wi-Fi interruption.
- Confirm the smallest supported iPad maintains large controls and no important overlay is clipped.
- Parent publishes, rolls back, exports a backup, deletes a test profile with confirmation, and restores in a rehearsal.

## Kind and home-network research

### Recommended MVP topology

```text
Laptop/iPad Safari
  http://<Mac-LAN-IP>:8080
        |
Mac firewall: allow TCP 8080 on trusted private network only
        |
Kind extraPortMapping host 8080 -> node 30080
        |
Kubernetes NodePort 30080 -> one Fastify web pod
        |
        +-- built React/Phaser files and same-origin /api
        +-- SQLite on one host-backed persistent volume
        +-- backend-only connection to local model on Mac host
```

Use one public origin, one application Deployment with `replicas: 1`, one ClusterIP/NodePort Service, and no ingress controller. A NodePort such as 30080 can be mapped by Kind to Mac host port 8080. Explicitly bind the host mapping to `0.0.0.0` only when family LAN access is intended. Bind Kubernetes API and development-only endpoints to loopback.

An ingress controller is unnecessary for one HTTP service and would add image, controller, routing, and debugging overhead. Separate frontend/backend services are also unnecessary in production; Fastify can serve static files and APIs. Separate Vite and Fastify processes remain useful in development.

### Local model path

Keep the raw model inaccessible to browsers and, ideally, inaccessible to the home LAN. The backend is the only caller.

For Podman on macOS, first test `host.containers.internal` from:

1. a normal Podman container;
2. the Kind node container;
3. the application pod.

If it resolves end-to-end, configure only the backend’s `MODEL_BASE_URL` to that host name and model port. If it does not, create an explicit, documented host-gateway/host-alias or narrowly bound host-side relay. Do not guess a magic IP. If the model must bind beyond loopback, restrict the listener/firewall to the Podman/Kind private path and confirm from another LAN device that port 11434 is closed. The deployment acceptance gate is a positive pod-to-model test and a negative iPad-to-model test.

### Persistent storage

Kind is a local test cluster, so a single-node hostPath/local PersistentVolume is acceptable. Mount a dedicated Mac directory into the Kind node with `extraMounts`, then mount that node path into the application through a PV/PVC. Never store the database only in the pod filesystem. Pin the node/volume relationship, use one replica, and document that recreating the cluster without preserving the Mac directory must not destroy data.

Backups must go to a different Mac directory than the live database volume. A backup on the same disposable node path is not a backup.

### Home-network controls

- Use the Mac’s current private LAN IP or a parent-managed local DNS name.
- Do not configure router port forwarding, UPnP, tunnels, public DNS, cloud load balancers, or `LoadBalancer` Services.
- macOS/endpoint firewall permits 8080 only on the trusted network and denies the model port from LAN clients.
- Expect the host IP to change unless DHCP reservation is configured by the parent.
- Local HTTP is workable for the core game but is unencrypted on Wi-Fi and lacks secure-context-only browser capabilities. Keep the MVP free of secrets in browser traffic and use pseudonymous local profiles. If the family requires HTTPS, add a locally trusted certificate and install trust on each device as a separate operational phase.

## iPad considerations

- Support current family iPads discovered during implementation; do not claim broad historical Safari support without a device matrix.
- Use Pointer Events/Phaser Pointer rather than separate mouse-only logic.
- Prevent page pan/zoom only on the active game surface; preserve browser accessibility elsewhere.
- Use a device-width viewport and safe-area-aware layout.
- Keep primary controls at least 56 CSS pixels in Player Mode and never below the 44-point Apple guidance.
- Provide tap alternatives for dragging and keyboard alternatives on laptops.
- Initialise audio from the first Start button gesture; include mute and replay-instruction controls.
- Handle orientation and visual viewport changes without resetting the stage.
- Avoid hover-only controls, right click, tiny scroll areas, and simultaneous three-finger gestures.
- Budget textures and audio conservatively, unload unused scenes/assets, and test WebGL context loss/return.
- Playwright WebKit is a useful early signal; final acceptance requires physical iPad Safari on the actual home network.

## Recommendations

1. Treat the stage interpreter, deterministic question engine, and publication gate as the core product, not the model.
2. Keep all AI outputs as untrusted candidate data and use the same validation path for human and model-created drafts.
3. Use template slots before arbitrary coordinates, and code-defined maps before Tiled.
4. Keep one same-origin web service and one SQLite writer/replica.
5. Develop and test without Kubernetes first; add Podman/Kind only after the local app and model gateway work.
6. Make Kind-to-Mac model connectivity a measured deployment task with a negative exposure test.
7. Use placeholders until interaction scale and collision feel are validated with both children.
8. Pin versions, image digests, model identifier, prompt versions, and content-pack versions during implementation; do not prematurely pin them in this research package.

## Assumptions requiring validation

- The Mac has enough memory to run the selected local model, Podman VM, Kind node, browser, and test runner together.
- A single application replica meets availability needs.
- The selected Node SQLite driver supports the required target architecture and container base image.
- The local model follows enough of Chat Completions to support the adapter; its exact schema-output field must be capability-tested.
- The family’s iPad Safari versions meet the eventual Vite production target.
- A trusted home network makes temporary local HTTP acceptable.
- The chosen asset licence permits redistribution in the application.
- No runtime requirement exists for offline PWA installation.

## Official source references

### Application and game stack

- [TypeScript licence (Apache-2.0)](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt)
- [React documentation](https://react.dev/learn) and [licence (MIT)](https://github.com/facebook/react/blob/main/LICENSE)
- [Phaser licence (MIT)](https://phaser.io/download/license)
- [Official Phaser React/TypeScript/Vite template](https://github.com/phaserjs/template-react-ts)
- [Phaser Arcade Physics](https://docs.phaser.io/phaser/concepts/physics/arcade)
- [Phaser Scale Manager](https://docs.phaser.io/phaser/concepts/scale-manager)
- [Phaser Pointer input](https://docs.phaser.io/api-documentation/class/input-pointer)
- [Phaser Tiled JSON parsing](https://docs.phaser.io/api-documentation/function/tilemaps)
- [Vite guide and browser support](https://vite.dev/guide/)
- [Vite licence (MIT)](https://github.com/vitejs/vite/blob/main/LICENSE)
- [Node.js overview](https://nodejs.org/en/about) and [licence](https://github.com/nodejs/node/blob/main/LICENSE)
- [Fastify validation and serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/) and [licence (MIT)](https://github.com/fastify/fastify/blob/main/LICENSE)
- [Zod documentation](https://zod.dev/) and [licence (MIT)](https://github.com/colinhacks/zod/blob/main/LICENSE)

### Data, tests, packaging, and deployment

- [SQLite overview and public-domain status](https://sqlite.org/about.html)
- [SQLite WAL constraints](https://sqlite.org/wal.html)
- [SQLite corruption and safe backup approaches](https://sqlite.org/howtocorrupt.html)
- [Vitest features](https://vitest.dev/guide/features.html) and [licence (MIT)](https://github.com/vitest-dev/vitest/blob/main/LICENSE)
- [Playwright browsers](https://playwright.dev/docs/browsers) and [licence (Apache-2.0)](https://github.com/microsoft/playwright/blob/main/LICENSE)
- [Podman documentation](https://docs.podman.io/en/latest/markdown/podman.1.html) and [project licence (Apache-2.0)](https://podman.io/)
- [Podman host-gateway behaviour](https://docs.podman.io/en/stable/markdown/podman-create.1.html)
- [Kind configuration and extra port mappings](https://kind.sigs.k8s.io/docs/user/configuration/)
- [Kind rootless Podman guidance](https://kind.sigs.k8s.io/docs/user/rootless/)
- [Kubernetes Services and NodePort](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes hostPath development scope](https://kubernetes.io/docs/tutorials/configuration/configure-persistent-volume-storage/)
- [Git licence (GPL-2.0)](https://git-scm.com/about.html)

### Model integration

- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)
- [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs)
- [Ollama network binding FAQ](https://docs.ollama.com/faq)
- [`llama.cpp` HTTP server](https://github.com/ggml-org/llama.cpp/tree/master/tools/server)
- [OpenAI Structured Outputs versus JSON mode](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenRouter provider routing](https://openrouter.ai/docs/guides/routing/provider-selection) and [model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)

### Content tools, browser, accessibility, and privacy

- [Tiled project and licences](https://github.com/mapeditor/tiled)
- [LibreSprite project and GPL-2.0 licence](https://github.com/LibreSprite/LibreSprite)
- [Krita licence (GPL-3.0)](https://krita.org/en/about/license/)
- [Audacity licence](https://manual.audacityteam.org/man/license.html)
- [code-server project and licence](https://github.com/coder/code-server)
- [W3C WCAG 2.2 input modalities](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Apple viewport guidance](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)
- [WebKit Pointer Events on iPadOS](https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/)
- [WebKit iOS media policy](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- [MDN secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
- [OAIC children and privacy](https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/children-and-young-people)
