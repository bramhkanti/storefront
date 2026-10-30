import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pinned standalone output for Docker deployment (never 'export')
  output: 'standalone',

  // Next.js 16 caching model (Cache Components + Partial Prefetching)
  cacheComponents: true,
  partialPrefetching: true,

  // React Compiler enabled (stable in Next 16)
  reactCompiler: true,

  // Custom cacheLife profiles used across queries
  cacheLife: {
    catalog: {
      stale: 300, // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 86400, // 1 day
    },
    navigation: {
      stale: 3600, // 1 hour
      revalidate: 7200, // 2 hours
      expire: 604800, // 7 days
    },
    // Approved reviews; the backend also revalidates the `reviews` tag on approval.
    reviews: {
      stale: 60, // 1 minute
      revalidate: 300, // 5 minutes
      expire: 86400, // 1 day
    },
    redirects: {
      stale: 86400, // 1 day
      revalidate: 86400, // 1 day
      expire: 2592000, // 30 days
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Local Medusa serves uploads from http://localhost:9000 in development.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
