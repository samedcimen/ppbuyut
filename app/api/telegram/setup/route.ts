import type { NextRequest } from "next/server";
import { BOT_COPY } from "@/lib/content/telegram";
import { site } from "@/lib/site";
import { botConfigured, telegram } from "@/lib/telegram/api";

// One-time setup, opened by the owner: /api/telegram/setup?key=<TELEGRAM_WEBHOOK_SECRET>.
// Points the bot at the webhook and sets its commands and descriptions in
// Turkish (default) and English. Safe to open again after a change.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!botConfigured() || req.nextUrl.searchParams.get("key") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("Not found", { status: 404 });
  }

  const steps: Record<string, unknown> = {};
  const run = async (name: string, method: string, body: Record<string, unknown>) => {
    try {
      steps[name] = await telegram(method, body);
    } catch (err) {
      steps[name] = `error: ${(err as Error).message}`;
    }
  };

  await run("webhook", "setWebhook", {
    url: `${site.url}/api/telegram`,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message"],
    drop_pending_updates: true,
  });
  for (const [locale, copy] of Object.entries(BOT_COPY)) {
    // Turkish is also the default for languages without their own text.
    const language = locale === "tr" ? {} : { language_code: locale };
    await run(`commands:${locale}`, "setMyCommands", { commands: copy.commands, ...language });
    await run(`description:${locale}`, "setMyDescription", { description: copy.description, ...language });
    await run(`short:${locale}`, "setMyShortDescription", { short_description: copy.shortDescription, ...language });
  }
  const bot = await telegram<{ username: string }>("getMe", {}).catch(() => null);

  return Response.json({ bot: bot ? `https://t.me/${bot.username}` : null, ...steps });
}
