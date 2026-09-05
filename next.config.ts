import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default withNextIntl(nextConfig);
