import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router: Router = Router();

router.get("/", requireAuth, async (req, res) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: { user_id: req.auth?.userId },
    include: {
      novel: {
        include: {
          _count: { select: { chapters: true } },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  res.json({ bookmarks: bookmarks.map((b: any) => b.novel) });
});

export default router;
