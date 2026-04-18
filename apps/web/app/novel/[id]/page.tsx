import { api } from "../../lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";

export default async function NovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const novel = await api.novels.byId(id);
  if (!novel) notFound();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {novel.cover_url ? (
              <img
                src={novel.cover_url}
                alt={novel.title_english ?? ""}
                className="w-36 h-52 object-cover rounded-xl shadow-lg self-start mx-auto sm:mx-0 shrink-0"
              />
            ) : (
              <div className="w-36 h-52 rounded-xl bg-gray-800 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <span className="text-gray-600 text-xs">No cover</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 leading-tight">
                {novel.title_english ?? novel.title_original}
              </h1>
              <p className="text-gray-500 text-sm mb-4">
                {novel.title_original}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold">
                  {novel.language}
                </span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">
                  {novel.status}
                </span>
                <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-semibold">
                  {novel.chapters.length} chapters
                </span>
              </div>
              {novel.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {novel.description}
                </p>
              )}
              <BookmarkButton novelId={novel.id} />
            </div>
          </div>
        </div>

        {/* Chapter list */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white">
              Chapters ({novel.chapters.length})
            </h2>
          </div>
          {novel.chapters.length === 0 ? (
            <p className="text-gray-500 px-6 py-12 text-center text-sm">
              No translated chapters yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-800">
              {novel.chapters.map((chapter: any) => (
                <Link
                  key={chapter.id}
                  href={`/novel/${novel.id}/chapter/${chapter.chapter_number}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-indigo-500/5 transition-colors group"
                >
                  <span className="text-sm text-gray-300 group-hover:text-indigo-400 transition-colors">
                    Chapter {chapter.chapter_number}
                    {chapter.title_translated && (
                      <span className="text-gray-500">
                        {" "}
                        — {chapter.title_translated}
                      </span>
                    )}
                  </span>
                  <span className="text-indigo-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
