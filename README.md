# Conte

A full-stack novel translation platform that automatically translates Korean, Japanese, and Chinese web novels into English using AI.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Node.js, Express 5, TypeScript, Prisma 5, PostgreSQL 16
- **Auth:** Clerk (webhooks + JWT verification)
- **API Layer:** tRPC v11 (end-to-end type safety)
- **Monorepo:** Turborepo + pnpm workspaces
- **Scraper:** Python, Celery, Redis, Flask, BeautifulSoup, httpx
- **Translation:** DeepSeek-V3 (Chinese), Qwen-MT-Plus (Japanese/Korean)

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

In active development — deployment coming in Month 6.

## Roadmap

- [x] Monorepo setup (Turborepo + pnpm)
- [x] tRPC API layer
- [x] Auth + Clerk webhook user sync
- [x] Python scraping engine (Celery + BeautifulSoup)
- [x] AI translation pipeline (DeepSeek-V3 + Qwen-MT-Plus)
- [x] Full reading UI (novel listing, detail, chapter reader)
- [x] Bookmarks + personal library page
- [x] Reading progress auto-save
- [x] In-app notifications for new chapters
- [x] Dark UI rework
- [ ] Full deployment (Vercel + Railway)
