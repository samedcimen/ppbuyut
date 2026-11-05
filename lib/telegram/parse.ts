import { detect, isValidFor, type DetectReason } from "../detect";
import { PLATFORM_LIST, isPlatformId, type PlatformId } from "../platforms";

// What a message to the Telegram bot asks for. Accepted: a profile link (also
// inside a sentence, as apps' Share menus send it), "platform username"
// ("instagram natgeo", "/tiktok @khaby.lame") and /start or /help.

export type BotRequest =
  | { kind: "help" }
  | { kind: "search"; platform: PlatformId; username: string }
  /** A bare username: which platform is meant? */
  | { kind: "need_platform"; username: string }
  | { kind: "invalid"; reason: DetectReason | "invalid_for"; platform?: PlatformId };

/** Words people use for a platform: its id, its name, and a few common short forms. */
const ALIASES: Record<string, PlatformId> = {
  ...Object.fromEntries(PLATFORM_LIST.flatMap((p) => [[p.id, p.id], [p.name.toLowerCase(), p.id]])),
  twitter: "x",
  ig: "instagram",
  insta: "instagram",
  fb: "facebook",
  yt: "youtube",
  tt: "tiktok",
  "dev.to": "devto",
  dev: "devto",
  tg: "telegram",
};

export function parseBotMessage(raw: string): BotRequest {
  const text = raw.trim();
  if (!text || /^\/(start|help)(@\w+)?\b/i.test(text)) return { kind: "help" };

  const pair = text.match(/^\/?(\S+)\s+@?(\S+)$/);
  const named = pair ? ALIASES[pair[1].toLowerCase().replace(/@\w+$/, "")] : undefined;
  if (pair && named && isPlatformId(named)) {
    const username = pair[2];
    return isValidFor(named, username)
      ? { kind: "search", platform: named, username }
      : { kind: "invalid", reason: "invalid_for", platform: named };
  }

  // A link anywhere in the message, or the whole message when it's a single word.
  const candidate = text.match(/https?:\/\/[^\s"'<>]+/)?.[0] ?? (/\s/.test(text) ? null : text);
  if (!candidate) return { kind: "help" };

  const result = detect(candidate);
  if (result.kind === "link") return { kind: "search", platform: result.platform, username: result.username };
  if (result.kind === "username") return { kind: "need_platform", username: result.username };
  if (result.kind === "invalid") return { kind: "invalid", reason: result.reason, platform: result.platform };
  return { kind: "help" };
}
