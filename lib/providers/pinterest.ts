import "server-only";
import { getText } from "./http";
import { ProviderError, type Provider } from "./types";

export const pinterest: Provider = {
  id: "pinterest",
  async fetchAvatar(username) {
    const html = await getText(`https://www.pinterest.com/${encodeURIComponent(username)}/`);
    // Missing users still get a 200 page, just without profile data.
    const url = html.match(/"image_xlarge_url":"([^"]+)"/)?.[1];
    if (!url) throw new ProviderError("not_found");
    return { url, width: 280, height: 280, source: "scrape" };
  },
};
