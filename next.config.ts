import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'storage.googleapis.com' }]
  },
  webpack: config => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/resources/**', '**/node_modules/**']
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: false
  },
  trailingSlash: false
}

export default nextConfig
