# Conte

A full-stack novel translation platform that focuses on Korean, Japanese and Chinese web novel into English using AI.

## Tech Stack

- **Frontend:** Next.js, React, Typescript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Auth:** Clerk
- **API Layer:** tRPC (end-to-end type safety)
- **Monorepo:** Turborepo + pnpm workspaces
- **Scraper:** Python, Celery, Redis, Flask, BeautifulSoup

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

- [x] Monorepo setup (Turborepo + pnpm)
- [x] tRPC API layer
- [x] Auth UI + JWT verification (Clerk)
- [x] Python scraping engine
- [x] AI translation pipeline (DeepSeek-V3 + Qwen-MT-Plus)
- [x] Full reading UI (novel listing, detail, chapter reader)
- [x] Bookmarks + personal library page
- [x] Reading progress auto-save
- [ ] Email notifications for new chapters (Resend)
- [ ] Deployment to Vercel
