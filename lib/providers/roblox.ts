import "server-only";
import { readJson, request } from "./http";
import { ProviderError, type Provider } from "./types";

// Roblox's public web APIs: a username (or the numeric id that profile links
// carry) becomes a user id, and the thumbnail API renders that user's avatar
// headshot at 720 px. No key or login.

const JSON_HEADERS = { accept: "application/json", "content-type": "application/json" };

async function findUser(username: string): Promise<{ id: number; name: string } | null> {
  // roblox.com/users/<id>/profile links give an id instead of a name.
  if (/^\d+$/.test(username)) {
    const res = await request(`https://users.roblox.com/v1/users/${username}`, { headers: JSON_HEADERS });
    if (res.status === 404) return null;
    if (res.status === 429) throw new ProviderError("rate_limited");
    if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);
    return readJson(res);
  }
  const res = await request("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
  });
  if (res.status === 429) throw new ProviderError("rate_limited");
  if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);
  const { data } = await readJson<{ data?: { id: number; name: string }[] }>(res);
  return data?.[0] ?? null;
}

async function headshot(id: number) {
  const res = await request(
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=720x720&format=Png&isCircular=false`,
    { headers: JSON_HEADERS },
  );
  if (res.status === 429) throw new ProviderError("rate_limited");
  if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);
  const { data } = await readJson<{ data?: { state: string; imageUrl?: string | null }[] }>(res);
  return data?.[0];
}

export const roblox: Provider = {
  id: "roblox",
  async fetchAvatar(username) {
    const user = await findUser(username);
    if (!user) throw new ProviderError("not_found");

    let thumb = await headshot(user.id);
    // A headshot nobody asked for lately is rendered on demand; it's usually ready a moment later.
    if (thumb?.state === "Pending") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      thumb = await headshot(user.id);
    }
    if (thumb?.state === "Blocked") throw new ProviderError("hidden", "avatar moderated");
    if (thumb?.state !== "Completed" || !thumb.imageUrl) throw new ProviderError("blocked", `thumbnail ${thumb?.state ?? "missing"}`);
    return { url: thumb.imageUrl, width: 720, height: 720, source: "official", original: true, name: user.name };
  },
};
