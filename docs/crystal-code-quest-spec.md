# Crystal Code Quest — Product and Delivery Specification

**Version:** 1.1  
**Date:** 30 July 2026  
**Repository:** `crystal-code-quest`  
**Repository visibility:** Private  
**Deployment:** Local Kind Kubernetes cluster  
**Network exposure:** Home/local network only  
**Game being built:** **The Crystal Adventure**

---

## 1. Product definition

**Crystal Code Quest is a learning game that teaches Linus vibe coding by helping him build a real game.**

It is not:

- a simulated coding lesson;
- a prompt playground disconnected from a product;
- a dashboard that only reports learning;
- an AI chat interface with a child theme.

Every completed build quest will eventually create a tested, reviewable, reversible change in the actual **The Crystal Adventure** codebase.

The product has two connected learning loops:

### Build learning loop

Linus learns to:

1. choose and shape an idea;
2. express the idea clearly;
3. check what the AI understood;
4. approve a bounded plan;
5. observe the build process;
6. test the real result;
7. understand what changed;
8. improve the next request.

### Play learning loop

A player learns maths, spelling, problem-solving, and other approved topics by playing **The Crystal Adventure**. Correct answers and progress affect the game experience through powers, obstacles, rewards, and story progression.

---

## 2. Product boundaries

### 2.1 Crystal Code Quest

The learning and building platform.

It contains:

- a **Child Builder account** for Linus;
- a **Parent account** for supervision, observation, approval, and learning review;
- the guided vibe-coding learning journey;
- prompt selection and later prompt writing;
- AI-plan review;
- build, test, review, and rollback workflows;
- a preview and launch route for The Crystal Adventure;
- the parent view of Linus’s ideas, prompts, learning, and builds.

### 2.2 The Crystal Adventure

The real game created and extended through Crystal Code Quest.

It contains:

- a **Player account**;
- a **Parent account**;
- educational gameplay;
- player learning evidence;
- parent visibility into what the player attempted and learned.

### 2.3 Account summary

| Product               | Account       | Purpose                                                                                                                     |
| --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Crystal Code Quest    | Child Builder | Selects ideas, learns prompting, reviews plans, initiates builds, tests features, and learns from changes                   |
| Crystal Code Quest    | Parent        | Reviews prompts, ideas, learning evidence, imagination journal, build history, safety decisions, approvals, and progression |
| The Crystal Adventure | Player        | Plays the real game and completes educational challenges                                                                    |
| The Crystal Adventure | Parent        | Reviews the player’s learning progress, attempts, strengths, difficulties, and game-based learning history                  |

The Parent identity may eventually be shared across both products, but the two role experiences must remain clearly separated.

---

## 3. Central product promise

> **Linus imagines it in Crystal Code Quest. The agents safely build it in The Crystal Adventure. A player then learns by playing it.**

The interface must always make this connection visible.

Examples:

- “Your idea will become a real feature in The Crystal Adventure.”
- “Review what the AI understood before it changes the game.”
- “The feature passed its tests. Open The Crystal Adventure and try it.”
- “This is the game rule your prompt created.”

---

## 4. Phase gates

Development is deliberately phased.

**No later phase may begin automatically.**

At the end of each phase:

1. the phase acceptance criteria must pass;
2. the parent must test the product;
3. findings must be recorded;
4. the parent must explicitly approve starting the next phase.

The most important gate is after **Phase 1**. The interface must be tested as both Parent and Child Builder before agent implementation begins.

---

# Phase 0 — Repository and design foundation

## Goal

Create a clean, testable foundation without implementing agent behaviour.

## Deliverables

- private Git repository structure;
- TypeScript project configuration;
- formatting, linting, type checking, unit testing, and browser testing;
- `AGENTS.md`;
- architecture decision record for the initial stack;
- design tokens and reusable UI primitives;
- seeded local data;
- container image;
- local Kind manifests;
- developer documentation;
- design reference stored in the repository.

## Recommended initial stack

A TypeScript-first full-stack application:

- Next.js or another mature React server framework;
- React and TypeScript;
- Tailwind CSS or an equivalent token-driven styling layer;
- Motion for restrained interaction feedback;
- accessible headless primitives;
- Zod for contracts and validation;
- SQLite for local single-family persistence;
- secure server-side session cookies;
- Vitest and Testing Library;
- Playwright for role-based end-to-end tests;
- pnpm;
- container image suitable for Kind.

The implementation model must inspect the current environment and explain any change from this stack before proceeding.

## Initial structure

```text
crystal-code-quest/
├── app/ or apps/
├── components/
├── features/
│   ├── auth/
│   ├── child-builder/
│   ├── parent/
│   ├── quest-flow/
│   ├── learning/
│   └── adventure-preview/
├── lib/
├── packages/
│   ├── contracts/
│   └── design-system/
├── data/
├── tests/
│   ├── unit/
│   └── e2e/
├── infrastructure/
│   └── kind/
├── docs/
├── public/
│   └── design-reference.png
├── AGENTS.md
├── opencode.json
└── README.md
```

The exact structure may differ if the chosen framework has strong conventions, but role boundaries and contracts must remain explicit.

## Acceptance criteria

- clean install works;
- formatting, linting, type checking, tests, and production build pass;
- app runs locally;
- app runs in Kind;
- no secret is committed;
- no external service is needed for Phase 0;
- architecture and commands are documented.

---

# Phase 1 — Complete interface and account experience

## Goal

Build a beautiful, functional, locally persisted interface for both the **Child Builder** and **Parent** accounts.

This phase uses seeded or mocked build data. It must not call an LLM, modify The Crystal Adventure, execute arbitrary commands, or implement autonomous agents.

After this phase, the parent will test Crystal Code Quest as both account types and approve or reject the interface direction.

---

## 5. Phase 1 account model

### 5.1 Parent account

The Parent account is the trusted supervisory account.

Initial capabilities:

- sign in through a local parent login;
- view Linus’s account;
- view prompts and choices selected by Linus;
- view how each selected idea became a structured request;
- see what Linus learned from each quest;
- view an **Imagination Journal**;
- view completed, in-progress, failed, and mocked builds;
- inspect an understandable summary of what changed;
- approve or lock learning stages;
- set local usage limits;
- access safety and account settings;
- switch into a clearly marked preview of the Child Builder experience.

Parent access must not be available through a simple child-facing role-switch button.

### 5.2 Child Builder account

The Child Builder account is Linus’s guided learning experience.

