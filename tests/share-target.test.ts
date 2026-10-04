import { describe, expect, it } from "vitest";
import { sharedTarget } from "@/lib/share-target";

describe("share target", () => {
  it("opens a profile shared as a URL", () => {
    expect(sharedTarget({ url: "https://www.tiktok.com/@khaby.lame?lang=tr" })).toEqual({
      kind: "profile",
      path: "/tiktok/khaby.lame",
    });
  });

  it("finds the link inside a sentence in the text field", () => {
    expect(sharedTarget({ text: "Bu profile göz at: https://www.instagram.com/natgeo?igsh=abc123 çok güzel" })).toEqual({
      kind: "profile",
      path: "/instagram/natgeo",
    });
  });

  it("uses the title when that's where the link is", () => {
    expect(sharedTarget({ title: "https://x.com/jack" })).toEqual({ kind: "profile", path: "/x/jack" });
  });

  it("passes a non-profile link on, so the reason can be shown", () => {
    expect(sharedTarget({ url: "https://www.instagram.com/p/abc123/" })).toEqual({
      kind: "text",
      text: "https://www.instagram.com/p/abc123/",
    });
  });

  it("passes plain text (a username) on", () => {
    expect(sharedTarget({ text: "@natgeo" })).toEqual({ kind: "text", text: "@natgeo" });
  });

  it("returns null when nothing was shared", () => {
    expect(sharedTarget({})).toBeNull();
    expect(sharedTarget({ text: "   " })).toBeNull();
  });
});
