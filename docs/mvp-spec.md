# The Crystal Adventure — MVP Specification

Status: **authoritative implementation specification.** Derived from the planning package in
`docs/planning/` (`claude-spec-handoff.md`, `product-research.md`, `technical-research.md`,
`architecture-plan.md`, `delivery-plan.md`). Where this document and a planning document
disagree, this document wins.

Date: 28 July 2026.

---

## 1. Product definition

A private, home-network web game for two children in one household.

- **Linus (Creator, ~8):** builds bounded stages through the loop *Idea → Prompt → Generate →
  Review → Test → Improve → Publish*. He learns that prompts communicate intent, that AI can be
  wrong, and that publishing is a deliberate responsibility.
- **Lucas (Player, Kindergarten):** plays only **published** stages, collecting English, Maths,
  and Science Crystals. He never sees prompts, drafts, developer tools, model errors, or terminal
  output.
- **Parent (Steward):** approves content, difficulty, publication, privacy, retention, model
  settings, history, and backup — without terminal or Kubernetes access.

The product succeeds when Lucas enjoys a stage Linus is proud of, and Linus can explain what he
asked for, what changed, and why it works.

### 1.1 Non-negotiable product rules

1. "Vibe coding" here means expressing intent and reviewing **structured stage data**. The model
   never writes or executes code.
2. Incorrect answers never remove progress, rewards, routes, or attempts. No lives, no score
   penalty, no leaderboard, no competition, no first-try bonus.
3. The normal route is **always** completable without the Power Question.
4. Learning questions cause world actions and keep scene context; they are not disconnected tests.
5. Lucas gets large controls, pictures, short instructions, 3–4 choices, letter/number tiles, a tap
   alternative to every drag, clear hints, and **no free-text answers**.
6. AI is an optional Creator dependency. Player Mode and every published stage work while the model
   is unavailable.

---

## 2. Resolved decisions (previously open)

| Decision | Resolution |
|---|---|
| Project licence | **MIT** |
| Package manager | **npm** (workspaces) |

### 2.1 Still requiring parent approval before the dependent phase starts

These block specific phases, not the whole build. Each is called out in the phase that needs it.

1. Linus's and Lucas's actual reading, motor, attention, and curriculum needs.
2. Exact curriculum alignment and approved English/Maths/Science content (blocks Phases 18–19).
3. Selected local model runtime/model, hardware budget, allowed downloads, and prompt/raw-output
   retention (blocks Phase 12).
4. Whether every publish requires parent PIN/approval; PIN and recovery semantics (blocks Phase 17).
5. Which fields Linus may customise, especially question topic/template (blocks Phase 11).
6. Approved asset pack, attribution, AI-art policy, likeness/names, audio/narration plan.
7. Player session/movement difficulty; iPad models/Safari versions; landscape requirement.
8. HTTP-on-trusted-Wi-Fi acceptance versus locally trusted HTTPS (blocks Phase 22).
9. Data retention, backup frequency/location, deletion/export, Power-attempt retention (Phase 16–17).
10. Power retry/skip default. **Planning candidate: offer the normal path after two attempts.**
11. Whether meaningfully revised versions earn another Team Star, and the anti-version-spam rule.
12. Crystal order, and whether it is parent-configurable.
13. Exact NodePort/host port and the Kind→Mac model route proven on the target Mac (Phase 21).

---

## 3. Architecture

A **modular monolith**. Logical boundaries are explicit in code and tests; deployment is not split.

```text
Laptop / iPad browser  (same origin)
  └─ React: routing, Creator/Player/Parent screens, forms, accessible DOM overlays
      └─ Phaser host component → AdventureScene: render, movement, physics, camera, triggers
           │ same-origin /api
One Fastify backend  (the system authority)
  ├─ profile/session and role boundary
  ├─ stage / version / preview / publication service
  ├─ Zod structural + semantic validation pipeline
  ├─ deterministic question & content engine
  ├─ progress and cooperative reward service
  ├─ provider-neutral model gateway
  ├─ audit / health / backup administration
  └─ serves built React+Phaser static assets in production
       │                              │ backend-only
  SQLite (local FS, one writer)   OpenAI-compatible local model on the Mac host
```

### 3.1 Component contract

