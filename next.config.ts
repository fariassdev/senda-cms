import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://senda-ai.s3.eu-west-1.amazonaws.com/images/**'),
    ],
  },
};

export default nextConfig;
