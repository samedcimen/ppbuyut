/** Browsers the extension card speaks to; the extension runs on every Chromium one. */
export type Browser = "chrome" | "edge" | "brave" | "opera" | "vivaldi" | "firefox" | "safari" | "other";

/** Chromium browsers install it from the Chrome Web Store. */
export const CHROMIUM: ReadonlySet<Browser> = new Set(["chrome", "edge", "brave", "opera", "vivaldi"]);

/**
 * Which browser this is, from the user agent (Brave hides itself there, so
 * `navigator.brave` too). Order matters: Edge, Opera and Vivaldi all also say
 * "Chrome", and Chrome also says "Safari".
 */
export function detectBrowser(ua: string, isBrave = false): Browser {
  if (/Firefox\/|FxiOS\//.test(ua)) return "firefox";
  if (/Edg(e|A|iOS)?\//.test(ua)) return "edge";
  if (/OPR\/|Opera\//.test(ua)) return "opera";
  if (/Vivaldi\//.test(ua)) return "vivaldi";
  if (isBrave) return "brave";
  if (/Chrome\/|CriOS\//.test(ua)) return "chrome";
  if (/Safari\//.test(ua)) return "safari";
  return "other";
}
