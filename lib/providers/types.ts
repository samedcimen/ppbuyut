/** small: only a tiny version; mirror: from the fallback source; bitmoji: no real photo; threads: via Instagram. */
export type NoteCode = "small" | "mirror" | "bitmoji" | "threads";

export interface AvatarResult {
  /** URL of the largest available version */
  url: string;
  width?: number;
  height?: number;
  /** thirdparty: a public mirror of the platform (used for Instagram) */
  source: "official" | "scrape" | "thirdparty";
  /** Caveat shown with the result (text lives in lib/i18n). */
  note?: NoteCode;
  /** Only a smaller-than-usual version was reachable; counts as a degraded service. */
  limited?: boolean;
  /** The URL points at the original upload (not a resized copy). */
  original?: boolean;
  /** Display name, for profiles whose address isn't a readable handle (Spotify artists). */
  name?: string;
}

export interface Provider {
  id: string;
  fetchAvatar(username: string): Promise<AvatarResult>;
}

/**
 * - not_found:    the account doesn't exist (or has no photo) — final, no fallback
 * - hidden:       no public profile data: a private account, or one we can't tell is missing
 * - rate_limited: the platform throttled us
 * - blocked:      the platform refused or changed its page
 * - unavailable:  no working method for this platform right now
 */
export type ProviderErrorCode = "not_found" | "hidden" | "rate_limited" | "blocked" | "unavailable";

export class ProviderError extends Error {
  constructor(
    public code: ProviderErrorCode,
    message?: string,
    /** For rate_limited: when the platform says we may try again (ms timestamp). */
    public retryAt?: number,
  ) {
    super(message ?? code);
  }
}
