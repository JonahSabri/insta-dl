/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "http",  hostname: "localhost", port: "8000" },
      { protocol: "http",  hostname: "backend" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Forwarded-For", value: ":remote-addr" },
        ],
      },
    ];
  },
};

export default nextConfig;
