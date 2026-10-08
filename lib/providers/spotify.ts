import "server-only";
import { PREVIEW_BOT_UA, getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

// Spotify's web player builds profile pages in the browser, but link-preview
// bots get the profile's name and photo as Open Graph tags.
export const spotify: Provider = {
  id: "spotify",
  async fetchAvatar(username) {
    // Unknown users answer 404, which getText turns into not_found.
    const html = await getText(`https://open.spotify.com/user/${encodeURIComponent(username)}`, {
      headers: { "user-agent": PREVIEW_BOT_UA },
    });
    if (metaContent(html, "og:type") !== "profile") throw new ProviderError("not_found");
    const url = metaContent(html, "og:image");
    // Without a photo the preview falls back to a generic Spotify image.
    if (!url?.startsWith("https://i.scdn.co/image/")) throw new ProviderError("hidden", "no avatar");
    return { url, width: 300, height: 300, source: "scrape" };
  },
};
