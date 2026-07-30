# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Crystal Code Quest.
# Builds the Next.js standalone application and runs idempotent SQLite migrations
# on startup. The database is persisted under a configurable data directory.

FROM node:22.23.1-slim AS base

# Enable Corepack and activate the exact pnpm version declared by packageManager.
ENV COREPACK_ENABLE_AUTO_PIN=0
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

FROM base AS deps
WORKDIR /app

# Install native build dependencies required by better-sqlite3.
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 \
  make \
  g++ \
  gcc \
  libc6-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app

COPY . .

# Verify the committed SQL schema matches the TypeScript source, then export it
# to a plain SQL file so the runtime migration script can run without a loader.
RUN pnpm exec tsx scripts/verify-schema-drift.ts && \
    pnpm exec tsx scripts/export-schema.ts

# Build the Next.js standalone application.
RUN pnpm build

# Make a dereferenced copy of the compiled better-sqlite3 package so the native
# runtime files are guaranteed to be present in the final image.
RUN mkdir -p /tmp/better-sqlite3-runtime && \
  cp -rL /app/node_modules/better-sqlite3 /tmp/better-sqlite3-runtime/better-sqlite3

FROM node:22.23.1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_PATH=/data/crystal-code-quest.db

# Create a non-root user and install ca-certificates for outbound requests.
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --home /app nextjs

# Create the persistent data directory and ensure it is writable by the app user.
RUN mkdir -p /data && chown -R nextjs:nodejs /data

# Copy the standalone Next.js server and its minimal runtime dependencies.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets to the locations expected by the standalone server.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the runtime migration assets.
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate-startup.mjs ./migrate-startup.mjs
COPY --from=builder --chown=nextjs:nodejs /app/scripts/schema.sql ./schema.sql

# Ensure the complete compiled better-sqlite3 package (including the native
# .node binary) is available in the standalone runtime.
COPY --from=builder --chown=nextjs:nodejs /tmp/better-sqlite3-runtime/better-sqlite3 ./node_modules/better-sqlite3

# Verify the native binary is present. The build fails if it is missing.
RUN ls -la /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node

# Copy the container start script.
COPY --from=builder --chown=nextjs:nodejs /app/scripts/start.sh ./start.sh
RUN chmod +x /app/start.sh

USER nextjs

EXPOSE 3000

# Mark the data directory as a volume so SQLite persistence is explicit.
VOLUME /data

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

ENTRYPOINT ["/app/start.sh"]
