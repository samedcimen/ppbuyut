import "server-only";
import { ProviderError } from "./types";

export const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

/** Link-preview bots get public meta tags from pages that otherwise require a login. */
export const PREVIEW_BOT_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

const TIMEOUT_MS = 8000;

export async function request(
  url: string,
  { timeoutMs = TIMEOUT_MS, ...init }: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      headers: { "user-agent": BROWSER_UA, "accept-language": "en-US,en;q=0.9", ...init.headers },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch {
    // Timeouts and network errors look the same to the user: the platform didn't answer.
    throw new ProviderError("blocked", `request failed: ${new URL(url).hostname}`);
  }
}

/** Maps platform HTTP errors to provider errors; returns the response when OK. */
export function check(res: Response): Response {
  if (res.ok) return res;
  if (res.status === 404) throw new ProviderError("not_found");
  if (res.status === 429) throw rateLimited(res);
  throw new ProviderError("blocked", `HTTP ${res.status}`);
}

/** A rate_limited error carrying the platform's reset time, when it sends one. */
export function rateLimited(res: Response): ProviderError {
  const retryAfter = Number(res.headers.get("retry-after"));
  const resetEpoch = Number(res.headers.get("x-rate-limit-reset"));
  const retryAt =
    retryAfter > 0 ? Date.now() + retryAfter * 1000 : resetEpoch > 0 ? resetEpoch * 1000 : undefined;
  return new ProviderError("rate_limited", `HTTP 429 from ${new URL(res.url).hostname}`, retryAt);
}

export async function getText(url: string, init?: RequestInit) {
  return (await request(url, init).then(check)).text();
}

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  return (await request(url, init).then(check)).json() as Promise<T>;
}

/** Reads JSON from `<script id="…">` in an HTML page. */
export function scriptJson<T>(html: string, id: string): T | null {
  const match = html.match(new RegExp(`<script id="${id}"[^>]*>([\\s\\S]*?)</script>`));
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as T;
  } catch {
    return null;
  }
}

export function metaContent(html: string, property: string): string | null {
  const match =
    html.match(new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]+)"`)) ??
    html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+property="${property}"`));
  return match ? decodeEntities(match[1]) : null;
}

export function decodeEntities(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
