"use client";

import { createLocalStore } from "./local-store";
import { isPlatformId, type PlatformId } from "./platforms";

export interface RecentSearch {
  platform: PlatformId;
  username: string;
  /** Display name, when the username isn't readable (Spotify artists). */
  name?: string;
}

const MAX_RECENT = 6;
const NO_RECENT: RecentSearch[] = [];

export const recentStore = createLocalStore<RecentSearch[]>("ppbuyut:recent", NO_RECENT, (raw) =>
  Array.isArray(raw)
    ? raw
        .filter(
          (r): r is RecentSearch =>
            typeof r === "object" && r !== null && isPlatformId(r.platform) && typeof r.username === "string",
        )
        .slice(0, MAX_RECENT)
    : null,
);

export function addRecent(entry: RecentSearch) {
  recentStore.set((prev) =>
    [
      entry,
      ...prev.filter(
        (r) => !(r.platform === entry.platform && r.username.toLowerCase() === entry.username.toLowerCase()),
      ),
    ].slice(0, MAX_RECENT),
  );
}

export function removeRecent(entry: RecentSearch) {
  recentStore.set((prev) => prev.filter((r) => !(r.platform === entry.platform && r.username === entry.username)));
}

export function clearRecent() {
  recentStore.set(NO_RECENT);
}

/** Platform chosen for bare usernames; remembered between visits. */
export const platformStore = createLocalStore<PlatformId>("ppbuyut:platform", "instagram", (raw) =>
  isPlatformId(raw) ? raw : null,
);
