import { describe, expect, it } from "vitest";
import { detect, isValidFor, looksLikeLinkPath, parseProfilePath, profilePathText } from "@/lib/detect";

const link = (platform: string, username: string) => ({ kind: "link", platform, username });

describe("detect: profile links", () => {
  it.each([
    ["https://www.instagram.com/natgeo/", link("instagram", "natgeo")],
    ["instagram.com/natgeo?igsh=abc", link("instagram", "natgeo")],
    ["https://www.tiktok.com/@khaby.lame", link("tiktok", "khaby.lame")],
    ["https://x.com/jack", link("x", "jack")],
    ["twitter.com/jack", link("x", "jack")],
    ["https://www.youtube.com/@mkbhd", link("youtube", "mkbhd")],
    ["https://www.threads.com/@zuck", link("threads", "zuck")],
    ["https://github.com/torvalds", link("github", "torvalds")],
    ["https://github.com/orgs/vercel", link("github", "vercel")],
    ["https://www.twitch.tv/shroud", link("twitch", "shroud")],
    ["https://t.me/durov", link("telegram", "durov")],
    ["https://t.me/s/durov", link("telegram", "durov")],
    ["https://web.telegram.org/k/#@durov", link("telegram", "durov")],
    ["https://tr.pinterest.com/etsy/", link("pinterest", "etsy")],
    ["https://www.snapchat.com/add/djkhaled305", link("snapchat", "djkhaled305")],
    ["https://www.facebook.com/zuck", link("facebook", "zuck")],
    ["https://www.facebook.com/profile.php?id=4", link("facebook", "4")],
    ["https://www.facebook.com/people/Some-Name/100012345678", link("facebook", "100012345678")],
    ["https://m.facebook.com/zuck", link("facebook", "zuck")],
  ])("%s", (input, expected) => {
    expect(detect(input)).toEqual(expected);
  });
});

describe("detect: not a profile", () => {
  it.each([
    ["https://www.instagram.com/explore/", "instagram"],
    ["https://www.instagram.com/p/abc123/", "instagram"],
    ["https://x.com/home", "x"],
    ["https://www.facebook.com/groups/123", "facebook"],
    ["https://web.telegram.org/k/#123456789", "telegram"],
  ])("%s is invalid for %s", (input, platform) => {
    const result = detect(input);
    expect(result.kind).toBe("invalid");
    expect(result.kind === "invalid" && result.platform).toBe(platform);
  });

  it("rejects unsupported sites", () => {
    expect(detect("https://example.com/user")).toEqual({ kind: "invalid", reason: "unsupported" });
  });

  it("rejects usernames with invalid characters", () => {
    expect(detect("https://x.com/bad user!").kind).toBe("invalid");
    expect(detect("hello world").kind).toBe("invalid");
  });

  it("treats empty input as empty", () => {
    expect(detect("   ")).toEqual({ kind: "empty" });
  });
});

describe("detect: bare usernames", () => {
  it("strips a leading @", () => {
    expect(detect("@natgeo")).toEqual({ kind: "username", username: "natgeo" });
  });

  it("does not mistake a dotted username for a domain", () => {
    expect(detect("john.doe")).toEqual({ kind: "username", username: "john.doe" });
  });
});

describe("isValidFor", () => {
  it("applies each platform's username rules", () => {
    expect(isValidFor("x", "jack")).toBe(true);
    expect(isValidFor("x", "a.b")).toBe(false); // X has no dots
    expect(isValidFor("github", "torvalds")).toBe(true);
    expect(isValidFor("telegram", "ab")).toBe(false); // too short
    expect(isValidFor("facebook", "zuck")).toBe(true); // old short names exist
  });
});

