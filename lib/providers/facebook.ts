import "server-only";
import { PREVIEW_BOT_UA, check, metaContent, request } from "./http";
import { ProviderError, type AvatarResult, type Provider } from "./types";

interface GraphPicture {
  data?: { url?: string; width?: number; height?: number; is_silhouette?: boolean };
}

/**
 * The Graph API's picture edge needs no token for Pages and public numeric
 * ids, and serves large originals (800–2048 px). Personal profiles answer with
 * an error or a grey silhouette, so null sends us to the profile page.
 */
async function fromGraph(username: string): Promise<AvatarResult | null> {
  const res = await request(
    `https://graph.facebook.com/${encodeURIComponent(username)}/picture?width=2048&height=2048&redirect=false`,
  );
  if (!res.ok) return null;
  const { data } = ((await res.json().catch(() => ({}))) as GraphPicture) ?? {};
  if (!data?.url || data.is_silhouette) return null;
  return { url: data.url, width: data.width, height: data.height, source: "official", original: true };
}

/** The profile page's link preview: works for personal profiles too. */
async function fromPagePreview(username: string): Promise<AvatarResult> {
  const path = /^\d+$/.test(username) ? `profile.php?id=${username}` : encodeURIComponent(username);
  const init = { headers: { "user-agent": PREVIEW_BOT_UA }, redirect: "manual" as const };
  // Redirects are followed by hand: whether one happened is the signal below.
  let res = await request(`https://www.facebook.com/${path}`, init);
  const location = res.headers.get("location");
  const redirected = res.status >= 300 && res.status < 400 && !!location;
  if (redirected) res = await request(new URL(location, "https://www.facebook.com/").toString(), init);
  if (res.status === 429) check(res);
  // Restricted profiles get an error page (400/403) on cloud IPs: that's the
  // profile, not Facebook being down, so it must not mark the service broken.
  if (res.status >= 400 && res.status < 500) throw new ProviderError(res.status === 404 ? "not_found" : "hidden");
  const html = await check(res).text();
  const url = metaContent(html, "og:image");
  // Facebook alternates between its CDN and its crawler image relay.
  if (url && /^https:\/\/[^/]+\.(fbcdn\.net|fbsbx\.com)\//.test(url)) return { url, source: "scrape" };

  // From home connections a missing account answers 200 at once, while an
  // existing username is first redirected to "/name/". Only that combination
  // proves the account doesn't exist. Cloud IPs (Vercel) get redirects and
  // login walls for everything, so any other picture-less page is reported as
  // "hidden": the account may be private or may not exist — we can't tell.
  if (!redirected && !metaContent(html, "og:title")) throw new ProviderError("not_found");
  throw new ProviderError("hidden");
}

export const facebook: Provider = {
  id: "facebook",
  async fetchAvatar(username) {
    return (await fromGraph(username)) ?? fromPagePreview(username);
  },
};
