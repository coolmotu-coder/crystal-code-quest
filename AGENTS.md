# AGENTS.md — Crystal Code Quest

This document guides anyone (human or agent) working on the Crystal Code Quest codebase.

## Product truth

Crystal Code Quest teaches Linus vibe coding by helping him build real features in **The Crystal Adventure**. The current milestone is the **interface-first** milestone:

- Foundation
- First Vertical Slice
- Remaining Child Experience
- Remaining Parent Experience
- Final Verification

Do not start later work (Guardian model, coding agents, real game builds, telemetry) without explicit parent approval.

## Repository boundary

This repository is `crystal-code-quest`. It must never contain The Crystal Adventure game code or game repository access logic. The two products remain separate.

## Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
pnpm format:check

# Unit tests
pnpm test

# End-to-end tests
pnpm e2e

# Database setup (interactive, generates credentials once)
pnpm db:setup

# Database migrations only
pnpm db:migrate

# Database seed only (idempotent)
pnpm db:seed
```

## Conventions

- TypeScript strict mode is enabled.
- Every server boundary validates input with Zod.
- Server-side role guards are authoritative; middleware is a convenience layer.
- `better-sqlite3` is a server-only package. It is listed in `serverExternalPackages` and must never be imported by a Client Component.
- The database file lives in `data/` and is gitignored.
- Design tokens live in CSS custom properties in `app/globals.css`.
- The Parent Guide is a human, parent-like placeholder component.
- All build and preview states in this milestone are clearly labelled **mocked**.

## Role boundaries

- **Parent account** uses `/parent/*` routes.
- **Child Builder account** uses `/child/*` routes.
- There is no role-switcher component.
- A Parent may preview the Child Builder experience via `/parent/preview`, but the session remains a Parent session and a banner is shown.

## Phase gate

Stop after the complete interface milestone. The parent must test both accounts and explicitly approve the next milestone before any LLM, agent, or game-repository work begins.

## Planned agent architecture

The real-agent runtime is documented in `docs/crystal-code-quest-spec.md` and `docs/adr/002-resumable-agent-orchestration.md`. It is planning-only for this milestone; no agent code, provider credentials, or repository access are implemented.

Key constraints:

- Agent workflows are resumable, checkpointed, and provider-independent.
- The Quest Orchestrator is deterministic state-machine software; models do not control workflow state.
- The Crystal Guide teaches and explains but does not execute code, shell commands, or builds.
- OpenCode Go is a development tool for building Crystal Code Quest, not a runtime dependency of the child experience.
- Real building occurs only in an isolated copy of The Crystal Adventure repository; no direct push or deployment by the builder model.
- Deterministic checks and independent review are required before any change becomes active.
- No agent job, provider call, repository inspection, build, repair, or activation may begin before the required Understanding Gate for that stage has passed.

## Testing requirements

- Unit tests for auth, role guards, prompt construction, and learning evidence.
- Playwright E2E tests for the Parent flow, Child Builder flow, and responsive viewports.
- Production build, container build, and Kind validation must pass.

## Safety constraints

- No LLM or provider calls in this milestone.
- No coding agents or shell execution inside the application.
- No access to The Crystal Adventure repository.
- No real credentials committed or shown in documentation.
- Only password hashes are stored in SQLite.
- Login throttling restricts repeated PIN and password guessing.

## Dependencies

Add a dependency only when its purpose is clear. Prefer built-in Node.js APIs for scripts.
