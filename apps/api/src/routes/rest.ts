import { Router } from "express";
import { prisma } from "../lib/prisma";

const router: Router = Router();

router.get("/", async (req, res) => {
  const novels = await prisma.novel.findMany({
    orderBy: { updated_at: "desc" },
    include: { _count: { select: { chapters: true } } },
  });
  res.json(novels);
});

router.get("/:id", async (req, res) => {
  const novel = await prisma.novel.findUnique({
    where: { id: req.params.id },
    include: {
      chapters: {
        where: { translation_status: "DONE" },
        orderBy: { chapter_number: "asc" },
        select: { id: true, chapter_number: true, title_translated: true },
      },
    },
  });

  if (!novel) return res.status(404).json({ error: "Not found" });
  res.json(novel);
});

router.get("/:id/chapters/:num", async (req, res) => {
  const chapterNumber = parseInt(req.params.num);
  const chapter = await prisma.chapter.findUnique({
    where: {
      novel_id_chapter_number: {
        novel_id: req.params.id,
        chapter_number: chapterNumber,
      },
    },
  });

  if (!chapter || chapter.translation_status !== "DONE") {
    return res.status(404).json({ error: "Not found" });
  }

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
  res.json({
    ...chapter,
    prev: prev?.chapter_number ?? null,
    next: next?.chapter_number ?? null,
  });
});

export default router;
