import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";

export const progressRouter = router({
  save: protectedProcedure
    .input(z.object({ novelId: z.string(), chapterId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.readingProgress.upsert({
        where: {
          user_id_novel_id: {
            user_id: ctx.userId!,
            novel_id: input.novelId,
          },
        },
        update: { chapter_id: input.chapterId },
        create: {
          user_id: ctx.userId!,
          novel_id: input.novelId,
          chapter_id: input.chapterId,
        },
      });
      return { ok: true };
    }),
});
