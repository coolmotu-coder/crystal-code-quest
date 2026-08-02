# Start Crystal Code Quest Interface Development

Work only inside the current `crystal-code-quest` Git repository.

Before starting, confirm that OpenCode is connected to **OpenCode Go**:

1. Run `/connect` and select **OpenCode Go** if it is not already connected.
2. Run `/models` and confirm the configured model IDs are available.
3. Never place the OpenCode Go API key in this repository.

Read these files first:

1. `crystal-code-quest-spec.md`
2. `opencode.json`
3. `design-reference.png` if it exists
4. existing `README.md`, `AGENTS.md`, package files, and source files

## Product truth

Crystal Code Quest is a learning game that teaches Linus vibe coding by eventually building real features in **The Crystal Adventure**.

However, this task is **interface-first**.

Build only:

- Phase 0 — Repository and design foundation
- Phase 1 — Complete interface and account experience

Do not start Phase 2 or later.

## Mandatory stop gate

After Phase 1 is complete, stop.

The parent will personally test both accounts and explicitly approve the next phase.

Do not implement:

- real LLM calls;
- OpenCode Go, OpenRouter, or any other model-provider calls from the application;
- Guardian model behaviour;
- coding agents;
- LangGraph orchestration;
- shell execution;
- game-repository access;
- real patches;
- package installation initiated by a child;
- public publishing;
- fake claims that code or a game was built.

Use seeded local data and a clearly mocked build-state service.

## Required accounts

### Parent account

Build a protected Parent experience that can see:

- prompts and options Linus selected;
- the final constructed prompt;
- the mocked AI plan;
- changes Linus made while reviewing it;
- what he learned;
- evidence supporting that learning;
- quest and build history;
- an Imagination Journal showing how ideas evolved;
- current learning stage;
- parent settings and controls.

Do not reduce imagination to a numerical creativity score.

### Child Builder account

Build a child-friendly Linus experience that can:

- log in separately;
- choose a guided build quest;
- select approved options;
- see the prompt being constructed;
- review what the mocked AI plan understood;
- start a mocked build journey;
- see a success or safe rollback result;
- learn what the selected prompt created;
- view previous quests and progress.

Parent routes must reject a Child Builder session. Child routes must not expose parent-only records.

## First complete quest

Implement this complete guided flow:

> Give Lucas Super Jump after he correctly answers a hard maths question.

The selections must represent:

- category: Power
- character: Lucas
- power: Super Jump
- trigger: Correct Answer
- subject: Maths
- difficulty: Hard
- usage: One obstacle

Construct this prompt:

> When Lucas answers a hard maths question correctly, give him Super Jump for one obstacle.

Show:

- Who
- What
- When
- How long or how many uses
- Expected result

## Design direction

Crystal Code Quest must use the clean hacker-style direction shown in `design-reference.png`.

Use:

- near-black, charcoal, and deep-slate surfaces;
- teal, mint, cyan, and restrained blue accents;
- occasional violet only where it connects to The Crystal Adventure;
- crisp typography;
- precise spacing;
- clear hierarchy;
- restrained interaction motion;
- strong keyboard and focus behaviour;
- reduced-motion support;
- polished laptop and iPad layouts.

Do not create:

- a generic SaaS dashboard;
- a colourful crystal-fantasy background across Code Quest;
- a robot guide in Code Quest; *(superseded — the canonical master visual reference in `docs/design/concept-art/crystal-code-quest-master-visual-direction.png` now includes the Crystal Builder as the only approved AI builder robot in the Builder Workspace; see `docs/assets/character-specs.md`)*
- a preschool interface;
- fake terminal output;
- excessive glow or looping animation.

The main guide is a warm, capable, parent-like human mentor. Do not claim that the illustration is the real parent unless a real reference photo is later provided.

Robots and the colourful crystal world belong inside The Crystal Adventure previews. *(superseded in part — the Crystal Builder is the only approved robot character and belongs in the Crystal Code Quest Builder Workspace; the colourful crystal world still belongs to The Crystal Adventure previews; see `docs/assets/character-specs.md`)*

## Implementation expectations

Before editing:

1. inspect the repository;
2. state what already exists;
3. propose the framework and repository structure;
4. list exact files to create or change;
5. define the Phase 0 and Phase 1 data model;
6. define routes;
7. define account and session behaviour;
8. define the design-token system;
9. define automated tests;
10. identify assumptions and risks.

Then implement in small verified slices.

Prefer a TypeScript-first stack suitable for later agent and Kind integration. Use secure local sessions and SQLite or an equally simple local database for Phase 1.

Create or update `AGENTS.md` with:

- architecture;
- commands;
- conventions;
- role boundaries;
- phase gate;
- testing requirements;
- safety constraints.

## Required pages

### Shared

- landing and login;
- Parent login;
- Child Builder login;
- access denied;
- loading and error states.

### Child Builder

- home;
- quest catalogue;
- guided quest builder;
- prompt construction;
- mocked AI-plan review;
- mocked build journey;
- success;
- safe failure or rollback;
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

## Required tests

At minimum:

- parent and child login;
- route protection;
- prompt construction;
- complete Super Jump child flow;
- mocked success;
- mocked rollback;
- Parent view of selected prompt;
- Parent learning evidence;
- Parent Imagination Journal;
- parent learning-stage setting;
- keyboard navigation for custom controls;
- reduced-motion behaviour;
- laptop and iPad Playwright flows.

## Verification

Run and report:

- formatting;
- linting;
- type checking;
- unit and component tests;
- Playwright end-to-end tests;
- production build;
- container build if the runtime is available;
- Kind deployment validation if the local cluster is available.

Do not claim a check passed unless you ran it and captured the result.

## Final response

When complete, report:

1. what was implemented;
2. account credentials or the secure local setup command;
3. routes for Parent and Child Builder;
4. screenshots or exact preview instructions;
5. tests and commands run;
6. known limitations;
7. decisions needing parent feedback;
8. confirmation that Phase 2 was not started.
