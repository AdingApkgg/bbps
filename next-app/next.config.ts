import withSerwistInit from '@serwist/next'
import type { NextConfig } from 'next'

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js'
})

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 避免多 lockfile 时 Turbopack 根目录推断警告
  turbopack: { root: process.cwd() }
}

export default withSerwist(nextConfig)
