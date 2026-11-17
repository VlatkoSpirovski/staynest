/** @type {import('next').NextConfig} */
const frameAncestors =
  process.env.NODE_ENV === "production"
    ? "frame-ancestors 'self' https://staynest.site https://*.staynest.site"
    : "frame-ancestors 'self' http://localhost:* https://staynest.site https://*.staynest.site";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: frameAncestors },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  }
};

export default nextConfig;
