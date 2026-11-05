import type { Locale } from "../i18n";
import { PLATFORM_LIST } from "../platforms";

// What the Telegram bot says. Plain text (no Markdown), so names with
// underscores or dots never break the formatting.

const names = PLATFORM_LIST.map((p) => p.name).join(", ");

export const BOT_COPY = {
  tr: {
    help: `Merhaba! Bana bir profil bağlantısı gönder, profil fotoğrafını tam boyutta dosya olarak göndereyim.

Örnekler:
• https://instagram.com/natgeo
• instagram natgeo
• tiktok @khaby.lame

Uygulamalarda bir profili "Paylaş → Telegram → ppbüyüt" ile de gönderebilirsin.

Desteklenen platformlar: ${names}.

Yalnızca herkese açık profil fotoğrafları gösterilir; şifre ya da giriş istenmez.`,
    needPlatform: (u: string) =>
      `@${u} hangi platformda? Platformu da yaz, örneğin:\ninstagram ${u}\n\nYa da profil bağlantısını gönder.`,
    slowDown: "Biraz yavaşlayalım: kısa sürede çok fazla istek geldi. Bir dakika sonra tekrar dene.",
    unknown: "Beklenmeyen bir hata oluştu. Lütfen tekrar dene.",
    caption: (label: string, platform: string, size: string | null) =>
      `${label} · ${platform}${size ? ` · ${size}` : ""}\nppbuyut.com`,
    open: "ppbüyüt'te aç",
    profile: (platform: string) => `${platform} profili`,
    commands: [
      { command: "start", description: "Nasıl kullanılır" },
      { command: "help", description: "Örnekler ve desteklenen platformlar" },
    ],
    description:
      "Profil fotoğraflarını tam boyutta gönderen bot. Bir profil bağlantısı gönder; Instagram, TikTok, X, YouTube ve 20'den fazla platform. Reklamsız, kayıtsız, ücretsiz.",
    shortDescription: "Profil fotoğraflarını tam boyutta gönderir · ppbuyut.com",
  },
  en: {
    help: `Hi! Send me a profile link and I'll send back the profile picture as a full-size file.

Examples:
• https://instagram.com/natgeo
• instagram natgeo
• tiktok @khaby.lame

In apps you can also share a profile with "Share → Telegram → ppbüyüt".

Supported platforms: ${names}.

Only public profile pictures are shown; no password or login is ever asked for.`,
    needPlatform: (u: string) =>
      `Which platform is @${u} on? Add the platform, for example:\ninstagram ${u}\n\nOr send the profile link.`,
    slowDown: "Let's slow down: too many requests in a short time. Try again in a minute.",
    unknown: "Something unexpected went wrong. Please try again.",
    caption: (label: string, platform: string, size: string | null) =>
      `${label} · ${platform}${size ? ` · ${size}` : ""}\nppbuyut.com`,
    open: "Open in ppbüyüt",
    profile: (platform: string) => `${platform} profile`,
    commands: [
      { command: "start", description: "How to use it" },
      { command: "help", description: "Examples and supported platforms" },
    ],
    description:
      "Sends profile pictures at full size. Send a profile link: Instagram, TikTok, X, YouTube and 20+ more platforms. No ads, no sign-up, free.",
    shortDescription: "Sends profile pictures at full size · ppbuyut.com",
  },
} satisfies Record<Locale, unknown>;

export const botCopy = (locale: Locale) => BOT_COPY[locale];
