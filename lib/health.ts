import "server-only";
import { PLATFORM_IDS, type PlatformId } from "./platforms";
import { resolveAvatar } from "./providers";
import { ProviderError, type AvatarResult } from "./providers/types";
import type { PlatformHealth, ServiceState } from "./service-state";

/**
 * Live service state per platform, from two signals:
 *  1. real searches (`recordOutcome`), when one happened recently;
 *  2. otherwise a probe search for a well-known account, cached so the
 *     platforms aren't hit on every page view.
 */

const TRAFFIC_FRESH_MS = 15 * 60 * 1000;
const PROBE_TTL_MS = 30 * 60 * 1000;

// Accounts that are public, long-lived and have a profile photo.
const PROBE_ACCOUNTS: Record<PlatformId, string> = {
  instagram: "instagram",
  tiktok: "tiktok",
  x: "X",
  youtube: "YouTube",
  threads: "zuck",
  github: "github",
  twitch: "twitch",
  telegram: "telegram",
  pinterest: "pinterest",
  snapchat: "djkhaled305",
};

const fromTraffic = new Map<PlatformId, PlatformHealth>();
const fromProbe = new Map<PlatformId, PlatformHealth>();
const probing = new Map<PlatformId, Promise<PlatformHealth>>();

export function stateOf(result: AvatarResult): ServiceState {
  // A mirror answering means the platform itself didn't.
  return result.limited || result.source === "thirdparty" ? "degraded" : "up";
}

export function recordOutcome(platform: PlatformId, state: ServiceState) {
  fromTraffic.set(platform, { platform, state, checkedAt: Date.now() });
}

async function probe(platform: PlatformId): Promise<PlatformHealth> {
  let state: ServiceState;
  try {
    state = stateOf(await resolveAvatar(platform, PROBE_ACCOUNTS[platform]));
  } catch (err) {
    // The probe account exists, so even "not found" means the method is broken.
    if (!(err instanceof ProviderError)) console.error(`[health] ${platform}`, err);
    state = "down";
  }
  const health = { platform, state, checkedAt: Date.now() };
  fromProbe.set(platform, health);
  return health;
}

async function healthOf(platform: PlatformId): Promise<PlatformHealth> {
  const now = Date.now();
  const traffic = fromTraffic.get(platform);
  if (traffic && now - traffic.checkedAt < TRAFFIC_FRESH_MS) return traffic;

  const probed = fromProbe.get(platform);
  if (probed && now - probed.checkedAt < PROBE_TTL_MS) return probed;

  // One probe at a time per platform, however many visitors ask.
  let pending = probing.get(platform);
  if (!pending) {
    pending = probe(platform).finally(() => probing.delete(platform));
    probing.set(platform, pending);
  }
  return pending;
}

export function getHealth(): Promise<PlatformHealth[]> {
  return Promise.all(PLATFORM_IDS.map(healthOf));
}
