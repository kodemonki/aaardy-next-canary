import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-tp1.mozu.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
