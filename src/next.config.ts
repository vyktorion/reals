// @ts-expect-error - next-pwa module doesn't have types
import nextPwa from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

const withPWA = nextPwa({
  dest: "src/public",
  register: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: ({ url }: { url: URL }) => url.pathname === '/',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'start-url',
      },
    },
    {
      urlPattern: ({ url }: { url: URL }) => url.origin === self.location.origin && url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/auth/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: ({ url }: { url: URL }) => url.origin === self.location.origin && !url.pathname.startsWith('/api/'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'others',
      },
    },
    {
      urlPattern: /\.js$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-js-assets',
      },
    },
    {
      urlPattern: /\.css$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-style-assets',
      },
    },
  ],
});

export default withPWA(nextConfig);
