# The Crystal Adventure — Architecture Plan

Status: recommended architecture for later specification work. This is not a final MVP specification and contains no production code.

## Architecture goals

1. Let Linus experiment without risking Lucas’s stable experience.
2. Make every question answer and game rule deterministic and testable without a model.
3. Treat model output as untrusted candidate data.
4. Keep the household deployment understandable: one public web application, one backend authority, one database, one local model connection.
5. Work with keyboard, touch, laptop, and iPad Safari.
6. Preserve stage history and make rollback a pointer change, not a rebuild.
7. Keep all child data and model traffic local by default.

## Recommended MVP architecture

```text
┌──────────────────────── Browser: same origin ────────────────────────┐
│ React application                                                    │
│  ├─ Creator Mode: ideas, prompt, review, validation, publish          │
│  ├─ Player Mode: published stage chooser and accessible overlays     │
│  ├─ Parent Mode: approvals, content, privacy, backup/restore          │
│  └─ Phaser host component                                            │
│       └─ Phaser AdventureScene: render, movement, physics, triggers   │
└───────────────────────────┬───────────────────────────────────────────┘
                            │ same-origin /api
┌───────────────────────────▼───────────────────────────────────────────┐
│ One Fastify backend (system authority)                               │
│  ├─ profile/session and role boundary                                │
│  ├─ stage/version/preview/publication service                        │
│  ├─ Zod structural + semantic validation pipeline                    │
│  ├─ deterministic question/content engine                            │
│  ├─ progress and cooperative reward service                          │
│  ├─ provider-neutral model gateway                                   │
│  ├─ audit/health/backup administration                               │
│  └─ built React/Phaser static files in production                    │
└──────────────┬────────────────────────────────┬───────────────────────┘
               │                                │ backend-only
┌──────────────▼──────────────┐       ┌─────────▼──────────────────────┐
│ SQLite on local persistent  │       │ OpenAI-compatible local model │
│ filesystem; one writer      │       │ on Mac host                   │
└─────────────────────────────┘       └────────────────────────────────┘
```

This is a modular monolith. Logical boundaries are explicit in code and tests, but deployment is not split into microservices.

## Component responsibilities

| Component | Responsibilities | Must not do |
|---|---|---|
| React shell | Routing, role-specific screens, forms, accessible DOM overlays, review cards, focus management | Run physics, hold authoritative answers, call model endpoint |
| Phaser host | Create/destroy one game instance; bridge typed events | Recreate game on routine React renders |
| Adventure engine | Render allowed stage data; movement, collision, camera, animation, trigger world effects | Interpret arbitrary scripts, HTML, URLs, or model instructions |
| API layer | Validate requests, enforce session/role, shape responses, same-origin policy | Expose provider credentials/base URL to children |
| Stage service | Draft/version lifecycle, validation orchestration, preview grants, publication/rollback transactions | Mutate immutable published versions |
| Stage validator | Structural, semantic, content, asset, geometry, reachability, question, power, completion checks | Ask the model whether its own output is valid |
| Question engine | Canonicalise template parameters; derive choices, correct result, hints, visual metadata | Accept model-authored truth as authoritative |
| Progress/reward service | Attempts, completions, power usage, Creator/Player/Team Star idempotency | Penalise errors or award for model-call volume |
| Model gateway | Provider config, sanitisation, versioned prompts, timeouts, limited retries/repair, safe audit | Publish, execute code, silently fall back to cloud |
| Persistence layer | Transactions, migrations, repositories, constraints, backups, integrity checks | Permit direct browser/database access |
| Parent administration | Approvals, packs, retention, model health, rollback, backup/restore | Expose terminal, Kubernetes credentials, or raw secrets |

## End-to-end data flows

### Create, review, preview, publish

```text
Linus selects/enters idea
  → Creator API validates intent and creator level
  → model gateway requests bounded StageCandidate JSON
  → JSON parse + Zod validation
  → deterministic canonicalisation and semantic validation
     ├─ invalid → store failure metadata; keep prior draft; show fix card
     └─ valid → store a new immutable draft version
  → backend computes semantic diff from prior version
  → Linus reviews
  → preview grant loads that exact draft in real engine
  → preview telemetry/checklist is attached to exact version
  → publish request revalidates exact content hash and approval policy
  → one transaction marks version published and moves stage pointer
  → Lucas list now resolves that pointer
```

