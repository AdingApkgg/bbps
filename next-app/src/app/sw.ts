/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist, CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'serwist'

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
      // 图片 — CacheFirst
      matcher({ request }) {
        return request.destination === 'image'
      },
      handler: new CacheFirst({
        cacheName: 'images',
        plugins: []
      })
    }
  ]
})

serwist.addEventListeners()
