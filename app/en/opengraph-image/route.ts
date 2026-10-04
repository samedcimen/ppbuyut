import { renderOgImage } from "@/lib/og-image";

// Social preview image; referenced from the metadata (lib/site-metadata.ts, lib/seo.ts).
export const dynamic = "force-static";

export function GET() {
  return renderOgImage("en");
}
