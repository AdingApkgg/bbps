'use client'

import { useEffect, useState } from 'react'
import {
  ApiError,
  fetchCustomBaseFacets,
  fetchCustomBases,
  type CustomBase,
  type CustomBaseQuery
} from '@/lib/api'
import { normalizeBaseLevel } from '@/lib/custom-bases'

/** 搜索词防抖：每敲一个字就发一次请求会很快撞上 60 次/分钟的限速 */
const SEARCH_DEBOUNCE = 300

export type BasesError = 'rate' | 'other'

export function useDebounced<T>(value: T, delay = SEARCH_DEBOUNCE): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/** 快照连同它属于哪次查询一起存，换条件时 loading 直接推导得出 */
interface Snapshot {
  key: string
  items: CustomBase[]
  total: number
  error: BasesError | null
}

function queryKey(q: CustomBaseQuery): string {
  return JSON.stringify([q.q, q.level, q.sort, q.page, q.pageSize])
}

interface BasesState {
  items: CustomBase[]
  total: number
  loading: boolean
  error: BasesError | null
}

/**
 * 基地列表。不轮询 —— 这份数据几乎不变，而 /api/bases* 按 IP 限速
 * 60 次/分钟，额度要留给用户的搜索和翻页。
 */
export function useCustomBases(query: CustomBaseQuery): BasesState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)

  const { q, level, sort, page, pageSize } = query
  const key = queryKey(query)

  // 只认当前查询的快照：换条件时自然回到 loading，不会闪出上一次的结果
  const current = snapshot?.key === key ? snapshot : null

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const run = async () => {
      try {
        const data = await fetchCustomBases(
          { q, level, sort, page, pageSize },
          controller.signal
        )
        if (cancelled) return
        setSnapshot({
          key,
          items: data.items ?? [],
          total: data.total ?? 0,
          error: null
        })
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === 'AbortError')) {
          return
        }
        setSnapshot({
          key,
          items: [],
          total: 0,
          error:
            e instanceof ApiError && e.kind === 'rate_limited' ? 'rate' : 'other'
        })
      }
    }
    run()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [key, q, level, sort, page, pageSize])

  return {
    items: current?.items ?? [],
    // 加载中沿用上一次的总数，翻页时页脚的「共 N 座 / 第 x 页」才不会闪一下 0
    total: current?.total ?? snapshot?.total ?? 0,
    loading: current === null,
    error: current?.error ?? null
  }
}

/**
 * 类型筛选下拉的选项。
 *
 * 两处清洗：
 *  1. facets 里的空串是「没有类型」那一桶，它不能当 level 参数传回去
 *     （那等于不筛选），直接剔除。
 *  2. 线上有 `layout/enemybase.level` 这种把文件路径存进来的脏值，它和
 *     `enemybase` 会显示成同一个名字。按归一化后的值去重，保留规范写法那个，
 *     否则下拉里会并排出现两个「黑暗卫队头目岛」。
 */
export function useBaseLevels(): string[] {
  const [levels, setLevels] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const run = async () => {
      try {
        const data = await fetchCustomBaseFacets(controller.signal)
        if (cancelled) return
        const byName = new Map<string, string>()
        for (const f of data.base_levels ?? []) {
          if (!f.base_level) continue
          const key = normalizeBaseLevel(f.base_level)
          // 规范写法优先：`enemybase` 胜过 `layout/enemybase.level`
          if (!byName.has(key) || f.base_level === key) {
            byName.set(key, f.base_level)
          }
        }
        setLevels([...byName.values()])
      } catch {
        /* 筛选是增强项，取不到就只显示「全部」 */
      }
    }
    run()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  return levels
}
