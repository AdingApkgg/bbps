import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHtml } from '@/components/site-shell'
import '@/app/globals.css'

/**
 * 全局 404。多根 layout 下没有「根 not-found」可以兜住未匹配的 URL ——
 * Next 会退到内置的英文骨架（无 <html lang>、无外壳、无样式），
 * 所以这里显式提供一版，导出到 `out/404.html`，由 `public/_redirects` 接住。
 *
 * 它必须自带 <html>/<body>（不能复用 layout），因此只保留最小外壳，
 * 不复刻导航栏 —— 用户此刻已经走丢了，先给出口比给菜单重要。
 */
export const metadata: Metadata = {
  title: '页面不存在',
  robots: { index: false, follow: true }
}

export default function GlobalNotFound() {
  return (
    <SiteHtml lang="zh-Hans">
      <main
        id="main"
        className="mx-auto flex min-h-svh max-w-(--hig-container-narrow) flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <p className="font-mono text-label text-(--hig-color-label-secondary)">404</p>
        <h1 className="text-title1 text-(--hig-color-primary)">页面不存在</h1>
        <p className="text-body text-(--hig-color-label-secondary)">
          链接可能已经失效，或者站点改过路径。下面是几个常去的地方。
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Link
            href="/"
            className="rounded-sm bg-(--hig-color-primary) px-4 py-2 text-button text-(--hig-color-on-primary)"
          >
            回到首页
          </Link>
          <Link
            href="/downloads/"
            className="rounded-sm bg-(--hig-color-fill-secondary) px-4 py-2 text-button text-(--hig-color-label)"
          >
            下载客户端
          </Link>
        </div>
        <p className="mt-6 text-caption text-(--hig-color-label-tertiary)">
          <span lang="en">Page not found.</span>{' '}
          <Link href="/en/" className="underline">
            Go to the English site
          </Link>
        </p>
      </main>
    </SiteHtml>
  )
}