Initial capabilities:

- sign in through a child-friendly local account screen;
- choose an approved build quest;
- make structured creative choices;
- review what Crystal Guide understood;
- start a mocked build journey;
- receive truthful progress based on mocked workflow state;
- see a mocked successful or rolled-back result;
- learn what the prompt achieved;
- view previous quests and learning achievements;
- launch the existing game preview where available.

### 5.3 Phase 1 authentication

Phase 1 must implement real local sessions and role protection, but it is not internet-grade identity management.

Requirements:

- Parent and Child Builder are separate accounts;
- parent credentials are not visible in the browser bundle;
- passwords or PINs are stored as secure hashes;
- sessions use HTTP-only cookies;
- parent routes reject child sessions;
- child routes do not expose parent-only data;
- demo seed credentials are provided through local setup, not hard-coded into rendered UI;
- the README explains that this is a local-family deployment.

---

## 6. Crystal Code Quest visual direction

### 6.1 Code Quest identity

Crystal Code Quest uses a **clean hacker-style learning interface**.

Primary visual language:

- near-black, charcoal, and deep slate surfaces;
- teal, mint, cyan, and restrained electric-blue accents;
- small violet accents only where they connect to The Crystal Adventure;
- crisp typography;
- code-inspired details without pretending to be a terminal;
- thin borders, soft depth, and precise spacing;
- high contrast and excellent readability;
- premium and modern, not corporate;
- child-friendly without looking preschool-like.

### 6.2 Product separation

The colourful blue and purple crystal-world palette belongs mainly to **The Crystal Adventure**.

Within Crystal Code Quest, that world appears only in:

- game previews;
- build-result previews;
- feature thumbnails;
- adventure history;
- selected badges or crystal rewards.

This separation helps Linus understand:

- Crystal Code Quest is where he learns and builds;
- The Crystal Adventure is the game world he changes and plays.

### 6.3 Human Parent Guide

Crystal Code Quest does not use a robot as the main guide.

The guide should appear as a:

- warm, calm, capable parent-like human mentor;
- trustworthy adult in casual modern clothing;
- supportive coach rather than a teacher or authority figure;
- clearly illustrated or rendered character, not a claimed likeness of the real parent.

The Parent Guide:

- explains the next step;
- reminds Linus to check the AI plan;
- breaks large ideas into smaller choices;
- celebrates effort and learning;
- never pretends that a failed build succeeded.

Robots remain characters inside The Crystal Adventure.

### 6.4 Interaction principles

The interface must be highly interactive but restrained.

Use:

- clear hover, focus, press, selected, loading, success, and error states;
- responsive quest cards;
- progressive disclosure;
- visual prompt construction;
- step-by-step AI-plan comparison;
- meaningful transitions;
- subtle progress illumination;
- before-and-after previews;
- keyboard navigation;
- reduced-motion support.

Avoid:

- looping mascot animation;
- excessive glow;
- flashing effects;
- fake terminal output;
- walls of text;
- generic analytics dashboards;
- dozens of decorative cards;
- hidden critical actions;
- animations that delay repeated use.

---

## 7. Child Builder experience

### 7.1 Child home

Must show:

- “Welcome back, Linus”;
- current quest;
- next learning step;
- recent feature added to The Crystal Adventure;
- learning streak;
- current unlocked stage;
- “Start a new quest” action;
- game preview;
- Parent Guide panel.

### 7.2 Quest journey

Visible journey:

```text
Choose an idea
→ Shape the prompt
→ Review the AI plan
→ Build the feature
→ Test the game
→ Learn what changed
```

Phase 1 implements this as a complete mocked journey with explicit application state.

### 7.3 First guided quest

The first fully implemented quest is:

> **Give Lucas Super Jump after he correctly answers a hard maths question.**

Selections:

- quest category: Power;
- character: Lucas;
- power: Super Jump;
- trigger: Correct Answer;
- subject: Maths;
- difficulty: Hard;
- usage: One obstacle.

### 7.4 Prompt construction

At the first learning stage, Linus selects approved options.

The interface then constructs:

> When Lucas answers a hard maths question correctly, give him Super Jump for one obstacle.

It also visually identifies:

- Who: Lucas
- What: Super Jump
- When: Correct hard maths answer
- How long: One obstacle
- Expected result: Lucas can clear a higher obstacle

### 7.5 AI-plan review

Phase 1 uses a mocked AI plan but presents the final shape required for the real system.

Example:

```text
The AI understood:

1. Listen for a correct hard maths answer.
2. Give Super Jump to Lucas.
3. Let Lucas clear one approved obstacle.
4. Remove the power after it is used.
5. Check that existing questions still work.
```

Actions:

- Change my idea
- Build my idea

### 7.6 Build journey

Use truthful named states, even when mocked:

- Preparing a safe workspace
- Finding the right game systems
- Creating the feature
- Testing the game
- Inspecting the change
- Preparing the preview

The UI must make it obvious in developer documentation that this phase is mocked. It must not falsely claim that code was changed.

### 7.7 Result and learning

Success result:

- mocked game preview;
- “Play latest build” button routed to a placeholder or configured preview;
- feature summary;
- learning explanation;
- prompt structure recap;
- one reflection question.

Example learning explanation:

> You created a rule with two conditions: the answer must be correct and the question must be hard. Only then does Lucas receive Super Jump.

Failure result:

> The feature did not pass all game checks, so the previous version was kept safe.

---

## 8. Parent experience

### 8.1 Parent overview

Must show:

- Linus’s current learning stage;
- latest selected prompt;
- latest completed quest;
- recent learning outcome;
- builds by status;
- parent actions requiring attention;
- local usage summary.

### 8.2 Prompt and idea history

For every quest, show:

- date and time;
- original template;
- options Linus selected;
- final constructed prompt;
- later free-written prompt when that stage is unlocked;
- what the system understood;
- changes Linus made after reviewing the plan;
- final build outcome.

### 8.3 Learning evidence

Do not show only points or badges.

Show evidence such as:

- identified the correct character and action;
- added a trigger;
- added duration or usage;
- noticed a missing requirement;
- changed an AI plan before approving it;
- tested the feature;
- explained why the result matched or did not match the request;
- learned an `if` condition;
- learned that two conditions can both be required.

### 8.4 Imagination Journal

The Parent account must help the parent understand how Linus’s imagination is developing.

Show:

