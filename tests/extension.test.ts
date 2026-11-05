import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { detect, parseProfilePath } from "@/lib/detect";

const source = readFileSync(new URL("../extension/background.js", import.meta.url), "utf8");

/** Runs background.js against a fake `chrome` and returns what its handlers do. */
function load(uiLanguage = "tr") {
  const listeners: Record<string, (...args: unknown[]) => void> = {};
  const opened: string[] = [];
  const menus: { id: string; documentUrlPatterns?: string[]; targetUrlPatterns?: string[] }[] = [];
  const on = (name: string) => ({ addListener: (fn: (...args: unknown[]) => void) => (listeners[name] = fn) });
  const chrome = {
    i18n: { getUILanguage: () => uiLanguage, getMessage: (key: string) => key },
    tabs: { create: ({ url }: { url: string }) => opened.push(url) },
    runtime: { onInstalled: on("installed") },
    contextMenus: {
      onClicked: on("clicked"),
      removeAll: (done: () => void) => done(),
      create: (menu: (typeof menus)[number]) => menus.push(menu),
    },
    action: { onClicked: on("action") },
  };
  new Function("chrome", source)(chrome);
  listeners.installed();
  return {
    menus,
    /** Toolbar click on `url`: the tab it opens. */
    action(url: string) {
      opened.length = 0;
      listeners.action({ url });
      return opened[0];
    },
    /** Right-click on a link to `url`: the tab it opens. */
    link(url: string) {
      opened.length = 0;
      listeners.clicked({ menuItemId: "link", linkUrl: url }, {});
      return opened[0];
    },
  };
}

const HOSTS = JSON.parse(
  source
    .split("// HOSTS-START")[1]
    .split("// HOSTS-END")[0]
    .replace(/^\s*const HOSTS = /, "")
    .replace(/,\s*\];\s*$/, "]"),
) as string[];

/** Chrome match patterns ("*://*.x.com/*") as a test. */
const matches = (patterns: string[], href: string) => {
  const host = new URL(href).hostname;
  return patterns.some((p) => {
    const h = p.slice("*://".length, -"/*".length);
    return h.startsWith("*.") ? host.endsWith(h.slice(1)) : host === h;
  });
};

const PROFILES = [
  "https://www.instagram.com/natgeo/",
  "https://www.facebook.com/zuck",
  "https://www.facebook.com/profile.php?id=4",
  "https://m.facebook.com/zuck",
  "https://www.tiktok.com/@khaby.lame?_t=1",
  "https://x.com/jack",
  "https://twitter.com/jack/status/20",
  "https://www.youtube.com/@MrBeast/videos",
  "https://www.threads.com/@zuck",
  "https://bsky.app/profile/jay.bsky.team",
  "https://mastodon.social/@Gargron",
  "https://fosstodon.org/@someone/123",
  "https://github.com/torvalds/linux",
  "https://gitlab.com/dzaporozhets",
  "https://dev.to/ben",
  "https://www.twitch.tv/shroud",
  "https://kick.com/elraenn",
  "https://www.roblox.com/users/1/profile",
  "https://www.roblox.com/user.aspx?id=1",
  "https://steamcommunity.com/id/gabelogannewell/",
  "https://open.spotify.com/intl-tr/artist/06HL4z0CvFAxyc27GXpf02?si=x",
  "https://soundcloud.com/flume",
  "https://staff.tumblr.com/",
  "https://www.tumblr.com/staff",
  "https://www.flickr.com/people/flickr/",
  "https://vk.com/durov",
  "https://t.me/durov",
  "https://web.telegram.org/k/#@durov",
  "https://tr.pinterest.com/pinterest/",
  "https://www.snapchat.com/add/djkhaled305",
];

describe("browser extension", () => {
  it.each(PROFILES)("opens %s in ppbüyüt as the same profile", (href) => {
    const expected = detect(href);
    expect(expected.kind).toBe("link");
    if (expected.kind !== "link") return;

    const { menus, action, link } = load();
    expect(matches(menus.find((m) => m.id === "page")!.documentUrlPatterns!, href)).toBe(true);
    expect(matches(menus.find((m) => m.id === "link")!.targetUrlPatterns!, href)).toBe(true);

    for (const target of [action(href), link(href)]) {
      const url = new URL(target);
      expect(url.origin).toBe("https://ppbuyut.com");
      // The site's [...slug] route: Next.js splits the raw path and decodes each segment.
      const segments = url.pathname.split("/").filter(Boolean);
      expect(parseProfilePath(segments)).toEqual({ platform: expected.platform, username: expected.username });
    }
  });

  it("lists only sites detect() knows", () => {
    for (const host of HOSTS) expect(detect(`https://${host}/someone`), host).not.toMatchObject({ reason: "unsupported" });
  });

  it("opens the English site for non-Turkish browsers", () => {
    expect(load("en-US").action("https://x.com/jack")).toBe("https://ppbuyut.com/en/https://x.com/jack");
    expect(load("tr-TR").action("https://x.com/jack")).toBe("https://ppbuyut.com/https://x.com/jack");
  });

  it("opens the search page from other sites", () => {
    expect(load().action("https://example.com/natgeo")).toBe("https://ppbuyut.com");
    expect(load("en").action("chrome://newtab/")).toBe("https://ppbuyut.com/en");
  });
});
