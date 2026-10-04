"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { redactUrl } from "@/lib/analytics-privacy";

/** Cookie-free page view counts (Vercel Web Analytics), with usernames stripped from URLs. */
export function Analytics() {
  return <VercelAnalytics beforeSend={(event) => ({ ...event, url: redactUrl(event.url) })} />;
}
