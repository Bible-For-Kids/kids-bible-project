const isStaticExport = process.env.STATIC_EXPORT === 'true';
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: configuredBasePath || undefined,
        assetPrefix: configuredBasePath || undefined,
      }
    : {}),
  experimental: {
    mdxRs: true,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  ...(isStaticExport
    ? {}
    : {
        async rewrites() {
          return [
            {
              source: '/stories/:slug',
              destination: '/api/stories/:slug',
            },
          ];
        },
        async redirects() {
          return [
            {
              source: '/home',
              destination: '/',
              permanent: true,
            },
          ];
        },
      }),
  webpack: (config, { dev, isServer }) => {
    // Enable reading markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    return config;
  },
}

module.exports = nextConfig
