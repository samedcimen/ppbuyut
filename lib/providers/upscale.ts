import type { PlatformId } from "@/lib/platforms";

/**
 * Rewrites a known avatar URL to the platform's largest version.
 */
export function upscale(platform: PlatformId, url: string): string {
  switch (platform) {
    case "x":
      // …/abc_normal.jpg → …/abc.jpg (original upload)
      return url.replace(/_(normal|bigger|mini|\d+x\d+)(?=\.\w+$)/, "");
    case "youtube":
      // =s900-c-k-… (resized, cropped) → =s0: the original upload, never upscaled
      return url.replace(/=s\d+(-[^/?#]*)?$/, "=s0");
    case "github":
      return url.replace(/([?&])s=\d+/, "$1s=460");
    case "snapchat":
      // …_RS0,90_FMjpeg → …_FMjpeg: without the resize step the CDN serves the original (1080 px)
      return url.replace(/_RS\d+,\d+(?=_)/, "");
    case "bluesky":
      // img/avatar/plain/… (1000 px) → img/feed_fullsize/plain/… (the upload's own size), as JPEG
      return url.replace("/img/avatar/plain/", "/img/feed_fullsize/plain/").replace(/(@\w+)?$/, "@jpeg");
    case "kick":
      // …/profile_image/conversion/<id>-fullsize.webp (350 px) → …/profile_image/<id>: the uploaded file
      return url.replace(/\/conversion\/([\w-]+?)-(?:fullsize|medium|thumb)\.webp$/, "/$1");
    case "spotify":
      // i.scdn.co/image/ab6775700000<size><hash>: 3b82 is 64 px, ee85 the largest (300 px)
      return url.replace(/(\/image\/ab6775700000)3b82/, "$1ee85");
    default:
      return url;
  }
}
