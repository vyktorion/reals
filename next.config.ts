// @ts-ignore
import nextPwa from "next-pwa";
// @ts-ignore
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
  'https://reals-seven.vercel.app',
  'http://localhost:3000',
  ],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'pwa-jade-eight.vercel.app',
      },
    ],
  },
  experimental: {
    // optimizePackageImports removed as requested
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: isDevelopment ? 'no-cache, no-store, must-revalidate' : 'public, max-age=60, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

// Simplified approach - completely disable PWA in development
const isDevelopment = process.env.NODE_ENV === 'development';

const pwaConfig = {
  dest: "public",
  register: !isDevelopment, // Only register in production
  skipWaiting: !isDevelopment,
  clientsClaim: !isDevelopment,
  disable: isDevelopment, // Completely disable in development
};

const withPWA = nextPwa(pwaConfig);

// @ts-ignore
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// @ts-ignore
export default withAnalyzer(withPWA(nextConfig));