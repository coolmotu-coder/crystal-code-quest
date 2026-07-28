# Development Guide

## Prerequisites

- Node.js LTS (see `.nvmrc`)
- npm (comes with Node.js)
- Podman or Docker (for containerization in later phases)

## Repository Structure

```
the-crystal-adventure/
├── apps/
│   ├── web/          # React + Phaser frontend
│   └── server/       # Fastify backend
├── packages/
│   └── contracts/    # Shared TypeScript types and Zod schemas
├── docs/
│   └── planning/     # Planning documents
├── README.md
├── CONTRIBUTING.md   # This file
├── LICENSE
└── .gitignore
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd the-crystal-adventure
```

### 2. Install dependencies

```bash
npm install
```

### 3. Verify setup

```bash
# Check Node.js version
node --version
npm --version

# Run tests (when available)
npm test
```

## Development Workflow

### Adding a new package

```bash
# Create a new package in packages/
mkdir packages/<package-name>
cd packages/<package-name>
npm init -y
```

### Running development servers

```bash
# Start web frontend
npm run dev:web

# Start server
npm run dev:server

# Start both
npm run dev
```

### Running tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- <test-file>
```

### Linting and formatting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Code Standards

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Phaser 3**: Arcade Physics, Scale Manager `FIT`
- **Fastify**: Plugin-based architecture
- **Zod**: All input validation
- **Claymorphism**: Visual style (see Phase 2)

See `docs/mvp-spec.md` for full technical specifications.

## Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Reference issue/PR numbers when applicable
- Keep commits focused and atomic

## Deployment

See `docs/planning/delivery-plan.md` for deployment phases.

## Troubleshooting

### Node version mismatch

Use `nvm` to switch to the LTS version specified in `.nvmrc`:

```bash
nvm install
nvm use
```

### Dependency issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Questions?

Open an issue or ask in the project chat.
