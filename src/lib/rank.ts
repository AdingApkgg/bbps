/**
 * 排行榜 API
 *
 * 可用类型：VP / CRAB / COE 各有 GLOBAL 与 LOCAL 两档，外加
 * reserved_alliance/RANK_STATS_DEPLOY（阵亡统计）。
 * WARSHIP_GLOBAL / WARSHIP_LOCAL 服务端返回 404，不做入口。
 */
import { fetchLeaderboard, fetchReservedAlliance } from '@/lib/api'

export interface RankEntry {
  rank: number
  level: number
  name: string
  /** 原始名字（含 <cRRGGBB> 颜色码），交给 <PlayerName> 渲染 */
  rawName: string
  value: number
  /** 玩家 ID，用于查基地详情；阵亡榜也有 */
  playerId: number | null
}

/** 榜单类型；WARSHIP_* 返回 404，不收录 */
export type LeaderboardScope = 'GLOBAL' | 'LOCAL'
export type LeaderboardKind = 'VP' | 'CRAB' | 'COE'

interface VPOrCrabItem {
  Order?: number
  AvatarLevel?: number
  Name?: string
  Score?: number
  ID?: number
  HomeID?: number
  Region?: string
  AllianceName?: string
  NumberOnePosCounter?: number
  PreviousOrder?: number
  [key: string]: unknown
}

interface DeployItem {
  Order?: number
  VictoryPoint?: number
  Level?: number
  PlayerName?: string
  PlayerID?: number
  NumberOnePosCounter?: number
  PreviousOrder?: number
  [key: string]: unknown
}

async function fetchVpOrCrab(type: string): Promise<RankEntry[]> {
  const json = await fetchLeaderboard<unknown>(type)
  const list = (Array.isArray(json)
    ? json
    : (json as { body?: { RankingEntries?: VPOrCrabItem[] } })?.body
        ?.RankingEntries) as VPOrCrabItem[] | undefined
  if (!Array.isArray(list)) return []
  return list.map((item, i) => ({
    rank: item.Order ?? i + 1,
    level: Number(item.AvatarLevel) || 0,
    name: String(item.Name ?? '').trim() || '—',
    rawName: String(item.Name ?? ''),
    value: Number(item.Score) || 0,
    playerId: Number(item.ID) || null
  }))
}

async function fetchDeployStats(): Promise<RankEntry[]> {
  const json = await fetchReservedAlliance<{
    AllianceMemberList?: DeployItem[]
    body?: { AllianceMemberList?: DeployItem[] }
  }>('RANK_STATS_DEPLOY')
  const list = json?.AllianceMemberList ?? json?.body?.AllianceMemberList
  if (!Array.isArray(list)) return []
  return list.map((item, i) => ({
    rank: item.Order ?? i + 1,
    level: Number(item.Level) || 0,
    name: String(item.PlayerName ?? '').trim() || '—',
    rawName: String(item.PlayerName ?? ''),
    value: Number(item.VictoryPoint) || 0,
    playerId: Number(item.PlayerID) || null
  }))
}

export interface RankData {
  vp: RankEntry[]
  megacrab: RankEntry[]
  coe: RankEntry[]
  casualties: RankEntry[]
}

/**
 * 一次取回某一档（全球 / 本地）的三个榜 + 阵亡统计。
 * 阵亡统计没有 LOCAL 之分，两档共用。
 */
export async function fetchAllRanks(
  scope: LeaderboardScope = 'GLOBAL'
): Promise<RankData> {
  const [vp, megacrab, coe, casualties] = await Promise.all([
    fetchVpOrCrab(`VP_${scope}`),
    fetchVpOrCrab(`CRAB_${scope}`),
    fetchVpOrCrab(`COE_${scope}`),
    fetchDeployStats()
  ])
  return { vp, megacrab, coe, casualties }
}
