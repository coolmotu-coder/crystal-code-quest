# Crystal Code Quest

A local learning platform that teaches Linus vibe coding by helping him build real features in **The Crystal Adventure**.

> **Linus imagines it in Crystal Code Quest. The agents safely build it in The Crystal Adventure. A player then learns by playing it.**

This milestone is **interface-first**: it implements the Foundation and First Vertical Slice only. All build and preview activity is clearly labelled **mocked**. No LLM calls, coding agents, or game-repository access are included.

## Prerequisites

- Node.js 22 (see `.nvmrc`)
- pnpm 9 or later
- Podman or Docker (for container builds)
- kind and kubectl (for local Kubernetes validation)

## Quick start

```bash
# Install dependencies
pnpm install

# Create .env.local, generate session secret, and create the Parent and Child accounts
pnpm db:setup

# Run database migrations (safe to rerun)
pnpm db:migrate

# Start the development server
pnpm dev
```

After `pnpm db:setup`, the terminal prints the account names and confirms success. Credentials are not stored in `.env.local`; only password hashes are stored in SQLite.

## Important: local-family deployment

Crystal Code Quest is designed for a single family running on a local home network. Authentication is local-session based, not internet-grade identity management. Keep the instance on your local network and change the default-generated credentials after first setup.

## Commands

| Command             | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Start the development server                  |
| `pnpm build`        | Create a production build                     |
| `pnpm start`        | Start the production server                   |
| `pnpm typecheck`    | Run TypeScript type checking                  |
| `pnpm lint`         | Run ESLint                                    |
| `pnpm format`       | Format code with Prettier                     |
| `pnpm format:check` | Check formatting                              |
| `pnpm test`         | Run unit and component tests                  |
| `pnpm e2e`          | Run Playwright end-to-end tests               |
| `pnpm db:setup`     | Interactive setup (session secret + accounts) |
| `pnpm db:migrate`   | Run database migrations                       |
| `pnpm db:seed`      | Seed demo quest data                          |
| `pnpm db:reset`     | Reset database and run setup again            |

## Accounts

- **Parent**: email + password, accesses `/parent/*`.
- **Child Builder**: username + PIN (minimum six digits), accesses `/child/*`.

Routes are protected by both middleware and authoritative server-side role guards.

## Container build

```bash
# Build with the current Git short SHA as the tag
export IMAGE_TAG="crystal-code-quest:$(git rev-parse --short HEAD)"
podman build -t "$IMAGE_TAG" .
```

## Local Compose validation

```bash
export IMAGE_TAG="crystal-code-quest:$(git rev-parse --short HEAD)"
podman compose up -d
```

Requires `.env.local` (created by `pnpm db:setup`) and a persistent named
volume for the SQLite database.

## Kind deployment

The existing local Podman-backed Kind cluster is named `ai-lab`. See
`infrastructure/kind/README.md` for the full workflow.

```bash
export IMAGE_TAG="crystal-code-quest:$(git rev-parse --short HEAD)"
podman build -t "$IMAGE_TAG" .
kind load docker-image "$IMAGE_TAG" --name ai-lab
kubectl create secret generic crystal-code-quest \
  --from-literal=session-secret="$(grep '^SESSION_SECRET=' .env.local | cut -d '=' -f2)" \
  --namespace crystal-code-quest
kubectl apply -k infrastructure/kind
kubectl rollout status deployment/crystal-code-quest -n crystal-code-quest
kubectl port-forward -n crystal-code-quest svc/crystal-code-quest 3000:3000
```

## Testing

- Unit tests cover auth, role guards, prompt construction, and learning evidence.
- E2E tests cover the Parent flow, Child Builder flow, and responsive laptop/iPad viewports.

## Safety notes

- No LLM or provider calls are made by the application in this milestone.
- No coding agents or arbitrary shell execution are exposed to the child.
- The Crystal Adventure repository is not accessed.
- All build and preview states are clearly labelled **mocked**.

## License

MIT License — see `LICENSE`.
