import "server-only";
import { readJson, request } from "./http";
import { ProviderError, type Provider } from "./types";

// Kick's official developer API (api.kick.com) with an app access token
// (OAuth client credentials, no user login). Kick's website API sits behind a
// Cloudflare challenge that turns server requests away; this one doesn't.
// The app is registered on kick.com; its keys live in KICK_CLIENT_ID and
// KICK_CLIENT_SECRET.

const TOKEN_URL = "https://id.kick.com/oauth/token";
const API = "https://api.kick.com/public/v1";

let token: { value: string; expiresAt: number } | null = null;

async function appToken(): Promise<string> {
  if (token && token.expiresAt > Date.now()) return token.value;

  const clientId = process.env.KICK_CLIENT_ID;
  const clientSecret = process.env.KICK_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new ProviderError("unavailable", "Kick keys not set");

  const res = await request(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
  });
  if (!res.ok) throw new ProviderError("unavailable", `token HTTP ${res.status}`);
  const data = await readJson<{ access_token?: string; expires_in?: number }>(res);
  if (!data.access_token) throw new ProviderError("unavailable", "no token");
  // Renew a minute early so a request never carries an expiring token.
  token = { value: data.access_token, expiresAt: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000 };
  return token.value;
}

async function api<T>(path: string, retried = false): Promise<T[]> {
  const res = await request(`${API}${path}`, {
    headers: { authorization: `Bearer ${await appToken()}`, accept: "application/json" },
  });
  if (res.status === 401 && !retried) {
    token = null; // revoked or expired early: fetch a fresh one once
    return api<T>(path, true);
  }
  if (res.status === 429) throw new ProviderError("rate_limited");
  if (!res.ok) throw new ProviderError("blocked", `HTTP ${res.status}`);
  return (await readJson<{ data?: T[] }>(res)).data ?? [];
}

const channelUserId = async (slug: string) =>
  (await api<{ broadcaster_user_id?: number }>(`/channels?slug=${encodeURIComponent(slug)}`))[0]?.broadcaster_user_id;

export const kick: Provider = {
  id: "kick",
  async fetchAvatar(username) {
    const slug = username.toLowerCase();
    // Channel addresses use "-" where usernames have "_" (some_user → kick.com/some-user).
    const userId =
      (await channelUserId(slug)) ?? (slug.includes("_") ? await channelUserId(slug.replaceAll("_", "-")) : undefined);
    if (!userId) throw new ProviderError("not_found");

    const [user] = await api<{ profile_picture?: string }>(`/users?id=${userId}`);
    const url = user?.profile_picture;
    // Accounts without an upload get one of Kick's default avatars.
    if (!url || url.includes("/default-profile-pictures/")) throw new ProviderError("hidden", "no avatar");
    return { url, source: "official", original: true };
  },
};
