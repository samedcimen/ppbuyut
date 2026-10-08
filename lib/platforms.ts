import {
  siBluesky,
  siFacebook,
  siGithub,
  siInstagram,
  siKick,
  siPinterest,
  siSnapchat,
  siSoundcloud,
  siSpotify,
  siTelegram,
  siThreads,
  siTiktok,
  siTwitch,
  siX,
  siYoutube,
} from "simple-icons";

export const PLATFORM_IDS = [
  "instagram",
  "facebook",
  "tiktok",
  "x",
  "youtube",
  "threads",
  "bluesky",
  "github",
  "twitch",
  "kick",
  "spotify",
  "soundcloud",
  "telegram",
  "pinterest",
  "snapchat",
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];

export type PlatformStatus = "stable" | "beta" | "experimental";

/** How the photo is obtained (labels live in lib/i18n). */
export type PlatformMethod =
  | "open_url"
  | "image_url"
  | "open_page"
  | "page_data"
  | "preview"
  | "internal"
  | "public_api"
  | "official_api"
  | "via_instagram";

export interface Platform {
  id: PlatformId;
  name: string;
  /** simple-icons SVG path (24x24 viewBox) */
  iconPath: string;
  /** Badge background */
  brand: string;
  /** Icon color on top of `brand` */
  brandFg: string;
  /** Glow / ring color. `null` → neutral foreground (for black brands). */
  accent: string | null;
  /** Brand colors for the background aura (left, center, right). */
  glow: [string, string, string];
  /** Largest size the platform serves, in px (approximate for some). */
  maxSize: number;
  /** Pixel label ("320 px") or "original" for platforms that serve the uploaded file. */
  maxSizeLabel: string;
  method: PlatformMethod;
  status: PlatformStatus;
  usernamePattern: RegExp;
  profileUrl: (username: string) => string;
}

