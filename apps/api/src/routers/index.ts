import { router } from "../lib/trpc";
import { novelsRouter } from "./novels";
import { chaptersRouter } from "./chapters";
import { progressRouter } from "./progress";
import { scraperRouter } from "./scraper";
import { usersRouter } from "./users";
export const appRouter = router({
  novels: novelsRouter,
  chapters: chaptersRouter,
  progress: progressRouter,
  scraper: scraperRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
