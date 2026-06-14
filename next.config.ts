import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.newsapi.org" },
      { protocol: "https", hostname: "**.gnews.io" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
