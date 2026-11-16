import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/** 游戏服务端。CORS 只精确放行 https://30hb.cn，本地开发靠下面的 rewrites 代理绕开 */
const GAME_API = 'https://webapi.30hb.cn'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  turbopack: { root: process.cwd() },

  /**
   * 仅 next dev 生效：把 /gameapi/* 代理到游戏服务端，
   * 这样本地 localhost:3000 也能调接口，而不必去改线上 CORS 白名单。
   * 静态导出（next build）不含此项 —— 线上是浏览器直连 webapi.30hb.cn。
   */
  ...(isDev
    ? {
        rewrites: async () => [{ source: '/gameapi/:path*', destination: `${GAME_API}/:path*` }],
        /**
         * dev 下跨源加载 dev 资源（HMR 的 WebSocket、/__nextjs_font/* 字体）会被拦成 403。
         * 从 tailnet 域名或局域网 IP 打开预览时必须放行，否则热更新静默失效、字体 403。
         */
        allowedDevOrigins: [
          'localhost-1.tailac9c6f.ts.net',
          '127.0.0.1',
          'localhost',
          '192.168.*.*',
          '10.*.*.*'
        ]
      }
    : {})
}

export default nextConfig
