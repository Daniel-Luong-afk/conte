import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { Context } from "./trpc";

export function createContext({ req }: CreateExpressContextOptions): Context {
  const userId = req.auth?.userId ?? null;
  const role = req.auth?.role ?? null;
  return {
    userId,
    role,
    prisma,
    redis,
  };
}
