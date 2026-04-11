import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../lib/trpc";

export const novelsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.novel.findMany({
      orderBy: { updated_at: "desc" },
      include: {
        _count: { select: { chapters: true } },
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const novel = await ctx.prisma.novel.findUnique({
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
      });

      if (!novel) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Novel not found" });
      }

      return novel;
    }),
});