| Component | Responsible for | Must not |
|---|---|---|
| React shell | Routing, role screens, forms, overlays, focus management | Run physics, hold authoritative answers, call the model |
| Phaser host | Create/destroy exactly one game instance; typed event bridge | Recreate the game on routine React renders |
| Adventure engine | Render approved stage data; movement, collision, camera, world effects | Interpret scripts, HTML, URLs, or model instructions |
| API layer | Validate requests, enforce session/role, shape responses | Expose provider credentials or base URL to any browser |
| Stage service | Draft/version lifecycle, preview grants, publish/rollback transactions | Mutate an immutable published version |
| Stage validator | Structure, catalogue, content, geometry, reachability, power, completion | Ask the model whether its own output is valid |
| Question engine | Canonicalise parameters; derive choices, correct answer, hints | Accept model-authored truth |
| Progress/reward | Attempts, completions, power usage, idempotent stars | Penalise errors or reward model-call volume |
| Model gateway | Config, sanitisation, versioned prompts, timeouts, one repair, safe audit | Publish, execute code, or silently fall back to cloud |
| Persistence | Transactions, migrations, repositories, constraints, backups | Permit direct browser→database access |
| Parent admin | Approvals, packs, retention, health, rollback, backup/restore | Expose terminal, kubeconfig, or raw secrets |

### 3.2 Technology (pin exact versions at Phase 1)

TypeScript (strict) · React · Phaser 3 (Arcade Physics, Scale Manager `FIT`) · Vite · Node.js LTS ·
Fastify · Zod · SQLite · Vitest · Playwright · Podman · Kind/Kubernetes.

**Rejected/deferred:** Tiled, code-server, Phaser Editor, PostgreSQL, Redis, ingress controller,
separate preview deployment, per-stage container build, OpenRouter/any cloud model.

Repo layout: `apps/web`, `apps/server`, `packages/contracts`.

### 3.3 Visual direction (provisional — lands in Phase 2)

Grounded in a query against the `ai-lab-ui-ux-pro-max` design database
(commit `3b5df75`, 2026-07-28, product type "children educational game", stack React). Its
recommendations are **input, not authority** — the rejections below are deliberate.

**Style: Claymorphism.** Soft 3D, chunky, playful, toy-like. Thick borders (3–4 px), double
shadows, 16–24 px corner radii, soft press (200 ms ease-out). The database lists its best-fit
uses as "educational apps, children's apps … casual games", and the chunky form directly serves
the ≥56 px touch targets §11.1 requires. Light mode only — dark support is partial and the
database flags "dark modes" as an anti-pattern for this style. It also warns
**"⚠ Ensure 4.5:1"**, which is a hard requirement here, not a nicety (§10, and Lucas cannot read
his way out of a contrast failure).

**Palette** — learning blue + play yellow + fun pink:

| Role | Hex | Role | Hex |
|---|---|---|---|
| Primary | `#2563EB` | Background | `#EFF6FF` |
| On primary | `#FFFFFF` | Foreground | `#0F172A` |
| Secondary | `#F59E0B` | Muted | `#F1F5FD` |
| Accent/CTA | `#EC4899` | Border | `#E4ECFC` |
| Destructive | `#DC2626` | Ring | `#2563EB` |

Every pair must be contrast-checked at ≥4.5:1 before Phase 2 closes. **Colour is never the only
discriminator** (§5) — this palette does not relax that.

**Typography:** Baloo 2 (headings) + Comic Neue (body). **Self-host both.** The database emits a
`fonts.googleapis.com` `@import`; using it would put a third-party network request on every page
load, break Player Mode offline, and contradict §10's local-only data posture. Vendor the WOFF2
files into `apps/web` and record them in the asset register (§2.1 item 6).

**Adopted from the pre-delivery checklist:** SVG icons rather than emoji · visible focus states
for keyboard nav · smooth 150–300 ms hover/press transitions · **`prefers-reduced-motion`
respected** · responsive at 375 / 768 / 1024 / 1440 px · text contrast ≥4.5:1 in light mode.

**Rejected, with reasons:**

- **"App Store Style Landing" pattern** — the database's top pattern hit, and wrong. It assumes
  download CTAs, star ratings, review sections, and store badges. This product has no landing
  page, no store presence, and §14.1 explicitly excludes app-store packaging. Discarded whole.
- **GSAP motion presets** — GSAP is not in §3.2 and adding it is a new runtime dependency, which
  §14.1 forbids. Phaser owns in-world animation; React overlays use CSS transitions. The *timing*
  guidance is kept (300–450 ms, staggered reveals); the library is not.
- **44 × 44 px touch targets** — the database's mobile minimum is weaker than §11.1's ≥56 px for
  Player Mode. The stricter figure stands.
