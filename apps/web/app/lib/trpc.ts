import { createTRPCReact, CreateTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@conte/types";

export const trpc: CreateTRPCReact<AppRouter, unknown> =
  createTRPCReact<AppRouter>();
