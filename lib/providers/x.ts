import "server-only";
import { getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

// x.com serves link-preview bots a static profile page whose preview image is
// the avatar (…_200x200.jpg; `upscale` turns it into the original). Missing
// accounts get a 404. X refuses plain Node requests on its other public
// endpoints, but not this one.
export const x: Provider = {
  id: "x",
  async fetchAvatar(username) {
    const html = await getText(`https://x.com/${encodeURIComponent(username)}`, {
      headers: { "user-agent": "Twitterbot/1.0" },
    });
    const url = metaContent(html, "og:image");
    if (!url?.includes("/profile_images/")) throw new ProviderError("not_found");
    return { url, source: "scrape", original: true };
  },
};
