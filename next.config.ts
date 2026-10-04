import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.4'],
  experimental: {
    // app/global-not-found.tsx: needed since each language has its own root layout.
    globalNotFound: true,
  },
};

export default nextConfig;
