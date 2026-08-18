'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  checkSession,
  getToken,
  logout as apiLogout,
  onTokenChange,
  setToken,
  verifyCode
} from '@/lib/api'

export type SessionStatus = 'checking' | 'anonymous' | 'authed'

export function useWebSession() {
  const [status, setStatus] = useState<SessionStatus>('checking')
  const [playerId, setPlayerId] = useState<number | null>(null)

  // 页面加载先校验已存令牌，有效就直接进面板，别让回头客重复验证
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const run = async () => {
      if (!getToken()) {
        if (!cancelled) setStatus('anonymous')
        return
      }
      try {
        const data = await checkSession(controller.signal)
        if (cancelled) return
        if (data.valid) {
          setPlayerId(data.player_id)
          setStatus('authed')
        } else {
          setToken(null)
          setStatus('anonymous')
        }
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === 'AbortError')) return
        // 401 已由 api 层清掉令牌；网络错误也退回验证页，避免卡在 checking
        setStatus('anonymous')
      }
    }
    run()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  // 任何请求拿到 401 都会清令牌，这里同步退回验证界面
  useEffect(() => {
    return onTokenChange((token) => {
      if (!token) {
        setPlayerId(null)
        setStatus('anonymous')
      }
    })
  }, [])

  const verify = useCallback(async (id: number, code: string) => {
    const data = await verifyCode(id, code)
    setToken(data.token)
    setPlayerId(data.player_id)
    setStatus('authed')
    return data
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setPlayerId(null)
    setStatus('anonymous')
  }, [])

  return { status, playerId, verify, logout }
}

export { ApiError }
