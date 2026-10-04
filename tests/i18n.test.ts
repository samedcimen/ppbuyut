import { describe, expect, it } from "vitest";
import { en } from "@/lib/i18n/en";
import { localeOf, profilePath, switchLocalePath } from "@/lib/i18n/routes";
import { tr } from "@/lib/i18n/tr";

describe("language switch", () => {
  it.each([
    ["/", "en", "/en"],
    ["/en", "tr", "/"],
    ["/sss", "en", "/en/faq"],
    ["/en/terms", "tr", "/kullanim-sartlari"],
    ["/pp-buyutme/instagram", "en", "/en/profile-picture/instagram"],
    ["/en/profile-picture/x", "tr", "/pp-buyutme/x"],
    ["/instagram/natgeo", "en", "/en/instagram/natgeo"],
    ["/en/tiktok/khaby.lame", "tr", "/tiktok/khaby.lame"],
    ["/surum-notlari", "en", "/en/changelog"],
    ["/en/changelog", "tr", "/surum-notlari"],
    ["/github.com/torvalds", "en", "/en"],
    ["/en/faq", "en", "/en/faq"],
  ] as const)("%s → %s: %s", (path, to, expected) => {
    expect(switchLocalePath(path, to)).toBe(expected);
  });

  it("tells the language from the path", () => {
    expect(localeOf("/")).toBe("tr");
    expect(localeOf("/english")).toBe("tr");
    expect(localeOf("/en")).toBe("en");
    expect(localeOf("/en/faq")).toBe("en");
  });

  it("builds profile paths per language", () => {
    expect(profilePath("instagram", "a.b", "tr")).toBe("/instagram/a.b");
    expect(profilePath("youtube", "@kanal", "en")).toBe("/en/youtube/%40kanal");
  });
});

describe("dictionaries", () => {
  // Every key in the Turkish dictionary has an English counterpart (the type
  // checks this too; this also catches empty strings).
  const keys = (o: object, prefix = ""): string[] =>
    Object.entries(o).flatMap(([k, v]) =>
      v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
    );

  it("have the same keys", () => {
    expect(keys(en).sort()).toEqual(keys(tr).sort());
  });

  it("keep the bookmarklet messages free of quotes", () => {
    for (const t of [tr, en]) {
      expect(t.bookmarklet.unsupported("X")).not.toMatch(/['"]/);
      expect(t.bookmarklet.telegramNoUser).not.toMatch(/['"]/);
    }
  });
});
