import { Router } from "express";
import { prisma } from "../lib/prisma";
import { withCache } from "../lib/cache";

const router: Router = Router();

router.get("/", async (req, res) => {
  const novels = await withCache("novels:all", 300, () =>
    prisma.novel.findMany({
      orderBy: { updated_at: "desc" },
      include: { _count: { select: { chapters: true } } },
    }),
  );
  res.json(novels);
});

router.get("/:id", async (req, res) => {
  const novel = await withCache(`novels:${req.params.id}`, 3600, () =>
    prisma.novel.findUnique({
      where: { id: req.params.id },
      include: {
        chapters: {
          where: { translation_status: "DONE" },
          orderBy: { chapter_number: "asc" },
          select: { id: true, chapter_number: true, title_translated: true },
        },
      },
    }),
  );
  if (!novel) return res.status(404).json({ error: "Not found" });
  res.json(novel);
});

router.get("/:id/chapters/:num", async (req, res) => {
  const chapterNumber = parseInt(req.params.num);
  const chapter = await withCache(
    `chapters:${req.params.id}:${req.params.num}`,
    86400,
    async () => {
      const ch = await prisma.chapter.findUnique({
        where: {
          novel_id_chapter_number: {
            novel_id: req.params.id,
            chapter_number: chapterNumber,
          },
        },
      });
      if (!ch || ch.translation_status !== "DONE") return null;
      const prev = await prisma.chapter.findFirst({
        where: {
          novel_id: req.params.id,
          chapter_number: { lt: chapterNumber },
          translation_status: "DONE",
        },
        orderBy: { chapter_number: "desc" },
        select: { chapter_number: true },
      });
      const next = await prisma.chapter.findFirst({
        where: {
          novel_id: req.params.id,
          chapter_number: { gt: chapterNumber },
          translation_status: "DONE",
        },
        orderBy: { chapter_number: "asc" },
        select: { chapter_number: true },
      });
      return {
        ...ch,
        prev: prev?.chapter_number ?? null,
        next: next?.chapter_number ?? null,
      };
    },
  );
  if (!chapter) return res.status(404).json({ error: "Not found" });
  res.json(chapter);
});

export default router;
