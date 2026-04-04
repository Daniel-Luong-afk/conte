import { router } from "../lib/trpc";
import { novelsRouter } from "./novels";
import { scraperRouter } from "./scraper";

export const appRouter = router({
  novels: novelsRouter,
  scraper: scraperRouter,
});

export type AppRouter = typeof appRouter;