- ideas and themes he repeatedly chooses;
- unusual combinations he creates;
- characters he prefers to develop;
- types of problems he likes solving;
- how an initial idea evolved after review;
- original ideas suggested by Linus;
- features he revisited and improved;
- short reflections recorded after quests.

Do **not** create a simplistic “imagination score” or rank creativity. The purpose is to preserve evidence and patterns, not judge the child.

Example entries:

```text
Idea:
Lucas should become lighter instead of simply jumping higher.

Why it is interesting:
Linus changed the game mechanic, not only the visual effect.

What he learned:
A result can be implemented in different ways.
```

### 8.5 Parent controls

Phase 1 controls:

- current learning stage;
- feature categories shown to Linus;
- daily quest limit;
- account access;
- parent PIN/password change;
- review mocked blocked requests;
- view seeded safety rules.

Real model cost limits and agent approvals are introduced in later phases.

---

## 9. Phase 1 required screens

### Shared

- landing/login;
- account-specific login;
- access-denied;
- loading and error states;
- responsive navigation.

### Child Builder

- home;
- quest catalogue;
- guided quest builder;
- prompt construction;
- AI-plan review;
- mocked build journey;
- success;
- safe failure/rollback;
- My Adventure;
- learning history;
- achievements;
- profile.

### Parent

- overview;
- prompt and idea history;
- quest detail;
- learning evidence;
- Imagination Journal;
- build history;
- learning-stage controls;
- safety and settings;
- child-experience preview.

---

## 10. Phase 1 data model

Minimum entities:

```text
User
Role
ChildProfile
ParentChildRelationship
QuestTemplate
QuestSelection
PromptRecord
PlanRecord
BuildRecord
LearningEvidence
ImaginationJournalEntry
Achievement
LearningStage
ParentPolicy
Session
```

Requirements:

- typed contracts;
- validation on every server boundary;
- timestamps;
- stable IDs;
- role-based access checks;
- seeded demo history;
- no model-generated content in Phase 1.

---

## 11. Phase 1 testing

### Unit and component tests

Cover:

- prompt construction;
- learning-evidence rendering;
- role guards;
- parent policy controls;
- quest-state transitions;
- empty, loading, success, and failure states;
- accessibility of custom interactions.

### End-to-end scenarios

#### Parent

1. Sign in as Parent.
2. View Linus’s latest selected prompt.
3. Open the quest detail.
4. See what he learned.
5. Open the Imagination Journal.
6. Change an allowed learning-stage setting.
7. Confirm child-only pages do not expose parent controls.

#### Child Builder

1. Sign in as Linus.
2. Start the Super Jump quest.
3. Select approved options.
4. Review the constructed prompt.
5. Review the mocked AI plan.
6. start the mocked build;
7. see a successful result;
8. view the learning explanation;
9. confirm parent-only routes are denied.

#### Responsive

Repeat the core child flow on:

- laptop viewport;
- iPad landscape;
- iPad portrait;
- narrow mobile viewport for basic resilience.

---

## 12. Phase 1 acceptance gate

Phase 1 is complete only when:

- both accounts work with separate local sessions;
- all required screens are implemented;
- the child flow is genuinely interactive;
- the Parent account shows selected prompts, learning evidence, and Imagination Journal entries;
- the visual distinction between Code Quest and The Crystal Adventure is clear;
- the Parent Guide is human and parent-like;
- the child-facing UI is safe and understandable;
- laptop and iPad layouts are polished;
- automated tests pass;
- production build passes;
- Kind deployment works on the local network;
- no LLM is called;
- no actual game repository is modified;
- the parent tests both roles and explicitly approves Phase 2.

**Stop after this gate.**

---

# Phase 2 — Guardian and learning engine

## Goal

Replace mocked prompt interpretation with a safe Guardian workflow while keeping the game builder mocked.

## Deliverables

- approved prompt catalogue;
- structured feature-spec schema;
- deterministic content and operation rules;
- Crystal Guide learning coach for age-appropriate explanations and micro-lessons;
- Understanding Gate state model with gates before planning, building, verification, and final Parent approval;
- fixed, reviewed Super Jump micro-lessons and approved quiz questions;
- deterministic passing and retry rules;
- Parent-assisted learning flow without a bypass;
- learning evidence stored for each gate;
- rules preventing agent execution before demonstrated understanding;
- Guardian Review for child safety and request clarity;
- learning-stage enforcement;
- real prompt and plan records;
- parent view of real Guardian decisions and learning evidence;
- blocked-request handling;
- provider-independent model gateway behind the Crystal Guide;
- no real game modification yet.

## Crystal Guide

The Crystal Guide is a learning and safety coach, not the technical workflow controller.

- Helps Linus express his idea.
- Checks that the request fits the approved learning stage.
- Explains safety decisions in child-friendly language.
- Converts free-form wording into a structured request.
- Teaches one small coding concept per stage.
- Does not execute code or shell commands.
- Does not bypass safety rules or approve builds.

## Understanding Gate

Before the system executes the next agent stage, Linus must demonstrate a basic understanding of what his instruction means, what the game should check, what result should happen, what should happen after the feature is used, and why the next technical stage is necessary.

- The first implementation uses fixed, reviewed questions rather than AI-generated quiz questions.
- AI-generated variations may be added later, but every answer must still be checked against deterministic approved learning rules.
- The system must identify one or two essential questions for each stage.
- Linus must answer all essential questions correctly before Proceed becomes available.
- After an incorrect answer, the Guide explains again with different words, shows a small example, and asks a similar question.
- Parent assistance does not automatically unlock Proceed.
- No agent job, provider call, repository inspection, build, repair, or activation may begin before the required Understanding Gate for that stage has passed.

## Gate

Parent tests prompt interpretation, teaching quality, quiz behaviour, and safety decisions before real coding access is introduced.

---

# Phase 3 — Real game-build pipeline

## Goal

Allow one approved Crystal Code Quest quest to make one real, bounded change in The Crystal Adventure.

## First real feature

> Give Lucas Super Jump after a correct hard maths answer.

## Deliverables

- Quest Orchestrator that manages high-level workflow states deterministically;
- separate game repository connection;
- isolated Git worktree or short-lived worker workspace;
- checkpoint and resume data;
- approved file boundaries;
- repository context retrieval;
- provider-independent model gateway for coding providers;
- coding model behind the gateway;
- patch application in the isolated workspace;
- resumable job records for each workflow stage;
- job and cost budgets per quest;
- Parent approval before activation;
- child-facing progress and truthful status;
- complete audit record;
- no direct push and no direct deployment by the builder model.

