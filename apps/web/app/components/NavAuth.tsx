"use client";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { trpc } from "../lib/trpc";

export default function NavAuth() {
  const { isSignedIn } = useAuth();
  const { data: me } = trpc.users.getMe.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        {me?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Admin
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="text-sm text-gray-400 hover:text-white transition-colors"
    >
      Sign in
    </Link>
  );
}