The model never writes directly to SQLite and never receives publication authority.

### Play, question, power, completion

```text
Lucas chooses a published stage
  → API returns a player-safe projection of current immutable version
  → AdventureScene interprets approved environment and object slots
  → normal question trigger pauses physics and requests React overlay
  → answer ID goes to backend question engine
     ├─ incorrect → attempt stored; hint index returned; world/progress retained
     └─ correct → resolution stored; world consequence event returned
  → optional Power Question uses the same deterministic path
     ├─ correct → one-use power state activated for this run
     └─ skipped/exhausted → normal route remains available
  → eligible rock collision consumes one power atomically in run state
  → completion trigger validated against exact published version
  → completion and rewards stored idempotently
  → Phaser/React show celebration
```

Client-side feedback may be optimistic only for animation. The backend is the durable authority. Loss of connectivity pauses answer resolution and offers retry; it must not guess.

## Mode architecture

### Creator Mode

Routes are child-friendly React screens over APIs:

- idea cards and approved customisation chips;
- scaffold level and prompt composer;
- generation status with cancel;
- semantic review, not raw JSON;
- validation cards with child wording and optional Parent detail;
- preview launcher bound to one version ID/content hash;
- test checklist and reflection;
- publication button with explicit draft/published language;
- version history and undo-to-new-draft.

Creator Mode may query only Linus’s authorised projects/drafts. It cannot set `published_at`, reward rules, correct answers, role policy, or model configuration.

The scaffold is represented as engine-owned `creator_level` and UI capabilities. Model prompts do not decide Linus’s level.

### Player Mode

Player Mode has its own route and response projection:

- only current published versions;
- no draft/version history, prompt text, validation details, creator controls, model state, or parent settings;
- a small stage-card list with subject and picture;
- Phaser canvas plus React overlays;
- resumable session only if resume semantics are explicitly implemented; otherwise safe stage restart;
- no link to Creator/Parent Mode in the child play flow.

A guessed draft URL still fails backend authorisation. Visual hiding is not a security boundary.

### Parent Mode

Parent Mode uses a local parent session, preferably protected by a PIN after approval of recovery semantics. It provides:

- profile and pseudonym management;
- content-pack and difficulty-band approval;
- publish-approval policy;
- stage history, validation details, publish/rollback;
- model configuration/health without revealing credentials after entry;
- data retention and prompt-history policy;
- local export/backup, restore workflow, and deletion;
- optional audit view.

No web terminal, `kubectl`, filesystem browser, model console, or code-server is embedded.

## Model gateway

### Interface and adapters

Keep an internal provider interface independent of HTTP details:

```text
health(config) -> reachable, modelAvailable, structuredMode, latency
generate(task, messages, schema, limits, abortSignal) -> text, metadata
```

The first adapter targets Chat Completions on an OpenAI-compatible base URL. Provider-specific mapping is isolated:

- some providers use OpenAI-style `response_format`;
- some support only JSON mode;
- Ollama’s native API accepts a schema in `format`;
- `llama.cpp` supports schema-constrained response formats with its own compatibility qualifications.

The stage validator is invariant across adapters. A provider declaring schema support can reduce malformed output but cannot bypass Zod/semantic checks.

### Task-specific prompts

Maintain separate versioned templates:

- `idea_suggestions/v1`: exactly three diverse, short ideas using approved subjects/environments/question templates.
- `stage_candidate/v1`: produce one candidate using the provided schema subset, current draft, approved content catalogue, and requested change.
- `change_explanation/v1`: simplify a developer-computed semantic diff; output bounded explanation cards.
- `repair_stage/v1`: given invalid candidate plus validation codes, produce a replacement candidate once.

Never combine repair with new creative requirements. Prompts contain delimiters and say child/user text is data, not instruction hierarchy. Nonetheless, defence comes from bounded output and validation, not prompt wording.

### Limits and failure behaviour

- non-streaming generation for structured tasks;
- one concurrent request initially;
- bounded request and output sizes;
- cancellation propagated to provider;
- deadline, at most one transient retry, at most one repair;
- no recursive repair loop;
- no cloud fallback;
- prior draft/published state untouched until valid candidate insert commits;
- health degradation visible to Creator/Parent, invisible to ordinary play;
- Player functions fully without model availability.

### Audit record

