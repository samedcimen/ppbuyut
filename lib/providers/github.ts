import "server-only";
import { request } from "./http";
import { ProviderError, type Provider } from "./types";

// github.com/{user}.png redirects to the CDN avatar; no API key or rate limit involved.
export const github: Provider = {
  id: "github",
  async fetchAvatar(username) {
    const res = await request(`https://github.com/${encodeURIComponent(username)}.png?size=460`, {
      redirect: "manual",
    });
    if (res.status === 404) throw new ProviderError("not_found");
    if (res.status === 429) throw new ProviderError("rate_limited");

    const location = res.headers.get("location");
    if (res.status < 300 || res.status >= 400 || !location) throw new ProviderError("blocked", `HTTP ${res.status}`);
    return { url: location, width: 460, height: 460, source: "official" };
  },
};
