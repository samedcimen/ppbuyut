import "server-only";
import { readJson, request } from "./http";
import { ProviderError, type Provider } from "./types";

// DEV's public API (no key). It returns a 320 px resized copy whose address
// carries the uploaded file's own; upscale() unwraps that.
export const devto: Provider = {
  id: "devto",
  async fetchAvatar(username) {
    const res = await request(`https://dev.to/api/users/by_username?url=${encodeURIComponent(username)}`, {
      headers: { accept: "application/json" },
    });
    if (res.status === 404) throw new ProviderError("not_found");
    if (res.status === 429) throw new ProviderError("rate_limited");
    if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);
    const user = await readJson<{ profile_image?: string | null }>(res);
    if (!user.profile_image) throw new ProviderError("hidden", "no avatar");
    return { url: user.profile_image, source: "official", original: true };
  },
};
