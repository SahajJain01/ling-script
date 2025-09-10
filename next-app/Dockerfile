# Simple single-container production image with SQLite file persistence via volume
FROM oven/bun:1.1-alpine AS base
WORKDIR /app

# Install dependencies with Bun
COPY package.json ./
RUN bun install

# Copy source
COPY . .

# Generate Prisma client and build
RUN bunx prisma generate
RUN bun run build

# Bun keeps a single store cache outside the project; keep layer size low

# Ensure data dir exists for SQLite file
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:../data/ling.db
EXPOSE 3000

# Ensure DB schema is applied on container start (SQLite file in /app/data)
CMD ["sh", "-lc", "bunx prisma generate && bunx prisma db push --skip-generate && bun run start"]
