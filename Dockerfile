## Multi-arch production build for Next.js + Prisma (SQLite)
## - Builds on linux/amd64 and linux/arm64 (per GitHub Actions workflow)
## - Uses Next.js standalone output
## - Runs prisma db push on start to ensure schema exists (SQLite)

FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Install dependencies (no lockfile present, so use install)
COPY package.json ./
RUN npm install --no-audit --no-fund

FROM deps AS builder
WORKDIR /app
COPY . .
# Generate Prisma client and build Next (standalone)
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# SQLite file mounted under /app/data in runtime (bound volume)
ENV DATABASE_URL=file:../data/ling.db

# App artifacts
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Minimal Prisma runtime + CLI so we can `db push` on start
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Ensure data dir exists for SQLite file
RUN mkdir -p /app/data

EXPOSE 3000

# Apply DB schema, seed idempotently, then start Next standalone server
CMD ["sh", "-lc", "node ./node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma && node ./prisma/seed.js && node ./.next/standalone/server.js"]
