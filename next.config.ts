import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ludsumwdxszujuzrepws.supabase.co',
      },
    ],
  },
};

export default nextConfig;
