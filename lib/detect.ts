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
  /** Extracts the username from path segments (and the query, #fragment or host, if needed), or returns null. */
  extract: (segments: string[], query: URLSearchParams, hash: string, host: string) => string | null;
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

/**
 * Site paths that aren't profiles, per platform. Shared with the bookmarklet
 * (lib/bookmarklet.ts), which must refuse the same pages.
 */
export const RESERVED_PATHS = {
  facebook: [
    "groups", "events", "watch", "marketplace", "gaming", "share", "sharer", "story.php", "photo", "photo.php",
    "photos", "videos", "reel", "posts", "permalink.php", "login", "login.php", "help", "pages", "hashtag",
    "search", "settings", "notifications", "messages", "friends", "bookmarks", "privacy", "policies", "legal",
  ],
  instagram: ["p", "reel", "reels", "tv", "explore", "stories", "accounts", "direct", "about", "legal", "developer"],
  x: [
    "home", "explore", "search", "i", "settings", "messages", "notifications", "intent", "hashtag", "share", "compose", "login", "signup", "tos", "privacy",
  ],
  github: [
    "settings", "explore", "marketplace", "topics", "trending", "login", "join", "features", "sponsors", "notifications", "pulls", "issues", "about", "pricing", "apps", "search", "collections", "enterprise", "security", "codespaces", "new",
  ],
  twitch: ["directory", "videos", "settings", "p", "search", "downloads", "jobs", "turbo", "subscriptions", "inventory", "wallet"],
  kick: [
    "categories", "category", "browse", "following", "video", "videos", "clips", "clip", "dashboard", "search",
    "terms-of-service", "privacy-policy", "community-guidelines", "dmca-policy", "cookies", "about", "contact",
    "careers", "subscriptions", "settings", "login", "signup", "register", "popout", "api", "help", "faq", "press",
  ],
  soundcloud: [
    "discover", "stream", "upload", "you", "search", "charts", "pages", "pro", "terms-of-use", "people", "settings",
    "notifications", "messages", "mobile", "imprint", "popular", "jobs", "press", "creators", "signin", "logout",
    "tags", "feed", "home", "for-artists", "artists", "connect", "apps", "community-guidelines",
  ],
  tumblr: [
    "blog", "dashboard", "explore", "tagged", "search", "settings", "login", "register", "likes", "following",
    "inbox", "new", "docs", "policy", "help", "about", "privacy", "live", "communities", "activity", "reblog", "post",
  ],
  /** Tumblr subdomains that aren't blogs. */
  tumblrHosts: ["api", "assets", "media", "static", "help", "www"],
  telegram: ["joinchat", "addstickers", "addemoji", "share", "proxy", "socks", "login", "iv"],
  pinterest: ["pin", "search", "ideas", "today", "settings", "business", "_", "login", "resource"],
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
      return firstSegment(RESERVED_PATHS.facebook)(segments);
    },
  },
  {
    platform: "instagram",
    match: onDomain("instagram.com", "instagr.am"),
    extract: firstSegment(RESERVED_PATHS.instagram),
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
    extract: firstSegment(RESERVED_PATHS.x),
  },
  {
    platform: "youtube",
    match: onDomain("youtube.com"),
    extract: atSegment,
  },
  {
    // bsky.app/profile/<handle>
    platform: "bluesky",
    match: onDomain("bsky.app"),
    extract: (segments) => (segments[0] === "profile" && segments[1] && !segments[1].startsWith("did:") ? segments[1] : null),
  },
  {
    platform: "github",
    match: (host) => host === "github.com",
    extract: (segments) => {
      if (segments[0]?.toLowerCase() === "orgs") return segments[1] ?? null;
      return firstSegment(RESERVED_PATHS.github)(segments);
    },
  },
  {
    platform: "twitch",
    match: onDomain("twitch.tv"),
    extract: firstSegment(RESERVED_PATHS.twitch),
  },
  {
    platform: "kick",
    match: onDomain("kick.com"),
    extract: firstSegment(RESERVED_PATHS.kick),
  },
  {
    // open.spotify.com/user/<id> and /artist/<id>, also with a language prefix (/intl-tr/…)
    platform: "spotify",
    match: (host) => host === "open.spotify.com",
    extract: (segments) => {
      const rest = segments[0]?.startsWith("intl-") ? segments.slice(1) : segments;
      if (rest[0] === "user") return rest[1] ?? null;
      if (rest[0] === "artist" && rest[1]) return `artist:${rest[1]}`;
      return null;
    },
  },
  {
    platform: "soundcloud",
    match: (host) => host === "soundcloud.com",
    extract: firstSegment(RESERVED_PATHS.soundcloud),
  },
  {
    // name.tumblr.com, or tumblr.com/name, /blog/name, /blog/view/name, /dashboard/blog/name
    platform: "tumblr",
    match: onDomain("tumblr.com"),
    extract: (segments, _query, _hash, host) => {
      if (host !== "tumblr.com") {
        const blog = host.slice(0, -".tumblr.com".length);
        return blog.includes(".") || RESERVED_PATHS.tumblrHosts.includes(blog) ? null : blog;
      }
      const start = segments[0] === "dashboard" ? (segments[1] === "blog" ? 2 : -1) : segments[0] === "blog" ? 1 : 0;
      if (start < 0) return null;
      if (start === 0) return firstSegment(RESERVED_PATHS.tumblr)(segments);
      return (segments[start] === "view" ? segments[start + 1] : segments[start]) ?? null;
    },
  },
  {
    platform: "telegram",
    match: onDomain("t.me", "telegram.me", "telegram.dog"),
    extract: (segments) => {
      // t.me/s/channel → public channel preview
      const rest = segments[0] === "s" ? segments.slice(1) : segments;
      const first = rest[0];
      if (!first || first.startsWith("+")) return null;
      return firstSegment(RESERVED_PATHS.telegram)(rest);
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
    extract: firstSegment(RESERVED_PATHS.pinterest),
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
    const username = rule.extract(segments, url.searchParams, url.hash, host)?.replace(/^@/, "");
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

/**
 * Whether a path that isn't a profile still looks like a pasted link (so it
 * gets an explanation instead of a 404): it starts with http(s): or a domain
 * (instagram.com/explore, example.com/x). Plain words like /platformlar/abc don't.
 */
export function looksLikeLinkPath(segments: string[]) {
  const first = segments.length > 0 ? safeDecode(segments[0]) : "";
  return /^https?:$/i.test(first) || /^[\w-]+(\.[\w-]+)+$/.test(first);
}

/** Whether a bare username fits the chosen platform's rules. */
export function isValidFor(platform: PlatformId, username: string): boolean {
  return PLATFORMS[platform].usernamePattern.test(username);
}
