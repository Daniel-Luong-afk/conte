import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../lib/trpc";
import { withCache } from "../lib/cache";
import { redis } from "../lib/redis";

export const novelsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const CACHE_TTL_SECONDS = 5 * 60;
    const CACHE_KEY = "novels:all";
    return withCache(CACHE_KEY, CACHE_TTL_SECONDS, () =>
      ctx.prisma.novel.findMany({
        orderBy: { updated_at: "desc" },
        include: {
          _count: { select: { chapters: true } },
          sources: true,
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

  create: adminProcedure
    .input(
      z.object({
        title_original: z.string().min(1),
        title_english: z.string().optional(),
        description: z.string().optional(),
        cover_url: z.string().optional(),
        status: z.enum(["ONGOING", "COMPLETED", "HIATUS"]).optional(),
        language: z.enum(["JP", "KR", "CN"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const novel = await ctx.prisma.novel.create({ data: input });
      await redis.del("novels:all");
      return novel;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title_original: z.string().min(1).optional(),
        title_english: z.string().optional(),
        description: z.string().optional(),
        cover_url: z.string().optional(),
        status: z.enum(["ONGOING", "COMPLETED", "HIATUS"]).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const novel = await ctx.prisma.novel.update({ where: { id }, data });
      await redis.del("novels:all");
      await redis.del(`novels:${id}`);
      return novel;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.novel.delete({ where: { id: input.id } });
      await redis.del("novels:all");
      await redis.del(`novels:${input.id}`);
      return { deleted: true };
    }),

  addSource: adminProcedure
    .input(
      z.object({
        novel_id: z.string(),
        site_name: z.string().min(1),
        source_url: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const source = await ctx.prisma.novelSource.create({ data: input });
      await redis.del("novels:all");
      return source;
    }),

  updateSource: adminProcedure
    .input(
      z.object({
        id: z.string(),
        site_name: z.string().min(1).optional(),
        source_url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const source = await ctx.prisma.novelSource.update({
        where: { id },
        data,
      });
      await redis.del("novels:all");
      return source;
    }),

  deleteSource: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.novelSource.deleteMany({ where: { id: input.id } });
      await redis.del("novels:all");
      return { deleted: true };
    }),
});
