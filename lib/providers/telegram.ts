import "server-only";
import { getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

export const telegram: Provider = {
  id: "telegram",
  async fetchAvatar(username) {
    const html = await getText(`https://t.me/${encodeURIComponent(username)}`);
    const url = html.match(/class="tgme_page_photo_image"[^>]*src="([^"]+)"/)?.[1] ?? metaContent(html, "og:image");
    // Missing users and users without a public photo get Telegram's logo.
    if (!url || url.includes("telegram.org/img/")) throw new ProviderError("not_found");
    return { url, source: "scrape" };
  },
};
