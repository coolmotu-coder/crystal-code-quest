# ADR 001 — Initial stack for Crystal Code Quest

**Status:** Accepted
**Date:** 2026-07-30

## Context

Crystal Code Quest is an interface-first milestone for a single-family local learning platform. The product must teach Linus vibe coding through a polished, secure, and testable interface before any LLM or game-repository integration is introduced.

The specification recommended a TypeScript-first full-stack stack: Next.js or similar, React, Tailwind, Motion, Zod, SQLite, secure server-side cookies, Vitest, Testing Library, Playwright, pnpm, and a container image suitable for Kind.

## Decision

We will use the following stack:

| Layer            | Choice                         | Reason                                                                                        |
| ---------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| Framework        | Next.js 15 App Router          | Full-stack React with server components, server actions, and a single deployable container.   |
| Language         | TypeScript 5                   | Strict typing across the codebase.                                                            |
| Styling          | Tailwind CSS 3                 | Token-driven utility CSS matching the hacker-style design reference.                          |
| Motion           | Framer Motion                  | Restrained, interruptible animations with `prefers-reduced-motion` support.                   |
| UI primitives    | Radix UI                       | Accessible, headless, keyboard-friendly components.                                           |
| Validation       | Zod                            | Contracts and input validation on every server boundary.                                      |
| Database         | SQLite + better-sqlite3        | Single-file, local, no external service required for this milestone.                          |
| Sessions         | iron-session v8                | Encrypted, HTTP-only, server-side cookies.                                                    |
| Password hashing | bcryptjs                       | Secure hashes without native bindings.                                                        |
| Testing          | Vitest + React Testing Library | Unit and component tests.                                                                     |
| E2E              | Playwright                     | Role-based browser tests across viewports.                                                    |
| Package manager  | pnpm                           | Fast, deterministic, content-addressable lockfile.                                            |
| Container        | Pinned Node 22 Debian slim     | `better-sqlite3` compiles native bindings; Debian slim is more reliable than Alpine for this. |
| Orchestration    | kind                           | Local Kubernetes cluster for home network validation.                                         |

## Notable choices

### Next.js instead of a separate backend

A single Next.js application reduces the number of moving parts and gives us server components and server actions for the database layer. The database module is never imported by client components; `better-sqlite3` is declared in `serverExternalPackages`.

### Server-side role guards

Middleware handles convenience redirects, but every protected page, route handler, and server action also calls an authoritative server-side role guard. This prevents role escalation even if middleware is bypassed.

### No role-switcher component

Parent and Child Builder use separate authenticated sessions. A Parent may preview the Child experience via `/parent/preview`, but the session remains a Parent session and a banner is shown.

### Interactive credential setup

`pnpm db:setup` generates a session secret and interactively prompts for the Parent email/password and Child username/PIN. Only bcrypt hashes are stored in SQLite; credentials are not written to `.env.local` or committed.

### Child PIN throttling

Server-side login throttling restricts repeated PIN and password guessing. It is in-memory and suitable for a single-family local deployment.

### Idempotent database lifecycle

Migrations are recorded in a `migrations` table and applied inside a transaction. Seeding is explicit and idempotent. Normal application startup never resets or reseeds the database.

### Container tag

The container image tag uses the Git short SHA, e.g. `crystal-code-quest:abc1234`. The exact digest is recorded after the build is inspected.

## Consequences

- A single Node.js process is sufficient for the Foundation and First Vertical Slice.
- SQLite limits the deployment to one application replica.
- The stack is ready for later phases: Guardian, build orchestrator, and game repository integration can be added as separate services without rewriting the interface.

## Status

Accepted for the Foundation and First Vertical Slice.
