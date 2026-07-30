# Development Guide — Crystal Code Quest

## Prerequisites

- Node.js 22 (see `.nvmrc`)
- pnpm 9 or later
- Podman or Docker (for container builds)
- kind and kubectl (for local Kubernetes validation)

## Repository Structure

```
crystal-code-quest/
├── app/                  # Next.js App Router
│   ├── (child)/          # Child Builder routes
│   ├── (parent)/         # Parent routes
│   └── api/              # API routes and health checks
├── components/           # React components
│   ├── guide/            # Parent Guide placeholder
│   ├── layout/           # Shell, sidebars, top bar
│   ├── parent/           # Parent-specific components
│   ├── quest/            # Quest and build components
│   └── ui/               # Design-system primitives
├── lib/                  # Application code
│   ├── auth/             # Sessions, hashing, guards
│   ├── contracts/        # Zod schemas
│   ├── db/               # SQLite connection and queries
│   ├── guide/            # Guide messages
│   ├── journal/          # Imagination Journal helpers
│   ├── learning/         # Learning evidence and stages
│   └── quests/           # Quest templates, builder, plan, build
├── scripts/              # CLI setup, migrations, seed
├── tests/                # Unit and E2E tests
├── infrastructure/kind/  # Kubernetes manifests
├── data/                 # SQLite database (gitignored)
├── docs/                 # Documentation and ADRs
└── public/               # Static assets
```

## Getting Started

```bash
pnpm install
pnpm db:setup
pnpm db:migrate
pnpm dev
```

## Development Workflow

### Running checks before committing

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
```

### Database changes

1. Add a migration file in `scripts/migrations/`.
2. Run `pnpm db:migrate`.
3. Ensure migrations are idempotent and recorded in the `migrations` table.

### Adding a dependency

Add a dependency only when its purpose is clear. Prefer built-in Node.js APIs for scripts. Run `pnpm install <pkg>` and document the reason in the commit message.

## Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Keep commits focused and atomic.
- Never commit `.env.local`, `data/*.db`, or credentials.

## Testing

- Unit and component tests live in `tests/unit/`.
- E2E tests live in `tests/e2e/`.
- Capture screenshots for design review after the First Vertical Slice.

## Safety Constraints

- No LLM or provider calls in the interface milestone.
- No coding agents or shell execution inside the application.
- No access to The Crystal Adventure repository.
- All build and preview states must be clearly labelled **mocked**.
- Only password hashes are stored in SQLite.

## Deployment

See `README.md` for container build and Kind deployment commands.

## Questions?

Open an issue or ask in the project chat.
