// Image hosts /api/proxy may fetch from. Anything else is refused, so the proxy
// can't be used to reach arbitrary (or internal) addresses — SSRF protection.
// An entry matches the host itself and any subdomain.
const ALLOWED_HOSTS = [
  "avatars.githubusercontent.com",
  "yt3.ggpht.com",
  "yt3.googleusercontent.com",
  "pbs.twimg.com",
  "static-cdn.jtvnw.net",
  "telesco.pe",
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "i.pinimg.com",
  "sc-cdn.net",
  "snapchat.com",
  "cdninstagram.com",
  "fbcdn.net",
];

export function isAllowedImageUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
  const host = url.hostname.toLowerCase();
  return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

/** URL of our proxy for an upstream image. `name` becomes the download file name. */
export function proxyUrl(upstream: string, name: string) {
  return `/api/proxy?${new URLSearchParams({ url: upstream, name })}`;
}