- **An icon library (Heroicons/Lucide)** — a dependency and licensing decision that belongs to the
  asset-pack approval in §2.1 item 6, not to a design database.

This direction is provisional until parent approval of the asset pack (§2.1 item 6).

---

## 4. The stage contract

`StageDefinition` (schemaVersion 1) is the single unit of creatable content. Full conceptual shape:
`docs/planning/architecture-plan.md` §"Stage schema proposal". Key constraints:

- Position is expressed as **named template slot IDs**, never arbitrary coordinates.
- `environment.templateId` ∈ `forest_bridge | crystal_cave | castle_garden` — each template ships a
  **pre-proven route graph**; validation checks graph activation, not a general platformer solver.
- `normalQuestion` is mandatory. `powerQuestion` is optional, uses `temporaryPower: "super_strength"`
  with `powerDuration: { kind: "eligible_obstacles", count: 1 }`, and may gate only a **bonus** path.
- `completionCondition.kind` is engine-owned: `normal_question_then_crystal`.

### 4.1 Ownership — who may set what

| Category | Linus | Model may propose | Engine/backend derives | Never model-controlled |
|---|---|---|---|---|
| Title, short story | Within limits | Yes | Sanitise/limit | — |
| Subject, environment, palette, decoration | From allowlist | From allowlist | Catalogue lookup | Any URL/file/asset outside catalogue |
| Slots, platforms, obstacles | Safe approved choices | From template slots | Geometry + reachability | Raw collision shapes, physics constants |
| Question template + parameters | Approved choices | Propose IDs/params | **Prompt, choices, correct answer, hints** | Correct answer, arbitrary question text |
| Rewards / world consequence | Compatible option | Propose ID | Execute allowlisted effect | Reward amounts, executable effects |
| Power placement | Request the challenge | Propose slot/template | Enforce one-use rules | Duration > 1, mandatory power, removing normal route |
| Completion, crystal identity | No | Only via subject mapping | Engine-owned | Arbitrary completion logic |
| IDs, hashes, versions, timestamps, status | No | No | Server-generated | Always |
| Auth, roles, publication, DB/network/model config | No | No | Backend/operations | Always |
| Code, HTML, Markdown, URLs, paths, shaders, deps | No | No | Not stage data at all | Always |

**The model-facing candidate omits `answerChoices` and `hint` entirely.** The question engine
injects them deterministically from the approved template + content-pack version. Model-authored
correct answers, choices, or hints are never stored as authoritative.

### 4.2 Validation pipeline — run in this exact order, return stable issue codes

1. **Transport** — content type, size, parseable JSON.
2. **Structure** — exact Zod schema; **unknown keys rejected**; string/array/number bounds.
3. **Catalogue** — every template, asset, slot, reward, content-pack reference exists and is approved.
4. **Canonicalisation** — templates + parameters resolve to a deterministic `QuestionInstance` + hash.
5. **Content** — allowed vocabulary/topics, instruction length, no markup/URL/personal data, band.
6. **Geometry** — objects fit slots, no illegal overlap, spawn/goal safe.
7. **Reachability** — normal route exists in the engine movement envelope; mandatory question and
   crystal reachable **without** power.
8. **Power invariants** — optional, one use, eligible rock exists, bonus path optional, skip available.
9. **Completion/reward** — one valid crystal, no bypass of the mandatory normal question, idempotent
   reward IDs.
10. **Publication policy** — exact version/hash passed preview and any required parent approval.

Zod structural validation is necessary but **never sufficient**.

---

## 5. Question engine

An approved **content pack** is versioned, developer/parent-reviewed data containing: template
definition, allowed parameter domains, deterministic canonicaliser, answer rule, distractor rule,
ordered visual hints, alt text/audio references, curriculum/difficulty metadata, attempt/skip
policy, and a content review record.

At draft validation the backend canonicalises to a `QuestionInstance` with a stable hash. **At
answer time the browser submits only the instance ID and a choice/tile action ID.** The backend
compares against derived truth and returns `correct`, `hint`, or `complete`.

Initial templates: count objects 1–10 · recognise numeral · compare collections · case match ·
initial-sound picture · approved CVC letter tiles · living/non-living · plant needs · AB/ABB pattern.

**Hard limits:** quantity cap 10 for normal questions (Power Question may use a separately approved
small stretch) · only approved CVC words/pictures/phoneme mappings/categories · no ambiguous
"more/fewer" ties unless the template teaches "same" · choices unique in meaning *and* display ·
concise alt text on every picture · colour never the only discriminator · fixed length limits on
instructions and hints · tap alternative to every drag · repeated answers cannot duplicate rewards ·
an incorrect answer stores the attempt, advances the hint index, and emits **no punitive event**.

