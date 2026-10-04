import { PLATFORMS, isPlatformId, type PlatformId } from "./platforms";

export type DetectResult =
  | { kind: "empty" }
  /** A profile link — platform is known. */
  | { kind: "link"; platform: PlatformId; username: string }
  /** A bare username — the platform must be chosen by the user. */
  | { kind: "username"; username: string }
  /** `platform` is set when the link's site was recognized but the profile part wasn't. */
  | { kind: "invalid"; reason: DetectReason; platform?: PlatformId };

/** Why input was rejected (messages live in lib/i18n). */
export type DetectReason = "unreadable" | "unsupported" | "not_profile" | "bad_username" | "bad_chars";

interface HostRule {
  platform: PlatformId;
  match: (host: string) => boolean;
  /** Extracts the username from path segments (and the query or #fragment, if needed), or returns null. */
  extract: (segments: string[], query: URLSearchParams, hash: string) => string | null;
}

const onDomain = (...domains: string[]) => (host: string) =>
  domains.some((d) => host === d || host.endsWith(`.${d}`));

/** First segment, unless it is a reserved (non-profile) path. */
const firstSegment = (reserved: string[]) => (segments: string[]) => {
  const [first] = segments;
  if (!first || reserved.includes(first.toLowerCase())) return null;
  return first;
};

/** First segment that starts with "@" (TikTok, Threads, YouTube handles). */
const atSegment = (segments: string[]) => {
  const [first] = segments;
  return first?.startsWith("@") ? first.slice(1) : null;
};