describe("profile paths (site.com/<link>)", () => {
  it("reads the short form", () => {
    expect(parseProfilePath(["instagram", "natgeo"])).toEqual({ platform: "instagram", username: "natgeo" });
    expect(parseProfilePath(["youtube", "@mkbhd"])).toEqual({ platform: "youtube", username: "mkbhd" });
  });

  it("reads a pasted link, even with the // collapsed by the server", () => {
    expect(parseProfilePath(["https:", "www.instagram.com", "natgeo"])).toEqual({ platform: "instagram", username: "natgeo" });
    expect(parseProfilePath(["github.com", "torvalds"])).toEqual({ platform: "github", username: "torvalds" });
  });

  it("keeps a query that the bookmarklet escaped as %3F", () => {
    expect(parseProfilePath(["https:", "www.facebook.com", "profile.php%3Fid=4"])).toEqual({
      platform: "facebook",
      username: "4",
    });
  });

  it("returns null for anything else", () => {
    expect(parseProfilePath(["olmayan-sayfa"])).toBeNull();
    expect(parseProfilePath(["x.com", "home"])).toBeNull();
  });

  it("tells pasted links from mistyped pages (which get a 404)", () => {
    expect(looksLikeLinkPath(["https:", "example.com", "a"])).toBe(true);
    expect(looksLikeLinkPath(["instagram.com", "explore"])).toBe(true);
    expect(looksLikeLinkPath(["www.example.com"])).toBe(true);
    expect(looksLikeLinkPath(["platformlar", "qfqfqfq"])).toBe(false);
    expect(looksLikeLinkPath(["en", "faq", "x"])).toBe(false);
    expect(looksLikeLinkPath(["olmayan-sayfa"])).toBe(false);
  });

  it("rebuilds the link text", () => {
    expect(profilePathText(["https:", "x.com", "jack"])).toBe("https://x.com/jack");
  });
});

describe("Bluesky", () => {
  it("reads bsky.app profile links", () => {
    expect(detect("https://bsky.app/profile/jay.bsky.team")).toEqual({ kind: "link", platform: "bluesky", username: "jay.bsky.team" });
    expect(detect("bsky.app/profile/alice.bsky.social/post/3k")).toEqual({ kind: "link", platform: "bluesky", username: "alice.bsky.social" });
  });

  it("rejects non-profile pages and DIDs", () => {
    expect(detect("https://bsky.app/search?q=x")).toMatchObject({ kind: "invalid", reason: "not_profile" });
    expect(detect("https://bsky.app/profile/did:plc:abc")).toMatchObject({ kind: "invalid", reason: "not_profile" });
  });

  it("accepts handles and bare names", () => {
    expect(isValidFor("bluesky", "jay.bsky.team")).toBe(true);
    expect(isValidFor("bluesky", "alice")).toBe(true);
    expect(isValidFor("bluesky", "my-site.com.tr")).toBe(true);
    expect(isValidFor("bluesky", "-bad.com")).toBe(false);
    expect(isValidFor("bluesky", "a..b")).toBe(false);
    expect(isValidFor("bluesky", "a_b.com")).toBe(false);
  });

  it("opens from a profile path", () => {
    expect(parseProfilePath(["bluesky", "jay.bsky.team"])).toEqual({ platform: "bluesky", username: "jay.bsky.team" });
    expect(parseProfilePath(["bsky.app", "profile", "jay.bsky.team"])).toEqual({ platform: "bluesky", username: "jay.bsky.team" });
  });
});

describe("Kick", () => {
  it("reads channel links", () => {
    expect(detect("https://kick.com/elraenn")).toEqual({ kind: "link", platform: "kick", username: "elraenn" });
    expect(detect("kick.com/some-user/videos")).toEqual({ kind: "link", platform: "kick", username: "some-user" });
  });

  it("rejects site pages", () => {
    expect(detect("https://kick.com/categories/just-chatting")).toMatchObject({ kind: "invalid", reason: "not_profile" });
    expect(detect("https://kick.com/")).toMatchObject({ kind: "invalid", reason: "not_profile" });
  });
});

describe("Spotify", () => {
  it("reads user links, with or without a language prefix", () => {
    expect(detect("https://open.spotify.com/user/31efmabncplixn3hvbz3almkpxte?si=42f18408398a4022")).toEqual({
      kind: "link",
      platform: "spotify",
      username: "31efmabncplixn3hvbz3almkpxte",
    });
    expect(detect("https://open.spotify.com/intl-tr/user/spotify")).toEqual({ kind: "link", platform: "spotify", username: "spotify" });
  });

  it("rejects other pages", () => {
    expect(detect("https://open.spotify.com/track/abc")).toMatchObject({ kind: "invalid", reason: "not_profile" });
    expect(detect("https://open.spotify.com/")).toMatchObject({ kind: "invalid", reason: "not_profile" });
  });
});
