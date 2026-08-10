import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

// Next.js checks the request's Origin header against this allowlist before
// accepting a Server Action call. localhost works out of the box; anything
// accessed through a forwarded/proxied dev URL (Codespaces, Gitpod, a
// devcontainer, ngrok, etc.) needs its host added here or every Server
// Action submit fails with "Invalid Server Actions request." Set
// NEXT_PUBLIC_SITE_URL in .env.local to that forwarded URL if that's your
// setup -- its host is included automatically below.
// Next.js checks the request's Origin header against this allowlist before
// accepting a Server Action call. localhost works out of the box; anything
// accessed through a forwarded/proxied dev URL (Codespaces, Gitpod, a
// devcontainer, ngrok, etc.) needs its host added here or every Server
// Action submit fails with "Invalid Server Actions request." Wildcards
// cover Codespaces/Gitpod's per-session random subdomains directly, since
// relying on NEXT_PUBLIC_SITE_URL being set exactly right (and the dev
// server having been restarted after setting it) is an easy thing to get
// wrong. Add your own pattern here if you're on a different tunnel/proxy.
const siteHostname = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "*.app.github.dev", // GitHub Codespaces
        "*.gitpod.io", // Gitpod
        ...(siteHostname ? [siteHostname] : []),
      ],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(supabaseHostname
        ? [{ protocol: "https" as const, hostname: supabaseHostname }]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
