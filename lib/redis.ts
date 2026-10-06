import "server-only";
import { Redis } from "@upstash/redis";

// Shared Upstash Redis client for the cache and the rate limiter, so both hold
// across server instances. Without credentials (local development) it is null
// and callers keep their in-memory fallback. Vercel's Upstash integration sets
// the KV_* names; a database connected by hand usually uses the UPSTASH_* ones.

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

/** Prefix for every key this site writes, in case the database is shared. */
export const KEY_PREFIX = "ppbuyut";
