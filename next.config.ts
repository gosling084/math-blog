import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/.git/**', '**/node_modules/**'],
    };
    return config;
  },
};

export default nextConfig;