import { describe, expect, it } from "vitest";
import { bookmarkletFor } from "@/lib/bookmarklet";
import { detect } from "@/lib/detect";
import { tr } from "@/lib/i18n/tr";
import { PROFILE_URLS as URLS } from "./fixtures/profile-urls";

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
