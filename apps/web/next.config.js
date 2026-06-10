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
  webpack: (config, { isServer }) => {
    // Disable webpack cache for production to reduce build size
    if (!isServer) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;