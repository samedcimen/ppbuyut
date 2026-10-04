import { NextResponse, type NextRequest } from "next/server";
import { cacheGet, cacheSet } from "@/lib/cache";
import { validateFor } from "@/lib/detect";
import { recordOutcome, stateOf } from "@/lib/health";
import { isPlatformId } from "@/lib/platforms";
import { resolveAvatar } from "@/lib/providers";
import { ProviderError, type AvatarResult, type ProviderErrorCode } from "@/lib/providers/types";
import { proxyUrl } from "@/lib/proxy-hosts";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const STATUS: Record<ProviderErrorCode, number> = {
  not_found: 404,
  hidden: 403,
  rate_limited: 429,
  blocked: 502,
  unavailable: 503,
};

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

type Cached = { ok: true; result: AvatarResult } | { ok: false; code: ProviderErrorCode; detail?: string };

// `detail` is the short technical reason (e.g. "HTTP 500"), useful when a platform misbehaves.
const error = (code: string, status: number, headers?: HeadersInit, detail?: string) =>
  NextResponse.json({ error: code, ...(detail && { detail }) }, { status, headers });

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get("platform");
  const username = req.nextUrl.searchParams.get("username")?.trim().replace(/^@/, "") ?? "";
  if (!isPlatformId(platform) || !username || validateFor(platform, username)) return error("invalid", 400);

  const limit = rateLimit(`avatar:${clientIp(req)}`, 10, 60);
  if (!limit.ok) return error("rate_limited", 429, { "retry-after": String(limit.retryAfter) });

  const key = `avatar:${platform}:${username.toLowerCase()}`;
  let entry = await cacheGet<Cached>(key);

  if (!entry) {
    try {
      entry = { ok: true, result: await resolveAvatar(platform, username) };
      recordOutcome(platform, stateOf(entry.result));
    } catch (err) {
      if (!(err instanceof ProviderError)) {
        console.error(`[avatar] ${platform}/${username}`, err);
        return error("unknown", 500);
      }
      entry = { ok: false, code: err.code, detail: err.message === err.code ? undefined : err.message };
      // A missing or hidden account says nothing about the platform's health.
      if (err.code !== "not_found" && err.code !== "hidden") recordOutcome(platform, "down");
    }
    // A small fallback result is kept briefly so the full size is retried soon.
    const ttl = entry.ok ? (entry.result.limited ? TTL.not_found : TTL.ok) : TTL[entry.code];
    await cacheSet(key, entry, ttl);
  }

  if (!entry.ok) return error(entry.code, STATUS[entry.code], undefined, entry.detail);

  const { url, width, height, source, note, original } = entry.result;
  return NextResponse.json(
    { platform, username, url: proxyUrl(url, `${platform}-${username}`), width, height, source, note, original },
    { headers: { "cache-control": "private, max-age=300" } },
  );
}
