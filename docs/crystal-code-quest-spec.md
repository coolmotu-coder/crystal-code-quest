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

| Product | Account | Purpose |
|---|---|---|
| Crystal Code Quest | Child Builder | Selects ideas, learns prompting, reviews plans, initiates builds, tests features, and learns from changes |
| Crystal Code Quest | Parent | Reviews prompts, ideas, learning evidence, imagination journal, build history, safety decisions, approvals, and progression |
| The Crystal Adventure | Player | Plays the real game and completes educational challenges |
| The Crystal Adventure | Parent | Reviews the player’s learning progress, attempts, strengths, difficulties, and game-based learning history |

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
- Guardian model for age-appropriate language;
- learning-stage enforcement;
- real prompt and plan records;
- parent view of real Guardian decisions;
- blocked-request handling;
- no real game modification yet.

## Gate

Parent tests prompt interpretation, teaching quality, and safety behaviour before real coding access is introduced.

---

# Phase 3 — Real game-build pipeline

## Goal

Allow one approved Crystal Code Quest quest to make one real, bounded change in The Crystal Adventure.

## First real feature

> Give Lucas Super Jump after a correct hard maths answer.

## Deliverables

- separate game repository connection;
- isolated Git worktree;
- checkpoint;
- approved file boundaries;
- repository context retrieval;
- coding model;
- patch application;
- no direct push;
- complete audit record.

## Gate

The real feature must be repeatable, bounded, and recoverable.

---

# Phase 4 — Review, verification, and rollback

## Goal

Make “working” an evidence-based result.

## Deliverables

- deterministic format, lint, typecheck, test, and build checks;
- focused game smoke test;
- browser-console check;
- read-only code reviewer using a different model family;
- one controlled repair attempt;
- automatic rollback;
- parent technical summary;
- child-friendly truthful result.

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

| Development role | OpenCode Go model |
|---|---|
| Primary interface and repository implementation | `opencode-go/kimi-k2.7-code` |
| Fast repository exploration and small analysis | `opencode-go/deepseek-v4-flash` |
| Visual, usability, and accessibility review | `opencode-go/qwen3.7-plus` |
| Independent code, architecture, and security review | `opencode-go/deepseek-v4-pro` |

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

OpenCode Go may be evaluated for runtime experiments later, but it is not assumed to be the production runtime provider.

---

## 14. Future agent architecture

```text
Child Builder
    ↓
Guardian and Learning Coach
    ↓
Build Orchestrator
    ├── Feature Spec Generator
    ├── Repository Context Service
    ├── Coding Agent
    ├── Deterministic Verifier
    ├── Code Review Agent
    └── Accept / Repair / Rollback
    ↓
The Crystal Adventure repository and preview
```

The Orchestrator must be a state machine. It must not be an unrestricted autonomous parent agent.

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
