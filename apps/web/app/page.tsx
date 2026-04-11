import { api } from "./lib/api";
import Link from "next/link";

export default async function HomePage() {
  const novels = (await api.novels.list()) ?? [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Conte</h1>
      <p className="text-gray-500 mb-10">
        JKC web novels automatically translated with AI.
      </p>

      {novels.length === 0 ? (
        <p className="text-gray-400">No novels yets</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {novels.map((novel: any) => (
            <Link
              key={novel.id}
              href={`/novel/${novel.id}`}
              className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {novel.cover_url && (
                <img
                  src={novel.cover_url}
                  alt={novel.title_english ?? ""}
                  className="w-full h-48 object-cover"
                />
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
    </main>
  );
}