---

## 6. Draft, preview, publish, rollback

States are **data records, not deployments**: `DRAFT` → `VALIDATED` → `PUBLISHED` (→ `SUPERSEDED`).

Preview is an access-controlled route loading one exact version + content hash in the real Player
engine behind a Creator banner, with a checklist recorded against that exact version.

**Publish transaction (single DB transaction):** load exact version and hash → confirm unmutated and
passing under *current* validators/content pack → confirm preview checklist + parent approval policy
→ set publication metadata on the immutable version → move `stages.current_published_version_id` →
write audit + Creator Star idempotently. **If any step fails, nothing changes for Lucas.**

**Rollback** never copies or edits content: recheck a prior immutable published version for engine/
schema compatibility, then move the pointer atomically plus audit. An old schema needing migration
becomes a **new candidate version** — history is never mutated.

Player queries resolve **only** `current_published_version_id`.

---

## 7. Model gateway

Internal provider interface, independent of HTTP details:

```text
health(config)  -> reachable, modelAvailable, structuredMode, latency
generate(task, messages, schema, limits, abortSignal) -> text, metadata
```

First adapter: Chat Completions on an OpenAI-compatible base URL. Provider quirks (`response_format`
vs JSON-mode-only vs Ollama `format` vs llama.cpp) stay isolated in the adapter. **The validator is
invariant across adapters** — declared schema support reduces malformed output but bypasses nothing.

Versioned prompt templates: `idea_suggestions/v1` (exactly three short, diverse ideas) ·
`stage_candidate/v1` · `change_explanation/v1` (simplify a **developer-computed** diff) ·
`repair_stage/v1` (once; never combined with new creative requirements).

**Limits:** non-streaming for structured tasks · concurrency 1 · bounded request/output size ·
cancellation propagated · deadline · at most one transient retry · at most one repair · **no
recursive repair loop** · **no cloud fallback** · prior draft/published state untouched until a valid
candidate commits · health visible to Creator/Parent, invisible to ordinary play.

**Flow:** validate/rate-limit intent → build versioned prompt from sanitised fields + approved
catalogues → request low-variance structured output → enforce deadline/cancel → deterministically
extract and parse JSON → Zod + all semantic validators → at most one repair, then revalidate **from
step 1** → save a new immutable draft only if valid → compute the semantic diff **in application
code** (the model may simplify it, never invent it) → record safe metadata/hashes/validation codes.

Full prompts and raw responses default to **off or short retention**, pending parent choice. Never
log credentials or auth headers.

On timeout/outage/malformed output: tell Linus his last draft is safe. Never alter Lucas's published
stage. Never silently use cloud.

---

## 8. Persistence

SQLite, local filesystem (**never** a network filesystem), **one writer, one replica**. DB, WAL, and
shared-memory files stay together. Store stage JSON for immutable fidelity while indexing lifecycle
fields relationally — arbitrary JSON is never the only validation layer.

Tables: `profiles` · `parent_credentials` (verifier only, never plaintext) · `stages` ·
`stage_versions` · `validation_runs` · `preview_runs` · `publication_events` · `question_instances` ·
`play_sessions` · `question_attempts` · `stage_completions` · `reward_awards` · `power_attempts` ·
`power_usage` · `creator_progress` · `player_progress` · `model_requests` · `parent_settings` ·
`audit_events` · `schema_migrations`.

Use foreign keys, transactions, unique idempotency constraints, short writes, and migration
checksums. The migration runner takes a safe pre-migration backup, takes an application lock, checks
the current version, applies in one transaction where supported, records a checksum, and **refuses
unknown future versions**.

**Backups:** `VACUUM INTO` or the SQLite backup API — **never** copy a live main DB file alone.
Backups live outside the live data directory and outside the disposable Kind node. Validate by
opening read-only and running `quick_check`/`integrity_check`. **Restore:** stop writes, preserve the
suspect original, validate the backup, restore, migrate, run integrity checks.

---

## 9. Rewards (cooperative only)

- **Creator Star** — one per exact version, after Linus previews, checks, and publishes a valid stage.
  Never awarded for model-call count.
- **Player Star** — one per exact published version when Lucas completes it. **No reduction** for
  hints, retries, taking the normal route, or skipping the Power Question.
