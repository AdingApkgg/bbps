import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 避免多 lockfile 时 Turbopack 根目录推断警告
  turbopack: { root: process.cwd() },
}

export default nextConfig
