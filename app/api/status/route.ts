import { NextResponse } from "next/server";
import { getHealth } from "@/lib/health";

// Never prerender at build time: that would probe every platform during the build.
export const dynamic = "force-dynamic";

export async function GET() {
  const platforms = await getHealth();
  return NextResponse.json(
    { platforms, generatedAt: Date.now() },
    { headers: { "cache-control": "public, max-age=60, s-maxage=60" } },
  );
}
