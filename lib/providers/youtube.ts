import "server-only";
import { getText, metaContent } from "./http";
import { ProviderError, type Provider } from "./types";

// The channel page's preview image is the channel avatar (yt3.googleusercontent.com);
// `upscale` then asks the CDN for the original upload.
export const youtube: Provider = {
  id: "youtube",
  async fetchAvatar(username) {
    // The consent cookie skips the EU cookie wall that would replace the page.
    const html = await getText(`https://www.youtube.com/@${encodeURIComponent(username)}`, {
      headers: { cookie: "CONSENT=YES+1" },
    });
    const url = metaContent(html, "og:image");
    if (!url?.includes("yt3.")) throw new ProviderError("blocked", "avatar missing from page");
    return { url, source: "scrape", original: true };
  },
};
