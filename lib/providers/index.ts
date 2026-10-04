import "server-only";
import type { PlatformId } from "@/lib/platforms";
import { facebook } from "./facebook";
import { github } from "./github";
import { instagram } from "./instagram";
import { pinterest } from "./pinterest";
import { snapchat } from "./snapchat";
import { telegram } from "./telegram";
import { threads } from "./threads";
import { tiktok } from "./tiktok";
import { twitch } from "./twitch";
import { ProviderError, type AvatarResult, type Provider } from "./types";
import { upscale } from "./upscale";
import { x } from "./x";
import { youtube } from "./youtube";

// Every provider reads the platform's own public pages or URLs: no API keys,
// no third-party services.
const PROVIDERS: Record<PlatformId, Provider> = {
  github, youtube, twitch, x, telegram, tiktok, pinterest, snapchat, instagram, threads, facebook,
};

// When a platform throttles us, more requests only extend the block (X and
// Instagram both do this). Stay away until its reset time.
const DEFAULT_COOLDOWN_MS = 5 * 60 * 1000;
const cooldownUntil = new Map<PlatformId, number>();

/** Finds the platform's largest avatar. Throws `ProviderError` when it can't. */
export async function resolveAvatar(platform: PlatformId, username: string): Promise<AvatarResult> {
  if ((cooldownUntil.get(platform) ?? 0) > Date.now()) {
    throw new ProviderError("rate_limited", "cooling down");
  }
  try {
    const result = await PROVIDERS[platform].fetchAvatar(username);
    return { ...result, url: upscale(platform, result.url) };
  } catch (err) {
    if (err instanceof ProviderError && err.code === "rate_limited") {
      cooldownUntil.set(platform, err.retryAt ?? Date.now() + DEFAULT_COOLDOWN_MS);
    }
    throw err;
  }
}
