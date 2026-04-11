"use client";
import { useState } from "react";
import { trpc } from "../lib/trpc";
import Link from "next/link";

const LANGUAGES = [
  { label: "All", value: undefined },
  { label: "Japanese", value: "JP" },
  { label: "Korean", value: "KR" },
  { label: "Chinese", value: "CN" },
] as const;

export default function BrowsePage() {
  const [language, setLanguage] = useState<"JP" | "KR" | "CN" | undefined>(
    undefined,
  );

  const { data, isLoading } = trpc.novels.getAll.useQuery();

  const novels = data
    ? language
      ? data.filter((n: any) => n.language === language)
      : data
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Browse Novels</h1>

      <div className="flex gap-2 mb-8">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.label}
            onClick={() => setLanguage(lang.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
              ${
                language === lang.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-gray-400">Loading...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {novels.map((novel: any) => (
          <Link
            key={novel.id}
            href={`/novel/${novel.id}`}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {novel.cover_url && (
              <img
                src={novel.cover_url}
                alt={novel.title_english ?? ""}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-3">
              <p className="font-medium text-sm leading-snug line-clamp-2">
                {novel.title_english ?? novel.title_original}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {novel.language} · {novel._count.chapters} chapters
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
