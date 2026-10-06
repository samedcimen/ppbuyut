import "server-only";
import { KEY_PREFIX, redis } from "./redis";

// TTL cache. With Upstash Redis it is shared by all server instances; without
// it (local development), or when Redis fails, it falls back to memory.

const MAX_ENTRIES = 5000;
const store = new Map<string, { value: unknown; expiresAt: number }>();

const redisKey = (key: string) => `${KEY_PREFIX}:cache:${key}`;

export async function cacheGet<T>(key: string): Promise<T | undefined> {
  if (redis) {
    try {
      // Values are stored as JSON and parsed back by the client.
      return (await redis.get<T>(redisKey(key))) ?? undefined;
    } catch (err) {
      console.error("[cache] redis get failed, using memory", err);
    }
  }
  return memoryGet<T>(key);
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  if (redis) {
    try {
      await redis.set(redisKey(key), value, { ex: ttlSeconds });
      return;
    } catch (err) {
      console.error("[cache] redis set failed, using memory", err);
    }
  }
  memorySet(key, value, ttlSeconds);
}

function memoryGet<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return hit.value as T;
}

function memorySet(key: string, value: unknown, ttlSeconds: number) {
  if (store.size >= MAX_ENTRIES) {
    // Map keeps insertion order: drop the oldest entry.
    store.delete(store.keys().next().value!);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}