const RULES: HostRule[] = [
  {
    platform: "facebook",
    match: onDomain("facebook.com", "fb.com"),
    extract: (segments, query) => {
      const [first, , third] = segments;
      // facebook.com/profile.php?id=123 and facebook.com/people/Name/123
      if (first === "profile.php") return query.get("id");
      if (first === "people") return third ?? null;
      return firstSegment([
        "groups", "events", "watch", "marketplace", "gaming", "share", "sharer", "story.php", "photo", "photo.php",
        "photos", "videos", "reel", "posts", "permalink.php", "login", "login.php", "help", "pages", "hashtag",
        "search", "settings", "notifications", "messages", "friends", "bookmarks", "privacy", "policies", "legal",
      ])(segments);
    },
  },
  {
    platform: "instagram",
    match: onDomain("instagram.com", "instagr.am"),
    extract: firstSegment([
      "p", "reel", "reels", "tv", "explore", "stories", "accounts", "direct", "about", "legal", "developer",
    ]),
  },
  {
    platform: "threads",
    match: onDomain("threads.net", "threads.com"),
    extract: atSegment,
  },
  {
    platform: "tiktok",
    match: onDomain("tiktok.com"),
    extract: atSegment,
  },
  {
    platform: "x",
    match: onDomain("x.com", "twitter.com"),
    extract: firstSegment([
      "home", "explore", "search", "i", "settings", "messages", "notifications", "intent", "hashtag", "share", "compose", "login", "signup", "tos", "privacy",
    ]),
  },
  {
    platform: "youtube",
    match: onDomain("youtube.com"),
    extract: atSegment,
  },
  {
    platform: "github",
    match: (host) => host === "github.com",
    extract: (segments) => {
      if (segments[0]?.toLowerCase() === "orgs") return segments[1] ?? null;
      return firstSegment([
        "settings", "explore", "marketplace", "topics", "trending", "login", "join", "features", "sponsors", "notifications", "pulls", "issues", "about", "pricing", "apps", "search", "collections", "enterprise", "security", "codespaces", "new",
      ])(segments);
    },
  },
  {
    platform: "twitch",
    match: onDomain("twitch.tv"),
    extract: firstSegment(["directory", "videos", "settings", "p", "search", "downloads", "jobs", "turbo", "subscriptions", "inventory", "wallet"]),
  },
  {
    platform: "telegram",
    match: onDomain("t.me", "telegram.me", "telegram.dog"),
    extract: (segments) => {
      // t.me/s/channel → public channel preview
      const rest = segments[0] === "s" ? segments.slice(1) : segments;
      const first = rest[0];
      if (!first || first.startsWith("+")) return null;
      return firstSegment(["joinchat", "addstickers", "addemoji", "share", "proxy", "socks", "login", "iv"])(rest);
    },
  },
  {
    // Telegram Web keeps the open chat in the fragment: web.telegram.org/k/#@username
    platform: "telegram",
    match: (host) => host === "web.telegram.org",
    extract: (_segments, _query, hash) => hash.match(/^#@([A-Za-z0-9_]{4,32})$/)?.[1] ?? null,
  },
  {
    platform: "pinterest",
    match: (host) => /(^|\.)pinterest\.[a-z.]{2,6}$/.test(host),
    extract: firstSegment(["pin", "search", "ideas", "today", "settings", "business", "_", "login", "resource"]),
  },
  {
    platform: "snapchat",
    match: onDomain("snapchat.com"),
    extract: (segments) => {
      const [first, second] = segments;
      if (first === "add") return second ?? null;
      return atSegment(segments);
    },
  },
];

const GENERIC_USERNAME = /^[A-Za-z0-9._-]{1,40}$/;

const normalizeHost = (host: string) => host.toLowerCase().replace(/^(www|m|mobile)\./, "");

/**
 * "john.doe" is a valid Instagram username, so a dot alone doesn't make a URL.
 * Treat input as a link only with a protocol, a path, or a known domain.
 */
function looksLikeUrl(input: string) {
  if (/^https?:\/\//i.test(input) || input.includes("/")) return true;
  const host = normalizeHost(input);
  return RULES.some((r) => r.match(host));
}

function safeDecode(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function detect(rawInput: string): DetectResult {
  const input = rawInput.trim();
  if (!input) return { kind: "empty" };

  if (looksLikeUrl(input)) {
    let url: URL;
    try {
      url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    } catch {
      return { kind: "invalid", reason: "unreadable" };
    }

    const host = normalizeHost(url.hostname);
    const rule = RULES.find((r) => r.match(host));
    if (!rule) return { kind: "invalid", reason: "unsupported" };

    const segments = url.pathname.split("/").filter(Boolean).map(safeDecode);
    const username = rule.extract(segments, url.searchParams, url.hash)?.replace(/^@/, "");
    const platform = PLATFORMS[rule.platform];

    if (!username) {
      return { kind: "invalid", reason: "not_profile", platform: rule.platform };
    }
    if (!platform.usernamePattern.test(username)) {
      return { kind: "invalid", reason: "bad_username", platform: rule.platform };
    }
    return { kind: "link", platform: rule.platform, username };
  }

  const username = input.replace(/^@/, "");
  if (!GENERIC_USERNAME.test(username)) {
    return { kind: "invalid", reason: "bad_chars" };
  }
  return { kind: "username", username };
}

/**
 * Reads a profile from a site path, so a link can be opened by prefixing it with our domain:
 *   /instagram/kullanici                     (short form, also what we put in the address bar)
 *   /instagram.com/kullanici
 *   /https://www.instagram.com/kullanici     (servers may collapse "//" into "/")
 */
export function parseProfilePath(segments: string[]): { platform: PlatformId; username: string } | null {
  const parts = segments.map(safeDecode);

  if (parts.length === 2 && isPlatformId(parts[0])) {
    const platform = parts[0];
    const username = parts[1].replace(/^@/, "");
    return PLATFORMS[platform].usernamePattern.test(username) ? { platform, username } : null;
  }

  const result = detect(profilePathText(segments));
  return result.kind === "link" ? { platform: result.platform, username: result.username } : null;
}

/** The path as the link text the user most likely typed after our domain. */
export function profilePathText(segments: string[]) {
  return segments.map(safeDecode).join("/").replace(/^(https?):\/(?!\/)/i, "$1://");
}

/** Whether a bare username fits the chosen platform's rules. */
export function isValidFor(platform: PlatformId, username: string): boolean {
  return PLATFORMS[platform].usernamePattern.test(username);
}
