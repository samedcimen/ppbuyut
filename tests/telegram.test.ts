import { describe, expect, it } from "vitest";
import { parseBotMessage } from "@/lib/telegram/parse";

describe("Telegram bot messages", () => {
  it("answers /start, /help and chatter with help", () => {
    expect(parseBotMessage("/start")).toEqual({ kind: "help" });
    expect(parseBotMessage("/help@ppbuyutbot")).toEqual({ kind: "help" });
    expect(parseBotMessage("merhaba nasılsın")).toEqual({ kind: "help" });
    expect(parseBotMessage("   ")).toEqual({ kind: "help" });
  });

  it("reads profile links, also inside a shared sentence", () => {
    expect(parseBotMessage("https://www.instagram.com/natgeo/")).toEqual({ kind: "search", platform: "instagram", username: "natgeo" });
    expect(parseBotMessage("instagram.com/natgeo")).toEqual({ kind: "search", platform: "instagram", username: "natgeo" });
    expect(parseBotMessage("Bu profile göz at: https://www.tiktok.com/@khaby.lame?_t=1 çok iyi")).toEqual({
      kind: "search",
      platform: "tiktok",
      username: "khaby.lame",
    });
  });

  it("reads 'platform username', with names and short forms", () => {
    expect(parseBotMessage("instagram natgeo")).toEqual({ kind: "search", platform: "instagram", username: "natgeo" });
    expect(parseBotMessage("/tiktok @khaby.lame")).toEqual({ kind: "search", platform: "tiktok", username: "khaby.lame" });
    expect(parseBotMessage("Twitter jack")).toEqual({ kind: "search", platform: "x", username: "jack" });
    expect(parseBotMessage("SoundCloud flume")).toEqual({ kind: "search", platform: "soundcloud", username: "flume" });
  });

  it("asks for the platform when only a username is sent", () => {
    expect(parseBotMessage("@natgeo")).toEqual({ kind: "need_platform", username: "natgeo" });
    expect(parseBotMessage("natgeo")).toEqual({ kind: "need_platform", username: "natgeo" });
  });

  it("explains what's wrong with a link or name", () => {
    expect(parseBotMessage("https://www.instagram.com/explore/")).toEqual({ kind: "invalid", reason: "not_profile", platform: "instagram" });
    expect(parseBotMessage("https://example.com/natgeo")).toMatchObject({ kind: "invalid", reason: "unsupported" });
    expect(parseBotMessage("twitch a")).toEqual({ kind: "invalid", reason: "invalid_for", platform: "twitch" });
  });
});
