# ADR 002 — Resumable agent orchestration for Crystal Code Quest

**Status:** Proposed  
**Date:** 2026-08-01

## Context

Crystal Code Quest will eventually allow Linus to build real features in The Crystal Adventure through guided AI-assisted workflows. The implementation must not depend on a single long-running OpenCode session, a single AI provider, or an unrestricted autonomous agent. Work must be safe, auditable, and recoverable.

The core principle is:

> Small agent jobs save their state after every step, so work can pause, retry, resume, or switch providers without losing Linus’s idea or applying incomplete game changes.

## Decision

We will implement a deterministic **Quest Orchestrator** that manages small, bounded, checkpointed jobs. AI providers sit behind a **provider-independent model gateway**. All real building happens in an isolated copy of The Crystal Adventure. Deterministic software, not AI opinion, decides whether a build is eligible for review or activation.

## Components

### 1. Crystal Guide

The Crystal Guide is a learning and safety coach, not the technical workflow controller.

- Helps Linus express his idea.
- Checks that the request fits the approved learning stage.
- Explains safety decisions in child-friendly language.
- Converts free-form wording into a structured request.
- Teaches one small coding concept per stage.
- Does not execute code, shell commands, or builds.
- Does not bypass safety rules or approve builds.

### 2. Quest Orchestrator

The Quest Orchestrator is deterministic workflow software. It creates and advances jobs, enforces allowed state transitions, records checkpoints, applies budgets and retry limits, and requests Parent approval where required. It never relies on model memory as the source of truth.

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

### 3. Resumable job model

One quest is divided into bounded jobs such as:

1. Understand the child’s request.
2. Create a structured feature specification.
3. Inspect approved repository context.
4. Generate an implementation plan.
5. Create a patch in an isolated workspace.
6. Run deterministic verification.
7. Conduct an independent model review.
8. Perform at most one controlled repair.
9. Request approval.
10. Activate the new game version or roll back.

Each job stores:

- quest ID;
- child and Parent ownership;
- starting game version;
- job type;
- current status;
- structured input;
- structured output;
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

### 4. Provider-independent model gateway

Agent roles request capabilities rather than hard-coded model names:

- language and coaching;
- planning;
- repository reasoning;
- coding;
- code review;
- explanation.

The gateway may route to OpenCode Go during the private family prototype, another commercial AI API, a locally hosted model, or a future provider. Provider IDs, model IDs, limits, and routing policy belong in server-side configuration. The production application must not require customers to own an OpenCode, Google, Anthropic, OpenAI, or other provider account.

Provider accounts belong to the business. Customer usage is metered through Crystal Code Quest. Personal development subscriptions must not be shared with customers. Provider terms and data-retention policies must be reviewed before production use.

### 5. Provider fallback and retry

- Retry only transient failures.
- Use exponential backoff.
- Limit retry count.
- Allow a compatible fallback provider.
- Preserve the same structured job input.
- Never silently weaken safety or verification requirements.
- Never activate a partially generated change.
- Record every provider switch in the audit history.

If no provider is available, the job is set to Paused, the complete checkpoint is retained, Linus sees a friendly saved-progress message, and the Parent is notified when intervention is needed. Resume later without asking Linus to repeat the idea.

Child-facing wording: “Your quest is safely saved. The Crystal Builder will continue when it is ready.” Model names, tokens, provider errors, stack traces, and subscription limits are never exposed to the child.

### 6. Job and cost budgets

Configurable limits for every quest:

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

### 7. Isolated game workspace

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

### 8. Deterministic verification

Normal software decides whether a build is eligible for review. Verification may include:

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

### 9. Independent review

The reviewer should use a different model family from the builder where practical. The reviewer checks correctness, security, scope compliance, learning intent, child-safety constraints, maintainability, unexpected regressions, and whether the implementation matches the approved feature specification. The reviewer is read-only.

### 10. Repair policy

- One controlled repair attempt by default.
- Repair receives the original specification, patch, failed checks, and review findings.
- Repair operates in the same isolated workspace.
- All deterministic checks run again.
- Further failure causes safe rollback or Parent review.
- No open-ended autonomous repair loop.

### 11. Game versioning and rollback

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

### 12. Parent approval

Parent approval is required at minimum for:

- first real repository change;
- requests outside the approved feature catalogue;
- dependency changes;
- broad file access;
- increased job budget;
- publication or deployment;
- activation of a newly built game version during the initial family release.

The Parent view shows Linus’s original idea, structured feature specification, files proposed for change, agent plan, budget usage, test results, reviewer result, risks, and approve/reject/retry/roll-back actions.

### 13. Child experience

The simplified child journey is:

- Understanding your idea
- Creating a safe plan
- Waiting for Parent approval
- Building in a practice copy
- Checking the feature
- Reviewing the result
- Ready to play

Child-facing status remains truthful. Success is not displayed until deterministic checks and required approval have passed.

### 14. Audit and evidence

An append-only audit record contains actor, action, timestamp, previous state, new state, request or approval ID, provider/model role, files accessed, commands executed, diff digest, test evidence, reviewer decision, and activation or rollback event. Secrets, raw credentials, private provider tokens, and unnecessary child personal information must not be written to audit records.

### 15. Failure categories

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

### 16. Initial implementation boundary

The first real-agent implementation is deliberately narrow:

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

## Understanding Gate

Before the system executes the next agent stage, Linus must demonstrate a basic understanding of:

- what his instruction means;
- what the game should check;
- what result should happen;
- what should happen after the feature is used;
- why the next technical stage is necessary.

The first implementation uses fixed, reviewed questions rather than AI-generated quiz questions. AI-generated variations may be added later, but every answer must still be checked against deterministic approved learning rules.

No agent job, provider call, repository inspection, build, repair, or activation may begin before the required Understanding Gate for that stage has passed.

## OpenCode limitation

OpenCode is currently a development tool used by Prakhar to build Crystal Code Quest. OpenCode session step limits must not become part of Linus’s product experience. The production agent workflow uses persisted jobs and checkpoints. If OpenCode Go is used as one runtime provider during the private prototype, it must sit behind the provider-independent gateway. An interrupted or exhausted provider call pauses one job; it must not lose the full quest workflow.

## Consequences

- The system can survive provider outages, model errors, and long-running jobs without losing Linus’s idea.
- Safety and workflow control remain deterministic software, not model behaviour.
- Multiple providers can be evaluated without rewriting business logic.
- Every significant action is auditable and reversible.
- The architecture is more complex than a single-session prompt chain, but it is required for trust and recoverability.

## Status

Proposed for implementation in later phases, after Phase 1 parent acceptance.
