'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  AlertCircle,
  Check,
  Loader2,
  LogOut,
  ShieldAlert,
  Terminal
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useWebSession } from '@/hooks/use-web-session'
import { useServerStats } from '@/hooks/use-server-stats'
import { ApiError, runCommand } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export type Feedback = { kind: 'ok' | 'warn' | 'error'; text: string } | null

/**
 * 会话 + 在线状态 + 执行指令。
 * 指令库和常用指令共用这一份，避免重复发起会话校验与 /api/server 轮询。
 */
export function useCommandRunner() {
  const locale = useLocale()
  const t = getDictionary(locale).console
  const session = useWebSession()
  // 复用已有的 /api/server 轮询，不额外发请求
  const { players, loading: statsLoading } = useServerStats()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const playerId = session.playerId
  const isOnline = useMemo(
    () => (playerId == null ? false : players.some((p) => p.id === playerId)),
    [players, playerId]
  )

  const execute = useCallback(
    async (rawCommand: string) => {
      const command = rawCommand.trim().replace(/^\/+/, '') // 不要带开头的 /
      if (!command || busy) return
      if (command.length > 2048) {
        setFeedback({ kind: 'error', text: t.resultTooLong })
        return
      }
      setBusy(true)
      setFeedback(null)
      try {
        const res = await runCommand(command)
        setFeedback(
          res.result === 1
            ? { kind: 'ok', text: t.resultSent }
            : { kind: 'warn', text: t.resultRejected }
        )
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.kind === 'offline') setFeedback({ kind: 'error', text: t.resultOffline })
          else if (err.kind === 'unauthorized') return // 令牌已清，自动退回验证页
          else if (err.kind === 'bad_request') setFeedback({ kind: 'error', text: t.resultBadRequest })
          else if (err.kind === 'rate_limited') setFeedback({ kind: 'error', text: t.resultRateLimited })
          else setFeedback({ kind: 'error', text: t.errorNetwork })
        } else {
          setFeedback({ kind: 'error', text: t.errorNetwork })
        }
      } finally {
        setBusy(false)
      }
    },
    [busy, t]
  )

  return {
    ...session,
    isOnline,
    statsLoading,
    busy,
    feedback,
    setFeedback,
    execute,
    /** 可执行：已登录 + 游戏在线 + 当前没有请求在飞 */
    canRun: session.status === 'authed' && isOnline && !busy
  }
}

export function RunFeedback({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  return (
    <div
      className={`flex gap-2 rounded-md border p-3 ${
        feedback.kind === 'ok'
          ? 'border-emerald-500/40 bg-emerald-500/5'
          : feedback.kind === 'warn'
            ? 'border-amber-500/40 bg-amber-500/5'
            : 'border-destructive/40 bg-destructive/5'
      }`}
    >
      {feedback.kind === 'ok' ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-600" />
      ) : (
        <AlertCircle
          className={`h-4 w-4 shrink-0 ${
            feedback.kind === 'warn' ? 'text-amber-600' : 'text-destructive'
          }`}
        />
      )}
      <p
        className={`text-sm ${
          feedback.kind === 'ok'
            ? 'text-emerald-700 dark:text-emerald-500'
            : feedback.kind === 'warn'
              ? 'text-amber-700 dark:text-amber-500'
              : 'text-destructive'
        }`}
      >
        {feedback.text}
      </p>
    </div>
  )
}

/* ── 第一步：游戏内取码 → 换令牌 ── */

export function VerifyPanel({
  onVerify
}: {
  onVerify: (id: number, code: string) => Promise<unknown>
}) {
  const locale = useLocale()
  const t = getDictionary(locale).console
  const [playerId, setPlayerId] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const idValid = /^\d{1,12}$/.test(playerId.trim())
  const codeValid = /^\d{6}$/.test(code.trim())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idValid || !codeValid || busy) return
    setBusy(true)
    setError(null)
    try {
      await onVerify(Number(playerId.trim()), code.trim())
    } catch (err) {
      // 服务端刻意不区分「码错了 / 码过期了 / 没要过码」——
      // 能区分就等于泄露哪些账号正在等待验证。统一提示。
      setError(
        err instanceof ApiError && err.kind === 'network'
          ? t.errorNetwork
          : t.verifyFailed
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Terminal className="h-4 w-4" />
          {t.verifyTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 流程方向：玩家在游戏里主动给自己要码，网页没有「发送验证码」这种接口 */}
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
              1
            </span>
            <span className="text-muted-foreground">
              {t.step1Prefix}{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                /webcode
              </code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
              2
            </span>
            <span className="text-muted-foreground">{t.step2}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
              3
            </span>
            <span className="text-muted-foreground">{t.step3}</span>
          </li>
        </ol>

        {/* 防诈骗提示 —— 与游戏内发码时的提示对齐 */}
        <div className="flex gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3">
          <ShieldAlert className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-xs leading-relaxed text-destructive">
            {t.scamWarning}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="rc-player-id" className="text-sm font-medium">
                {t.playerIdLabel}
              </label>
              <Input
                id="rc-player-id"
                inputMode="numeric"
                autoComplete="off"
                placeholder={t.playerIdPlaceholder}
                value={playerId}
                onChange={(e) =>
                  setPlayerId(e.target.value.replace(/\D/g, '').slice(0, 12))
                }
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="rc-code" className="text-sm font-medium">
                {t.codeLabel}
              </label>
              <Input
                id="rc-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                className="font-mono tracking-[0.3em]"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
              />
            </div>
          </div>

          {error && (
            <p className="flex items-start gap-1.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!idValid || !codeValid || busy}
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.verifying}
              </>
            ) : (
              t.verifySubmit
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">{t.codeRules}</p>
      </CardContent>
    </Card>
  )
}

/* ── 已登录状态条 ── */

export function SessionBar({
  playerId,
  isOnline,
  statsLoading,
  onLogout
}: {
  playerId: number | null
  isOnline: boolean
  statsLoading: boolean
  onLogout: () => Promise<void>
}) {
  const locale = useLocale()
  const t = getDictionary(locale).console
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await onLogout()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Badge variant="secondary" className="font-mono">
            ID {playerId ?? '—'}
          </Badge>
          {statsLoading ? (
            <Badge variant="outline">{t.checkingOnline}</Badge>
          ) : isOnline ? (
            <Badge className="bg-emerald-600 hover:bg-emerald-600">
              {t.online}
            </Badge>
          ) : (
            <Badge variant="destructive">{t.offline}</Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {t.logout}
          </Button>
        </CardContent>
      </Card>

      {!isOnline && !statsLoading && (
        <div className="flex gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-700 dark:text-amber-500">
            {t.offlineHint}
          </p>
        </div>
      )}
    </div>
  )
}
