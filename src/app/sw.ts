/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import {
  Serwist,
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
  ExpirationPlugin
} from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // 页面导航 — NetworkFirst
      matcher({ request }) {
        return request.mode === 'navigate'
      },
      handler: new NetworkFirst({
        cacheName: 'pages',
        networkTimeoutSeconds: 3
      })
    },
    {
      // 静态资源 (JS/CSS/字体) — StaleWhileRevalidate
      matcher({ request }) {
        return (
          request.destination === 'script' ||
          request.destination === 'style' ||
          request.destination === 'font'
        )
      },
      handler: new StaleWhileRevalidate({
        cacheName: 'static-assets'
      })
    },
    {
      /*
       * 图片 — CacheFirst + 过期策略。
       *
       * 过期策略不是可选项：CacheFirst 命中缓存就不再回源，没有 ExpirationPlugin
       * 的话任何图片一旦被缓存就**永久**定格，站内图片再也无法原地更新
       * （换 logo、换截图、压缩封面，老用户全都看不到）。缓存本身也会无限膨胀。
       *
       * maxAgeFrom 用默认的 last-fetched：按抓取时间算，否则常被浏览的图
       * 会不断续命、永远不刷新。
       */
      matcher({ request }) {
        return request.destination === 'image'
      },
      handler: new CacheFirst({
        cacheName: 'images',
        plugins: [
          new ExpirationPlugin({
            // 站内图片共约 36 张，64 留足余量又不至于无限增长
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true
          })
        ]
      })
    }
  ]
})

serwist.addEventListeners()
