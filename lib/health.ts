import "server-only";
import { cacheGet, cacheSet } from "./cache";
import { PLATFORM_IDS, type PlatformId } from "./platforms";
import { resolveAvatar } from "./providers";
import { ProviderError, type AvatarResult } from "./providers/types";
import type { PlatformHealth, ServiceState } from "./service-state";

/**
 * Live service state per platform, from two signals:
 *  1. real searches (`recordOutcome`), when one happened recently;
 *  2. otherwise a probe search for a well-known account, cached so the
 *     platforms aren't hit on every page view.
 * Both live in the shared cache (Redis in production), so every server
 * instance reports the same state. Each is one key holding all platforms,
 * which keeps a status read at two Redis commands.
 */

const TRAFFIC_FRESH_MS = 15 * 60 * 1000;
const PROBE_TTL_MS = 30 * 60 * 1000;
const TRAFFIC_KEY = "health:traffic";
const PROBE_KEY = "health:probe";

type HealthMap = Partial<Record<PlatformId, PlatformHealth>>;

// Accounts that are public, long-lived and have a profile photo.
const PROBE_ACCOUNTS: Record<PlatformId, string> = {
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  x: "X",
  youtube: "YouTube",
  threads: "zuck",
  bluesky: "bsky.app",
  github: "github",
  twitch: "twitch",
  telegram: "telegram",
  pinterest: "pinterest",
  snapchat: "djkhaled305",
};

export function stateOf(result: AvatarResult): ServiceState {
  // A mirror answer still gives users a full-size photo (its possible
  // staleness is noted on the result), so only a small result counts as degraded.
  return result.limited ? "degraded" : "up";
}

/**
 * Saves the state a real search just saw. Merged into the shared map: two
 * searches finishing at the same moment may drop one update, which only costs
 * a little freshness.
 */
export async function recordOutcome(platform: PlatformId, state: ServiceState) {
  try {
    const map = (await cacheGet<HealthMap>(TRAFFIC_KEY)) ?? {};
    map[platform] = { platform, state, checkedAt: Date.now() };
    await cacheSet(TRAFFIC_KEY, map, Math.ceil(TRAFFIC_FRESH_MS / 1000));
  } catch (err) {
    // Status is a nicety; it must never fail a search.
    console.error("[health] could not record outcome", err);
  }
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
  return { platform, state, checkedAt: Date.now() };
}

// One probe at a time per platform on this instance, however many visitors ask.
const probing = new Map<PlatformId, Promise<PlatformHealth>>();

function probeOnce(platform: PlatformId) {
  let pending = probing.get(platform);
  if (!pending) {
    pending = probe(platform).finally(() => probing.delete(platform));
    probing.set(platform, pending);
  }
  return pending;
}

export async function getHealth(): Promise<PlatformHealth[]> {
  const now = Date.now();
  const [traffic, probed] = await Promise.all([cacheGet<HealthMap>(TRAFFIC_KEY), cacheGet<HealthMap>(PROBE_KEY)]);

  const fresh: PlatformHealth[] = [];
  const health = await Promise.all(
    PLATFORM_IDS.map(async (platform) => {
      const fromTraffic = traffic?.[platform];
      if (fromTraffic && now - fromTraffic.checkedAt < TRAFFIC_FRESH_MS) return fromTraffic;
      const fromProbe = probed?.[platform];
      if (fromProbe && now - fromProbe.checkedAt < PROBE_TTL_MS) return fromProbe;
      const result = await probeOnce(platform);
      fresh.push(result);
      return result;
    }),
  );

  // Probes finish together, so they're saved in one write rather than racing each other.
  if (fresh.length > 0) {
    const map = (await cacheGet<HealthMap>(PROBE_KEY)) ?? {};
    for (const h of fresh) map[h.platform] = h;
    await cacheSet(PROBE_KEY, map, Math.ceil(PROBE_TTL_MS / 1000));
  }
  return health;
}
