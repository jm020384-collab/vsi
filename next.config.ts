import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "tile.openstreetmap.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async redirects() {
    return [
      // /therapists/[slug] — застарілий маршрут з часів до дизайну vsi,
      // замінений на /specialists/[slug]. Редирект, а не 404, щоб не
      // ламати вже проіндексовані/розшарені посилання.
      {
        source: "/therapists/:slug",
        destination: "/specialists/:slug",
        permanent: true,
      },
    ];
  },
};

export default withSerwist(nextConfig);
