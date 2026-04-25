import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, adminProcedure } from "../lib/trpc";

export const scraperRouter = router({
  scrapNovel: adminProcedure
    .input(z.object({ novel_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let nSource = await ctx.prisma.novelSource.findFirst({
        where: {
          novel_id: input.novel_id,
        },
      });

      if (!nSource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Error: Can not find novel",
        });
      }

      const res = await fetch(`${process.env.SCRAPER_URL}/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_url: nSource.source_url,
          novel_id: nSource.novel_id,
          source_id: nSource.id,
          site_name: nSource.site_name,
        }),
      });
      const data = await res.json();

      return {
        task_id: data.task_id,
      };
    }),
});
