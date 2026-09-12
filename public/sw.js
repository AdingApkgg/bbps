/*
 * 自毁 Service Worker。
 *
 * 本站已移除 PWA。但直接删掉 sw.js 是不够的：老用户浏览器里注册的旧 SW
 * 会继续运行，继续从它自己的缓存里发旧的 app shell 和图片，可能长期卡在
 * 某个历史版本上。所以要先发这一版，让它把自己和所有缓存清理干净。
 *
 * 页面不再调用 register()，但浏览器在同作用域导航时仍会自行检查本脚本更新，
 * 老用户因而会拿到它。
 *
 * 确认线上装机量归零后（观察数周即可），这个文件连同 public/_headers 里
 * 对应的那条规则可以一并删除。
 */
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 顺序要紧：先清缓存再注销。反过来的话，注销会让这个 SW 失去控制权
      // 并可能被立即终止，后面的清理就跑不完了（实测如此）。
      const names = await caches.keys()
      await Promise.all(names.map((name) => caches.delete(name)))
      await self.registration.unregister()
      // 重新加载已打开的页面，让它们脱离这个 SW 的控制
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) client.navigate(client.url)
    })()
  )
})