Store task, provider type, model ID, prompt-template version, schema version, timestamps, duration, attempt count, outcome, validation codes, input/output hashes, related profile/stage/version, and cancellation/timeout class. Full child prompt and raw response default to short retention or off, pending parent choice. Never log credentials or authentication headers.

## Stage schema proposal

The following is a conceptual contract, not production TypeScript:

```ts
interface StageDefinition {
  schemaVersion: 1;
  stageId: string;
  title: string;
  story: {
    intro: string;
    goal: string;
    completion: string;
  };
  subject: "english" | "maths" | "science";
  environment: {
    templateId: "forest_bridge" | "crystal_cave" | "castle_garden";
    paletteId: string;
    decorationSetId: string;
  };
  player: {
    spawnSlot: string;
    goalSlot: string;
  };
  platforms: Array<{
    slotId: string;
    platformType: "ground" | "ledge" | "bridge";
    enabled: boolean;
  }>;
  obstacles: Array<{
    obstacleId: string;
    type: "gap" | "gate" | "heavy_rock";
    slotId: string;
    mandatory: boolean;
  }>;
  normalQuestion: {
    encounterSlot: string;
    templateId: string;
    parameters: Record<string, string | number | string[]>;
    choiceCount: 3 | 4;
    answerChoices: Array<{
      choiceId: string;
      approvedContentId: string;
    }>;
    hint: { sequenceIds: string[] };
    hintPolicyId: string;
    normalRewardId: "open_gate" | "repair_bridge" | "grow_vine";
  };
  powerQuestion?: {
    encounterSlot: string;
    templateId: string;
    parameters: Record<string, string | number | string[]>;
    choiceCount: 3 | 4;
    answerChoices: Array<{
      choiceId: string;
      approvedContentId: string;
    }>;
    hint: { sequenceIds: string[] };
    hintPolicyId: string;
    temporaryPower: "super_strength";
    powerDuration: { kind: "eligible_obstacles"; count: 1 };
    powerObstacleId: string;
    bonusPathId: string;
    skipAfterAttempts: number;
  };
  bonusPaths: Array<{
    bonusPathId: string;
    entranceSlot: string;
    exitSlot: string;
    optional: true;
    bonusRewardId: string;
  }>;
  completionCondition: {
    kind: "normal_question_then_crystal";
    crystalId: "english" | "maths" | "science";
  };
  difficulty: {
    curriculumBand: "foundation";
    difficultyLevel: 1 | 2 | 3;
    skillTags: string[];
    maxQuantity?: number;
    readingSupport: "pictures_and_audio" | "pictures_and_text";
    reviewedContentPackVersion: string;
  };
}
```

`answerChoices` and `hint` above describe the backend-canonical validated form so the conceptual stage contains the required playable material. The model-facing candidate should omit both: the deterministic question engine injects them from the approved template and parameters. The authoritative correct answer remains backend-derived and is not sent in the Player API projection before resolution. Implementations may persist the canonical fields or reproduce them from a stable template/content-pack version and hash, but must get identical results.

### Ownership matrix

| Field/category | Linus may control | Model may propose | Fixed/derived by engine/backend | Parent approval | Never model-controlled |
|---|---:|---:|---:|---:|---:|
| Title and short story | Yes, within limits | Yes | Sanitise/limit | Sensitive names | — |
| Subject | Choose from approved | Yes from allowlist | Validate | Approved subjects/band | — |
| Environment template/palette/decor | Choose allowlist | Yes | Asset lookup | Asset pack | URLs/files/assets outside catalogue |
| Spawn/goal/platform/encounter slots | Via simple approved choices later | Yes from template slots | Geometry and reachability | — | Raw collision shapes/physics constants |
| Obstacles | Safe type/slot | Yes | Mandatory-path invariant | Fright/intensity policy | Scripts/behaviour definitions |
| Question template/topic | Choose approved | Select/propose IDs/params | Canonical prompt/choices/correct answer/hints | Content pack and difficulty | Correct answer, truth, arbitrary question text |
| Choice count | Possibly choose 3/4 | Propose | Bound and accessibility validate | Defaults | Choice correctness |
| Normal reward/world consequence | Choose compatible option | Propose ID | Execute allowlisted effect | — | Reward amounts or executable effects |
| Power availability | Request optional challenge | Propose placement/template | Enforce Super Strength rules | Enabled/difficulty | Duration >1, mandatory power, removal of normal route |
| Power duration/consumption | No | No | Exactly one eligible rock | Policy | Always never |
| Bonus path | Theme/approved slot | Propose safe ID/slot | Reachability and optionality | Bonus content | Mandatory progression/competitive reward |
| Completion condition/crystal identity | No | Select only when subject mapping allows | Engine-owned | Story order | Arbitrary completion logic |
| Difficulty metadata | Choose parent-approved band | Suggest tags | Calculate/check hard limits | Yes | Self-certification as age-appropriate |
| IDs, schema/version, hashes, timestamps/status | No | No | Server generated | — | Always never |
| Auth, roles, publication, DB/network/model config | No | No | Backend/operations | Parent | Always never |
| Code, HTML, Markdown, URLs, file paths, shaders, dependencies | No | No | Not stage data | — | Always never |

