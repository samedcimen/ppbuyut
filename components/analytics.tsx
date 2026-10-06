"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { redactUrl } from "@/lib/analytics-privacy";

/**
 * Cookie-free page view counts (Vercel Web Analytics) and real-visitor page
 * speed (Speed Insights), both with usernames stripped from URLs.
 */
export function Analytics() {
  return (
    <>
      <VercelAnalytics beforeSend={(event) => ({ ...event, url: redactUrl(event.url) })} />
      <SpeedInsights beforeSend={(event) => ({ ...event, url: redactUrl(event.url) })} />
    </>
  );
}
