"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trpc } from "../lib/trpc";

export default function AdminPage() {
  const router = useRouter();

  const { data: me, isLoading: meLoading } = trpc.users.getMe.useQuery();
  const { data: novels, isLoading: novelsLoading } =
    trpc.novels.getAll.useQuery();

  const scrapeMutation = trpc.scraper.scrapNovel.useMutation();

  useEffect(() => {
    if (!meLoading && me?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [me, meLoading, router]);

  if (meLoading || novelsLoading) {
    return <p className="p-8 text-gray-400">Loading...</p>;
  }

  if (me?.role !== "ADMIN") return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="flex flex-col gap-4">
        {novels?.map((novel: any) => (
          <div
            key={novel.id}
            className="flex items-center justify-between bg-gray-900 rounded-lg p-4"
          >
            <div>
              <p className="font-medium">
                {novel.title_english ?? novel.title_original}
              </p>
              <p className="text-sm text-gray-400">{novel.language}</p>
            </div>
            <button
              onClick={() => scrapeMutation.mutate({ novel_id: novel.id })}
              disabled={scrapeMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg"
            >
              {scrapeMutation.isPending ? "Scraping..." : "Scrape"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
