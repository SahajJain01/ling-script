<div align="center">

# Ling Script

Minimal, mobile‑first language practice. Built for speed, clarity, and a delightful UX.

<br/>

<img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white&style=for-the-badge" />
<img alt="React" src="https://img.shields.io/badge/React-18-087ea4?logo=react&logoColor=white&style=for-the-badge" />
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white&style=for-the-badge" />
<img alt="SQLite" src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white&style=for-the-badge" />
<img alt="Bun" src="https://img.shields.io/badge/Bun-%F0%9F%8D%90-000000?logo=bun&logoColor=white&style=for-the-badge" />
<img alt="Node.js" src="https://img.shields.io/badge/Node.js-20-5FA04E?logo=node.js&logoColor=white&style=for-the-badge" />
<img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white&style=for-the-badge" />
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-configured-4B32C3?logo=eslint&logoColor=white&style=for-the-badge" />

<br/>

<sub>App Router • API routes • Prisma ORM • SQLite • Standalone build • One‑container deploy</sub>

</div>

## Highlights

- Bold, mobile‑first UI with accessible focus states and toasts
- Next.js App Router with server components and `app/api/*` endpoints
- Prisma + SQLite for a zero‑ops, file‑based database that “just works”
- One‑command local setup; instant seed/reset scripts for fast iteration
- Production‑ready Dockerfile using Next standalone output

## Built With

- Next.js 14, React 18, TypeScript 5
- Prisma 5 (SQLite), Node.js 20
- Bun (dev ergonomics, `bunx` for Prisma)
- Vanilla CSS (no framework) tuned for touch + desktop

## Quick Start

Prereqs: Node 20+ (or Bun), Docker optional.

1) Install deps

```bash
# Recommended
bun install

# or npm
npm install
```

2) Configure the database URL (SQLite file path). Create `.env` in the repo root:

```ini
DATABASE_URL="file:../data/ling.db"
```

3) Create the database and generate the Prisma client

```bash
# Push schema (skips generate in script); dev regenerates client automatically
bun run db:push
```

4) Start the dev server

```bash
bun run dev
# http://localhost:3000
```

5) Seed sample data (languages, units, prompts)

```bash
bun run db:seed

# Or recreate from scratch (delete DB file, push, seed)
bun run db:reset
```

Health check: `GET /api/health`

## API Cheatsheet

- `GET /api/langs` — list languages
- `GET /api/units/:langId` — units for a language
- `GET /api/prompts/:unitId` — prompts for a unit
- `POST /api/create/lang` — `{ name }`
- `POST /api/create/unit` — `{ langId, name }`
- `POST /api/create/prompt` — `{ unitId, content, answer }`

## Docker (One‑Container Deploy)

Build the image:

```bash
docker build -t ling-script-next .
```

Run with a bind mount to persist the SQLite file on the host:

```bash
# Linux/Mac
docker run --name ling-next -p 3000:3000 \
  -v "$(pwd)/data:/app/data" \
  -e DATABASE_URL="file:../data/ling.db" \
  ling-script-next
```

```powershell
# Windows PowerShell
docker run --name ling-next -p 3000:3000 `
  -v ${PWD}\data:/app/data `
  -e DATABASE_URL="file:../data/ling.db" `
  ling-script-next
```

Notes:

- SQLite lives at `/app/data/ling.db` inside the container; no external DB needed
- You can change the filename/location by adjusting `DATABASE_URL`

## Project Structure

```
app/                    # App Router (pages + API routes)
  api/                  # REST-ish endpoints
  lang/[id]/            # Language units listing
  unit/[id]/            # Practice screen (client)
components/             # UI primitives (TopNav, Toasts, etc.)
lib/prisma.ts           # Prisma client (single instance)
prisma/schema.prisma    # Data model (Lang, Unit, Prompt)
prisma/seed.js          # Seed script (idempotent)
scripts/reset-db.js     # Quick nuke & seed for dev
Dockerfile              # Multi-stage, standalone Next build
```

## NPM Scripts

- `dev` — `bunx prisma generate && next dev`
- `build` — `prisma generate && next build`
- `start` — `next start`
- `db:push` — `prisma db push --skip-generate`
- `db:seed` — `bun prisma/seed.js`
- `db:reset` — remove DB, push schema, seed

## Roadmap

- Richer progress tracking and spaced repetition
- Export/import user progress
- More languages and curated units

---

Made with care. If this helped you evaluate my skills, I’m happy to walk through the code, decisions, and tradeoffs in an interview.
