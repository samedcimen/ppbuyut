import "server-only";
import { getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

export const twitch: Provider = {
  id: "twitch",
  async fetchAvatar(username) {
    const html = await getText(`https://www.twitch.tv/${encodeURIComponent(username.toLowerCase())}`);
    // Missing channels still get a 200 page, just without a profile image.
    const url = metaContent(html, "og:image");
    if (!url?.includes("profile_image")) throw new ProviderError("not_found");
    return { url, width: 300, height: 300, source: "scrape" };
  },
};
