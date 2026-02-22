/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing CDN domain
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh", // UploadThing v7 new CDN
      },
    ],
  },
};

export default nextConfig;
