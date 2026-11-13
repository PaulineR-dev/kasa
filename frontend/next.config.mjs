/**
 * Configuration Next.js du front : cache des pages publiques, réécritures API
 * vers le serveur et formats optimisés pour les images distantes.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Keep public listing and detail pages server-rendered for crawlers and LCP.
  cacheLife: {
    listings: { stale: 300, revalidate: 3600, expire: 86400 },
  },
  async rewrites() {
    const apiOrigin = (process.env.API_URL || "http://localhost:3000").replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${apiOrigin}/auth/:path*`,
      },
    ];
  },
  images: {
    formats: ["image/webp"],
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-eu-west-1.amazonaws.com",
        pathname: "/course.oc-static.com/projects/front-end-kasa-project/**",
      },
    ],
  },
};

export default nextConfig;
