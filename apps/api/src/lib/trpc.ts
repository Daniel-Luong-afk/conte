import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "./prisma";
import { redis } from "./redis";

export interface Context {
  userId: string | null;
  role: string | null;
  prisma: typeof prisma;
  redis: typeof redis;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx } });
});
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx: { ...ctx } });
});
