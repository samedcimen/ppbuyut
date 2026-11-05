import "server-only";

// Minimal Telegram Bot API client. The bot's token lives in TELEGRAM_BOT_TOKEN;
// TELEGRAM_WEBHOOK_SECRET is the shared secret Telegram sends back with every
// update, so only Telegram can call the webhook.

const token = () => process.env.TELEGRAM_BOT_TOKEN;

export const botConfigured = () => !!token() && !!process.env.TELEGRAM_WEBHOOK_SECRET;

export async function telegram<T = unknown>(method: string, body: Record<string, unknown> | FormData): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: "POST",
    ...(body instanceof FormData ? { body } : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30_000),
  });
  const data = (await res.json().catch(() => ({ ok: false, description: `HTTP ${res.status}` }))) as {
    ok: boolean;
    result?: T;
    description?: string;
  };
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description ?? res.status}`);
  return data.result as T;
}

export type InlineButton = { text: string; url: string };

export function sendMessage(chatId: number, text: string, buttons?: InlineButton[]) {
  return telegram("sendMessage", {
    chat_id: chatId,
    text,
    link_preview_options: { is_disabled: true },
    ...(buttons && { reply_markup: { inline_keyboard: [buttons] } }),
  });
}

/** Uploads a file (Telegram only fetches GIF, PDF and ZIP documents by URL itself). */
export function sendDocument(chatId: number, file: Blob, filename: string, caption: string, buttons: InlineButton[]) {
  const form = new FormData();
  form.set("chat_id", String(chatId));
  form.set("caption", caption);
  form.set("reply_markup", JSON.stringify({ inline_keyboard: [buttons] }));
  form.set("document", file, filename);
  return telegram("sendDocument", form);
}
