"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../../../../lib/trpc";

interface Chapter {
  id: string;
  chapter_number: number;
  title_translated: string | null;
  content_translated: string;
  prev: number | null;
  next: number | null;
}

export default function ReadingClient({
  chapter,
  novelId,
}: {
  chapter: Chapter;
  novelId: string;
}) {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(18);
  const [isDark, setIsDark] = useState(true);

  const progressSaved = useRef(false);
  const saveProgress = trpc.progress.save.useMutation();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" && chapter.next) {
        router.push(`/novel/${novelId}/chapter/${chapter.next}`);
      }
      if (e.key === "ArrowLeft" && chapter.prev) {
        router.push(`/novel/${novelId}/chapter/${chapter.prev}`);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [chapter.prev, chapter.next, novelId, router]);

  useEffect(() => {
    progressSaved.current = false;

    const handleScroll = () => {
      if (progressSaved.current) return;

      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;

      if (scrolled / total > 0.8) {
        progressSaved.current = true;
        saveProgress.mutate({
          novelId,
          chapterId: chapter.id,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapter.id, novelId]);

  const bg = isDark ? "bg-gray-950 text-gray-100" : "bg-amber-50 text-gray-900";
  const border = isDark ? "border-gray-800" : "border-amber-200";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-200`}>
      <div className={`sticky top-0 z-10 border-b ${border} px-4 py-2`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push(`/novel/${novelId}`)}
            className="text-sm opacity-60 hover:opacity-100"
          >
            ← Back
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm opacity-70 hover:opacity-100"
            >
              A-
            </button>
            <span className="text-xs opacity-40 w-8 text-center">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize((s) => Math.min(28, s + 2))}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm opacity-70 hover:opacity-100"
            >
              A+
            </button>
            <button
              onClick={() => setIsDark((d) => !d)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center opacity-70 hover:opacity-100"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6 text-center">
          Chapter {chapter.chapter_number}
          {chapter.title_translated && (
            <span className="block text-base font-normal opacity-70 mt-1">
              {chapter.title_translated}
            </span>
          )}
        </h1>

        <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}>
          {chapter.content_translated.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-5">
              {paragraph}
            </p>
          ))}
        </div>

        <div
          className={`flex justify-between gap-4 mt-12 pt-6 border-t ${border}`}
        >
          <button
            onClick={() =>
              chapter.prev &&
              router.push(`/novel/${novelId}/chapter/${chapter.prev}`)
            }
            disabled={!chapter.prev}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-30 font-medium text-sm"
          >
            ← Previous
          </button>
          <button
            onClick={() =>
              chapter.next &&
              router.push(`/novel/${novelId}/chapter/${chapter.next}`)
            }
            disabled={!chapter.next}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-30 font-medium text-sm"
          >
            Next →
          </button>
        </div>
      </article>
    </div>
  );
}
