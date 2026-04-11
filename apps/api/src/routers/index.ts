import { router } from "../lib/trpc";
import { novelsRouter } from "./novels";
import { chaptersRouter } from "./chapters";
import { progressRouter } from "./progress";
import { scraperRouter } from "./scraper";

export const appRouter = router({
  novels: novelsRouter,
  chapters: chaptersRouter,
  progress: progressRouter,
  scraper: scraperRouter,
});

export type AppRouter = typeof appRouter;
