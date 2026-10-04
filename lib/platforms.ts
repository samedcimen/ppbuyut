import {
  siGithub,
  siInstagram,
  siPinterest,
  siSnapchat,
  siTelegram,
  siThreads,
  siTiktok,
  siTwitch,
  siX,
  siYoutube,
} from "simple-icons";

export const PLATFORM_IDS = [
  "instagram",
  "tiktok",
  "x",
  "youtube",
  "threads",
  "github",
  "twitch",
  "telegram",
  "pinterest",
  "snapchat",
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];

export type PlatformStatus = "stable" | "beta" | "experimental";

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
  maxSizeLabel: string;
  method: string;
  status: PlatformStatus;
  usernamePattern: RegExp;
  placeholder: string;
  profileUrl: (username: string) => string;
  note?: string;
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
    method: "Dahili endpoint",
    status: "experimental",
    usernamePattern: /^[A-Za-z0-9._]{1,30}$/,
    placeholder: "instagram.com/kullanici",
    profileUrl: (u) => `https://www.instagram.com/${u}/`,
    note: "Instagram, giriş yapılmadan en fazla ~320 px boyut sunuyor.",
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
    method: "Sayfa verisi",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9._]{2,24}$/,
    placeholder: "tiktok.com/@kullanici",
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
    maxSizeLabel: "Orijinal",
    method: "Bağlantı önizlemesi",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9_]{1,15}$/,
    placeholder: "x.com/kullanici",
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
    maxSizeLabel: "Orijinal",
    method: "Sayfa verisi",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9._-]{3,30}$/,
    placeholder: "youtube.com/@kanal",
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
    method: "Instagram üzerinden",
    status: "experimental",
    usernamePattern: /^[A-Za-z0-9._]{1,30}$/,
    placeholder: "threads.com/@kullanici",
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
    method: "Açık URL",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/,
    placeholder: "github.com/kullanici",
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
    method: "Sayfa verisi",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9_]{3,25}$/,
    placeholder: "twitch.tv/kanal",
    profileUrl: (u) => `https://www.twitch.tv/${u}`,
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
    method: "Açık sayfa",
    status: "stable",
    usernamePattern: /^[A-Za-z0-9_]{4,32}$/,
    placeholder: "t.me/kullanici",
    profileUrl: (u) => `https://t.me/${u}`,
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
    method: "Sayfa verisi",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9_]{3,30}$/,
    placeholder: "pinterest.com/kullanici",
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
    method: "Sayfa verisi",
    status: "beta",
    usernamePattern: /^[A-Za-z0-9._-]{3,15}$/,
    placeholder: "snapchat.com/add/kullanici",
    profileUrl: (u) => `https://www.snapchat.com/add/${u}`,
  },
};

export const PLATFORM_LIST: Platform[] = PLATFORM_IDS.map((id) => PLATFORMS[id]);

export const STATUS_LABEL: Record<PlatformStatus, string> = {
  stable: "Kararlı",
  beta: "Beta",
  experimental: "Deneysel",
};

export function isPlatformId(value: unknown): value is PlatformId {
  return typeof value === "string" && (PLATFORM_IDS as readonly string[]).includes(value);
}
