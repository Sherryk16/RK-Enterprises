/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
    qualities: [75, 80, 85, 90, 95, 100], // Explicitly define qualities, including 100
  },
};

module.exports = nextConfig;


