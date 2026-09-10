import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// No nonce infra (would force dynamic rendering on every page), so scripts
// and styles rely on 'unsafe-inline' for our own JSON-LD tag and Tailwind's
// injected styles. Only these named third-party origins are otherwise trusted.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://www.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
