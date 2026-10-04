import "server-only";

// In-memory TTL cache, per server instance. Async on purpose: it can be
// swapped for Redis (Upstash) later without touching the callers.

const MAX_ENTRIES = 5000;
const store = new Map<string, { value: unknown; expiresAt: number }>();

export async function cacheGet<T>(key: string): Promise<T | undefined> {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  if (store.size >= MAX_ENTRIES) {
    // Map keeps insertion order: drop the oldest entry.
    store.delete(store.keys().next().value!);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}
