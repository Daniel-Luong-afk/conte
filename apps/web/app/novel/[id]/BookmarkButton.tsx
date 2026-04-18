"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { trpc } from "../../lib/trpc";

export default function BookmarkButton({ novelId }: { novelId: string }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.novels.isBookmarked.useQuery(
    { novelId },
    { enabled: !!isSignedIn },
  );

  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (data !== undefined) setBookmarked(data.bookmarked);
  }, [data?.bookmarked]);

  const toggle = trpc.novels.toggleBookmark.useMutation({
    onSuccess: (result) => {
      setBookmarked(result.bookmarked);
      utils.novels.isBookmarked.setData({ novelId }, result);
    },
    onError: () => {
      setBookmarked((prev) => !prev);
    },
  });

  const handleClick = () => {
    setBookmarked((prev) => !prev);
    toggle.mutate({ novelId });
  };

  // Clerk hasn't loaded yet — show skeleton
  if (!isLoaded || (isSignedIn && isLoading))
    return (
      <div className="px-4 py-2 rounded-lg bg-gray-800 animate-pulse text-transparent text-sm w-28">
        Bookmark
      </div>
    );

  // Not signed in — redirect to sign-in on click
  if (!isSignedIn)
    return (
      <button
        onClick={() => router.push("/sign-in")}
        className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400 text-sm font-medium transition-colors"
      >
        ☆ Bookmark
      </button>
    );

  return (
    <button
      onClick={handleClick}
      disabled={toggle.isPending}
      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
        bookmarked
          ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
          : "border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400"
      }`}
    >
      {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
    </button>
  );
}