- **Team Star** — one when a version holds both a Creator and a Player Star.
- No leaderboard, currency, streak, time bonus, sibling comparison, or loss of any kind.

All awards are idempotent by `(reward type, profile/team, stage version)`.

---

## 10. Security requirements

1. Session and role enforced **server-side on every protected route**. Hiding UI is not a boundary —
   a guessed draft URL must fail authorisation.
2. Player API uses a **separate safe projection**: no draft, version history, prompt, validation
   detail, model state, or parent settings.
3. The browser never learns the model base URL or credential.
4. The model has **no** tool access: no filesystem, database, shell, network, package manager, Git,
   Podman, or Kubernetes.
5. Reject unknown stage keys and every code/HTML/Markdown/URL/path field.
6. Bound payloads, strings, arrays, model tokens, total timeout, retries, repair, and concurrency.
7. Validate catalogue, difficulty, geometry, route, power, completion, and **exact hash** before
   publication.
8. Every failure preserves the prior published pointer; history stays immutable; backups verified.
9. Minimal local data, pseudonyms preferred, no telemetry/ads, explicit retention/export/delete,
   redacted logs.
10. No kubeconfig, Podman socket, terminal, code-server, or mutating service-account token in the app.
11. Only the app port is exposed on the trusted LAN; no router forwarding/UPnP/tunnel. A **negative
    raw-model exposure test is required evidence**.
12. Reassess Australian privacy obligations before packaging or any internet exposure — the OAIC
    Children's Online Privacy Code was still being finalised at research time.

---

## 11. Deployment topology

```text
iPad/laptop → http://<Mac-private-IP>:8080
  → Mac firewall (trusted private network only)
  → Kind extraPortMapping: host 8080 → node 30080
  → Kubernetes NodePort 30080
  → one Fastify pod (replicas: 1) serving built UI + /api
  → SQLite on a local PV
  → backend-only connection to the model on the Mac host
```

Single Kind control-plane node on the Podman provider. One namespace, one Deployment with
readiness/liveness/startup probes, ClusterIP + NodePort, host directory → `extraMounts` → PV/PVC.

The model stays on the Mac host, outside Kubernetes, for native acceleration. `MODEL_BASE_URL` is
backend-only environment/secret data. `host.containers.internal` reachability from a pod nested in a
Kind node **must be proven on the actual machine**, never assumed.

**Required deployment evidence:** app reachable through the Mac host port · pod reaches the model ·
iPad **cannot** reach the raw model, Kubernetes API, database, or Podman socket · no router
forwarding/UPnP/tunnel · data survives pod replacement · backups live outside disposable cluster
storage · a model outage disables Creator generation **only**.

### 11.1 iPad requirements (mandatory, physical device)

Pointer Events · Player-Mode touch targets **≥ 56 CSS px** · device-width viewport · safe areas ·
tap alternative to every drag · explicit Start gesture before any audio · resize/orientation
handling · no hover dependence · `prefers-reduced-motion` respected · layouts verified at
375 / 768 / 1024 / 1440 px. **Playwright WebKit is a signal, not a substitute for a real iPad.**

---

## 12. Testing requirements

**Unit** — stage structure/semantics/unknown-key rejection · question correctness, distractors,
Kindergarten hard limits · hints, repeated attempts, absence of punishment · reward idempotency ·
Power Question optionality · Super Strength activation and exactly-one consumption · normal-route
reachability · immutability/publication/rollback rules.

**Integration** — Fastify ↔ deterministic fake model · opt-in live local-model conformance · JSON
extraction, schema/semantic invalidity, timeout, cancel, transient retry, one repair · SQLite
migrations and repositories · draft/preview/publish/rollback · progress/reward/power recording ·
safe backup, integrity, restore.

**End-to-end (deterministic fake model, Chromium + WebKit)** — Linus picks an idea → draft generated
→ validated → semantic review → preview → publish → Lucas sees the published version → normal
question, hint, correct → Power success **and** skip variants → one rock breaks → completion →
rewards stored. Include an invalid later draft and the rollback path.

**Manual family/device** — Linus completes the scaffold and explains request/change/draft/published ·
Lucas plays on laptop and iPad with touch, hints, skip, tap alternatives, orientation changes, and
**no adult translation** · Parent configures, approves, rolls back, exports, and rehearses restore ·
Wi-Fi interruption, Mac sleep/wake, model stopped · positive app-port and negative
model/admin/database/Kubernetes exposure tests.

---

