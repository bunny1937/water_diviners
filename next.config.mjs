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
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // ADD for Google profile pics
    ],
  },
};

export default nextConfig;
