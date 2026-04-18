import { api } from "./lib/api";
import Link from "next/link";

export default async function HomePage() {
  const novels = (await api.novels.list()) ?? [];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Novel Translations
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-5">
            Web novels,
            <br />
            <span className="text-indigo-400">in English.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mb-8">
            Japanese, Korean, and Chinese novels, automatically translated as
            new chapters release.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            Browse Novels <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Latest releases */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-white mb-6">Latest Releases</h2>

        {novels.length === 0 ? (
          <p className="text-gray-500">No novels yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {novels.map((novel: any) => (
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
      </section>
    </main>
  );
}
