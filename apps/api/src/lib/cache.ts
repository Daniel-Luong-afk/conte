import { redis } from "./redis";

export async function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = await fn();
  await redis.set(key, JSON.stringify(data), "EX", ttl);
  return data;
}
