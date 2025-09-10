## Multi-arch production build for Next.js + Prisma (SQLite)
## - Builds on linux/amd64 and linux/arm64 (per GitHub Actions workflow)
## - Uses Next.js standalone output
## - Runs prisma db push on start to ensure schema exists (SQLite)

FROM oven/bun:1-debian AS deps
WORKDIR /app

# Ensure OpenSSL is available so Prisma selects the correct (openssl-3) engine
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies with Bun (uses bun.lock if present)
COPY package.json bun.lock ./
RUN bun install

FROM deps AS builder
WORKDIR /app
COPY . .
# Ensure optional public dir exists so later COPY does not fail
RUN mkdir -p /app/public
# Generate Prisma client and build Next (standalone)
RUN bunx prisma generate
RUN bun run build

FROM oven/bun:1-debian AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# SQLite file mounted under /app/data in runtime (bound volume)
ENV DATABASE_URL=file:/app/data/ling.db
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--enable-source-maps

# Ensure OpenSSL is available in runtime for Prisma engine
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# App artifacts
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Bring the full node_modules from deps to satisfy Prisma CLI runtime deps
# (e.g., @prisma/config -> effect, c12, empathic, deepmerge-ts)
COPY --from=deps /app/node_modules ./node_modules

# Ensure data dir exists for SQLite file and drop privileges
RUN mkdir -p /app/data \
    && chown -R bun:bun /app

USER bun

EXPOSE 3000

# Generate Prisma client, apply DB schema, seed idempotently, then start Next standalone server
CMD ["sh", "-lc", "bunx prisma generate --schema=./prisma/schema.prisma && bunx prisma db push --skip-generate --schema=./prisma/schema.prisma && bun prisma/seed.js && bun ./.next/standalone/server.js"]

# Basic healthcheck against the built-in health route
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS "http://localhost:${PORT:-3000}/api/health" >/dev/null || exit 1
