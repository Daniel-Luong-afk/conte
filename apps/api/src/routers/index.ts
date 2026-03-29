import { router } from "../lib/trpc";
import { novelsRouter } from "./novels";

export const appRouter = router({
  novels: novelsRouter,
});

export type AppRouter = typeof appRouter;