## Quest Orchestrator

The Orchestrator is deterministic workflow software. It is the source of truth for workflow state, not the models. It advances the quest only through allowed transitions, records checkpoints, enforces budgets and retry limits, and requests Parent approval where required.

High-level states:

- Idea Submitted
- Guardian Review
- Feature Specification
- Planning
- Awaiting Parent Approval
- Preparing Isolated Workspace
- Building
- Verifying
- Independent Review
- Repairing
- Ready for Approval
- Accepted
- Rolled Back
- Paused
- Failed Safely

## Resumable job model

One quest is divided into bounded jobs. Each job stores:

- quest ID;
- child and Parent ownership;
- starting game version;
- job type;
- current status;
- structured input and output;
- provider and model used;
- allowed files and commands;
- start and completion timestamps;
- attempt number;
- token or cost usage where available;
- tool actions;
- error category;
- checkpoint or resume data;
- verification evidence;
- approval record.

A job must be restartable without repeating already accepted work.

## Provider-independent model gateway

The runtime routes jobs by capability, not by hard-coded model name:

- language and coaching;
- planning;
- repository reasoning;
- coding;
- code review;
- explanation.

Provider configuration is server-side. The production application must not require customers to own a provider account.

## Provider fallback and retry

- Retry only transient failures.
- Use exponential backoff.
- Limit retry count.
- Allow a compatible fallback provider.
- Preserve the same structured job input.
- Never silently weaken safety or verification requirements.
- Never activate a partially generated change.
- Record every provider switch in the audit history.

If no provider is available, the job is set to Paused, the checkpoint is retained, and Linus sees “Your quest is safely saved. The Crystal Builder will continue when it is ready.” Model names, tokens, provider errors, stack traces, and subscription limits are never exposed to the child.

## Job and cost budgets

Configurable limits per quest:

- maximum planning attempts;
- maximum builder attempts;
- maximum files changed;
- maximum allowed diff size;
- maximum tool actions;
- maximum runtime;
- maximum AI tokens or cost;
- one controlled repair attempt by default;
- Parent approval threshold for expensive or broad changes.

When a budget is exhausted, stop safely, preserve the checkpoint, do not apply the patch, explain the status to the Parent, and allow the Parent to approve a new budget or cancel the quest.

## Isolated game workspace

Real building occurs only in an isolated copy of The Crystal Adventure:

- separate repository from Crystal Code Quest;
- temporary worktree or short-lived worker workspace;
- fixed starting commit or game version;
- approved file allow-list;
- no access to unrelated home directories;
- no container-engine socket;
- no unrestricted network access;
- minimal scoped credentials;
- no direct push to the default branch;
- no direct deployment by the builder model;
- workspace destroyed after evidence and patch are retained.

## Parent approval

Parent approval is required before the first real repository change, requests outside the catalogue, dependency changes, broad file access, increased budgets, publication, deployment, and activation of a newly built game version.

The Parent view shows Linus’s original idea, structured feature specification, files proposed for change, agent plan, budget usage, test results, reviewer result, risks, and approve/reject/retry/roll-back actions.

## Child experience

The simplified child journey during real builds is:

- Understanding your idea
- Creating a safe plan
- Waiting for Parent approval
- Building in a practice copy
- Checking the feature
- Reviewing the result
- Ready to play

Child-facing status remains truthful and never claims success before deterministic checks and required approval have passed.

## Audit and evidence

The audit record contains actor, action, timestamp, previous state, new state, request or approval ID, provider/model role, files accessed, commands executed, diff digest, test evidence, reviewer decision, and activation or rollback event. Secrets, raw credentials, provider tokens, and unnecessary child personal information are never written to audit records.

## Gate

The real feature must be repeatable, bounded, and recoverable.

---

# Phase 4 — Review, verification, and rollback

## Goal

Make "working" an evidence-based result.

## Deliverables

- deterministic format, lint, typecheck, test, and build checks;
- focused game smoke test;
- browser-console check;
- read-only code reviewer using a different model family;
- one controlled repair attempt;
- automatic rollback;
- parent technical summary;
- child-friendly truthful result;
- game versioning and rollback storage;
- audit record of every verification, review, repair, and activation decision.

## Deterministic verification

Normal software, not an AI opinion, decides whether a build is eligible for review.

Verification may include:

- formatting;
- lint;
- type checking;
- unit tests;
- integration tests;
- production build;
- focused gameplay smoke tests;
- console-error checks;
- path and diff policy checks;
- forbidden-file checks;
- dependency-change checks;
- acceptance criteria generated from the approved feature specification.

A model reviewer must never override a failed deterministic check.

## Independent review

The reviewer should use a different model family from the builder where practical.

The reviewer checks:

- correctness;
- security;
- scope compliance;
- learning intent;
- child-safety constraints;
- maintainability;
- unexpected regressions;
- whether the implementation matches the approved feature specification.

The reviewer is read-only.

## Repair policy

- One controlled repair attempt by default.
- Repair receives the original specification, patch, failed checks, and review findings.
- Repair operates in the same isolated workspace.
- All deterministic checks run again.
- Further failure causes safe rollback or Parent review.
- No open-ended autonomous repair loop.

## Game versioning and rollback

Every accepted build creates a versioned game release. Store:

- source starting version;
- accepted patch;
- verification evidence;
- reviewer result;
- approval record;
- resulting game version;
- activation timestamp;
- rollback target.

The Parent can restore a prior stable version without deleting history. Incomplete, paused, rejected, or failed jobs must never become the active game version.

## Gate

No model opinion may override failed deterministic verification.

---

# Phase 5 — The Crystal Adventure accounts and learning telemetry

## Goal

Connect game play to parent-visible learning evidence.

## Player account

- plays the game;
- completes maths, spelling, and other approved challenges;
- earns in-game effects and progress;
- sees age-appropriate feedback.

## Parent account

- sees player attempts;
- sees topic and difficulty;
- sees correct and incorrect answers;
- sees improvement over time;
- sees where help may be needed;
- sees which Code Quest-built features were encountered.

Avoid surveillance-style analytics. Collect only data needed for learning support.

---

# Phase 6 — Progressive vibe-coding freedom

## Goal

Move Linus gradually from selection to independent prompting and safe code understanding.

Progression:

