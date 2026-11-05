import "server-only";
import { after } from "next/server";
import { cacheGet, cacheSet } from "./cache";
import { recordOutcome, stateOf } from "./health";
import type { PlatformId } from "./platforms";
import { resolveAvatar } from "./providers";
import { ProviderError, type AvatarResult, type ProviderErrorCode } from "./providers/types";

// One search, as the site's /api/avatar and the Telegram bot both run it:
// cached result first, otherwise the platform's provider, with the outcome
// fed to the live service status.

// Signed CDN URLs (TikTok, Instagram) expire, so successes aren't kept too long.
// Failures are cached briefly so repeated searches don't hammer the platform.
const TTL: Record<ProviderErrorCode | "ok", number> = {
  ok: 60 * 60,
  not_found: 10 * 60,
  hidden: 10 * 60,
  rate_limited: 60,
  blocked: 60,
  unavailable: 5 * 60,
};

export type Lookup = { ok: true; result: AvatarResult } | { ok: false; code: ProviderErrorCode; detail?: string };

/** The avatar for a validated platform and username; `null` when something unexpected broke. */
export async function lookupAvatar(platform: PlatformId, username: string): Promise<Lookup | null> {
  const key = `avatar:${platform}:${username.toLowerCase()}`;
  const cached = await cacheGet<Lookup>(key);
  if (cached) return cached;

  let entry: Lookup;
  try {
    entry = { ok: true, result: await resolveAvatar(platform, username) };
    const state = stateOf(entry.result);
    // After the response: the status board must not slow a search down.
    after(() => recordOutcome(platform, state));
  } catch (err) {
    if (!(err instanceof ProviderError)) {
      console.error(`[avatar] ${platform}/${username}`, err);
      return null;
    }
    entry = { ok: false, code: err.code, detail: err.message === err.code ? undefined : err.message };
    // A missing or hidden account says nothing about the platform's health.
    if (err.code !== "not_found" && err.code !== "hidden") after(() => recordOutcome(platform, "down"));
  }
  // A small fallback result is kept briefly so the full size is retried soon.
  const ttl = entry.ok ? (entry.result.limited ? TTL.not_found : TTL.ok) : TTL[entry.code];
  await cacheSet(key, entry, ttl);
  return entry;
}
