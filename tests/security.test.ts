import { describe, expect, it } from "vitest";
import { redactPath, redactUrl } from "@/lib/analytics-privacy";
import { decodeEmail, encodeEmail } from "@/lib/obfuscate";
import { isAllowedImageUrl } from "@/lib/proxy-hosts";
import { TOKEN_TTL_SECONDS, openUrl, sealUrl } from "@/lib/proxy-token";

describe("proxy allowlist (SSRF guard)", () => {
  it.each([
    "https://avatars.githubusercontent.com/u/1?s=460",
    "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:x/bafk@jpeg",
    "https://pbs.twimg.com/profile_images/1/abc.jpg",
    "https://scontent.cdninstagram.com/v/t51/abc.jpg",
    "https://p16-common-sign.tiktokcdn.com/abc.jpeg",
    "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1",
  ])("allows %s", (url) => {
    expect(isAllowedImageUrl(url)).toBe(true);
  });

  it.each([
    "http://pbs.twimg.com/x.jpg", // not https
    "https://169.254.169.254/latest/meta-data",
    "https://localhost/x",
    "https://evil.com/x.png",
    "https://avatars.githubusercontent.com.evil.com/x", // look-alike suffix
    "https://notcdninstagram.com/x", // look-alike name
    "https://user:pw@pbs.twimg.com/x.jpg",
    "https://pbs.twimg.com:8443/x.jpg",
    "file:///etc/passwd",
    "not a url",
  ])("refuses %s", (url) => {
    expect(isAllowedImageUrl(url)).toBe(false);
  });
});

describe("proxy tokens", () => {
  it("round-trips a URL", () => {
    const url = "https://pbs.twimg.com/profile_images/1/abc.jpg";
    expect(openUrl(sealUrl(url))).toBe(url);
  });

  it("hides the address and differs on every call", () => {
    const url = "https://api.example.com/x.jpg";
    const a = sealUrl(url);
    expect(a).not.toContain("example");
    expect(sealUrl(url)).not.toBe(a);
  });

  it("rejects tampered or made-up tokens", () => {
    const token = sealUrl("https://pbs.twimg.com/x.jpg");
    const tampered = token.slice(0, -2) + (token.endsWith("AA") ? "BB" : "AA");
    expect(openUrl(tampered)).toBeNull();
    expect(openUrl("hello")).toBeNull();
    expect(openUrl("")).toBeNull();
  });

  it("expires", () => {
    const issued = Date.UTC(2026, 9, 6, 12);
    const token = sealUrl("https://pbs.twimg.com/x.jpg", issued);
    expect(openUrl(token, issued + (TOKEN_TTL_SECONDS - 60) * 1000)).toBe("https://pbs.twimg.com/x.jpg");
    expect(openUrl(token, issued + (TOKEN_TTL_SECONDS + 1) * 1000)).toBeNull();
  });
});

describe("analytics redaction", () => {
  it.each([
    ["/", "/"],
    ["/sss", "/sss"],
    ["/surum-notlari/", "/surum-notlari"],
    ["/pp-buyutme/instagram", "/pp-buyutme/instagram"],
    ["/instagram/natgeo", "/instagram/[kullanici]"],
    ["/facebook/zuck", "/facebook/[kullanici]"],
    ["/https:/www.instagram.com/natgeo", "/[profil-baglantisi]"],
    ["/github.com/torvalds", "/[profil-baglantisi]"],
    ["/pp-buyutme/natgeo", "/[profil-baglantisi]"],
    ["/en", "/en"],
    ["/en/faq", "/en/faq"],
    ["/en/changelog", "/en/changelog"],
    ["/en/profile-picture/tiktok", "/en/profile-picture/tiktok"],
    ["/en/instagram/natgeo", "/en/instagram/[kullanici]"],
    ["/en/https:/x.com/jack", "/en/[profil-baglantisi]"],
    ["/en/pp-buyutme/instagram", "/en/[profil-baglantisi]"],
  ])("%s → %s", (path, expected) => {
    expect(redactPath(path)).toBe(expected);
  });

  it("drops query and fragment", () => {
    expect(redactUrl("https://ppbuyut.com/instagram/natgeo?x=1#y")).toBe(
      "https://ppbuyut.com/instagram/[kullanici]",
    );
  });
});

describe("e-mail obfuscation", () => {
  it("round-trips without the address appearing in the encoded form", () => {
    const email = "someone@example.com";
    const encoded = encodeEmail(email);
    expect(encoded).not.toContain("@");
    expect(decodeEmail(encoded)).toBe(email);
  });
});
