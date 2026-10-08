import "server-only";
import { getText } from "./http";
import { ProviderError, type Provider } from "./types";

// The public profile page names its owner (ownerNsid) and shows their "buddy
// icon". The page also shows other people's icons, so the owner's is picked by
// id; "_r" is its largest version (300 px instead of 48).
export const flickr: Provider = {
  id: "flickr",
  async fetchAvatar(username) {
    // Unknown users answer 404, which getText turns into not_found.
    const html = await getText(`https://www.flickr.com/people/${encodeURIComponent(username)}/`);
    const owner = html.match(/"ownerNsid":"(\d+@N\d+)"/)?.[1];
    if (!owner) throw new ProviderError("not_found");

    const icon = html.match(new RegExp(`//(farm\\d+\\.staticflickr\\.com/\\d+/buddyicons/${owner})(?:_[a-z])?\\.jpg`))?.[1];
    // Without an upload Flickr shows a generic icon from another address.
    if (!icon) throw new ProviderError("hidden", "no avatar");
    return { url: `https://${icon}_r.jpg`, width: 300, height: 300, source: "scrape", original: true };
  },
};
