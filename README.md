# Conte

A full-stack novel translation platform that focuses on Korean, Japanese and Chinese web novel into English using AI.

## Tech Stack

- **Frontend:** Next.js, React, Typescript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Auth:** Clerk
- **API Layer"** tRPC (end-to-end type safety)
- **Monorepo:** Turbo repo + pnpm workspaces

## Getting Started

```bash
git clone https://github.com/Daniel-Luong-afk/conte
cd conte
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
docker compose up -d
pnpm install
pnpm dev
```

## Status

In active development!

## Roadmap

- [o] Monorepo setup (Turborepo + pnpm)
- [o] tRPC API layer
- [x] Auth UI + JWT verification (Clerk) token forwarding in progress
- [ ] Python scraping engine
- [ ] AI translation pipeline (DeepL + OpenAI)
- [ ] Full reading UI
- [ ] AWS deployment + CI/CD
