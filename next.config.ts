import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    // Root cause of the Render OOM restarts: the sharp-based optimizer
    // (/_next/image) has no concurrency cap. Measured locally — a burst of
    // just 30 first-time image requests (the kind a fresh deploy's cold
    // cache sees from the first few visitors on different screen widths, or
    // an image-crawling bot) pushed RSS from ~43MB to 270MB, reproducibly,
    // regardless of output format (WebP or AVIF). The same site's actual
    // source photos are already small (largest is ~260KB, 1800px wide), so
    // serving them unoptimized and letting the browser cache them directly
    // is both cheap and good enough: the same 512MB instance held flat at
    // baseline RSS under 150 concurrent static-file requests — more than
    // 5x the load that spiked the optimizer. <Image> still gives lazy
    // loading, blur placeholders, and layout stability; it just stops
    // resizing/re-encoding on the server. Revisit if this moves to a larger
    // instance or a CDN that can absorb that work off this process.
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
