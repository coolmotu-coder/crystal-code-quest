# The Crystal Adventure

A private, home-network web game for two children in one household.

## Overview

**The Crystal Adventure** is a collaborative educational game where:
- **Linus (Creator, ~8)** builds bounded stages through the loop *Idea → Prompt → Generate → Review → Test → Improve → Publish*
- **Lucas (Player, Kindergarten)** plays only **published** stages, collecting English, Maths, and Science Crystals
- **Parent (Steward)** approves content, difficulty, publication, privacy, retention, model settings, history, and backup

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd the-crystal-adventure

# Use the pinned Node version
nvm use          # reads .nvmrc (Node 20.14.0)

# Install dependencies
npm install
```

> **Status:** the repository foundation is in place; no application exists yet.
> `npm run dev:web` and `npm run dev:server` start working once the web and
> server workspaces are created. Build order and phase gates are documented in
> [`docs/mvp-spec.md`](./docs/mvp-spec.md) §14.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed setup instructions.

## Repository Structure

The layout below is the agreed target. Directories are created by the phase
that first needs them, not up front.

```
apps/
├── web/      # React + Phaser frontend
└── server/   # Fastify backend
packages/
└── contracts/ # Shared TypeScript types and Zod schemas
docs/
├── mvp-spec.md   # authoritative specification
└── planning/     # research and planning package
```

## Tech Stack

- **TypeScript** (strict mode)
- **React** with Vite
- **Phaser 3** (Arcade Physics)
- **Fastify** backend
- **Zod** validation
- **SQLite** local persistence
- **Node.js LTS** (see `.nvmrc`)

## License

MIT — see [LICENSE](./LICENSE) for details.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## Code of Conduct

Be kind, be patient, and remember: this is for children.