### Validation pipeline

Run in this order and return stable issue codes:

1. **Transport:** content type/size and parseable JSON.
2. **Structure:** exact Zod schema, unknown keys rejected, string/array/number bounds.
3. **Catalogue:** every template, asset, slot, reward, and content-pack reference exists and is approved.
4. **Canonicalisation:** question templates resolve approved parameters into a deterministic instance.
5. **Content:** allowed vocabulary/topics, instruction length, no unsafe text/markup/URLs/personal data, curriculum band.
6. **Geometry:** objects fit slots, no illegal overlaps, spawn/goal safe.
7. **Reachability:** normal route exists using engine movement envelope; mandatory question and crystal reachable without power.
8. **Power invariants:** optional, one use, eligible rock exists, bonus path optional, skip/normal path available.
9. **Completion/reward:** one valid crystal, no bypass of mandatory normal question, idempotent reward IDs.
10. **Publication policy:** exact version/hash passed preview and any required parent approval.

Static template-slot reachability is preferable to attempting a general platformer solver. Every environment template should have pre-proven route graphs; stage validation then checks graph activation and requirements.

## Question engine

### Data model

An approved content pack is developer/parent-reviewed, versioned data:

```text
template definition
  + allowed parameter domains
  + deterministic renderer/canonicaliser
  + answer rule
  + distractor rule
  + ordered visual hints
  + alt text/audio references
  + curriculum/difficulty metadata
  + attempt/skip policy
  + content review record
```

At draft validation, the backend turns a stage’s template reference and parameters into a canonical `QuestionInstance` with a stable hash. At answer time the browser submits only the question-instance ID and choice/tile action IDs. The backend compares against derived truth and returns `correct`, `hint`, or `complete`.

### Age and correctness controls

- quantity hard cap initially 10 for normal questions; Power Question may use a separately approved small stretch;
- only approved CVC words, pictures, grapheme/phoneme mappings, scientific categories, and terminology;
- no ambiguous “more/fewer” ties unless the template explicitly teaches “same”;
- choices unique in meaning and display;
- pictures include concise alt text; colour is not the only discriminator;
- instructions and hint sequences have fixed length limits;
- drag interactions have tap alternatives;
- repeated answers cannot create duplicate rewards;
- an incorrect answer stores progress, advances a hint index, and never sends a punitive event.

The model can suggest a content reference, but the pack and deterministic engine decide if it exists, is correct, and is permitted.

## Preview, publishing, and rollback

### Records, not deployments

Use one deployment and separate data states:

- `DRAFT`: immutable version visible to its creator/parent and preview API.
- `VALIDATED`: draft version with a validation report tied to exact content hash and validator/content-pack versions.
- `PUBLISHED`: immutable version eligible for a stage’s current published pointer.
- `SUPERSEDED`: descriptive status if useful; immutable record remains restorable.

Preview is an access-controlled route that loads an exact version with a preview banner. Player queries resolve only `stages.current_published_version_id`.

### Publish transaction

In one database transaction:

1. load exact version and content hash;
2. confirm not mutated and latest validation is passing under current required validators/content pack;
3. confirm preview checklist and parent approval policy;
4. set publication metadata for the immutable version;
5. update `current_published_version_id`;
6. create audit and Creator Star records idempotently.

If any step fails, nothing changes for Lucas.

### Rollback

Rollback does not copy or modify stage content. Parent/authorised Creator selects a prior immutable published version, the backend rechecks compatibility with the current engine/schema, and a transaction changes the current published pointer plus audit record. If an old schema needs migration, migrate it to a new candidate version and validate rather than mutating history.

