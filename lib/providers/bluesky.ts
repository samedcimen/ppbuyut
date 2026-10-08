import "server-only";
import { readJson, request } from "./http";
import { ProviderError, type Provider } from "./types";

// Bluesky's public AppView API: official, no key, no login.
const API = "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile";

export const bluesky: Provider = {
  id: "bluesky",
  async fetchAvatar(username) {
    const handle = username.includes(".") ? username : `${username}.bsky.social`;
    const res = await request(`${API}?actor=${encodeURIComponent(handle.toLowerCase())}`, {
      headers: { accept: "application/json" },
    });
    // Unknown handles answer 400 "Profile not found".
    if (res.status === 400 || res.status === 404) throw new ProviderError("not_found");
    if (res.status === 429) throw new ProviderError("rate_limited");
    if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);

    const profile = await readJson<{ avatar?: string }>(res);
    // An account without a photo shows Bluesky's default avatar, which isn't in the data.
    if (!profile.avatar) throw new ProviderError("hidden", "no avatar");
    return { url: profile.avatar, source: "official", original: true };
  },
};
