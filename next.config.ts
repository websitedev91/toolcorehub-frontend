import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      // Proxy all Rank Math sitemaps (sitemap_index.xml, post-sitemap.xml, etc.)
      {
        source: "/blog/:sitemap([\\w-]+\\.xml)",
        destination: "/api/sitemap-proxy?path=:sitemap",
      },
    ];
  },
};

export default nextConfig;