1. select prompt options;
2. complete a prompt;
3. write a guided prompt;
4. review AI interpretation;
5. explain a small code rule;
6. edit safe values;
7. complete bounded code;
8. propose a feature plan.

Progression depends on demonstrated understanding and parent approval, not only time.

---

# Phase 7 — Operational hardening

## Goal

Harden local deployment and long-term operation.

Deliverables:

- temporary build Jobs;
- restricted service accounts;
- NetworkPolicy;
- secrets management;
- backup and restore;
- cost and quota enforcement;
- structured logs;
- health checks;
- audit export;
- disaster recovery documentation;
- upgrade process.

---

## 13. Development and runtime model strategy

### 13.1 Building Crystal Code Quest

Repository development will use the **OpenCode Go subscription** through the OpenCode client.

Initial development roles:

| Development role                                    | OpenCode Go model               |
| --------------------------------------------------- | ------------------------------- |
| Primary interface and repository implementation     | `opencode-go/kimi-k2.7-code`    |
| Fast repository exploration and small analysis      | `opencode-go/deepseek-v4-flash` |
| Visual, usability, and accessibility review         | `opencode-go/qwen3.7-plus`      |
| Independent code, architecture, and security review | `opencode-go/deepseek-v4-pro`   |

Rules:

- connect through `/connect` and select **OpenCode Go**;
- use `/models` to confirm the model catalogue before starting;
- use the exact IDs displayed by OpenCode rather than guessing;
- use Kimi K2.7 Code for routine implementation;
- reserve DeepSeek V4 Pro for meaningful reviews and difficult fixes;
- use DeepSeek V4 Flash for inexpensive exploration;
- do not call every model for every change;
- do not commit API keys or OpenCode credentials;
- keep sharing disabled.

OpenCode Go is a development service and must not become a hidden dependency of the child-facing interface.

### 13.2 Crystal Code Quest runtime

Phase 1 makes **no model calls**.

For later phases, the application must use a provider-neutral model-routing interface:

```text
Internal/local model
    → Guardian wording, prompt coaching, explanations, and low-risk structured tasks

External hosted model
    → complex repository coding, difficult repairs, and independent code review

Deterministic software
    → policy enforcement, permissions, workflow routing, tests, acceptance, and rollback
```

The runtime must not hard-code OpenCode Go, OpenRouter, or any single provider into business logic. Provider IDs, model IDs, limits, and routing policy belong in server-side configuration.

#### Provider-independent model gateway

Agent roles should request capabilities rather than hard-coded model names:

- language and coaching;
- planning;
- repository reasoning;
- coding;
- code review;
- explanation.

The gateway may route to OpenCode Go during the private family prototype, another commercial AI API, a locally hosted model, or a future provider.

For commercialisation:

- provider accounts belong to the business;
- customer usage is metered through Crystal Code Quest;
- personal development subscriptions must not be shared with customers;
- provider terms and data-retention policies must be reviewed before production use.

#### Provider fallback and retry

- Retry only transient failures.
- Use exponential backoff.
- Limit retry count.
- Allow a compatible fallback provider.
- Preserve the same structured job input.
- Never silently weaken safety or verification requirements.
- Never activate a partially generated change.
- Record every provider switch in the audit history.

If no provider is available, the job is set to Paused, the complete checkpoint is retained, Linus sees a friendly saved-progress message, and the Parent is notified when intervention is needed. Resume later without asking Linus to repeat the idea.

Suggested child-facing wording: “Your quest is safely saved. The Crystal Builder will continue when it is ready.” Do not expose model names, tokens, provider errors, stack traces, or subscription limits to the child.

#### OpenCode limitation clarification

OpenCode is currently a development tool used by Prakhar to build Crystal Code Quest. OpenCode session step limits must not become part of Linus’s product experience. The production agent workflow uses persisted jobs and checkpoints. If OpenCode Go is used as one runtime provider during the private prototype, it must sit behind the provider-independent gateway. An interrupted or exhausted provider call pauses one job; it must not lose the full quest workflow.

OpenCode Go may be evaluated for runtime experiments later, but it is not assumed to be the production runtime provider.

---

## 13A. Learning Guide and coding explanation

Crystal Code Quest must not behave like a hidden code-generation machine.

When Linus selects **Proceed**, the Crystal Guide must explain what is about to happen in simple, age-appropriate language and teach one small coding concept during each stage.

The learning experience must help Linus understand:

- what he asked the computer to do;
- how his idea became a precise instruction;
- what part of the game may need to change;
- what coding concept is involved;
- why the system is checking the result;
- what happened if the build succeeded or failed;
- how mistakes and repairs are part of programming.

The Crystal Guide explains and teaches. The Quest Orchestrator still controls the technical workflow. The Guide must not execute commands, change code, approve builds, or bypass safety rules.

### Before Linus proceeds

Before accepting a Proceed action, show a short summary such as:

“Your idea says that Lucas should get Super Jump after answering a hard maths question correctly. The power should work for one obstacle and then turn off.”

Then explain the next step:

“Next, we will turn your idea into a coding plan. A coding plan tells the builder what should change before it starts working.”

Provide Linus with:

- a clear summary of his idea;
- what the next stage will do;
- one small coding concept;
- a simple confirmation action such as:
  - Proceed;
  - Go back and change my idea;
  - Explain this again.

Do not use a generic confirmation dialog.

### Teaching pattern for every stage

For every child-facing workflow stage, use this teaching structure:

1. **What is happening**
   - one or two short sentences;
   - child-friendly language;
   - no internal provider or infrastructure terminology.

2. **What coding idea this teaches**
   - one small concept only;
   - connected directly to Linus’s feature.

3. **Why we do this**
   - explain the purpose rather than only showing progress.

4. **What Linus should notice**
   - identify the input, rule, expected behaviour, or result.

5. **Check understanding**
   - one optional, simple question or prediction;
   - never block the build because of an incorrect learning answer.

6. **Proceed or review**
   - allow Linus to continue;
   - allow him to review or revise the previous step where safe.

Keep explanations short enough for a child to read without losing interest.

### Concepts taught during the Super Jump quest

Use the first real Super Jump feature to introduce these concepts.

#### Idea and requirement

Child explanation:

“You started with an idea. We made it more exact by choosing who gets the power, what starts it, and how long it lasts. Programmers call this a requirement.”

Teach:

- clear instructions;
- inputs and expected results;
- why precise wording helps a computer.

#### Condition

Child explanation:

