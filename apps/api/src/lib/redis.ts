import Redis from "ioredis";

const globalForRedit = globalThis as unknown as { redis: Redis };

export const redis = globalForRedit.redis ?? new Redis(process.env.REDIS_URL!);

if (process.env.NODE_ENV !== "production") {
  globalForRedit.redis = redis;
}