## 13. Acceptance criteria (MVP definition of done)

Evidence must exist that:

1. A malformed or unsafe candidate cannot be previewed as valid or published.
2. A valid draft never appears in Player Mode before publication.
3. Publication and rollback are atomic and resolve exact immutable versions.
4. The normal route is completable with the Power Question skipped **or** failed.
5. The model can be offline while Lucas plays a published stage.
6. No browser can reach the raw model through the application.
7. Correct answers are reproduced **without** a model.
8. Stage completion and rewards stay idempotent under retries.
9. Database backup and restore have been rehearsed **after the final migration**.
10. An iPad on home Wi-Fi plays through, while model/Kubernetes/database ports stay inaccessible.
11. Maths, English, and Science each have one parent-approved deterministic stage.
12. Creator, Player, and Team Stars are cooperative and idempotent.
13. No code-server, terminal, Hermes, Jarvis, OpenRouter, public ingress, or per-stage image build
    exists in the runtime.
14. Every user-facing screen has passed accessibility review (contrast ≥4.5:1, visible focus,
    keyboard operable, `prefers-reduced-motion` honoured, no colour-only cues) and has designed
    loading, empty, error, disabled, and success states. **Verified against rendered evidence —
    screenshots or a live device — never a source diff.**

---

## 14. Delivery phases

22 phases, each one independently shippable, reviewable, and revertible Kanban card. Full objective,
user-visible result, dependencies, expected files, acceptance criteria, tests, manual checks, risks,
and rollback for every phase: **`docs/planning/delivery-plan.md`** — that ordering is normative.

| # | Phase | Gate/dependency |
|---|---|---|
| 1 | Repository foundation | licence + package manager **(resolved: MIT, npm)** |
| 2 | React, TypeScript, Vite foundation | 1; visual direction §3.3 confirmed, fonts self-hosted, contrast checked |
| 3 | Phaser integration | 2 |
| 4 | Character movement and collision | 3 |
| 5 | One playable Kindergarten counting stage | 4; parent confirms quantity range/wording |
| 6 | Question interaction | 5 |
| 7 | Reward and completion | 6 |
| 8 | Optional Power Question | 7; parent approves stretch + attempt count |
| 9 | Super Strength and breakable rock | 8 |
| 10 | Structured stage schema | 5–9 |
| 11 | Creator Mode without AI | 10; §2.1(5) |
| 12 | Provider-neutral local-model gateway | 11; §2.1(3) |
| 13 | AI-generated structured stage | 12; model passes capability test |
| 14 | Preview and publishing | 13 |
| 15 | Stage versioning and rollback | 14 |
| 16 | SQLite progress storage | 15; schema approved |
| 17 | Parent controls | 16; §2.1(4), §2.1(9) |
| 18 | English stage | 16–17; educational review |
| 19 | Science stage | 18 architecture; educational review |
| 20 | Container packaging | 1–19 accepted |
| 21 | Kind deployment | 20; §2.1(13) |
| 22 | Home-network and iPad validation | 21; §2.1(8) |

**Delivery principles:** deterministic fakes before live models · placeholders before final art ·
direct local processes before containers · containers before Kind · never start a dependent phase
until its predecessor's acceptance criteria pass · feature-flag or route-guard incomplete Creator,
Parent, power, and deployment work · every schema change needs backward compatibility or a rehearsed
rollback.

### 14.1 Explicitly out of MVP scope

AI-generated or executed code/patches/scripts/HTML/shaders/URLs/assets/dependencies/infrastructure ·
direct browser→model calls · OpenRouter or any silent cloud fallback · internet accounts, public
sharing/hosting, remote multiplayer, social/chat, ads, telemetry, purchases, leaderboard, currency,
app-store packaging · free-text answers for Lucas · a general-purpose level editor, Tiled workflow,
Phaser Editor, or per-stage container build · separate preview/production deployments or namespaces ·
PostgreSQL, Redis, multiple backend replicas, ingress controller · speech recognition, camera,
microphone, location, biometrics · formal assessment or teacher replacement · Hermes, Jarvis,
code-server, Kubernetes credentials, or terminal access at runtime.

**Deferred follow-ons:** Tiled import after demonstrated need · locally trusted HTTPS and installable
PWA/offline cache · a second selected local provider · controlled code-patch education in a separate
sandbox · OpenRouter with explicit parent consent and no automatic fallback · multi-household,
public hosting, PostgreSQL/Redis/multi-replica · expanded animation, portraits, voice, extra powers.
