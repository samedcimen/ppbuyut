import type { PlatformId } from "./platforms";
import type { AvatarResult } from "./providers/types";

export interface AvatarResponse extends Omit<AvatarResult, "limited"> {
  platform: PlatformId;
  username: string;
  /** Our proxy URL (`/api/proxy?…`); append `&download=1` to download. */
  url: string;
}

export type AvatarErrorCode = "not_found" | "hidden" | "rate_limited" | "blocked" | "unavailable" | "unknown";

export class AvatarError extends Error {
  constructor(public code: AvatarErrorCode) {
    super(code);
  }
}


const KNOWN_ERRORS: AvatarErrorCode[] = ["not_found", "hidden", "rate_limited", "blocked", "unavailable"];

export async function getAvatar(
  platform: PlatformId,
  username: string,
  signal?: AbortSignal,
): Promise<AvatarResponse> {
  let res: Response;
  try {
    res = await fetch(`/api/avatar?${new URLSearchParams({ platform, username })}`, { signal });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new AvatarError("unknown");
  }

  if (res.ok) return res.json();

  const body = (await res.json().catch(() => ({}))) as { error?: string };
  const code = KNOWN_ERRORS.find((c) => c === body.error) ?? "unknown";
  throw new AvatarError(code);
}
