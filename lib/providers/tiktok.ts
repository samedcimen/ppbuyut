import "server-only";
import { getText, scriptJson } from "./http";
import { ProviderError, type Provider } from "./types";

interface UniversalData {
  __DEFAULT_SCOPE__?: {
    "webapp.user-detail"?: {
      statusCode?: number;
      userInfo?: { user?: { avatarLarger?: string; avatarMedium?: string; avatarThumb?: string } };
    };
  };
}

export const tiktok: Provider = {
  id: "tiktok",
  async fetchAvatar(username) {
    const html = await getText(`https://www.tiktok.com/@${encodeURIComponent(username)}`);
    const data = scriptJson<UniversalData>(html, "__UNIVERSAL_DATA_FOR_REHYDRATION__");
    const detail = data?.__DEFAULT_SCOPE__?.["webapp.user-detail"];
    if (!detail) throw new ProviderError("blocked", "page data missing");
    // statusCode 0 = found; anything else (e.g. 10221) = no such user
    if (detail.statusCode !== 0) throw new ProviderError("not_found");

    const user = detail.userInfo?.user;
    const url = user?.avatarLarger ?? user?.avatarMedium ?? user?.avatarThumb;
    if (!url) throw new ProviderError("not_found");
    return { url, source: "scrape" };
  },
};
