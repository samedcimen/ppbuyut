import { NextResponse, type NextRequest } from "next/server";
import { lookupAvatar } from "@/lib/avatar-lookup";
import { isValidFor } from "@/lib/detect";
import { isPlatformId } from "@/lib/platforms";
import type { ProviderErrorCode } from "@/lib/providers/types";
import { proxyUrl } from "@/lib/proxy-hosts";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const STATUS: Record<ProviderErrorCode, number> = {
  not_found: 404,
  hidden: 403,
  rate_limited: 429,
  blocked: 502,
  unavailable: 503,
};

// `detail` is the short technical reason (e.g. "HTTP 500"), useful when a platform misbehaves.
const error = (code: string, status: number, headers?: HeadersInit, detail?: string) =>
  NextResponse.json({ error: code, ...(detail && { detail }) }, { status, headers });

// Instagram can fall back to a mirror that needs up to ~30 s for a profile it hasn't seen.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get("platform");
  const username = req.nextUrl.searchParams.get("username")?.trim().replace(/^@/, "") ?? "";
  if (!isPlatformId(platform) || !username || !isValidFor(platform, username)) return error("invalid", 400);

  // A scan (one username on every platform) has its own limits: a few searches per
  // platform and minute, and a total cap, so it neither eats the normal limit nor
  // works as a way around it.
  const ip = clientIp(req);
  const scan = req.nextUrl.searchParams.has("scan");
  let limit = await rateLimit(scan ? `scan:${ip}` : `avatar:${ip}`, scan ? 60 : 10, 60);
  if (scan && limit.ok) limit = await rateLimit(`scan:${ip}:${platform}`, 4, 60);
  if (!limit.ok) return error("rate_limited", 429, { "retry-after": String(limit.retryAfter) });

  const entry = await lookupAvatar(platform, username);
  if (!entry) return error("unknown", 500);
  if (!entry.ok) return error(entry.code, STATUS[entry.code], undefined, entry.detail);

  const { url, width, height, source, note, original, name } = entry.result;
  return NextResponse.json(
    {
      platform,
      username,
      url: proxyUrl(url, `${platform}-${name ?? username}`),
      width,
      height,
      source,
      note,
      original,
      name,
    },
    { headers: { "cache-control": "private, max-age=300" } },
  );
}
