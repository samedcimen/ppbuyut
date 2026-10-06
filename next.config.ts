import type { NextConfig } from "next";

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
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" }],
      },
    ];
  },
};

export default nextConfig;
