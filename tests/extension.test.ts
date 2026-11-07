import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BOOKMARKLET_RULES } from "@/lib/bookmarklet";
import { detect, parseProfilePath } from "@/lib/detect";
import { PROFILE_URLS } from "./fixtures/profile-urls";

const source = readFileSync(new URL("../extension/background.js", import.meta.url), "utf8");
const messages = JSON.parse(readFileSync(new URL("../extension/_locales/tr/messages.json", import.meta.url), "utf8"));

type Outcome = { opened?: string; alerted?: string; badge?: string };

/** Runs background.js against a fake `chrome` and returns what its handlers do. */
function load(uiLanguage = "tr", { scriptable = true } = {}) {
  const listeners: Record<string, (...args: unknown[]) => void> = {};
  let outcome: Outcome = {};
  const menus: { id: string; documentUrlPatterns?: string[]; targetUrlPatterns?: string[] }[] = [];
  const on = (name: string) => ({ addListener: (fn: (...args: unknown[]) => void) => (listeners[name] = fn) });
  const chrome = {
    i18n: { getUILanguage: () => uiLanguage, getMessage: (key: string) => messages[key]?.message ?? "" },
    tabs: { create: ({ url }: { url: string }) => (outcome.opened = url) },
    runtime: { onInstalled: on("installed") },
    contextMenus: {
      onClicked: on("clicked"),
      removeAll: (done: () => void) => done(),
      create: (menu: (typeof menus)[number]) => menus.push(menu),
    },
    scripting: {
      executeScript: async ({ args }: { args: string[] }) => {
        if (!scriptable) throw new Error("Cannot access contents of the page");
        outcome.alerted = args[0];
      },
    },
    action: {
      onClicked: on("action"),
      setBadgeText: ({ text }: { text: string }) => (outcome.badge = text),
      setBadgeBackgroundColor: () => {},
      setTitle: () => {},
    },
  };
  new Function("chrome", source)(chrome);
  listeners.installed();
  const run = async (fire: () => void) => {
    outcome = {};
    fire();
    await new Promise((resolve) => setTimeout(resolve)); // let tell() settle
    return outcome;
  };
  return {
    menus,
    /** Toolbar click on `url`. */
    action: (url: string) => run(() => listeners.action({ id: 1, url })),
    /** Right-click on the page at `url`. */
    page: (url: string) => run(() => listeners.clicked({ menuItemId: "page", pageUrl: url }, { id: 1, url })),
    /** Right-click on a link to `url`. */
    link: (url: string) => run(() => listeners.clicked({ menuItemId: "link", linkUrl: url }, { id: 1, url: "https://x.com/" })),
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

const MORE_PROFILES = [
  "https://m.facebook.com/zuck",
  "https://www.tiktok.com/@khaby.lame?_t=1",
  "https://web.telegram.org/k/#@durov",
  "https://tr.pinterest.com/pinterest/",
];

describe("browser extension", () => {
  it("carries the bookmarklet's profile rules (run `npm run extension` after changing them)", () => {
    const rules = source.split("// RULES-START\n")[1].split("// RULES-END")[0];
    expect(new Function(`${rules}; return RULES;`)()).toEqual(BOOKMARKLET_RULES);
  });

  it.each([...PROFILE_URLS, ...MORE_PROFILES])("decides like the site: %s", async (href) => {
    const expected = detect(href);
    const ext = load();

    for (const outcome of [await ext.action(href), await ext.page(href), await ext.link(href)]) {
      if (expected.kind === "link") {
        // Opens ppbüyüt on the same profile, through the site's [...slug] route.
        const url = new URL(outcome.opened!);
        expect(url.origin).toBe("https://ppbuyut.com");
        const segments = url.pathname.split("/").filter(Boolean);
        expect(parseProfilePath(segments)).toEqual({ platform: expected.platform, username: expected.username });
        expect(outcome.alerted).toBeUndefined();
      } else if (expected.kind === "invalid" && expected.reason === "unsupported") {
        // Another site: the toolbar button opens the search page.
        expect(outcome).toEqual({ opened: "https://ppbuyut.com" });
      } else {
        // A supported site but not a profile: says so, opens nothing.
        expect(outcome.opened).toBeUndefined();
        expect(outcome.alerted).toMatch(/profil değil|kullanıcı adı görünmüyor/);
      }
    }
  });

  it("shows its menu on every supported site", () => {
    const { menus } = load();
    for (const href of [...PROFILE_URLS, ...MORE_PROFILES].filter((h) => detect(h).kind === "link")) {
      expect(matches(menus.find((m) => m.id === "page")!.documentUrlPatterns!, href), href).toBe(true);
      expect(matches(menus.find((m) => m.id === "link")!.targetUrlPatterns!, href), href).toBe(true);
    }
  });

  it("lists only sites detect() knows", () => {
    for (const host of HOSTS) expect(detect(`https://${host}/someone`), host).not.toMatchObject({ reason: "unsupported" });
  });

  it("falls back to a badge where it can't show a message", async () => {
    expect(await load("tr", { scriptable: false }).action("https://www.instagram.com/")).toEqual({ badge: "!" });
  });

  it("opens the English site for non-Turkish browsers", async () => {
    expect((await load("en-US").action("https://x.com/jack")).opened).toBe("https://ppbuyut.com/en/https://x.com/jack");
    expect((await load("tr-TR").action("https://x.com/jack")).opened).toBe("https://ppbuyut.com/https://x.com/jack");
    expect((await load("en").action("chrome://newtab/")).opened).toBe("https://ppbuyut.com/en");
  });
});
