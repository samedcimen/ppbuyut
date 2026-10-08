import "server-only";
import { readJson, request } from "./http";
import { ProviderError, type Provider } from "./types";

// Mastodon's public API on mastodon.social, the largest server. It knows its
// own accounts ("name") and, through federation, many on other servers
// ("name@server"); their avatars come from its own media cache. Asking other
// servers directly would mean fetching any host a visitor types, so we don't.
export const mastodon: Provider = {
  id: "mastodon",
  async fetchAvatar(username) {
    const res = await request(
      `https://mastodon.social/api/v1/accounts/lookup?acct=${encodeURIComponent(username)}`,
      { headers: { accept: "application/json" } },
    );
    if (res.status === 404) throw new ProviderError("not_found");
    if (res.status === 429) throw new ProviderError("rate_limited");
    if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);

    const account = await readJson<{ avatar?: string }>(res);
    // Accounts without a photo get Mastodon's placeholder.
    if (!account.avatar || account.avatar.includes("/missing.")) throw new ProviderError("hidden", "no avatar");
    return { url: account.avatar, source: "official", original: true };
  },
};
