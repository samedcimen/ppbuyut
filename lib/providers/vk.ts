import "server-only";
import { PREVIEW_BOT_UA, getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

// VK shows browsers a captcha, but link-preview bots get the profile's photo
// as an Open Graph tag. Works for people (durov, id1) and communities (club1).
export const vk: Provider = {
  id: "vk",
  async fetchAvatar(username) {
    // Unknown names answer 404, which getText turns into not_found.
    const html = await getText(`https://vk.com/${encodeURIComponent(username)}`, {
      headers: { "user-agent": PREVIEW_BOT_UA },
    });
    const url = metaContent(html, "og:image");
    if (!url) throw new ProviderError("not_found");
    // No photo (or a deleted page): VK's own placeholder from vk.com/images.
    if (!/^https:\/\/[^/]+\.(?:vkuserphoto\.ru|userapi\.com)\//.test(url)) throw new ProviderError("hidden", "no avatar");
    return { url, source: "scrape", original: true };
  },
};
