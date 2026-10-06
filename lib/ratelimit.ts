import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { ipAddress } from "@vercel/functions";
import { KEY_PREFIX, redis } from "./redis";

// Sliding-window limiter per client IP. With Upstash Redis it holds across all
// server instances; without it (local development) it falls back to memory.
// If Redis is slow or down, requests are let through rather than blocked.

type LimitResult = { ok: boolean; retryAfter: number };

const limiters = new Map<string, Ratelimit>();

function limiterFor(limit: number, windowSeconds: number) {
  const id = `${limit}/${windowSeconds}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      prefix: `${KEY_PREFIX}:ratelimit`,
      timeout: 1000,
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<LimitResult> {
  if (!redis) return memoryRateLimit(key, limit, windowSeconds);
  try {
    const { success, reset } = await limiterFor(limit, windowSeconds).limit(key);
    return { ok: success, retryAfter: success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
  } catch (err) {
    console.error("[ratelimit] redis unavailable, using memory", err);
    return memoryRateLimit(key, limit, windowSeconds);
  }
}

const hits = new Map<string, number[]>();

function memoryRateLimit(key: string, limit: number, windowSeconds: number): LimitResult {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((recent[0] + windowSeconds * 1000 - now) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) hits.delete(hits.keys().next().value!);
  return { ok: true, retryAfter: 0 };
}

/** The visitor's IP as Vercel reports it (not a client-supplied header); "local" in development. */
export function clientIp(req: Request) {
  return ipAddress(req) ?? "local";
}
