import { describe, expect, it } from "vitest";
import { bookmarkletFor } from "@/lib/bookmarklet";
import { detect } from "@/lib/detect";
import { tr } from "@/lib/i18n/tr";

const BASE = "https://ppbuyut.com";
const code = bookmarkletFor(BASE, tr.bookmarklet);

/** Runs the bookmarklet as a browser would on `href`: what does it open, or what does it say? */
function run(href: string) {
  const url = new URL(href);
  const opened: string[] = [];
  const alerts: string[] = [];
  // Browsers percent-decode a javascript: URL before running it.
  const source = decodeURIComponent(code.replace(/^javascript:/, ""));
  new Function("location", "window", "alert", source)(
    { hostname: url.hostname, pathname: url.pathname, search: url.search, hash: url.hash, href: url.href },
    { open: (to: string) => opened.push(to) },
    (message: string) => alerts.push(message),
  );
  return { opened: opened[0], alert: alerts[0] };
}

// Profile pages, non-profile pages and other sites across every platform.
const URLS = [
  "https://www.instagram.com/",
  "https://www.instagram.com/natgeo/",
  "https://www.instagram.com/natgeo/?igsh=abc",
  "https://www.instagram.com/explore/",
  "https://www.instagram.com/p/Cx1/",
  "https://www.instagram.com/reels/",
  "https://www.facebook.com/",
  "https://www.facebook.com/zuck",
  "https://www.facebook.com/profile.php?id=4",
  "https://www.facebook.com/profile.php",
  "https://www.facebook.com/people/Some-Name/100064/",
  "https://www.facebook.com/groups/123",
  "https://m.facebook.com/marketplace/",
  "https://www.tiktok.com/",
  "https://www.tiktok.com/@khaby.lame",
  "https://www.tiktok.com/@khaby.lame/video/1",
  "https://www.tiktok.com/foryou",
  "https://x.com/",
  "https://x.com/home",
  "https://x.com/jack",
  "https://twitter.com/jack/status/20",
  "https://x.com/i/flow/login",
  "https://www.youtube.com/",
  "https://www.youtube.com/@MrBeast",
  "https://www.youtube.com/@MrBeast/videos",
  "https://www.youtube.com/watch?v=x",
  "https://www.threads.com/",
  "https://www.threads.com/@zuck",
  "https://bsky.app/",
  "https://bsky.app/profile/jay.bsky.team",
  "https://bsky.app/profile/jay.bsky.team/post/3k",
  "https://bsky.app/profile/did:plc:abc",
  "https://bsky.app/search?q=x",
  "https://github.com/",
  "https://github.com/torvalds",
  "https://github.com/torvalds/linux",
  "https://github.com/orgs/vercel",
  "https://github.com/orgs",
  "https://github.com/explore",
  "https://www.twitch.tv/",
  "https://www.twitch.tv/shroud",
  "https://www.twitch.tv/directory",
  "https://kick.com/",
  "https://kick.com/elraenn",
  "https://kick.com/categories/just-chatting",
  "https://open.spotify.com/user/31efmabncplixn3hvbz3almkpxte?si=42f18408398a4022",
  "https://open.spotify.com/intl-tr/user/spotify",
  "https://open.spotify.com/track/abc",
  "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02",
  "https://open.spotify.com/intl-tr/artist/06HL4z0CvFAxyc27GXpf02?si=x",
  "https://open.spotify.com/artist/short",
  "https://open.spotify.com/",
  "https://soundcloud.com/flume",
  "https://soundcloud.com/skrillex/tracks",
  "https://soundcloud.com/discover",
  "https://soundcloud.com/",
  "https://staff.tumblr.com/",
  "https://staff.tumblr.com/post/123/abc",
  "https://www.tumblr.com/staff",
  "https://www.tumblr.com/blog/view/staff",
  "https://www.tumblr.com/dashboard/blog/staff",
  "https://www.tumblr.com/dashboard",
  "https://www.tumblr.com/explore",
  "https://www.tumblr.com/",
  "https://api.tumblr.com/v2",
  "https://t.me/",
  "https://t.me/durov",
  "https://t.me/s/telegram",
  "https://t.me/joinchat/abc",
  "https://t.me/+abcdef",
  "https://www.pinterest.com/",
  "https://www.pinterest.com/pinterest/",
  "https://tr.pinterest.com/pin/123/",
  "https://www.snapchat.com/",
  "https://www.snapchat.com/add/djkhaled305",
  "https://www.snapchat.com/@djkhaled305",
  "https://www.google.com/search?q=x",
  "https://example.com/natgeo",
];

describe("bookmarklet", () => {
  it.each(URLS)("decides like detect(): %s", (href) => {
    const { opened, alert } = run(href);
    const profile = detect(href).kind === "link";
    if (profile) {
      expect(opened).toBe(`${BASE}/${href.split("#")[0].replace(/\?/g, "%3F")}`);
      expect(alert).toBeUndefined();
    } else {
      expect(opened).toBeUndefined();
      expect(alert).toBeDefined();
    }
  });

  it("tells a non-profile page from an unsupported site", () => {
    expect(run("https://www.instagram.com/").alert).toMatch(/profil değil/);
    expect(run("https://example.com/natgeo").alert).toMatch(/çalışmıyor/);
  });

  it("opens Telegram Web chats by username", () => {
    expect(run("https://web.telegram.org/k/#@durov").opened).toBe(`${BASE}/telegram/durov`);
    expect(run("https://web.telegram.org/k/#-100123").alert).toMatch(/kullanıcı adı/);
  });

  it("contains nothing a javascript: URL would mangle", () => {
    expect(code).not.toContain("%");
    expect(code).not.toMatch(/[\r\n]/);
  });
});
