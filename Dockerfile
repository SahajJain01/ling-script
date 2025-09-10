## Multi-arch production build for Next.js + Prisma (SQLite)
## - Builds on linux/amd64 and linux/arm64 (per GitHub Actions workflow)
## - Uses Next.js standalone output
## - Runs prisma db push on start to ensure schema exists (SQLite)

FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Ensure OpenSSL is available so Prisma selects the correct (openssl-3) engine
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies (no lockfile present, so use install)
COPY package.json ./
RUN npm install --no-audit --no-fund

FROM deps AS builder
WORKDIR /app
COPY . .
# Ensure optional public dir exists so later COPY does not fail
RUN mkdir -p /app/public
# Generate Prisma client and build Next (standalone)
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# SQLite file mounted under /app/data in runtime (bound volume)
ENV DATABASE_URL=file:/app/data/ling.db
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--enable-source-maps

# Ensure OpenSSL is available in runtime for Prisma engine
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
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
    && chown -R node:node /app

USER node

EXPOSE 3000

# Apply DB schema, seed idempotently, then start Next standalone server
CMD ["sh", "-lc", "node ./node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma && node ./prisma/seed.js && node ./.next/standalone/server.js"]

# Basic healthcheck against the built-in health route
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
