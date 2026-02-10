/**
 * 排行榜 API，与 30hb.cn/rank 一致
 * 代理: https://rp.30hb.cn/?target=
 * 接口: leaderboard/VP_GLOBAL | leaderboard/CRAB_GLOBAL | reserved_alliance/RANK_STATS_DEPLOY
 */
const RANK_PROXY =
  process.env.NEXT_PUBLIC_RANK_PROXY ?? 'https://rp.30hb.cn/?target='
const API_BASE = 'https://webapi.30hb.cn/api/'

export interface RankEntry {
  rank: number
  level: number
  name: string
  /** 原始名字（含 <cRRGGBB> 颜色码），用于 parseGameText */
  rawName: string
  value: number
}

/** 解析游戏内颜色码 <cRRGGBB>Name</c> 为安全 HTML 字符串 */
export function parseGameText(text: string): string {
  if (!text || typeof text !== 'string') return ''
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(
    /&lt;c([0-9a-fA-F]{6})&gt;(.*?)&lt;\/c&gt;/gi,
    (_m, color: string, content: string) => {
      const unescaped = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      return `<span style="color:#${color}">${unescaped}</span>`
    }
  )
}

interface VPOrCrabItem {
  Order?: number
  AvatarLevel?: number
  Name?: string
  Score?: number
  [key: string]: unknown
}

interface DeployItem {
  VictoryPoint?: number
  Level?: number
  PlayerName?: string
  [key: string]: unknown
}

async function fetchVpOrCrab(path: string): Promise<RankEntry[]> {
  const url = `${RANK_PROXY}${encodeURIComponent(API_BASE + path)}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const list = json?.body?.RankingEntries as VPOrCrabItem[] | undefined
  if (!Array.isArray(list)) return []
  return list.map((item, i) => ({
    rank: item.Order ?? i + 1,
    level: Number(item.AvatarLevel) || 0,
    name: String(item.Name ?? '').trim() || '—',
    rawName: String(item.Name ?? ''),
    value: Number(item.Score) || 0
  }))
}

async function fetchDeployStats(): Promise<RankEntry[]> {
  const path = 'reserved_alliance/RANK_STATS_DEPLOY'
  const url = `${RANK_PROXY}${encodeURIComponent(API_BASE + path)}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const list = json?.body?.AllianceMemberList as DeployItem[] | undefined
  if (!Array.isArray(list)) return []
  return list.map((item, i) => ({
    rank: i + 1,
    level: Number(item.Level) || 0,
    name: String(item.PlayerName ?? '').trim() || '—',
    rawName: String(item.PlayerName ?? ''),
    value: Number(item.VictoryPoint) || 0
  }))
}

export async function fetchAllRanks(): Promise<{
  vp: RankEntry[]
  megacrab: RankEntry[]
  casualties: RankEntry[]
}> {
  const [vp, megacrab, casualties] = await Promise.all([
    fetchVpOrCrab('leaderboard/VP_GLOBAL'),
    fetchVpOrCrab('leaderboard/CRAB_GLOBAL'),
    fetchDeployStats()
  ])
  return { vp, megacrab, casualties }
}
