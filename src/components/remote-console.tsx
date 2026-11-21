'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, Loader2, LogOut, ShieldAlert, Terminal } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useWebSession } from '@/hooks/use-web-session'
import { useServerStats } from '@/hooks/use-server-stats'
import { ApiError, runCommand } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardRow } from '@/components/ui/card'

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
  const { players, stats, loading: statsLoading } = useServerStats()
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
          else if (err.kind === 'unauthorized')
            return // 令牌已清，自动退回验证页
          else if (err.kind === 'bad_request')
            setFeedback({ kind: 'error', text: t.resultBadRequest })
          else if (err.kind === 'rate_limited')
            setFeedback({ kind: 'error', text: t.resultRateLimited })
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

  /**
   * 这份在线快照有多旧（秒）。datetime_utcnow 是 UTC。
   * 用定时器驱动而不是在渲染里算 —— Date.now() 在 useMemo 里不纯。
   */
  const [snapshotAgeSec, setSnapshotAgeSec] = useState<number | null>(null)
  const rawNow = stats?.datetime_utcnow

  useEffect(() => {
    if (!rawNow) return
    const m = String(rawNow).match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?/
    )
    if (!m) return
    const ts = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0))
    const tick = () => {
      const age = Math.round((Date.now() - ts) / 1000)
      setSnapshotAgeSec(age >= 0 && age < 3600 ? age : null)
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [rawNow])

  return {
    ...session,
    isOnline,
    snapshotAgeSec,
    statsLoading,
    busy,
    feedback,
    setFeedback,
    execute,
    /**
     * 可执行：已登录且当前没有请求在飞。
     * 刻意不看在线状态 —— /api/server 的名单是 60 秒缓存快照，
     * 拿它做准入会两头错（刚登录被误禁、刚退出点了才 409）。
     * 让用户直接点，以 409 为权威答复。
     */
    canRun: session.status === 'authed' && !busy
  }
}

export function RunFeedback({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  // 结果是暂态的一条，不是多行内容：用分组底 + 状态色图标，不描边
  return (
    <div className="flex gap-2 rounded-sm bg-surface-02 p-3" role="status">
      {feedback.kind === 'ok' ? (
        <Check className="h-4 w-4 shrink-0 text-success" />
      ) : (
        <AlertCircle
          className={`h-4 w-4 shrink-0 ${feedback.kind === 'warn' ? 'text-warning' : 'text-error'}`}
        />
      )}
      <p
        className={`text-body-02 ${
          feedback.kind === 'ok'
            ? 'text-success'
            : feedback.kind === 'warn'
              ? 'text-warning'
              : 'text-error'
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
      setError(err instanceof ApiError && err.kind === 'network' ? t.errorNetwork : t.verifyFailed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          {t.verifyTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 流程方向：玩家在游戏里主动给自己要码，网页没有「发送验证码」这种接口 */}
        <ol className="space-y-3 text-body-02">
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-variant-01 text-label font-semibold">
              1
            </span>
            <span className="text-on-surface-medium">
              {t.step1Prefix}{' '}
              <code className="bg-surface-variant-01 px-2 py-0.5 font-mono text-on-surface">
                /webcode
              </code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-variant-01 text-label font-semibold">
              2
            </span>
            <span className="text-on-surface-medium">{t.step2}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-variant-01 text-label font-semibold">
              3
            </span>
            <span className="text-on-surface-medium">{t.step3}</span>
          </li>
        </ol>

        {/* 防诈骗提示 —— 与游戏内发码时的提示对齐 */}
        <div className="flex gap-2 rounded-sm bg-[color-mix(in_srgb,var(--hig-color-error)_10%,transparent)] p-3">
          <ShieldAlert className="h-4 w-4 shrink-0 text-error" />
          <p className="text-label leading-relaxed text-error">{t.scamWarning}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="rc-player-id" className="text-body-02 font-medium">
                {t.playerIdLabel}
              </label>
              <Input
                id="rc-player-id"
                inputMode="numeric"
                autoComplete="off"
                placeholder={t.playerIdPlaceholder}
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value.replace(/\D/g, '').slice(0, 12))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="rc-code" className="text-body-02 font-medium">
                {t.codeLabel}
              </label>
              <Input
                id="rc-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                className="font-mono tracking-[0.3em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>
          </div>

          {error && (
            <p className="flex items-start gap-2 text-body-02 text-error">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={!idValid || !codeValid || busy}>
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

        <p className="text-label text-on-surface-medium">{t.codeRules}</p>
      </CardContent>
    </Card>
  )
}

/* ── 已登录状态条 ── */

export function SessionBar({
  playerId,
  isOnline,
  snapshotAgeSec,
  statsLoading,
  onLogout
}: {
  playerId: number | null
  isOnline: boolean
  snapshotAgeSec: number | null
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
        <CardRow className="flex-wrap">
          <Badge variant="secondary" className="font-mono">
            ID {playerId ?? '—'}
          </Badge>
          {/* 仅作参考：这是 60 秒刷新一次的缓存快照，不用它拦请求 */}
          {statsLoading ? (
            <Badge variant="outline">{t.checkingOnline}</Badge>
          ) : (
            <Badge variant="outline" className="font-normal">
              {isOnline ? t.online : t.offline}
              {snapshotAgeSec != null && (
                <span className="ml-1 opacity-60">
                  {t.snapshotAge.replace('{n}', String(snapshotAgeSec))}
                </span>
              )}
            </Badge>
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
        </CardRow>
      </Card>

      <p className="text-label text-on-surface-medium">{t.onlineIsHint}</p>
    </div>
  )
}
