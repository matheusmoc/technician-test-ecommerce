/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['exemplo.com', 'localhost'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig