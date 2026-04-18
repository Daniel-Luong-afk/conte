import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "../lib/api";
import Link from "next/link";

export default async function LibraryPage() {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) redirect("/sign-in");

  const data = await api.bookmarks.list(token);
  const bookmarks = data?.bookmarks ?? [];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">My Library</h1>
        <p className="text-gray-400 mb-8">
          {bookmarks.length} bookmarked novel{bookmarks.length !== 1 ? "s" : ""}
        </p>

        {bookmarks.length === 0 ? (
          <div className="text-center py-32 border border-gray-800 rounded-2xl">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-gray-400 mb-2">Your library is empty.</p>
            <p className="text-gray-500 text-sm mb-6">
              Bookmark novels to save them here.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Browse Novels →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bookmarks.map((novel: any) => (
              <Link
                key={novel.id}
                href={`/novel/${novel.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800 mb-2">
                  {novel.cover_url ? (
                    <img
                      src={novel.cover_url}
                      alt={novel.title_english ?? ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      No cover
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-md font-medium">
                    {novel.language}
                  </span>
                </div>
                <p className="font-medium text-sm leading-snug line-clamp-2 text-gray-200 group-hover:text-indigo-400 transition-colors">
                  {novel.title_english ?? novel.title_original}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {novel._count.chapters} chapters
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
