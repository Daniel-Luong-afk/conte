import { api } from "../../../../lib/api";
import { notFound } from "next/navigation";
import ReadingClient from "./ReadingClient";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string; num: string }>;
}) {
  const { id, num } = await params;
  const chapter = await api.chapters.byNumber(id, parseInt(num));
  if (!chapter) notFound();

  return <ReadingClient chapter={chapter} novelId={id} />;
}
