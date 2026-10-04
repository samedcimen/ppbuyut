import { ImageResponse } from "next/og";

// iOS ignores SVG icons, so the logo mark is also rendered as a PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#09090b" }}>
        <svg viewBox="0 0 32 32" width="180" height="180">
          <g stroke="#fafafa" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M7 11.5V9a2 2 0 0 1 2-2h2.5" />
            <path d="M20.5 7H23a2 2 0 0 1 2 2v2.5" />
            <path d="M25 20.5V23a2 2 0 0 1-2 2h-2.5" />
            <path d="M11.5 25H9a2 2 0 0 1-2-2v-2.5" />
            <path d="M10.75 22.25c.9-2.6 2.9-4 5.25-4s4.35 1.4 5.25 4" />
          </g>
          <circle cx="16" cy="14" r="3.25" fill="#fafafa" />
        </svg>
      </div>
    ),
    size,
  );
}
