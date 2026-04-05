/** @type {import('next').NextConfig} */
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["mongoose"],
  turbopack: {
    root: __dirname,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 768, 1024, 1280, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "**.ufs.sh" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mmswaterdiviners.in" }],
        destination: "https://mmswaterdiviners.in/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/:file(.*\\.(?:png|jpg|jpeg|webp|svg|ico|woff|woff2))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