### Rejected operational separation

- Separate Kubernetes deployments/namespaces: no; data authorisation provides the needed separation at far lower cost.
- Separate routes: yes, for experience and authorisation (`/creator`, `/play`, `/parent`, and matching APIs), but not separate apps/clusters.
- Draft and published records: yes.
- Immutable published versions: yes.
- Container rebuild per stage: no; stages are validated data.

## Persistence design

### Conceptual tables

| Table | Minimum purpose and notable constraints |
|---|---|
| `profiles` | ID, display pseudonym, role, active flag, timestamps; no unnecessary birth date |
| `parent_credentials` | PIN verifier and recovery metadata if approved; never plaintext |
| `stages` | stable stage identity, owner, current draft pointer if desired, current published version FK |
| `stage_versions` | immutable version number, parent version, definition JSON, content hash, schema version, status metadata, creator prompt request ID |
| `validation_runs` | version/hash, validator/content-pack versions, pass/fail, issue codes/details, timestamp |
| `preview_runs` | exact version, creator, started/completed, checklist and observed events |
| `publication_events` | stage, from/to version, publisher/approver, publish/rollback reason, timestamp |
| `question_instances` | canonical template ID/version, parameters, hash, safe rendering metadata; answer can remain derivable |
| `play_sessions` | profile, exact stage version, start/end/status, ephemeral power state only if resume is supported |
| `question_attempts` | session, instance, selected action ID, outcome, hint index, timestamp |
| `stage_completions` | unique profile + stage version completion, timestamps |
| `reward_awards` | unique reward type + profile/team + stage version; idempotency key |
| `power_attempts` | session/version, question instance, outcome/hint/skip |
| `power_usage` | unique session + power grant; obstacle ID and consumed timestamp |
| `creator_progress` | scaffold level, evidence/unlock source, parent override |
| `player_progress` | derived crystal milestones and last played pointers; avoid duplicating derivable totals |
| `model_requests` | task/template/model metadata, hashes, timing/outcome; full text under retention setting only |
| `parent_settings` | versioned publication, difficulty, content pack, privacy, retention, audio, network acknowledgement settings |
| `audit_events` | actor, action, target, safe metadata, timestamp |
| `schema_migrations` | applied migration ID/checksum/time |

Store stage JSON for immutable fidelity while indexing lifecycle fields relationally. Do not make arbitrary JSON the only validation layer.

### Volume, migrations, and recovery

- One Fastify replica mounts one ReadWriteOnce local volume.
- Database, WAL, and shared-memory files remain together.
- Backups reside outside the live database directory and outside the disposable Kind node.
- Migration runner takes a safe pre-migration backup, obtains an application lock, checks current version, applies one transaction where supported, records checksum, and refuses unknown future versions.
- Backup schedule candidate: before migration/restore and a parent-triggered or daily rotating backup while the Mac is active; retention requires parent approval.
- Backup validation opens the backup read-only and runs `quick_check` or `integrity_check`.
- Restore stops writes/application, preserves the suspect live files, validates the selected backup, restores all required files through the documented method, then runs migrations and integrity checks.
- On corruption: stop writes, copy all DB/journal/WAL files for forensic recovery, restore the latest verified backup, then use SQLite recovery tools only on copies. Never repeatedly write to the damaged original.

## Local deployment topology

### Kind

- Single Kind control-plane node using Podman provider on macOS.
- One application namespace is enough; the default namespace is technically sufficient, but a named local namespace improves cleanup without pretending to be a security boundary.
- One application Deployment, `replicas: 1`, readiness/liveness/startup probes.
- One ClusterIP service plus NodePort 30080 (exact port may be chosen during implementation).
- Kind `extraPortMappings`: Mac host 8080 → node 30080, explicitly `listenAddress: 0.0.0.0` only for LAN acceptance.
- Dedicated host directory → Kind `extraMounts` → local PV/PVC → application data path.
- Fastify serves built assets and `/api` at the same origin.

No ingress controller, load balancer, public registry requirement, router port forwarding, or per-stage workloads.

### Model access boundary

The model stays on the Mac host and outside Kubernetes so it can use native local acceleration. Only the backend knows its URL. Deployment setup must:

1. establish and document a Podman/Kind-reachable host name or narrow relay;
2. configure `MODEL_BASE_URL` as backend-only environment/secret data;
3. verify backend pod health request;
4. verify an iPad/laptop cannot connect to the raw model port;
5. verify no public/cloud fallback occurs during outage;
6. fail Creator generation closed while continuing Player Mode.

