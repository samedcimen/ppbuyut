"use client";

import { useSyncExternalStore } from "react";
import type { PlatformId } from "./platforms";
import type { PlatformHealth } from "./service-state";

// Client side of /api/status: live service state per platform.

type Snapshot = Partial<Record<PlatformId, PlatformHealth>> | null;

let snapshot: Snapshot = null;
/** Minutes since the oldest check, computed once when the data arrives. */
let ageMinutes: number | null = null;
let loading = false;
const listeners = new Set<() => void>();

function load() {
  if (loading || snapshot) return;
  loading = true;
  fetch("/api/status")
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data: { platforms: PlatformHealth[]; generatedAt: number }) => {
      snapshot = Object.fromEntries(data.platforms.map((p) => [p.platform, p]));
      const oldest = Math.min(...data.platforms.map((p) => p.checkedAt));
      ageMinutes = Math.max(0, Math.round((data.generatedAt - oldest) / 60_000));
    })
    .catch(() => {
      // Status is informative only; without it the UI just shows no indicator.
      snapshot = {};
    })
    .finally(() => {
      loading = false;
      listeners.forEach((l) => l());
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
  return () => listeners.delete(listener);
}

/** Live status of all platforms; `null` while loading. Fetched once per page load. */
export function useServiceStatus(): Snapshot {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => null,
  );
}

/** How long ago the oldest platform was checked, in minutes; `null` while loading. */
export function useStatusAge(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => ageMinutes,
    () => null,
  );
}
