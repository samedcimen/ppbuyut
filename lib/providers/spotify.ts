import "server-only";
import { PREVIEW_BOT_UA, getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

// Spotify's web player builds profile pages in the browser, but link-preview
// bots get the profile's name and photo as Open Graph tags. Users keep their
// photo at up to 300 px, artists at 640 px.
export const spotify: Provider = {
  id: "spotify",
  async fetchAvatar(username) {
    const artist = username.startsWith("artist:");
    const path = artist ? `artist/${username.slice(7)}` : `user/${username}`;
    // Unknown profiles answer 404, which getText turns into not_found.
    const html = await getText(`https://open.spotify.com/${path.split("/").map(encodeURIComponent).join("/")}`, {
      headers: { "user-agent": PREVIEW_BOT_UA },
    });
    if (metaContent(html, "og:type") !== "profile") throw new ProviderError("not_found");
    const url = metaContent(html, "og:image");
    // Without a photo the preview falls back to a generic Spotify image.
    if (!url?.startsWith("https://i.scdn.co/image/")) throw new ProviderError("hidden", "no avatar");
    const size = artist ? 640 : 300;
    // An artist's address is an id, so the page title (the artist's name) is what users recognize.
    const name = artist ? (metaContent(html, "og:title") ?? undefined) : undefined;
    return { url, width: size, height: size, source: "scrape", original: true, name };
  },
};