### Home network

- Family connects to `http://<Mac-private-IP>:8080`.
- Mac firewall allows only the application port on the trusted private network.
- Router has no port forwarding/UPnP rule.
- Model port, Kubernetes API, database, Podman socket, and admin tooling are not LAN-exposed.
- Local HTTP limitation is explicitly accepted by parent or replaced later with trusted local HTTPS.
- Mac sleep and IP changes are operational availability issues; show a parent runbook rather than hiding them.

## Security boundaries

1. **Browser/backend:** all browser input is untrusted; session and role checks occur on every protected API.
2. **Mode boundary:** Player API projection has no draft/model/admin data.
3. **Backend/model:** model is untrusted and cannot access tools, database, filesystem, or network through the application.
4. **Candidate/engine:** exact schema plus semantic validation; no executable fields.
5. **Draft/published:** immutable versions and current-published pointer; preview cannot change pointer.
6. **Application/operations:** no Podman socket, Kubernetes service-account mutation rights, kubeconfig, terminal, or code-server in the app.
7. **LAN/public internet:** only one application port; no router forwarding; raw model denied.
8. **Data/privacy:** collect minimally, use pseudonyms, local default, explicit retention/deletion, parent-controlled export.

For local sessions, a family profile picker is usability, not authentication. Parent/Creator privileges still need a deliberate guard appropriate to the household; final PIN rules require approval.

## Risk register

Likelihood and impact are qualitative for the home MVP: Low (L), Medium (M), High (H).

| Risk | Likelihood | Impact | MVP mitigation | Later mitigation |
|---|:---:|:---:|---|---|
| Direct model exposure | M | H | Backend-only URL; firewall raw port; no CORS reliance; negative LAN test | Mutual auth/local proxy, network policy, TLS |
| Arbitrary AI-generated code | M if allowed; L under plan | H | Stage data only; reject code/HTML/URLs/scripts; no tool calls or patch execution | Sandboxed, human-reviewed patch workflow in a separate development system, not child runtime |
| Unsuitable generated content | M | H | Allowlists, short text limits, content filters, parent packs/approval, safe fallback | Curated classifiers, expanded review workflow, formal safety evaluation |
| Malformed stage definitions | H | M | Structured constraint plus Zod and semantic validation; one repair; retain prior draft | Provider conformance suite, schema negotiation |
| Broken published stages | M | H | Pre-proven templates, reachability tests, real preview checklist, publish revalidation, immutable rollback | Automated play agents, canary family cohort |
| Secrets leakage | L/M | H | No browser credentials; environment/secret reference; redacted logs; no cloud keys in MVP | Secret manager and rotation |
| Kubernetes credentials misuse | L | H | No kubeconfig/service account mutation token in app; minimal RBAC; local-only API | Separate operator account, policy enforcement |
| Unrestricted terminal access | L under plan | H | No code-server, shell, exec API, or terminal UI; children never access development tools | Separate authenticated development workstation/network |
| Model outage | M | M | Player independent; clear Creator health/failure; retain draft; no silent cloud | Explicit parent-approved alternative local provider |
| Model timeout | M/H on local hardware | M | Abort deadline, concurrency 1, one transient retry, cancel UI | Queue, hardware/model sizing, adaptive limits |
| Resource exhaustion | M | H | Payload/token/string/object caps; generation concurrency 1; pod resource requests/limits; asset budgets | Job queue, quotas, monitoring, separate inference host |
| SQLite corruption | L | H | Local filesystem, one writer, FULL sync/default safety, safe backups, integrity checks, tested restore | Off-device encrypted backup, redundant storage |
| Accidental public exposure | M | H | Private IP, firewall, no port forwarding/UPnP/tunnel, exposure checklist | Authenticated HTTPS/reverse proxy, network segmentation |
| Child privacy | M | H | Local default, pseudonyms, data minimisation, no telemetry/ads, parent retention/delete/export, no raw prompt logging by default | Privacy impact assessment, consent/age design review, compliance review before packaging |
| Stage-history loss | M | H | Immutable DB versions, external rotating backups, restore rehearsal | Encrypted off-device/versioned backup |
| Incompatible iPad behaviour | M | M/H | Pointer events, large targets, no required secure API, WebKit E2E plus real-device/manual gates | Supported-device matrix and device lab |
| Incorrect question answer | M if AI-authored; L with templates | H | Deterministic approved templates, canonical answer engine, review tests; model not authority | Independent educational review and content-pack signing |
| Ambiguous Kindergarten level | M | M/H | Hard limits/tags, approved packs, parent choice, family testing | Educator review and evidence-based progression |
| Draft leakage to Lucas | L/M | M | Server-side role/version filters; Player response projection; access tests | Stronger account auth if multi-household |
| Power blocks normal route | M during development | H for experience | Template graph invariant and E2E tests; power obstacle only on bonus entrance | Automated reachability/property testing |
| Reward competition/version farming | M | M | Idempotent per-version stars, no leaderboard/currency, meaningful-change rule pending | Parent reporting and anti-spam heuristic |
| Local HTTP interception | L/M on trusted Wi-Fi | M | No secrets in child traffic, trusted LAN only, explicit parent acceptance | Locally trusted HTTPS |
| Mac sleep/IP change | H | L/M | Parent runbook, visible health, DHCP reservation option; graceful reconnect | Dedicated always-on host/local DNS |
| Backup contains sensitive prompts | M | M | Prompt retention off/short by default; backup access restricted; deletion policy | Encrypted backup with managed keys |
| Asset licence/provenance failure | M | M/H | Asset register, approved sources/licences, no unreviewed AI art | Automated licence inventory and legal review |

