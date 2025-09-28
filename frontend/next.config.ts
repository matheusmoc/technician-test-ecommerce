import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  images: {
    domains: ['exemplo.com', 'localhost'],
    unoptimized: true,
  },
};

export default nextConfig;