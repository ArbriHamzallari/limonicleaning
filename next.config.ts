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
};

export default nextConfig;
