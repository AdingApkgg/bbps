'use client'

import { ShellError } from '@/components/shell-error'

/**
 * 中文站路由级错误边界。
 *
 * 没有它的话，任一客户端组件抛错都是 Next 的默认黑底白字「Application error」——
 * 页面整个塌掉，玩家连回首页的入口都没有。
 */
export default function ZhError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ShellError error={error} reset={reset} lang="zh-Hans" />
}
