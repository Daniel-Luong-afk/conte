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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          My Library
        </h1>
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No bookmarks yet</p>
            <Link
              href="/browse"
              className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
            >
              Browse novels →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {bookmarks.map((novel: any) => (
              <Link
                key={novel.id}
                href={`/novel/${novel.id}`}
                className="group border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
              >
                {novel.cover_url ? (
                  <img
                    src={novel.cover_url}
                    alt={novel.title_english ?? ""}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No cover</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-indigo-600">
                    {novel.title_english ?? novel.title_original}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {novel.language} · {novel._count.chapters} chapters
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
