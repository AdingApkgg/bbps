'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ShellErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  lang: 'zh-Hans' | 'en'
}

/**
 * 路由级错误兜底的内容体。
 *
 * 静态导出下 error.tsx 依然有效 —— 它就是客户端边界，只是服务端没有机会渲染它。
 * 渲染体收在这里，中英两边的 error.tsx 只差一个 lang。
 *
 * 不展示 `error.message`：生产构建里它经常是压缩后的英文栈信息，
 * 对玩家没有意义；`digest` 倒是可以留着，方便和服务端日志对照。
 */
export function ShellError({ error, reset, lang }: ShellErrorProps) {
  const isEn = lang === 'en'
  const prefix = isEn ? '/en' : ''

  useEffect(() => {
    /* 静态站没有上报端点，先落控制台；接入分析后改成上报 */
    console.error(error)
  }, [error])

  return (
    <main
      id="main"
      className="mx-auto flex min-h-[60svh] max-w-(--hig-container-narrow) flex-col items-center justify-center gap-4 px-6 py-16 text-center"
    >
      <p className="font-mono text-caption text-on-surface-helper">500</p>
      <h1 className="text-headline-lg text-on-surface">
        {isEn ? 'Something went wrong' : '页面出错了'}
      </h1>
      <p className="text-body-02 text-on-surface-medium">
        {isEn
          ? 'This page failed to render. Retrying usually helps.'
          : '这个页面渲染失败了，重试一次通常就好了。'}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>{isEn ? 'Retry' : '重试'}</Button>
        <Button variant="secondary" asChild>
          <Link href={`${prefix}/`}>{isEn ? 'Back to home' : '回到首页'}</Link>
        </Button>
      </div>
      {error.digest ? (
        <p className="mt-4 font-mono text-caption text-on-surface-helper">{error.digest}</p>
      ) : null}
    </main>
  )
}
