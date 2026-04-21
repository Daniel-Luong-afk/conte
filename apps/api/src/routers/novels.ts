import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../lib/trpc";
import { withCache } from "../lib/cache";

export const novelsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const CACHE_TTL_SECONDS = 5 * 60;
    const CACHE_KEY = "novels:all";
    return withCache(CACHE_KEY, CACHE_TTL_SECONDS, () =>
      ctx.prisma.novel.findMany({
        orderBy: { updated_at: "desc" },
        include: {
          _count: { select: { chapters: true } },
        },
      }),
    );
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const CACHE_TTL_SECONDS = 60 * 60;
      const CACHE_KEY = `novels:${input.id}`;

      const novel = await withCache(CACHE_KEY, CACHE_TTL_SECONDS, () =>
        ctx.prisma.novel.findUnique({
          where: { id: input.id },
          include: {
            chapters: {
              where: { translation_status: "DONE" },
              orderBy: { chapter_number: "asc" },
              select: {
                id: true,
                chapter_number: true,
                title_translated: true,
              },
            },
          },
        }),
      );

      if (!novel) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Novel not found" });
      }

      return novel;
    }),

  toggleBookmark: protectedProcedure
    .input(z.object({ novelId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.prisma.bookmark.findUnique({
        where: {
          user_id_novel_id: {
            user_id: ctx.userId!,
            novel_id: input.novelId,
          },
        },
      });

      if (existing) {
        await ctx.prisma.bookmark.delete({ where: { id: existing.id } });
        return { bookmarked: false };
      }

      await ctx.prisma.bookmark.create({
        data: {
          user_id: ctx.userId!,
          novel_id: input.novelId,
        },
      });

      return { bookmarked: true };
    }),

  isBookmarked: protectedProcedure
    .input(z.object({ novelId: z.string() }))
    .query(async ({ input, ctx }) => {
      const bookmark = await ctx.prisma.bookmark.findUnique({
        where: {
          user_id_novel_id: {
            user_id: ctx.userId!,
            novel_id: input.novelId,
          },
        },
      });

      return { bookmarked: !!bookmark };
    }),
});
