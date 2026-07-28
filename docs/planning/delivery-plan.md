# The Crystal Adventure — Delivery Plan

Status: ordered implementation planning for later Kanban/specification work. This is not an MVP specification, no card has been created, and no implementation has begun.

## Delivery principles

- Each phase below is intended to be one small, independently reviewable Kanban card.
- A phase leaves the main branch in a usable state, has explicit acceptance evidence, and can be reverted without data loss.
- Use deterministic fakes before live models, placeholders before final art, direct local processes before containers, and containers before Kind.
- Do not start a dependent phase until its acceptance criteria pass.
- Keep feature flags or route guards around incomplete Creator, Parent, power, and deployment work.
- Every schema/database change needs backward compatibility or a rehearsed rollback.
- Exact dependency versions, package manager, Node LTS, and licence for original project code must be approved when Phase 1 starts.

## Recommended first implementation task

**Phase 1: Repository foundation** is the first task. Its outcome is a reviewable repository policy and directory/test-command contract without prematurely creating the React application. This makes every later change consistent and reversible.

## Phase 1 — Repository foundation

- **Objective:** Establish project ownership, licence decision, contribution rules, directory convention, tool-version policy, formatting rules, and a minimal verification entry point.
- **User-visible result:** None; contributors have an unambiguous starting point.
- **Dependencies:** Parent approval of project licence and preferred package manager.
- **Expected components/files:** `README.md`, `LICENSE`, `.gitignore`, `.editorconfig`, contribution/development notes, tool-version file, proposed `apps/web`, `apps/server`, `packages/contracts` layout.
- **Acceptance criteria:** Fresh checkout instructions are accurate; only approved open-source development dependencies are planned; no app/framework is initialised in this card.
- **Tests:** Documentation/link check and clean working-tree smoke check.
- **Manual validation:** A second contributor can explain where browser, backend, shared contracts, tests, and deployment files will go.
- **Operational risks:** Premature choices or incompatible licence. Record decisions explicitly and avoid unused scaffolding.
- **Rollback:** Revert the card; no generated state or data exists.

## Phase 2 — React, TypeScript, and Vite foundation

- **Objective:** Create one minimal React/Vite application with strict TypeScript and accessible route placeholders for Creator, Player, and Parent modes.
- **User-visible result:** A responsive home page navigates to clearly labelled empty modes.
- **Dependencies:** Phase 1.
- **Expected components/files:** browser package manifest/config, `index.html`, `src/main.tsx`, `App`, route shell, base styles, TypeScript/Vite configs.
- **Acceptance criteria:** Development and production builds work; no console errors; keyboard navigation and focus labels work; Node/package versions are pinned.
- **Tests:** Vitest smoke test for route shell; production build check.
- **Manual validation:** Open on laptop and resize to an iPad-like viewport.
- **Operational risks:** Oversized starter template and accidental proprietary dependencies. Remove demo code and inspect licences.
- **Rollback:** Revert the browser foundation; Phase 1 remains.

## Phase 3 — Phaser integration

- **Objective:** Mount and cleanly destroy one Phaser game inside a React component using a typed event bridge.
- **User-visible result:** Player route shows a scaled placeholder game world; navigating away releases it.
- **Dependencies:** Phase 2.
- **Expected components/files:** `PhaserGame` host, game config, boot/adventure placeholder scene, event contracts, canvas container styles.
- **Acceptance criteria:** One canvas only; no duplicate listeners after route changes; `FIT` scaling and centring work; React and Phaser exchange one test event.
- **Tests:** Host lifecycle component test; repeated mount/unmount integration test.
- **Manual validation:** Navigate in/out ten times, resize, rotate emulated viewport, inspect console/memory.
- **Operational risks:** React rerenders recreating the game; global event leaks.
- **Rollback:** Feature-flag/remove Phaser host and retain React routes.

## Phase 4 — Character movement and collision

- **Objective:** Add a placeholder Lucas body with forgiving keyboard and touch movement, jump, ground collision, and safe respawn.
- **User-visible result:** Lucas walks and jumps across a short placeholder room on laptop or touchscreen.
- **Dependencies:** Phase 3.
- **Expected components/files:** player controller, Arcade Physics constants, input adapter, touch control overlay, collision template, animation-state placeholder.
- **Acceptance criteria:** Left/right/jump, coyote time, jump buffer, bounds, collision, and fall respawn work; engine constants are not data/model fields.
- **Tests:** Controller state/rule unit tests and scene collision smoke test.
- **Manual validation:** Keyboard, single-touch, two simultaneous touch pointers, held buttons, background/return.
- **Operational risks:** Touch page scrolling, tiny controls, frame-dependent motion.
- **Rollback:** Restore static Phaser scene; no persisted data affected.

## Phase 5 — One playable Kindergarten counting stage

- **Objective:** Build one fixed, model-free Maths counting adventure with start, traversal, encounter, and crystal endpoint.
- **User-visible result:** Lucas can play a coherent placeholder stage from start to crystal.
- **Dependencies:** Phase 4; parent confirms quantity range and wording.
- **Expected components/files:** fixed counting scene/config, placeholder forest/bridge assets, guide trigger, crystal trigger.
- **Acceptance criteria:** Mandatory path is forgiving and completable; count is 1–10; no free text; restart is safe.
- **Tests:** Scene trigger order and fixed-route reachability smoke test.
- **Manual validation:** Adult completes; Lucas observes/tries controls before question implementation.
- **Operational risks:** Platforming distracts from learning or stage is too long.
- **Rollback:** Keep movement room and remove stage-specific scene.

## Phase 6 — Question interaction

- **Objective:** Add an accessible React question overlay for the fixed counting encounter with deterministic choices and hints.
- **User-visible result:** Counting objects and choosing a large answer opens the in-world route; incorrect choices show a visual hint without penalty.
- **Dependencies:** Phase 5.
- **Expected components/files:** question overlay, focus/pause bridge, fixed question rule, choice buttons, hint presentation, tap/narration replay control.
- **Acceptance criteria:** Three choices, unique correct answer, retained world progress, repeat attempts, keyboard/touch access, focus return to game.
- **Tests:** Correctness/hint unit tests; overlay component tests; encounter integration test.
- **Manual validation:** Intentionally answer incorrectly twice, recover, rotate iPad viewport.
- **Operational risks:** “Quiz screen” feeling, accidental double submission, hidden focus.
- **Rollback:** Replace encounter with a non-question gate while keeping stage playable.

## Phase 7 — Reward and completion

- **Objective:** Add crystal collection, celebration, stage completion, replay, and initial Player Star rule in memory.
- **User-visible result:** Finishing the stage produces a short celebration and a non-competitive completion card.
- **Dependencies:** Phase 6.
- **Expected components/files:** completion state machine, crystal/reward animation, results overlay, in-memory idempotency key.
- **Acceptance criteria:** Completion requires resolved normal question plus crystal; double trigger awards once; replay resets run state.
- **Tests:** Completion/reward state-machine unit tests and E2E happy path.
- **Manual validation:** Repeated collision with goal, replay, browser refresh.
- **Operational risks:** reward duplication and overlong/unskippable animation.
- **Rollback:** Revert reward UI; stage remains completable.

## Phase 8 — Optional Power Question

- **Objective:** Add a fixed optional slightly harder question, visual hints, retry, and normal-route skip.
- **User-visible result:** Lucas can try a glowing challenge or continue normally after attempts.
- **Dependencies:** Phase 7; parent approves stretch level and default attempt count.
- **Expected components/files:** power encounter state, question variant, attempt/skip overlay, power-not-yet-used indicator.
- **Acceptance criteria:** Optionality is obvious; incorrect answers remove nothing; after the configured attempts both retry and normal path are offered.
- **Tests:** attempt/hint/skip state combinations and normal-route E2E.
- **Manual validation:** fail, skip, succeed, leave/restart at each point.
- **Operational risks:** perceived pressure or challenge becoming mandatory.
- **Rollback:** Disable power encounter flag; normal stage unchanged.

## Phase 9 — Super Strength and breakable rock

- **Objective:** Grant one-use Super Strength on success and consume it on one heavy rock that opens only a bonus path.
- **User-visible result:** Lucas gains a visible power, smashes one rock, and discovers an optional bonus route.
- **Dependencies:** Phase 8.
- **Expected components/files:** power state machine, badge/animation, rock object states, bonus-path gate, consumption event.
- **Acceptance criteria:** Exactly one eligible rock consumes power; normal route always open; failure/skip still completes stage; restart clears power per policy.
- **Tests:** activation/consumption/idempotency/ineligible-object unit tests; powered and unpowered E2E paths.
- **Manual validation:** hit rock before power, earn power, break rock, try second rock, finish both routes.
- **Operational risks:** collision consumes power accidentally or bonus path blocks completion.
- **Rollback:** Disable rock interaction and leave bonus path closed/decorative; normal path intact.

## Phase 10 — Structured stage schema

- **Objective:** Extract the proven fixed stage into a strict versioned Zod `StageDefinition` and reusable interpreter.
- **User-visible result:** The same counting stage plays from validated data with no regression.
- **Dependencies:** Phases 5–9.
- **Expected components/files:** shared stage schema/types, template/asset catalogues, semantic validators, route-graph validator, canonical fixture, interpreter.
- **Acceptance criteria:** Unknown/executable fields rejected; normal/power invariants enforced; fixture renders identically; browser never chooses validity.
- **Tests:** structural/semantic/property fixtures, invalid corpus, reachability and power invariant tests.
- **Manual validation:** Edit safe fixture fields and observe allowed changes; try unsafe fields and inspect friendly rejection.
- **Operational risks:** Over-general schema or migration burden.
- **Rollback:** Keep fixed scene behind a flag until interpreter parity is proven.

## Phase 11 — Creator Mode without AI

- **Objective:** Let Linus choose among three hard-coded ideas, customise safe fields, review, save an in-memory/local draft, and preview it.
- **User-visible result:** Linus completes the full learning loop up to publish using deterministic templates, with no model dependency.
- **Dependencies:** Phase 10.
- **Expected components/files:** idea cards, scaffold controls, prompt preview, semantic diff, draft state service/fake repository, preview banner/checklist.
- **Acceptance criteria:** Creator cannot set engine-owned fields; Player route cannot see draft; discard/undo work; wording passes family review.
- **Tests:** Creator reducers/components, ownership rules, preview access E2E.
- **Manual validation:** Linus completes choose→customise→review→preview and explains draft versus published.
- **Operational risks:** UI too text-heavy or draft leaks into Player route.
- **Rollback:** Hide Creator route and retain canonical player stage.

## Phase 12 — Provider-neutral local-model gateway

- **Objective:** Add Fastify and one backend-only provider interface with health, timeouts, cancellation, safe logging, and a fake provider.
- **User-visible result:** Parent/Creator sees local model health; browser never receives model URL.
- **Dependencies:** Phase 11 and approved local endpoint configuration.
- **Expected components/files:** server app/config, model provider interface, OpenAI-compatible adapter, fake server/provider, health API, redacted audit adapter.
- **Acceptance criteria:** Credentials/base URL remain server-only; no cloud fallback; timeout retains draft; Player works with model stopped.
- **Tests:** fake-provider valid/error/timeout/cancel/retry tests and negative API exposure tests.
- **Manual validation:** Stop model, generate, inspect safe error, then play existing stage.
- **Operational risks:** hanging local inference, secret/log leakage, incompatible API fields.
- **Rollback:** Disable generation endpoint; Creator remains deterministic.

## Phase 13 — AI-generated structured stage

- **Objective:** Implement idea suggestions, bounded stage generation, one repair, validation, and semantic explanation against the existing schema.
- **User-visible result:** Linus requests a change, reviews a valid proposed draft, or receives a safe actionable failure.
- **Dependencies:** Phase 12; selected model passes capability test.
- **Expected components/files:** versioned prompt templates, task services, JSON extraction, Zod/semantic pipeline integration, repair policy, diff explanation.
- **Acceptance criteria:** Model cannot mutate current draft directly; invalid output never previews/publishes; one repair maximum; explanations match computed diff.
- **Tests:** recorded valid/malformed/unsafe fixtures; deterministic fake E2E; opt-in live-model conformance test.
- **Manual validation:** normal request, prompt-injection-like text, malformed response simulation, cancel during generation.
- **Operational risks:** unsuitable text, schema drift, latency, repair loops.
- **Rollback:** turn off AI flag and return to Phase 11 flow.

## Phase 14 — Preview and publishing

- **Objective:** Add backend draft records, exact-version preview grants, publication gate, and stable Player projection.
- **User-visible result:** Linus deliberately publishes a tested valid stage; Lucas then sees it and never sees drafts.
- **Dependencies:** Phase 13; initial database repository may use temporary SQLite now or an abstraction completed in Phase 16.
- **Expected components/files:** stage/version repository interface, preview/publish APIs, checklist record, authorisation guard, Player projection.
- **Acceptance criteria:** Exact hash revalidated in atomic publish; draft URLs denied to Player; failed publish preserves prior pointer; Creator Star idempotent.
- **Tests:** authorisation, stale-hash race, validation failure, publish happy path, Player listing E2E.
- **Manual validation:** Preview one draft while Lucas sees prior published stage, then publish and refresh Lucas.
- **Operational risks:** time-of-check/time-of-use error or visual-only separation.
- **Rollback:** freeze current published pointer and disable publishing.

## Phase 15 — Stage versioning and rollback

- **Objective:** Make all stage versions immutable, preserve ancestry/history, and switch the published pointer to a compatible prior version.
- **User-visible result:** Parent/Linus can see version history and safely restore the previous working stage.
- **Dependencies:** Phase 14.
- **Expected components/files:** version repository/events, history UI, compatibility revalidation, rollback API/audit.
- **Acceptance criteria:** Published content never mutates; rollback is atomic; old incompatible schemas are refused or migrated to a new draft; progress remains tied to exact versions.
- **Tests:** immutability constraints, concurrent publish/rollback, compatibility and audit tests; E2E rollback.
- **Manual validation:** Publish A, publish B, roll back to A, confirm Lucas and history.
- **Operational risks:** destructive “rollback” implementation or confused rewards.
- **Rollback:** Disable history UI/API; keep current immutable version pointer.

## Phase 16 — SQLite progress storage

- **Objective:** Implement durable profiles, versions, attempts, completions, rewards, power use, creator/player progress, prompts metadata, validation, and settings.
- **User-visible result:** Progress and published stages survive backend/browser restart.
- **Dependencies:** Phase 15; schema approved.
- **Expected components/files:** SQLite driver/repositories, numbered migrations, constraints/indexes, backup/integrity commands, seed migration.
- **Acceptance criteria:** One writer/replica; foreign keys; idempotent unique keys; safe migration backup; restart persistence; verified backup/restore rehearsal.
- **Tests:** repository/transaction tests, migration matrix, corruption detection path, safe backup/restore integration.
- **Manual validation:** Complete/publish, restart all local processes, verify state; restore a test backup.
- **Operational risks:** native-driver packaging, live-file copy, migration loss.
- **Rollback:** Restore pre-migration verified backup and prior app version; never down-migrate destructively.

## Phase 17 — Parent controls

- **Objective:** Add protected local controls for profiles, content packs, difficulty, publication approval, retention, model health, backup/export, and rollback.
- **User-visible result:** Parent can steward the experience without terminal access.
- **Dependencies:** Phase 16; parent decides PIN/recovery and retention.
- **Expected components/files:** Parent session/PIN service if approved, settings APIs/UI, content approvals, data export/delete confirmation, backup/restore UI boundary.
- **Acceptance criteria:** Children cannot access privileged APIs by guessed URLs; secrets never redisplayed; deletion is scoped/confirmed; audit events recorded.
- **Tests:** role/auth matrix, PIN verifier/recovery rules, settings validation, export/delete integration.
- **Manual validation:** Parent changes a safe setting, approves publication, exports, and attempts access from Player session.
- **Operational risks:** lockout, weak PIN, destructive delete/restore.
- **Rollback:** Disable Parent mutations and use read-only defaults; restore data backup if needed.

## Phase 18 — English stage

- **Objective:** Add one approved English content template and complete published stage using existing engine/schema.
- **User-visible result:** Lucas can earn the English Crystal through a picture-supported letter/sound or case-match interaction.
- **Dependencies:** Phases 16–17; parent/educational review of pack.
- **Expected components/files:** English content pack, approved picture/letter assets and alt text, template canonicaliser/rendering fixture, stage seed.
- **Acceptance criteria:** Deterministic correct answer, no free text, pictures plus tap choices, age/difficulty tags, normal and powered routes valid.
- **Tests:** all content entries, distractor uniqueness, hints, schema/reachability, E2E completion.
- **Manual validation:** Lucas and parent test comprehension, audio/text support, ambiguous pictures.
- **Operational risks:** accent-dependent phonics, unfamiliar vocabulary, asset licensing.
- **Rollback:** Unpublish English stage/content-pack version; other stages unaffected.

## Phase 19 — Science stage

- **Objective:** Add one approved Science template and stage using observable, familiar Foundation content.
- **User-visible result:** Lucas earns the Science Crystal by helping the castle garden through picture classification.
- **Dependencies:** Phase 18 architecture, not necessarily its content; parent/educational review.
- **Expected components/files:** Science content pack, living/non-living or plant-needs assets, canonicaliser, hints, stage seed.
- **Acceptance criteria:** One unambiguous reviewed concept, deterministic choices, child-safe visuals, all route/power invariants pass.
- **Tests:** content correctness table, category ambiguity fixtures, schema/reachability, E2E completion.
- **Manual validation:** Parent asks Lucas to explain pictures; test incorrect hints and normal-route skip.
- **Operational risks:** oversimplified or culturally/contextually ambiguous science examples.
- **Rollback:** Unpublish Science stage/content-pack version.

## Phase 20 — Container packaging

- **Objective:** Build reproducible OCI image(s) with Podman, serving built UI and API from one runtime image.
- **User-visible result:** The complete local app runs from a container with persistent data mounted externally.
- **Dependencies:** Phases 1–19 acceptance; supported architecture/base image.
- **Expected components/files:** Containerfile, ignore file, build metadata/SBOM or licence report, runtime health probe, container run documentation.
- **Acceptance criteria:** Non-root process where feasible; no source/secrets/model bundled; pinned base digest; read-only root where practical; external data survives replacement.
- **Tests:** image build, vulnerability/licence review, start/readiness, persistence and signal-shutdown tests.
- **Manual validation:** Replace container while retaining DB and published stage.
- **Operational risks:** native SQLite binary/architecture mismatch, oversized image, hidden secrets.
- **Rollback:** Run prior image digest or direct Node process against compatible backup.

## Phase 21 — Kind deployment

- **Objective:** Deploy one application replica to a single-node Kind cluster using Podman, NodePort, probes, limits, and persistent volume.
- **User-visible result:** Mac browser reaches the same app through the Kind-mapped port and data survives pod replacement.
- **Dependencies:** Phase 20; Podman/Kind host prerequisites.
- **Expected components/files:** Kind config, Kubernetes namespace/Deployment/Services/PV/PVC/ConfigMap/Secret templates, local image-load and runbook files.
- **Acceptance criteria:** Host 8080 maps to NodePort; one ready replica; model gateway health works from pod; pod deletion preserves data; app has no mutation RBAC.
- **Tests:** manifest validation, rollout/readiness, pod-replacement persistence, resource-limit and model-outage smoke tests.
- **Manual validation:** Recreate pod (not data directory), publish/play, inspect exposed host ports.
- **Operational risks:** Podman VM resources, host-path mismatch, nested host networking, accidental volume loss.
- **Rollback:** Roll back Deployment image/config; if cluster fails, run Phase 20 container with verified DB backup.

## Phase 22 — Home-network and iPad validation

- **Objective:** Validate private Wi-Fi access, firewall/exposure boundaries, touch/audio/responsive behaviour, and a full family flow on physical devices.
- **User-visible result:** Linus creates on laptop/iPad and Lucas plays the stable stage on iPad over home Wi-Fi.
- **Dependencies:** Phase 21; parent accepts HTTP or supplies trusted-HTTPS requirement.
- **Expected components/files:** device/network matrix, macOS firewall/runbook, exposure test checklist, family acceptance record, known-issues document.
- **Acceptance criteria:** `http://<Mac-IP>:8080` works; raw model/Kubernetes/database ports fail from iPad; no router forwarding; full E2E journey passes; controls meet size and orientation needs.
- **Tests:** LAN positive app test, negative port scan from trusted client, Playwright WebKit regression, backup check before family trial.
- **Manual validation:** Linus idea→generate→review→preview→publish; Lucas normal and power routes; parent rollback; Wi-Fi drop/recovery and Mac sleep/wake.
- **Operational risks:** dynamic host IP, local HTTP interception, Safari-specific defects, Mac sleep.
- **Rollback:** Close firewall port and return to Mac-only access; data/published versions remain intact.

## Cross-phase quality gates

Before declaring the later MVP implementation complete:

- Maths, English, and Science each have one parent-approved, deterministic stage.
- Every stage passes structural, semantic, content, asset, reachability, power, and publication validation.
- The local model can be stopped without breaking Player Mode or published stages.
- A model-generated invalid draft demonstrably cannot change Lucas’s experience.
- Creator, Player, and Team Stars are cooperative and idempotent.
- SQLite backup and restore have been rehearsed after the final migration.
- Physical iPad validation passes on the home network.
- No code-server, terminal, Hermes, Jarvis, OpenRouter, public ingress, or stage-specific image build exists in runtime.

## Deferred follow-on cards

These are deliberately not phases of the MVP plan:

- Tiled-authored template import after a demonstrated map-authoring need.
- Locally trusted HTTPS and installable PWA/offline cache.
- A second explicitly selected local model provider.
- Controlled code-patch education in a separate sandbox/review workflow.
- OpenRouter evaluation with explicit parent consent and disabled automatic fallback.
- Multi-household accounts, public hosting, PostgreSQL, Redis, or multi-replica deployment.
- Expanded animation, custom portraits, voice production, and additional powers.