“The game needs to check a rule: did Lucas answer a hard maths question correctly? A rule that can be true or false is called a condition.”

Teach:

- true and false;
- `if` behaviour in plain language;
- the difference between hard and easy questions.

Example:

“If the answer is correct and the question is hard, then give Super Jump.”

Do not require Linus to read programming syntax at the first learning stage. Show code-like syntax only when his approved learning stage allows it.

#### State

Child explanation:

“The game needs to remember whether Lucas currently has Super Jump. What the game remembers right now is called its state.”

Teach:

- power off;
- power on;
- power used;
- power off again.

#### Event or trigger

Child explanation:

“The game starts this rule when Lucas answers a question. Something that tells the game to react is called an event or trigger.”

Teach:

- an action happens;
- the game notices it;
- the game checks the condition;
- the game decides what to do.

#### Limited use

Child explanation:

“Super Jump works for only one obstacle. The game must count when it is used and then remove it.”

Teach:

- counters;
- limits;
- changing state after an action.

#### Testing

Child explanation:

“Programmers do not only check whether the new power works. They also check that the old maths questions still work. These checks are called tests.”

Teach:

- expected result;
- testing the new behaviour;
- checking that existing behaviour was not broken;
- successful and unsuccessful cases.

#### Review

Child explanation:

“A different reviewer checks the builder’s work. This is like asking someone else to check your maths answer.”

Teach:

- reviewing work;
- finding mistakes;
- improving a solution;
- why the builder should not be the only checker.

#### Repair and rollback

Child explanation:

“Sometimes the first build does not work. The builder may try one careful repair. If it is still not safe, we keep the old working game.”

Teach:

- bugs are normal;
- repair is controlled;
- a stable version is protected;
- rollback does not erase Linus’s idea or learning history.

### Progressive coding detail

The amount of technical detail must depend on Linus’s current learning stage.

#### Stage 1 — Guided choices

Show:

- simple explanation;
- visual cause and result;
- no source code required;
- words such as condition, event, state, test, and bug introduced gently.

#### Stage 2 — Complete the prompt

Show:

- missing parts of a structured instruction;
- Who, What, When, How long, and Expected result;
- how changing one choice changes the final prompt.

#### Stage 3 — Guided prompt writing

Ask Linus to write or edit part of the requirement.

The Guide may:

- suggest clearer wording;
- point out missing information;
- explain why a request is ambiguous.

The Guide must not silently replace Linus’s idea.

#### Stage 4 — Review the implementation plan

Show:

- which game behaviour will change;
- why each plan step is needed;
- acceptance criteria;
- simple predictions such as:
  “What do you think should happen after Super Jump is used once?”

#### Stage 5 — Guided code understanding

Show small, approved code excerpts only.

Explain:

- the condition;
- the state change;
- the counter or usage rule;
- the related test.

Highlight only the lines relevant to the lesson.

Do not expose secrets, unrelated files, generated code, framework internals, or large code dumps.

#### Stage 6 — Safe bounded editing

Allow Linus to change only approved values or small code sections, such as:

- changing one obstacle to two;
- selecting another approved character;
- changing the power duration;
- completing a safe conditional expression.

All edits remain subject to:

- allow-listed files;
- deterministic validation;
- Parent controls;
- tests;
- independent review;
- rollback.

### Child-friendly build status

Each technical workflow status must have a child-facing explanation.

Examples:

- **Guardian Review:** “The Crystal Guide is checking that your idea is safe and clear.”
- **Feature Specification:** “We are turning your idea into exact game rules.”
- **Planning:** “The builder is deciding which small game parts may need to change.”
- **Awaiting Parent Approval:** “Your plan is ready. A Parent needs to check it before building starts.”
- **Preparing Isolated Workspace:** “We are making a safe practice copy of the game.”
- **Building:** “The Crystal Builder is carefully adding your feature to the practice copy.”
- **Verifying:** “The game is checking whether Super Jump works and whether anything else was accidentally broken.”
- **Independent Review:** “A different reviewer is checking the builder’s work.”
- **Repairing:** “A check found a problem. The builder is trying one careful repair.”
- **Ready for Approval:** “The feature passed its checks. A Parent can now decide whether it should become part of the playable game.”
- **Accepted:** “Your feature is now in the approved game version.”
- **Rolled Back:** “We kept the last working game version. Your idea and learning record are still safely saved.”
- **Paused:** “Your quest is safely saved. The Crystal Builder will continue when it is ready.”
- **Failed Safely:** “This build did not pass its checks, so it was not added to the game. We kept the working version safe.”

Do not show raw state-machine names to Linus unless paired with their simple explanation.

### Learning checkpoints

At meaningful stages, store a small learning record containing:

- concept introduced;
- explanation shown;
- optional question asked;
- Linus’s answer or prediction;
- whether he requested another explanation;
- whether he revised his prompt;
- short reflection after the result;
- learning stage at the time.

Do not score creativity.

Do not treat an incorrect answer as failure.

The purpose is to show learning progress and help the Parent understand how Linus’s coding knowledge is developing.

### Guide response rules

The Crystal Guide must:

- use short sentences and simple words;
- explain unfamiliar coding words when first introduced;
- teach through Linus’s actual feature;
- distinguish clearly between plan, code, test, review, and deployment;
- tell the truth about mocked and real actions;
- say when the system does not know something;
- encourage review and revision;
- explain mistakes without blame;
- preserve Linus’s original creative intent;
- support “Explain again” using different wording or an example.

The Crystal Guide must not:

- pretend that a mocked build changed the real game;
- tell Linus that a feature succeeded before verification passes;
- expose model names, tokens, providers, stack traces, shell commands, or infrastructure errors;
- overwhelm Linus with long code listings;
- describe AI as magically knowing or doing everything;
- complete every learning question for him immediately;
- use babyish language;
- reward only success while ignoring thoughtful attempts and corrections.

### Parent visibility

The Parent view should show:

- coding concept taught;
- explanation presented to Linus;
- question or prediction offered;
- Linus’s response where recorded;
- prompt revisions;
- whether he requested help or another explanation;
- what he learned from success, repair, or rollback;
- progress through the approved learning stages.

The Parent must be able to control:

- maximum explanation detail;
- whether code excerpts are shown;
- whether a learning checkpoint is optional or required before Proceed;
- approved learning stage;
- whether Linus can perform bounded code edits.

These controls must not allow the Parent or child UI to bypass technical safety and verification rules.

---

