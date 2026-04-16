import { Router } from "express";
import { prisma } from "../lib/prisma";

const internal_secret = process.env.INTERNAL_SECRET;

const router: Router = Router();

router.post("/chapter-done", async (req, res) => {
  const internal_secret_header = req.headers["x-internal-secret"];

  if (!internal_secret_header || internal_secret_header !== internal_secret) {
    res.status(401).json("Incorrect header");
    return;
  }

  const { novel_id, novel_title, chapter_number } = req.body;

  if (!novel_id) {
    res.status(404).json("Couldn't find novel with that ID");
    return;
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      novel_id: novel_id,
    },
  });

  const notification = bookmarks.map((b) => ({
    user_id: b.user_id,
    novel_id: b.novel_id,
    message: `${novel_title} has a new chapter: ${chapter_number}`,
  }));

  const { count } = await prisma.notification.createMany({
    data: notification,
  });

  res.json({ count: count });
});

export default router;
