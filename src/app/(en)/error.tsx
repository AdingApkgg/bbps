'use client'

import { ShellError } from '@/components/shell-error'

/* 英文站路由级错误边界，见 (zh)/error.tsx */
export default function EnError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ShellError error={error} reset={reset} lang="en" />
}
