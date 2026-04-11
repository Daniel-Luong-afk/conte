import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../lib/trpc";

export const chaptersRouter = router({
  getByNumber: publicProcedure
    .input(z.object({ novelId: z.string(), chapterNumber: z.number() }))
    .query(async ({ input, ctx }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          novel_id_chapter_number: {
            novel_id: input.novelId,
            chapter_number: input.chapterNumber,
          },
        },
      });

      if (!chapter || chapter.translation_status !== "DONE") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }

      const prev = await ctx.prisma.chapter.findFirst({
        where: {
          novel_id: input.novelId,
          chapter_number: { lt: input.chapterNumber },
          translation_status: "DONE",
        },
        orderBy: { chapter_number: "desc" },
        select: { chapter_number: true },
      });

      const next = await ctx.prisma.chapter.findFirst({
        where: {
          novel_id: input.novelId,
          chapter_number: { gt: input.chapterNumber },
          translation_status: "DONE",
        },
        orderBy: { chapter_number: "asc" },
        select: { chapter_number: true },
      });

      return {
        ...chapter,
        prev: prev?.chapter_number ?? null,
        next: next?.chapter_number ?? null,
      };
    }),
});
