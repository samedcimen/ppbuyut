import { ImageResponse } from "next/og";
import type { Locale } from "./i18n";
import { PLATFORM_LIST } from "./platforms";

// Preview shown when the site is shared (WhatsApp, X, Discord…), one per
// language: app/(tr)/opengraph-image.tsx and app/en/opengraph-image.tsx.
export const OG_SIZE = { width: 1200, height: 630 };

// Geist for Turkish letters. Requested without a browser user agent, Google
// Fonts answers with one complete TTF (a `text=` subset would drop the space).
// The image is rendered at build time, so a Google Fonts hiccup must not fail
// the whole build: without the font, the image falls back to the default one.
async function geist(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Geist:wght@${weight}`, {
      signal: AbortSignal.timeout(10_000),
    }).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    const font = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    return font.ok ? withoutKerning(await font.arrayBuffer()) : null;
  } catch {
    console.warn(`[og] Geist ${weight} could not be loaded; using the default font`);
    return null;
  }
}

/**
 * Satori measures words with the font's kerning (GPOS) but draws them without
 * it, which leaves uneven gaps after words like "TikTok". Renaming the table
 * in the font's directory makes both steps ignore it.
 */
function withoutKerning(font: ArrayBuffer) {
  const view = new DataView(font);
  const tables = view.getUint16(4);
  for (let i = 0; i < tables; i++) {
    const offset = 12 + i * 16;
    const tag = String.fromCharCode(...new Uint8Array(font, offset, 4));
    if (tag === "GPOS") new Uint8Array(font, offset, 4).set([0x58, 0x50, 0x4f, 0x53]); // "XPOS"
  }
  return font;
}

const COPY: Record<Locale, { headline: string[]; tagline: string }> = {
  tr: {
    headline: ["Profil fotoğrafını", "tam boyutta gör."],
    tagline: `Instagram, TikTok, X, YouTube ve ${PLATFORM_LIST.length - 4} platform daha. Reklamsız, kayıtsız.`,
  },
  en: {
    headline: ["See any profile picture", "at full size."],
    tagline: `Instagram, TikTok, X, YouTube and ${PLATFORM_LIST.length - 4} more platforms. No ads, no sign-up.`,
  },
};

// One row of platform badges across the content width (1200 - 2 × 72 padding),
// sized to fit however many platforms there are.
const ROW_WIDTH = 1200 - 2 * 72;
const BADGE_GAP = 10;
const BADGE = Math.min(60, Math.floor((ROW_WIDTH - BADGE_GAP * (PLATFORM_LIST.length - 1)) / PLATFORM_LIST.length));

export async function renderOgImage(locale: Locale) {
  const { headline, tagline } = COPY[locale];
  const [semibold, regular] = await Promise.all([geist(600), geist(400)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080a",
          color: "#fafafa",
          fontFamily: "GeistOG",
          position: "relative",
        }}
      >
        {/* Brand-colored aura, as on the site */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: [
              "radial-gradient(circle at 78% 0%, rgba(129,52,175,0.55) 0%, rgba(8,8,10,0) 45%)",
              "radial-gradient(circle at 50% -10%, rgba(221,42,123,0.5) 0%, rgba(8,8,10,0) 50%)",
              "radial-gradient(circle at 20% 0%, rgba(245,133,41,0.35) 0%, rgba(8,8,10,0) 40%)",
            ].join(", "),
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg viewBox="0 0 32 32" width="56" height="56">
            <rect width="32" height="32" rx="9" fill="#fafafa" />
            <g stroke="#08080a" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M7 11.5V9a2 2 0 0 1 2-2h2.5" />
              <path d="M20.5 7H23a2 2 0 0 1 2 2v2.5" />
              <path d="M25 20.5V23a2 2 0 0 1-2 2h-2.5" />
              <path d="M11.5 25H9a2 2 0 0 1-2-2v-2.5" />
              <path d="M10.75 22.25c.9-2.6 2.9-4 5.25-4s4.35 1.4 5.25 4" />
            </g>
            <circle cx="16" cy="14" r="3.25" fill="#08080a" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>
            pp<span style={{ color: "#a1a1aa" }}>büyüt</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {headline.map((line) => (
            <div key={line} style={{ fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 1.02 }}>
              {line}
            </div>
          ))}
          <div style={{ marginTop: 28, fontSize: 30, color: "#a1a1aa", fontWeight: 400 }}>{tagline}</div>
        </div>

        <div style={{ display: "flex", gap: BADGE_GAP }}>
          {PLATFORM_LIST.map((p) => (
            <div
              key={p.id}
              style={{
                width: BADGE,
                height: BADGE,
                borderRadius: Math.round(BADGE * 0.27),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: p.brand,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <svg viewBox="0 0 24 24" width={BADGE / 2} height={BADGE / 2} fill={p.brandFg}>
                <path d={p.iconPath} />
              </svg>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        ...(semibold ? [{ name: "GeistOG", data: semibold, weight: 600 as const, style: "normal" as const }] : []),
        ...(regular ? [{ name: "GeistOG", data: regular, weight: 400 as const, style: "normal" as const }] : []),
      ],
    },
  );
}
