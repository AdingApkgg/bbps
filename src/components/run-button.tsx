'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { findCatalogEntry, type DangerLevel } from '@/lib/commands'
import { Button } from '@/components/ui/button'

/**
 * 执行按钮，内置危险指令确认。
 * 目录、快捷按钮、生成器都用这一个 —— 否则会出现「目录里要二次确认、
 * 快捷按钮点一下就执行」这种不一致。
 * 未显式传 danger 时，按完整指令从目录里反查。
 */
export function RunButton({
  command,
  canRun,
  onRun,
  danger,
  disabled,
  size = 'sm',
  variant = 'default',
  className,
  children
}: {
  command: string
  canRun: boolean
  onRun: (command: string) => void
  danger?: DangerLevel
  disabled?: boolean
  size?: 'sm' | 'default'
  variant?: 'default' | 'outline'
  className?: string
  children?: React.ReactNode
}) {
  const locale = useLocale()
  const t = getDictionary(locale).commands
  const [confirming, setConfirming] = useState(0)

  const level = danger ?? findCatalogEntry(command)?.danger
  const needed = level === 'destructive' ? 2 : level === 'warn' ? 1 : 0

  const handleClick = () => {
    if (confirming < needed) {
      setConfirming((n) => n + 1)
      // 4 秒未确认自动复位，避免误触留在"已按一次"的状态
      setTimeout(() => setConfirming(0), 4000)
      return
    }
    setConfirming(0)
    onRun(command)
  }

  // 未开始确认时必须显示动作名，否则用户看不出这个按钮是干什么的
  const label =
    confirming === 0
      ? (children ?? t.runButton)
      : level === 'destructive'
        ? confirming < needed
          ? t.confirmDestructive
          : t.confirmAgain
        : t.confirmOnce

  return (
    <Button
      size={size}
      variant={confirming > 0 ? 'destructive' : variant}
      className={className}
      onClick={handleClick}
      disabled={!canRun || disabled}
      title={!canRun ? t.runNeedsLogin : command}
    >
      {children && confirming === 0 ? null : <Play className="mr-1 h-3.5 w-3.5" />}
      {label}
    </Button>
  )
}
