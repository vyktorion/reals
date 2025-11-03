// @ts-ignore
import nextPwa from "next-pwa";
// @ts-ignore
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.0.234',
    'localhost',
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
    ],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio', '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible', '@radix-ui/react-context-menu', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-hover-card', '@radix-ui/react-label', '@radix-ui/react-menubar', '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-progress', '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip', 'lucide-react', '@tabler/icons-react'],
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
            value: 'public, max-age=31536000, immutable',
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

const withPWA = nextPwa({
  dest: "src/public",
  register: true,
  disable: (process as any).env.NODE_ENV === 'development',
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

// @ts-ignore
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// @ts-ignore
export default withAnalyzer(withPWA(nextConfig));