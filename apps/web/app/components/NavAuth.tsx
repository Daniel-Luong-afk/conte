"use client";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function NavAuth() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
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
