/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['@cmpapp/types', '@cmpapp/utils'],
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Completely disable cache for production
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;