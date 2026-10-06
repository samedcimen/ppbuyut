import type { NextRequest } from "next/server";
import { BROWSER_UA, PREVIEW_BOT_UA } from "@/lib/providers/http";
import { isAllowedImageUrl } from "@/lib/proxy-hosts";
import { openUrl } from "@/lib/proxy-token";
import { clientIp, rateLimit } from "@/lib/ratelimit";

// Streams an avatar from the platform CDN through our origin: no CORS or
// hotlink problems, and downloads get a proper file name.

const MAX_REDIRECTS = 3;
const MAX_BYTES = 15 * 1024 * 1024;

// SVG is excluded on purpose: served from our origin it could run scripts.
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const fail = (status: number, message: string) => new Response(message, { status });

/** Facebook's crawler image relay (fbsbx.com) only serves images to its own link-preview bot. */
const userAgentFor = (url: string) => (new URL(url).hostname.endsWith(".fbsbx.com") ? PREVIEW_BOT_UA : BROWSER_UA);

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  // Only addresses this server issued (encrypted by /api/avatar) are fetched.
  const opened = openUrl(params.get("t") ?? "");
  if (!opened) return fail(400, "invalid token");

  // Cached copies are served by the CDN without reaching here; this caps fresh
  // fetches (e.g. with cache-busting parameters) so the proxy can't be used to
  // pull images in bulk. A search shows one or two images.
  const limit = await rateLimit(`proxy:${clientIp(req)}`, 60, 60);
  if (!limit.ok) return new Response("rate limited", { status: 429, headers: { "retry-after": String(limit.retryAfter) } });
  let target = opened;
  const name = (params.get("name") ?? "avatar").replace(/[^\w.-]/g, "_").slice(0, 80);
  const download = params.has("download");

  // Follow redirects by hand so every hop is checked against the allowlist.
  let upstream: Response | null = null;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isAllowedImageUrl(target)) return fail(400, "host not allowed");
    try {
      upstream = await fetch(target, {
        redirect: "manual",
        headers: { "user-agent": userAgentFor(target), accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      return fail(502, "upstream unreachable");
    }
    const location = upstream.headers.get("location");
    if (upstream.status >= 300 && upstream.status < 400 && location) {
      target = new URL(location, target).toString();
      upstream = null;
      continue;
    }
    break;
  }

  if (!upstream) return fail(502, "too many redirects");
  if (!upstream.ok || !upstream.body) return fail(upstream.status === 404 ? 404 : 502, "upstream error");

  const type = upstream.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ?? "";
  const ext = EXT_BY_TYPE[type];
  if (!ext) return fail(415, "not an image");
  if (Number(upstream.headers.get("content-length") ?? 0) > MAX_BYTES) return fail(413, "image too large");

  return new Response(limitBytes(upstream.body, MAX_BYTES), {
    headers: {
      "content-type": type,
      "content-disposition": `${download ? "attachment" : "inline"}; filename="${name}.${ext}"`,
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'",
    },
  });
}

/** Cuts the stream off when a server lies about (or omits) Content-Length. */
function limitBytes(body: ReadableStream<Uint8Array>, max: number) {
  let seen = 0;
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        seen += chunk.byteLength;
        if (seen > max) controller.error(new Error("image too large"));
        else controller.enqueue(chunk);
      },
    }),
  );
}