The OAIC states that the Privacy Act protects personal information regardless of age and that capacity to consent must be assessed; a parent may need to consent when a child lacks capacity. The Children’s Online Privacy Code was still in development at the research date, with a final code due later in 2026. A packaged or internet-facing product therefore requires a fresh legal/privacy review rather than relying on this home-MVP risk treatment.

## Architecture decisions and trade-offs

| Decision | Choice | Benefit | Cost/trade-off | Revisit when |
|---|---|---|---|---|
| Application shape | Modular monolith | Simplest deploy/debug/transaction boundary | Less independent scaling | Multiple households or distinct scaling needs |
| UI/game split | React DOM + Phaser canvas | Accessible forms/overlays and capable game loop | Event boundary must stay disciplined | Canvas-only UI becomes demonstrably simpler, unlikely |
| Stage model | Fixed engine + bounded data | Safe generation, validation, rollback | Less creative freedom | Linus masters schema and controlled code changes are separately designed |
| Layout | Code-defined templates/slots | Reachability and AI safety | Fewer bespoke maps | Human map authoring demand justifies Tiled |
| Physics | Arcade Physics | Simple/fitting for forgiving platforming | Not complex shapes/simulations | Game design requires them |
| Content | Controlled approved templates | Correct and age-bounded | Upfront authoring, finite variety | Reviewed hybrid generation proves safe |
| Model | Backend provider adapter | No browser exposure/provider lock-in | Adapter/capability tests | A stable standard removes differences |
| Publication | Data records/pointer | Atomic, fast, rollbackable | Same runtime serves both modes | Stronger isolation needed for public multi-tenant service |
| Database | SQLite, one replica | Minimal operations, transactions | Single-node writer | Sustained multi-writer/concurrency need |
| Deployment access | NodePort + Kind mapping | No ingress controller | One port and changing host IP | Multiple services/hostnames/TLS |
| Transport | Local HTTP initially | Lowest setup | Unencrypted and no secure-context APIs | Parent requires stronger security/PWA features |
| Art | Placeholders then one cleared pack/minimal custom set | Fast mechanics validation | Early look is rough | Interaction is stable |
| Rewards | Cooperative milestone stars | Aligns sibling collaboration | Needs meaningful-version rule | Family testing shows different motivation needs |

## Architecture acceptance evidence for the later specification

The formal specification should require evidence that:

- a malformed or unsafe candidate cannot be previewed as valid or published;
- a valid draft never appears in Player Mode before publication;
- publication and rollback are atomic and resolve exact immutable versions;
- the normal route is completable with the Power Question skipped or failed;
- the model can be offline while Lucas plays;
- no browser can reach the raw model through the application;
- correct answers are reproduced without a model;
- stage completion/rewards remain idempotent under retries;
- database backup and restore are rehearsed;
- an iPad on home Wi-Fi can play through, while model/Kubernetes/database ports remain inaccessible.
