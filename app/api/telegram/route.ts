import { after, type NextRequest } from "next/server";
import { lookupAvatar } from "@/lib/avatar-lookup";
import { botCopy } from "@/lib/content/telegram";
import { getMessages, type Locale } from "@/lib/i18n";
import { profilePath } from "@/lib/i18n/routes";
import { PLATFORMS, profileLabel, type PlatformId } from "@/lib/platforms";
import { proxyUrl } from "@/lib/proxy-hosts";
import { rateLimit } from "@/lib/ratelimit";
import { site } from "@/lib/site";
import { botConfigured, sendDocument, sendMessage, telegram } from "@/lib/telegram/api";
import { parseBotMessage } from "@/lib/telegram/parse";

// Webhook for the Telegram bot (registered by /api/telegram/setup). Telegram
// wants a quick answer, while a search can take up to ~30 s (Instagram's
// mirror), so the reply is sent after the response.

export const maxDuration = 60;

type Update = {
  message?: {
    chat: { id: number; type: string };
    from?: { language_code?: string };
    text?: string;
    caption?: string;
  };
};

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

export async function POST(req: NextRequest) {
  if (!botConfigured() || req.headers.get("x-telegram-bot-api-secret-token") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("Not found", { status: 404 });
  }
  const update = (await req.json().catch(() => ({}))) as Update;
  const message = update.message;
  // Private chats only: in groups the bot would answer every message.
  if (message?.chat.type === "private") {
    after(() => handle(message.chat.id, message.text ?? message.caption ?? "", message.from?.language_code));
  }
  return new Response("ok");
}

async function handle(chatId: number, text: string, language?: string) {
  const locale: Locale = language?.toLowerCase().startsWith("tr") ? "tr" : "en";
  const copy = botCopy(locale);
  const t = getMessages(locale);
  try {
    const request = parseBotMessage(text);
    if (request.kind === "help") return void (await sendMessage(chatId, copy.help));
    if (request.kind === "need_platform") return void (await sendMessage(chatId, copy.needPlatform(request.username)));
    if (request.kind === "invalid") {
      const name = request.platform ? PLATFORMS[request.platform].name : "";
      return void (await sendMessage(chatId, t.detect[request.reason](name)));
    }

    const limit = await rateLimit(`telegram:${chatId}`, 10, 60);
    if (!limit.ok) return void (await sendMessage(chatId, copy.slowDown));
    await telegram("sendChatAction", { chat_id: chatId, action: "upload_document" });
    await sendAvatar(chatId, request.platform, request.username, locale);
  } catch (err) {
    console.error("[telegram]", err);
    await sendMessage(chatId, copy.unknown).catch(() => {});
  }
}

async function sendAvatar(chatId: number, platform: PlatformId, username: string, locale: Locale) {
  const copy = botCopy(locale);
  const t = getMessages(locale);
  const p = PLATFORMS[platform];
  const entry = await lookupAvatar(platform, username);
  const page = { text: copy.open, url: `${site.url}${profilePath(platform, username, locale)}` };

  if (!entry) return void (await sendMessage(chatId, copy.unknown));
  if (!entry.ok) {
    const { title, body } = t.errors[entry.code];
    const text = `${title}\n\n${(body as (p: string, u: string) => string)(p.name, `@${username}`)}`;
    return void (await sendMessage(chatId, text, [{ text: copy.profile(p.name), url: p.profileUrl(username) }]));
  }

  const { result } = entry;
  const label = profileLabel(username, result.name, t.result.artist);
  // Through our own proxy: it knows each CDN's quirks and checks every address.
  const image = await fetch(`${site.url}${proxyUrl(result.url, `${platform}-${result.name ?? username}`)}`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!image.ok) return void (await sendMessage(chatId, `${t.errors.image_failed.title}\n\n${t.errors.image_failed.body()}`, [page]));

  const blob = await image.blob();
  const ext = EXT[blob.type] ?? "jpg";
  const size = result.width && result.height ? `${result.width} × ${result.height}` : null;
  const filename = `${platform}-${(result.name ?? username).replace(/[^\w.-]/g, "_")}.${ext}`;
  await sendDocument(chatId, blob, filename, copy.caption(label, p.name, size), [page]);
}
