import { api } from "../../lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function NovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const novel = await api.novels.byId(id);
  if (!novel) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {novel.cover_url && (
          <img
            src={novel.cover_url}
            alt={novel.title_english ?? ""}
            className="w-full sm:w-48 h-48 sm:h-64 object-cover rounded-lg shadow-lg"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {novel.title_english ?? novel.title_original}
          </h1>
          <p className="text-gray-500 mb-4 text-sm">{novel.title_original}</p>
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
              {novel.language}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
              {novel.status}
            </span>
          </div>
          {novel.description && (
            <p className="text-gray-700 text-sm leading-relaxed">
              {novel.description}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">
        Chapters ({novel.chapters.length})
      </h2>

      {novel.chapters.length === 0 ? (
        <p className="text-gray-400">No translated chapters yet.</p>
      ) : (
        <div className="divide-y border rounded-lg overflow-hidden">
          {novel.chapters.map((chapter: any) => (
            <Link
              key={chapter.id}
              href={`/novel/${novel.id}/chapter/${chapter.chapter_number}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-indigo-50 transition-colors"
            >
              <span className="text-sm">
                Chapter {chapter.chapter_number}
                {chapter.title_translated && (
                  <span className="text-gray-500">
                    {" "}
                    — {chapter.title_translated}
                  </span>
                )}
              </span>
              <span className="text-indigo-500 text-xs">Read →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
