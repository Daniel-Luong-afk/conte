import { router, protectedProcedure } from "../lib/trpc";

export const usersRouter = router({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId! },
      select: { id: true, email: true, role: true },
    });
    return user;
  }),
});
