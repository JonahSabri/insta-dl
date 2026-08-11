/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "https", hostname: "flagcdn.com" },
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

  async redirects() {
    return [
      { source: "/cookie-consent", destination: "/en/cookie-policy", permanent: true },
      { source: "/:lang/cookie-consent", destination: "/:lang/cookie-policy", permanent: true },
      { source: "/terms", destination: "/en/terms", permanent: false },
      { source: "/privacy-policy", destination: "/en/privacy-policy", permanent: false },
      { source: "/cookie-policy", destination: "/en/cookie-policy", permanent: false },
      { source: "/disclaimer", destination: "/en/disclaimer", permanent: false },
      { source: "/contact", destination: "/en/contact", permanent: false },
      { source: "/about", destination: "/en/about", permanent: false },
    ];
  },

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https: http: ws: wss:",
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
      "media-src 'self' blob: https: http:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' mailto:",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    const security = [
      { key: "Content-Security-Policy", value: csp },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Forwarded-For", value: ":remote-addr" },
          ...security,
        ],
      },
      {
        source: "/:path*",
        headers: security,
      },
    ];
  },
};

export default nextConfig;
