import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../lib/trpc";

export const novelsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.novel.findMany({
      orderBy: { created_at: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const novel = await ctx.prisma.novel.findUnique({
        where: { id: input.id },
      });

      if (!novel) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Novel not found" });
      }

      return novel;
    }),
});