## 13B. Understanding Gate before Proceed

Crystal Code Quest is a learning product, not only an AI building tool.

Linus is eight years old and is starting with no coding knowledge.

Before the system executes the next agent stage, Linus must demonstrate a basic understanding of:

- what his instruction means;
- what the game should check;
- what result should happen;
- what should happen after the feature is used;
- why the next technical stage is necessary.

The **Proceed** button must remain locked until the Understanding Gate is passed.

The gate must be simple, encouraging, age-appropriate, and directly connected to the feature Linus is building.

It must not test programming syntax during the early learning stages.

### Micro-lesson before the quiz

Before each quiz, the Crystal Guide gives a short lesson.

The lesson should contain:

1. one coding concept;
2. one example from Linus’s feature;
3. one visual or cause-and-result explanation where possible;
4. no more than a few short sentences;
5. an “Explain again” option.

Example:

“A condition is a rule the game checks.

For Super Jump, the game asks:

Did Lucas answer a hard maths question correctly?

If the answer is yes, the game turns Super Jump on.”

The Guide should then say:

“Let’s check that this makes sense before the builder continues.”

### Quiz format

Each Understanding Gate should contain two or three short questions.

Use child-friendly interaction such as:

- multiple choice;
- selecting the correct picture or sequence;
- matching cause and result;
- arranging two or three steps;
- predicting what should happen;
- choosing between two game behaviours.

Avoid:

- long written answers;
- technical vocabulary without explanation;
- source-code syntax during early stages;
- trick questions;
- timed quizzes;
- negative scoring;
- public scores or leaderboards.

### Super Jump understanding quiz

Before creating the real plan, Linus should answer questions similar to:

#### Question 1 — Condition

“When should Lucas receive Super Jump?”

Options:

- After any maths question;
- After answering a hard maths question correctly;
- Before answering a question.

Correct answer:

“After answering a hard maths question correctly.”

#### Question 2 — Limited use

“How long should Super Jump work?”

Options:

- For the whole game;
- For one obstacle;
- Until Lucas closes the game.

Correct answer:

“For one obstacle.”

#### Question 3 — State change

“What should happen after Lucas uses Super Jump once?”

Options:

- Super Jump should turn off;
- Lucas should get another Super Jump automatically;
- Every character should get Super Jump.

Correct answer:

“Super Jump should turn off.”

These questions teach:

- condition;
- expected result;
- state;
- limited use.

### Passing rule

The system must identify one or two essential questions for each stage.

Linus must answer all essential questions correctly before **Proceed** becomes available.

For a three-question gate:

- the essential condition question must be correct;
- the essential result or state question must be correct;
- the third question may provide supporting evidence.

Do not allow random guessing to unlock the next step immediately.

After an incorrect answer:

1. do not shame or mark Linus as having failed;
2. explain the concept again using different words;
3. show a small example or visual sequence;
4. give a hint;
5. ask a similar question with changed wording;
6. keep **Proceed** locked.

Suggested Guide response:

“Not quite yet. That is okay.

Super Jump should only start after two things are true:

the maths question is hard, and Lucas’s answer is correct.

Let’s try another example.”

### Retry and support flow

Linus may retry as many times as needed, but the system should vary the explanation rather than repeat the same question unchanged.

After three unsuccessful attempts:

- pause the quiz;
- show “Learn with the Crystal Guide”;
- provide a simpler explanation;
- use a visual cause-and-result example;
- offer “Ask a Parent to help me understand”;
- allow the Parent and Linus to review the lesson together;
- present a fresh quiz afterward.

Parent assistance does not automatically unlock **Proceed**.

Linus must still answer the essential understanding questions after the explanation.

The Parent must not have a button that silently bypasses the learning gate.

The Parent may:

- explain the concept;
- request an easier explanation;
- reset the quiz;
- change Linus’s approved learning stage;
- cancel or postpone the quest.

### Proceed behaviour

Before the gate is passed:

- **Proceed** is disabled;
- the interface explains why;
- Linus can review the lesson;
- Linus can retry the quiz;
- Linus can revise his idea;
- Linus can ask for help.

Suggested text:

“Before the Crystal Builder continues, show that you understand this game rule.”

After the gate is passed:

- **Proceed** becomes available;
- the Guide briefly confirms what Linus understood;
- the workflow stores the learning evidence;
- the Quest Orchestrator may start the next technical job.

Suggested confirmation:

“You understood it.

The game checks whether the question is hard and the answer is correct.

Then Lucas gets Super Jump for one obstacle.

Now the builder can create the plan.”

### Understanding Gates by workflow stage

#### Before Feature Specification

Linus must understand:

- who the feature affects;
- what should happen;
- what starts it;
- how long it lasts.

#### Before Planning

Linus must understand:

- that the plan describes the small game parts that may change;
- that planning happens before code is changed.

#### Before Building

Linus must understand:

- that the builder works in a safe practice copy;
- that the playable game is not changed yet;
- what behaviour the builder is trying to create.

#### Before Verification

Linus must understand:

- that tests check expected behaviour;
- that tests also make sure old features still work.

#### Before Repair

Linus must understand:

- that a failed check does not mean his idea was bad;
- that bugs are normal;
- that only one careful repair will be attempted.

#### Before Parent Approval

Linus must understand:

- that passing tests does not automatically activate the feature;
- that the Parent reviews the result before it becomes playable.

#### After Success or Rollback

Linus must complete a short reflection such as:

- “What rule did the game check?”
- “What happened after Super Jump was used?”
- “Why did we test the old maths questions?”
- “What did the builder repair?”
- “Why did we keep the previous game version?”

The reflection can be spoken, selected, or typed depending on the interface.

### Adaptive difficulty

The quiz difficulty must follow Linus’s learning stage.

#### Stage 1

- pictures and multiple choice;
- simple cause and result;
- no code syntax;
- one concept at a time.

#### Stage 2

- complete a missing part of a structured prompt;
- identify Who, What, When, and How long;
- choose the expected result.

#### Stage 3

- write or improve one sentence;
- identify an unclear or missing requirement;
- explain the condition in his own words.

#### Stage 4

- predict what one plan step will do;
- identify an acceptance criterion;
- choose an important test case.

#### Stage 5

- read a very small approved code excerpt;
- point to the condition or state change;
- predict the output.

#### Stage 6

- complete a bounded code change;
- explain what changed;
- predict which tests should pass.

