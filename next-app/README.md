# Ling Script (Next.js)

This is a Next.js rewrite scaffold with an integrated API and SQLite via Prisma. It is set up to run as a single Docker container with the SQLite file persisted on a mounted volume (no separate DB container).

## Stack
- Next.js App Router (server components)
- API routes under `app/api/*`
- Prisma ORM with SQLite file at `./data/ling.db`
- Dockerfile for production build & run

## Getting started (local)

1. Copy env: `cp .env.example .env`
2. Install deps: `bun install`
3. Create DB: `bun run db:push` (DB file at `next-app/data/ling.db`)
   - Note: `db:push` skips client generation; `bun run dev` generates the client automatically.
4. Dev server: `bun run dev` (http://localhost:3000)

Seed the dev DB file:
- `bun run db:seed` (populate sample langs/units/prompts)
- `bun run db:reset` (recreate DB file, push schema, seed)

Use the API to seed data quickly:
- `POST /api/create/lang` with `{ "name": "Spanish" }`
- `POST /api/create/unit` with `{ "langId": 1, "name": "Basics" }`
- `POST /api/create/prompt` with `{ "unitId": 1, "content": "Hello", "answer": "Hola" }`

Client endpoints compatible with the original backend:
- `GET /api/langs`
- `GET /api/units/:langId`
- `GET /api/prompts/:unitId`

## Docker (single container)

Build the image:

```bash
# from next-app/
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

On Windows PowerShell:

```powershell
 docker run --name ling-next -p 3000:3000 `
  -v ${PWD}\data:/app/data `
  -e DATABASE_URL="file:../data/ling.db" `
  ling-script-next
```

Notes:
- No separate DB container. SQLite lives at `/app/data/ling.db` inside the app container.
- You can change the filename/location via `DATABASE_URL`.

## Next steps
- Mirror the exact endpoints and data model from `ling-script-api` into `app/api/*`.
- Port Ionic views into React pages/components in `app/*`.
