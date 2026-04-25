"use client";
import { useState } from "react";
import { trpc } from "../lib/trpc";
import Link from "next/link";

const LANGUAGES = [
  { label: "All", value: undefined },
  { label: "Japanese 🇯🇵", value: "JP" },
  { label: "Korean 🇰🇷", value: "KR" },
  { label: "Chinese 🇨🇳", value: "CN" },
] as const;

export default function BrowsePage() {
  const [language, setLanguage] = useState<"JP" | "KR" | "CN" | undefined>(
    undefined,
  );

  const { data, isLoading } = trpc.novels.getAll.useQuery(undefined, {
    initialData: [],
  });

  const novels = data
    ? language
      ? data.filter((n: any) => n.language === language)
      : data
    : [];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Browse</h1>
        <p className="text-gray-400 mb-8">
          {data
            ? `${novels.length} novel${novels.length !== 1 ? "s" : ""}`
            : "Loading..."}
        </p>

        {/* Language filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.label}
              onClick={() => setLanguage(lang.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                language === lang.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-800 rounded-xl mb-2" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && novels.length === 0 && (
          <p className="text-gray-500 py-20 text-center">No novels found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {novels.map((novel: any) => (
            <Link key={novel.id} href={`/novel/${novel.id}`} className="group">
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
      </div>
    </main>
  );
}
