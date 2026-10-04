import { PLATFORMS, type PlatformId } from "./platforms";
import type { AvatarResult } from "./providers/types";

export interface AvatarResponse extends AvatarResult {
  platform: PlatformId;
  username: string;
}

export type AvatarErrorCode = "not_found" | "rate_limited" | "blocked" | "unknown";

export class AvatarError extends Error {
  constructor(public code: AvatarErrorCode) {
    super(code);
  }
}

export const SOURCE_LABEL: Record<AvatarResult["source"], string> = {
  official: "Resmi kaynak",
  scrape: "Herkese açık sayfa",
  thirdparty: "Yedek kaynak",
};

/**
 * Fetches the avatar for a profile.
 *
 * TODO(backend): replace the mock with `GET /api/avatar?platform=…&username=…`.
 * The mock lets the UI be exercised end to end:
 *   - GitHub returns the real avatar (public URL, no key needed)
 *   - other platforms return a generated placeholder at the platform's max size
 *   - usernames "yok", "limit" and "engel" trigger the error states
 */
export async function getAvatar(
  platform: PlatformId,
  username: string,
  signal?: AbortSignal,
): Promise<AvatarResponse> {
  await delay(700 + Math.random() * 600, signal);

  const lower = username.toLowerCase();
  if (lower === "yok") throw new AvatarError("not_found");
  if (lower === "limit") throw new AvatarError("rate_limited");
  if (lower === "engel") throw new AvatarError("blocked");

  if (platform === "github") {
    return {
      platform,
      username,
      url: `https://github.com/${encodeURIComponent(username)}.png?size=460`,
      source: "official",
    };
  }

  const size = PLATFORMS[platform].maxSize;
  return {
    platform,
    username,
    url: placeholderAvatar(username, size),
    width: size,
    height: size,
    source: ["youtube", "twitch", "x"].includes(platform) ? "official" : "scrape",
  };
}

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

function placeholderAvatar(seed: string, size: number) {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const hue = Math.abs(hash) % 360;
  const initials = seed.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 75% 62%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360} 70% 40%)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-family="system-ui,sans-serif" font-size="36" font-weight="600" fill="rgba(255,255,255,.92)">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