export const PLATFORMS: Record<PlatformId, Platform> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    iconPath: siInstagram.path,
    brand: "linear-gradient(135deg,#FEDA75 0%,#FA7E1E 25%,#D62976 55%,#962FBF 80%,#4F5BD5 100%)",
    brandFg: "#ffffff",
    accent: "#E1306C",
    glow: ["#F58529", "#DD2A7B", "#8134AF"],
    maxSize: 320,
    maxSizeLabel: "320 px",
    method: "internal",
    status: "experimental",
    usernamePattern: /^[A-Za-z0-9._]{1,30}$/,
    profileUrl: (u) => `https://www.instagram.com/${u}/`,
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    iconPath: siFacebook.path,
    brand: "#0866FF",
    brandFg: "#ffffff",
    accent: "#0866FF",
    glow: ["#0866FF", "#4F8BFF", "#1B4FD8"],
    maxSize: 2048,
    maxSizeLabel: "2048 px",
    method: "image_url",
    status: "beta",
    // Letters, digits, dots; old accounts have short names ("zuck"). Numeric ids (profile.php?id=…) too.
    usernamePattern: /^[A-Za-z0-9.]{1,50}$/,
    profileUrl: (u) => (/^\d+$/.test(u) ? `https://www.facebook.com/profile.php?id=${u}` : `https://www.facebook.com/${u}`),
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    iconPath: siTiktok.path,
    brand: "#000000",
    brandFg: "#ffffff",
    accent: "#FE2C55",
    glow: ["#25F4EE", "#FE2C55", "#FE2C55"],
    maxSize: 1080,
    maxSizeLabel: "720–1080 px",
    method: "page_data",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9._]{2,24}$/,
    profileUrl: (u) => `https://www.tiktok.com/@${u}`,
  },
  x: {
    id: "x",
    name: "X",
    iconPath: siX.path,
    brand: "#000000",
    brandFg: "#ffffff",
    accent: null,
    glow: ["#71717A", "#A1A1AA", "#52525B"],
    maxSize: 400,
    maxSizeLabel: "original",
    method: "preview",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9_]{1,15}$/,
    profileUrl: (u) => `https://x.com/${u}`,
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    iconPath: siYoutube.path,
    brand: "#FF0000",
    brandFg: "#ffffff",
    accent: "#FF0000",
    glow: ["#FF0000", "#FF4E45", "#CC0000"],
    maxSize: 1000,
    maxSizeLabel: "original",
    method: "page_data",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9._-]{3,30}$/,
    profileUrl: (u) => `https://www.youtube.com/@${u}`,
  },
  threads: {
    id: "threads",
    name: "Threads",
    iconPath: siThreads.path,
    brand: "#000000",
    brandFg: "#ffffff",
    accent: null,
    glow: ["#71717A", "#A1A1AA", "#52525B"],
    maxSize: 320,
    maxSizeLabel: "320 px",
    method: "via_instagram",
    status: "experimental",
    usernamePattern: /^[A-Za-z0-9._]{1,30}$/,
    profileUrl: (u) => `https://www.threads.com/@${u}`,
  },
  github: {
    id: "github",
    name: "GitHub",
    iconPath: siGithub.path,
    brand: "#181717",
    brandFg: "#ffffff",
    accent: null,
    glow: ["#8957E5", "#3FB950", "#2F81F7"],
    maxSize: 460,
    maxSizeLabel: "460 px",
    method: "open_url",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/,
    profileUrl: (u) => `https://github.com/${u}`,
  },
  twitch: {
    id: "twitch",
    name: "Twitch",
    iconPath: siTwitch.path,
    brand: "#9146FF",
    brandFg: "#ffffff",
    accent: "#9146FF",
    glow: ["#9146FF", "#BF94FF", "#772CE8"],
    maxSize: 300,
    maxSizeLabel: "300 px",
    method: "page_data",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9_]{3,25}$/,
    profileUrl: (u) => `https://www.twitch.tv/${u}`,
  },
  kick: {
    id: "kick",
    name: "Kick",
    iconPath: siKick.path,
    brand: "#53FC18",
    brandFg: "#000000",
    accent: "#53FC18",
    glow: ["#53FC18", "#2BD40B", "#A6FF8C"],
    maxSize: 1080,
    maxSizeLabel: "original",
    method: "official_api",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9_-]{2,25}$/,
    profileUrl: (u) => `https://kick.com/${u.toLowerCase()}`,
  },
  spotify: {
    id: "spotify",
    name: "Spotify",
    iconPath: siSpotify.path,
    brand: "#1ED760",
    brandFg: "#000000",
    accent: "#1ED760",
    glow: ["#1ED760", "#1DB954", "#7EF0A8"],
    maxSize: 640,
    maxSizeLabel: "300–640 px",
    method: "preview",
    status: "beta",
    // Users: an old username or a generated id (31efmabncplixn3hvbz3almkpxte).
    // Artists: "artist:" + their 22-character id, so both fit one search box.
    usernamePattern: /^(?:artist:[A-Za-z0-9]{22}|[A-Za-z0-9._-]{1,64})$/,
    profileUrl: (u) =>
      u.startsWith("artist:") ? `https://open.spotify.com/artist/${u.slice(7)}` : `https://open.spotify.com/user/${u}`,
  },
  soundcloud: {
    id: "soundcloud",
    name: "SoundCloud",
    iconPath: siSoundcloud.path,
    brand: "#FF5500",
    brandFg: "#ffffff",
    accent: "#FF5500",
    glow: ["#FF5500", "#FF8800", "#FF3300"],
    maxSize: 2000,
    maxSizeLabel: "original",
    method: "preview",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9_-]{2,40}$/,
    profileUrl: (u) => `https://soundcloud.com/${u.toLowerCase()}`,
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    iconPath: siTelegram.path,
    brand: "#26A5E4",
    brandFg: "#ffffff",
    accent: "#26A5E4",
    glow: ["#2AABEE", "#5AC8FA", "#229ED9"],
    maxSize: 320,
    maxSizeLabel: "~320 px",
    method: "open_page",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9_]{4,32}$/,
    profileUrl: (u) => `https://t.me/${u}`,
  },
  bluesky: {
    id: "bluesky",
    name: "Bluesky",
    iconPath: siBluesky.path,
    brand: "#1185FE",
    brandFg: "#ffffff",
    accent: "#1185FE",
    glow: ["#1185FE", "#5AB0FF", "#0560D4"],
    maxSize: 2000,
    maxSizeLabel: "original",
    method: "public_api",
    status: "stable",
    // A handle is a domain name (jay.bsky.team); a bare name means name.bsky.social.
    usernamePattern: /^(?=.{1,253}$)[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,
    profileUrl: (u) => `https://bsky.app/profile/${u.includes(".") ? u : `${u}.bsky.social`}`,
  },
  pinterest: {
    id: "pinterest",
    name: "Pinterest",
    iconPath: siPinterest.path,
    brand: "#BD081C",
    brandFg: "#ffffff",
    accent: "#E60023",
    glow: ["#E60023", "#FF5A5F", "#AD081B"],
    maxSize: 280,
    maxSizeLabel: "280 px",
    method: "page_data",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9_]{3,30}$/,
    profileUrl: (u) => `https://www.pinterest.com/${u}/`,
  },
  snapchat: {
    id: "snapchat",
    name: "Snapchat",
    iconPath: siSnapchat.path,
    brand: "#FFFC00",
    brandFg: "#000000",
    accent: "#F7E600",
    glow: ["#FFFC00", "#FFB800", "#FFE600"],
    maxSize: 1080,
    maxSizeLabel: "1080 px",
    method: "page_data",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9._-]{3,15}$/,
    profileUrl: (u) => `https://www.snapchat.com/add/${u}`,
  },
};

export const PLATFORM_LIST: Platform[] = PLATFORM_IDS.map((id) => PLATFORMS[id]);


export function isPlatformId(value: unknown): value is PlatformId {
  return typeof value === "string" && (PLATFORM_IDS as readonly string[]).includes(value);
}
