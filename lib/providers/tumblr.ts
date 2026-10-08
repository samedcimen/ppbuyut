import "server-only";
import { request } from "./http";
import { ProviderError, type Provider } from "./types";

// Tumblr's API serves a blog's avatar without a key: it redirects to the
// image at the requested size, 512 px being the largest.
export const tumblr: Provider = {
  id: "tumblr",
  async fetchAvatar(username) {
    const blog = username.toLowerCase();
    const res = await request(`https://api.tumblr.com/v2/blog/${encodeURIComponent(blog)}.tumblr.com/avatar/512`, {
      redirect: "manual",
    });
    if (res.status === 404) throw new ProviderError("not_found");
    if (res.status === 429) throw new ProviderError("rate_limited");

    const location = res.headers.get("location");
    if (res.status < 300 || res.status >= 400 || !location) throw new ProviderError("blocked", `HTTP ${res.status}`);
    // Blogs without their own avatar get one of Tumblr's default shapes.
    if (location.includes("/default_avatar/")) throw new ProviderError("hidden", "no avatar");
    return { url: location, width: 512, height: 512, source: "official", original: true };
  },
};
