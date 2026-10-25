import "server-only";
import { readJson, request } from "./http";
import { ProviderError, type Provider } from "./types";

// GitLab's public users API (no key). Accounts either upload an avatar, kept
// at up to 400 px, or use Gravatar, which we ask for at the same size.
export const gitlab: Provider = {
  id: "gitlab",
  async fetchAvatar(username) {
    const res = await request(`https://gitlab.com/api/v4/users?username=${encodeURIComponent(username)}`, {
      headers: { accept: "application/json" },
    });
    if (res.status === 429) throw new ProviderError("rate_limited");
    if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);
    const [user] = await readJson<{ avatar_url?: string | null }[]>(res);
    if (!user) throw new ProviderError("not_found");
    if (!user.avatar_url) throw new ProviderError("hidden", "no avatar");

    if (!user.avatar_url.includes("gravatar.com/")) return { url: user.avatar_url, source: "official", original: true };

    // Gravatar: 400 px, and a 404 instead of a generated pattern when there's no photo.
    const url = user.avatar_url.replace(/([?&])s=\d+/, "$1s=400").replace(/([?&])d=[^&]*/, "$1d=404");
    const check = await request(url, { method: "HEAD" });
    if (check.status === 404) throw new ProviderError("hidden", "no gravatar");
    return { url, width: 400, height: 400, source: "official" };
  },
};
