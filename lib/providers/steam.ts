import "server-only";
import { getText } from "./http";
import { ProviderError, type Provider } from "./types";

// Steam Community's public XML profile (no key). A profile is either a chosen
// name (steamcommunity.com/id/<name>) or a 17-digit id (/profiles/<id>). The
// avatar's "full" size, 184 px, is the largest Steam keeps.

// Steam's question-mark avatar, shown when no picture was set.
const DEFAULT_AVATAR = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";

const cdata = (xml: string, tag: string) =>
  xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([^\\]]*)\\]\\]></${tag}>`))?.[1] ?? xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1];

export const steam: Provider = {
  id: "steam",
  async fetchAvatar(username) {
    const path = /^\d{17}$/.test(username) ? `profiles/${username}` : `id/${encodeURIComponent(username)}`;
    const xml = await getText(`https://steamcommunity.com/${path}/?xml=1`);
    // Unknown profiles answer 200 with <error>…could not be found…</error>.
    if (xml.includes("<error>")) throw new ProviderError("not_found");
    const url = cdata(xml, "avatarFull");
    if (!url) throw new ProviderError("blocked", "no avatar field");
    if (url.includes(DEFAULT_AVATAR)) throw new ProviderError("hidden", "default avatar");
    return { url, width: 184, height: 184, source: "official", original: true, name: cdata(xml, "steamID") };
  },
};
