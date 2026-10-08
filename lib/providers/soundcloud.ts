import "server-only";
import { getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

// The public profile page carries the avatar as an Open Graph image (500 px);
// upscale() swaps it for the uploaded original.
export const soundcloud: Provider = {
  id: "soundcloud",
  async fetchAvatar(username) {
    // Unknown users answer 404, which getText turns into not_found.
    const html = await getText(`https://soundcloud.com/${encodeURIComponent(username.toLowerCase())}`);
    const url = metaContent(html, "og:image");
    // Accounts without a photo leave the tag empty (SoundCloud shows a gradient).
    if (!url?.includes("/avatars-")) throw new ProviderError("hidden", "no avatar");
    return { url, source: "scrape", original: true };
  },
};
