'use client'

import { useEffect, useRef } from 'react'

interface PollingOptions {
  /** 每次 tick 的动作，必须把 signal 传给 fetch */
  run: (signal: AbortSignal) => Promise<void>
  intervalMs: number
  /** 关掉只是不排定时器；首次 tick 照跑 */
  enabled?: boolean
  /** 值变化时整体重启（立即补一次 tick），用于切换数据源，比如排行榜换档 */
  restartKey?: string
}

/**
 * 共享轮询：可见时按间隔跑，标签页隐藏时停表，切回来立刻补一次。
 *
 * 站内 /comments、/stats、/rank 都在轮询，接口本身没有限速（见 use-chat 的注释）。
 * 不做可见性判断的话，用户挂着标签页去看视频，后台照样 12s/30s/60s 打一次，
 * 挂一夜就是几千次请求，而且这些数据根本没人看。
 *
 * 同一时刻只跑一个：上一次没回来就跳过这一拍，避免慢请求堆叠。
 * run 从 ref 取最新的一份，调用方不必 memo。
 */
export function usePolling({ run, intervalMs, enabled = true, restartKey }: PollingOptions) {
  const runRef = useRef(run)
  runRef.current = run

  // restartKey 只在依赖里起作用：用它本身的值把 effect 重启一次（切档/换 ID 时立即补数据），
  // effect 体内不需要读它，所以去重规则会认为这一项是多余的。
  // biome-ignore lint/correctness/useExhaustiveDependencies: restartKey 只作为重启信号
  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setInterval> | undefined
    let inFlight = false

    const tick = () => {
      if (inFlight || document.visibilityState === 'hidden') return
      inFlight = true
      void runRef
        .current(controller.signal)
        .catch(() => {
          /* 失败由 run 自己处理成 error 状态 */
        })
        .finally(() => {
          inFlight = false
        })
    }

    const start = () => {
      if (timer === undefined) timer = setInterval(tick, intervalMs)
    }
    const stop = () => {
      if (timer !== undefined) {
        clearInterval(timer)
        timer = undefined
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stop()
        return
      }
      // 刚切回来：先把落后的数据补上，再恢复定时器
      tick()
      if (enabled) start()
    }

    tick()
    if (enabled) start()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      stop()
      controller.abort()
    }
  }, [intervalMs, enabled, restartKey])
}
