import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prompt 03: /rezervo and /cmimet were merged into the single lead form, and
  // /pronare-airbnb into the Airbnb service page (it competed for the same query).
  async redirects() {
    return [
      { source: "/rezervo", destination: "/kerko-oferte", permanent: true },
      { source: "/cmimet", destination: "/kerko-oferte", permanent: true },
      { source: "/pronare-airbnb", destination: "/pastrim-airbnb-tirane#pronare", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // The *.vercel.app deployment addresses serve the same site: keep them out of search
      // results so only limonicleaning.com is indexed.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
