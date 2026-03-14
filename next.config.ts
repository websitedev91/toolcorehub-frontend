import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      // Proxy Rank Math sitemap index (rewrites domain inside XML)
      {
        source: "/blog/sitemap_index.xml",
        destination: "/api/sitemap-proxy?path=sitemap_index.xml",
      },
      // Proxy individual sitemaps (post-sitemap.xml, page-sitemap.xml, etc.)
      {
        source: "/blog/:sitemap(*-sitemap*.xml)",
        destination: "/api/sitemap-proxy?path=:sitemap",
      },
    ];
  },
};

export default nextConfig;
