import "server-only";
import { PREVIEW_BOT_UA, getText, metaContent, rateLimited, request } from "./http";
import { ProviderError, type AvatarResult, type Provider } from "./types";

const SMALL_NOTE = "Instagram şu an yalnızca küçük boyutu veriyor; daha sonra tekrar denersen büyük hâli gelebilir.";

// The same profile endpoint instagram.com's own web app calls (and what sites
// like instadp read `profile_pic_url_hd` from): ~320 px for logged-out visitors.
// Instagram throttles it per IP; while it does, more calls only extend the
// block, so we skip it until the cooldown ends and use the page preview instead.
// No login cookies are ever used.
const API_COOLDOWN_MS = 15 * 60 * 1000;
let apiCooldownUntil = 0;

async function fromApi(username: string): Promise<AvatarResult | null> {
  if (apiCooldownUntil > Date.now()) return null;

  const res = await request(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
    {
      // What the browser sends for this call from a profile page.
      headers: {
        "x-ig-app-id": "936619743392459",
        "x-requested-with": "XMLHttpRequest",
        accept: "*/*",
        referer: `https://www.instagram.com/${encodeURIComponent(username)}/`,
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
      },
    },
  );
  if (res.status === 404) throw new ProviderError("not_found");
  if (res.status === 429 || res.status === 401) {
    apiCooldownUntil = rateLimited(res).retryAt ?? Date.now() + API_COOLDOWN_MS;
    return null;
  }
  if (!res.ok) return null;

  const data = (await res.json().catch(() => null)) as { data?: { user?: { profile_pic_url_hd?: string } | null } } | null;
  if (data?.data && !data.data.user) throw new ProviderError("not_found");
  const url = data?.data?.user?.profile_pic_url_hd;
  return url ? { url, width: 320, height: 320, source: "scrape" } : null;
}

const MIRROR_NOTE = "Fotoğraf yedek kaynaktan alındı; Instagram'daki güncel hâlinden farklı olabilir.";

/**
 * A public mirror keeps copies of Instagram profile photos (often 400–1080 px)
 * on public, server-rendered pages — no captcha, and its robots.txt allows
 * /profil/. Used when Instagram itself refuses us (e.g. from cloud IPs).
 * A profile it hasn't seen yet is fetched from Instagram on the spot: that
 * first answer can take several seconds or be a 503 ("temporarily
 * unavailable") while the copy is made, so it gets a long timeout and one
 * retry. A 503 can't tell "missing" from "not ready", so it's never not_found.
 */
const MIRROR_ATTEMPTS = [15_000, 12_000];

async function fromMirror(username: string): Promise<AvatarResult | null> {
  for (const [attempt, timeoutMs] of MIRROR_ATTEMPTS.entries()) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 2000));
    let res: Response;
    try {
      res = await request(`https://instazoomer.de/profil/${encodeURIComponent(username)}`, {
        headers: { "user-agent": "ppbuyut (+https://ppbuyut.vercel.app)" },
        timeoutMs,
      });
    } catch {
      continue; // timed out: the copy may be ready on the next try
    }
    if (res.status === 429) throw rateLimited(res);
    if (res.status === 503) continue;
    if (!res.ok) return null;

    const url = (await res.text()).match(/class="profile-image"[^>]*src="([^"]+)"/)?.[1];
    return url?.startsWith("https://api.instazoomer.com/") ? { url, source: "thirdparty", note: MIRROR_NOTE } : null;
  }
  return null;
}

/** The public page's link preview: works when the API is throttled, but only ~100 px. */
async function fromPagePreview(username: string): Promise<AvatarResult> {
  const html = await getText(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
    headers: { "user-agent": PREVIEW_BOT_UA },
  });
  const url = metaContent(html, "og:image");
  if (url?.includes("cdninstagram.com")) return { url, source: "scrape", note: SMALL_NOTE, limited: true };

  // Missing accounts get a 200 page rendered by Instagram's error component.
  // Anything else without a profile image (e.g. a login wall served to cloud
  // IPs) means we were refused — not that the account doesn't exist.
  if (html.includes("PolarisErrorRoot")) throw new ProviderError("not_found");
  throw new ProviderError("blocked", "profile page without profile data");
}

export const instagram: Provider = {
  id: "instagram",
  async fetchAvatar(username) {
    return (await fromApi(username)) ?? (await fromMirror(username)) ?? fromPagePreview(username);
  },
};
