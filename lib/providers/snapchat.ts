import "server-only";
import { getText, metaContent, scriptJson } from "./http";
import { ProviderError, type Provider } from "./types";

interface NextData {
  props?: {
    pageProps?: {
      userProfile?: {
        $case?: string;
        publicProfileInfo?: { profilePictureUrl?: string };
        userInfo?: { bitmoji3d?: { avatarImage?: { url?: string } } };
      };
    };
  };
}

export const snapchat: Provider = {
  id: "snapchat",
  async fetchAvatar(username) {
    const html = await getText(`https://www.snapchat.com/@${encodeURIComponent(username)}`);
    const profile = scriptJson<NextData>(html, "__NEXT_DATA__")?.props?.pageProps?.userProfile;

    // Public profiles (creators, brands) have a real photo.
    const photo = profile?.publicProfileInfo?.profilePictureUrl;
    if (photo) return { url: photo, source: "scrape" };

    // Personal accounts only expose a Bitmoji.
    const bitmoji = profile?.userInfo?.bitmoji3d?.avatarImage?.url ?? metaContent(html, "og:image");
    if (bitmoji) return { url: bitmoji, source: "scrape", note: "bitmoji" };
    throw new ProviderError("not_found");
  },
};
