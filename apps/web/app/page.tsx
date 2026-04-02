"use client";

import { trpc } from "./lib/trpc";

export default function Home() {
  const { data, isLoading } = trpc.novels.getAll.useQuery();

  if (isLoading) return <p>Loading...</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
