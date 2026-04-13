"use client";
import { useState, useEffect } from "react";
import { trpc } from "../../lib/trpc";

type Props = {
  novelId: string;
};

export default function BookmarkButton({ novelId }: Props) {
  const { data, isLoading } = trpc.novels.isBookmarked.useQuery({ novelId });
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (data) setBookmarked(data.bookmarked);
  }, [data]);

  const toggle = trpc.novels.toggleBookmark.useMutation({
    onSuccess: (data) => setBookmarked(data.bookmarked),
    onError: () => setBookmarked((prev) => !prev),
  });

  const handleClick = () => {
    setBookmarked((prev) => !prev);
    toggle.mutate({ novelId });
  };

  if (isLoading)
    return (
      <div className="px-4 py-2 rounded-lg border border-gray-100 animate-pulse text-transparent text-sm">
        ☆ Bookmark
      </div>
    );

  return (
    <button
      onClick={handleClick}
      disabled={toggle.isPending}
      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
        bookmarked
          ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
          : "border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
      }`}
    >
      {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
    </button>
  );
}