The system must never present a Stage 5 or Stage 6 coding question to Linus until the Parent has approved that learning stage.

### Learning evidence

For every Understanding Gate, record:

- quest ID;
- concept taught;
- learning stage;
- lesson version shown;
- questions asked;
- essential questions;
- Linus’s answers;
- number of attempts;
- hints requested;
- explanations repeated;
- Parent assistance requested;
- final demonstrated understanding;
- timestamp;
- workflow stage unlocked.

Do not record a creativity score.

Do not label Linus as weak, failed, behind, or poor at coding.

Parent reporting should use language such as:

- understood independently;
- understood after a hint;
- understood after another example;
- understood with Parent support;
- still learning this concept.

### Safety rule

An AI model must not decide by itself that Linus understands.

The application must use deterministic quiz rules to decide whether the required answers are correct.

The Crystal Guide may:

- generate alternative explanations;
- generate age-appropriate examples;
- provide hints;
- explain why an answer is incorrect.

The Quest Orchestrator and deterministic learning rules decide whether **Proceed** is unlocked.

No agent job, provider call, repository inspection, build, repair, or activation may begin before the required Understanding Gate for that stage has passed.

---

## 14. Future agent architecture

```text
Child Builder
    ↓
Guardian and Learning Coach
    │   ├── Crystal Guide (language and teaching)
    │   └── Understanding Gate (deterministic learning check)
    ↓
Build Orchestrator
    │   (deterministic state machine, source of truth)
    ├── Feature Spec Generator
    ├── Repository Context Service
    ├── Coding Agent
    ├── Deterministic Verifier
    ├── Code Review Agent
    └── Accept / Repair / Rollback
    ↓
Provider-independent model gateway
    ├── capability: language and coaching
    ├── capability: planning
    ├── capability: repository reasoning
    ├── capability: coding
    ├── capability: code review
    └── capability: explanation
    ↓
Isolated game workspace
    (temporary worktree or short-lived worker)
    ↓
The Crystal Adventure repository and preview
```

The Orchestrator must be a state machine. It must not be an unrestricted autonomous parent agent.

The core principle is:

> Small agent jobs save their state after every step, so work can pause, retry, resume, or switch providers without losing Linus’s idea or applying incomplete game changes.

Each job stores the inputs, outputs, provider, model, attempt, checkpoints, verification evidence, and approval records needed to resume or retry without repeating accepted work. The Orchestrator advances jobs only through allowed state transitions and never relies on model memory as the source of truth.

---

## 15. Security invariants

Release blockers:

- no OpenCode Go, OpenRouter, or other model-provider credential in browser code;
- no arbitrary shell exposed to a child;
- no model-selected unrestricted file path;
- no access outside approved repositories;
- no host home-directory mount;
- no container runtime socket mount;
- no direct Git push;
- no dependency addition without parent approval;
- no public publishing;
- no model ability to change Guardian policy;
- no build accepted when deterministic checks fail;
- no partially changed canonical game after failure;
- all model output treated as untrusted input.

---

## 15A. Failure categories

Every job failure must be classified so the Quest Orchestrator can decide whether to retry, resume, request Parent action, permanently fail, or roll back.

| Category                  | Retryable | Resumable | Parent action | Permanently failed | Roll back |
| ------------------------- | :-------: | :-------: | :-----------: | :----------------: | :-------: |
| Validation failure        |    yes    |    yes    |      no       |         no         |    no     |
| Guardian rejection        |    yes    |    yes    |   optional    |         no         |    no     |
| Parent rejection          |    no     |    no     |      yes      |        yes         |    no     |
| Provider unavailable      |    yes    |    yes    |      no       |         no         |    no     |
| Provider budget exhausted |    no     |    yes    |      yes      |         no         |    no     |
| Tool limit reached        |    no     |    yes    |      yes      |         no         |    no     |
| Workspace failure         |    yes    |    yes    |      no       |         no         |    yes    |
| Verification failure      |    yes    |    yes    |      no       |         no         |    yes    |
| Reviewer rejection        |    yes    |    yes    |      no       |         no         |    yes    |
| Repair failure            |    no     |    no     |      yes      |        yes         |    yes    |
| Activation failure        |    yes    |    yes    |      yes      |         no         |    yes    |
| Manual cancellation       |    no     |    no     |      yes      |        yes         | optional  |

Retryable failures should apply exponential backoff and respect the provider fallback rules. Resumable failures preserve the checkpoint and may continue when the blocking condition clears. Parent-action failures require the Parent to approve a new budget, revise the request, or cancel the quest. Permanently failed jobs do not automatically retry. Rollback restores the last accepted game version without deleting history.

---

## 16. Initial user-acceptance checklist

The parent should test:

### As Child Builder

- Does it feel like a learning game rather than a dashboard?
- Is the flow understandable without technical knowledge?
- Is it clear that the idea will eventually change a real game?
- Does the prompt-building journey teach something?
- Is the Parent Guide helpful without taking over?
- Is the UI engaging but not childish?
- Is The Crystal Adventure visually distinct from Code Quest?

### As Parent

- Can I see exactly what Linus selected?
- Can I see the final prompt?
- Can I see what the system understood?
- Can I see evidence of what he learned?
- Can I understand how his ideas are evolving?
- Does the Imagination Journal feel useful rather than judgemental?
- Can I control his current learning stage?
- Can I tell which data is real and which build state is mocked?

---

## 16A. Initial real-agent implementation boundary

The first real-agent implementation should be deliberately narrow:

- one approved Super Jump feature;
- one known The Crystal Adventure repository;
- one starting game version;
- one isolated workspace;
- one builder provider;
- one independent reviewer;
- deterministic tests;
- one repair attempt;
- mandatory Parent approval;
- automatic rollback;
- no autonomous publishing;
- no arbitrary child-written shell commands;
- no multi-project or multi-tenant complexity yet.

This boundary limits the number of moving parts while the trust, audit, and recovery mechanics are validated with a real codebase change.

---

## 17. Definition of success

Crystal Code Quest succeeds when:

- Linus wants to return and build another idea;
- he becomes better at describing what he wants;
- he learns to question and review AI output;
- the platform safely creates real, working changes in The Crystal Adventure;
- a player learns by playing those changes;
- the parent can understand both the building learning and the gameplay learning;
- failures are safe, visible, and recoverable.

The first objective is not maximum autonomy.

The first objective is one beautiful, trusted path from **imagination → prompt → plan → real game feature → play → learning**.
