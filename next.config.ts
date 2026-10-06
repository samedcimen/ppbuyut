import type { NextConfig } from "next";

const dev = process.env.NODE_ENV === "development";

// Next.js puts inline scripts in every page (hydration data, the theme script,
// JSON-LD), so scripts need 'unsafe-inline' unless every page renders
// per request with a nonce. Even so, this blocks scripts, styles, frames and
// form posts from other sites, plugins, and <base> hijacking.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Avatars come through /api/proxy; the about page shows the developer's GitHub avatar.
  "img-src 'self' data: blob: https://github.com https://avatars.githubusercontent.com",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws: https://va.vercel-scripts.com" : ""}`,
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.4'],
  poweredByHeader: false,
  experimental: {
    // app/global-not-found.tsx: needed since each language has its own root layout.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      // Not on /api/proxy: its images carry their own, stricter policy (default-src 'none').
      {
        source: "/((?!api/proxy).*)",
        headers: [{ key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }],
      },
    ];
  },
};

export default nextConfig;
