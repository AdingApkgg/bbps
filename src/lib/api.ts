/**
 * 游戏服务端 API 客户端
 *
 * 站点是纯静态导出，没有任何后端，所有请求由浏览器直接打到游戏服务端。
 * 这里统一收口：base URL、X-Web-Token 注入、401/429 处理。
 */

/**
 * 线上直连 webapi.30hb.cn（CORS 只精确放行 https://30hb.cn）。
 * 本地开发走 /gameapi 相对路径，由 next.config.ts 的 rewrites 代理过去绕开 CORS，
 * 详见 next.config.ts。可用 NEXT_PUBLIC_API_BASE 覆盖。
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  (process.env.NODE_ENV === 'development'
    ? '/gameapi'
    : 'https://webapi.30hb.cn')

const TOKEN_KEY = 'bbps-web-token'

/* ---------- 会话令牌：只存 localStorage，绝不进 URL ---------- */

type TokenListener = (token: string | null) => void
const tokenListeners = new Set<TokenListener>()

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token)
    else window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* 隐私模式下 localStorage 可能不可用 */
  }
  tokenListeners.forEach((fn) => fn(token))
}

/** 订阅令牌失效（401 会自动清除并触发） */
export function onTokenChange(fn: TokenListener): () => void {
  tokenListeners.add(fn)
  return () => {
    tokenListeners.delete(fn)
  }
}

/* ---------- 错误 ---------- */

export type ApiErrorKind =
  | 'network'
  | 'unauthorized'
  | 'offline'
  | 'rate_limited'
  | 'bad_request'
  | 'server'

export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorKind

  constructor(status: number, kind: ApiErrorKind, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.kind = kind
  }
}

function kindFor(status: number): ApiErrorKind {
  if (status === 401) return 'unauthorized'
  if (status === 409) return 'offline'
  if (status === 429) return 'rate_limited'
  if (status === 400) return 'bad_request'
  return 'server'
}

/* ---------- 请求 ---------- */

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  /** 是否注入 X-Web-Token */
  auth?: boolean
  signal?: AbortSignal
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, signal } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    // 令牌只走请求头，不放 URL：URL 会进浏览器历史、Referer 和代理日志
    if (token) headers['X-Web-Token'] = token
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    throw new ApiError(0, 'network', 'network')
  }

  if (!res.ok) {
    // 令牌失效：立即清掉，订阅者（指令面板）会退回验证界面
    if (res.status === 401 && auth) setToken(null)
    throw new ApiError(res.status, kindFor(res.status), `HTTP ${res.status}`)
  }

  return (await res.json()) as T
}

/* ---------- 聊天 ---------- */

/** 玩家聊天消息；其余 type 是入队申请/联盟事件/战报分享等，message 为 null */
export const CHAT_TYPE_MESSAGE = 2

export interface ChatEntry {
  seq: number
  entry_id: number
  type: number
  sender_id: number
  sender_name: string
  sender_level: number
  /** Unix 秒 */
  time: number
  message: string | null
  pinned: boolean
}

export interface ChatResponse {
  count: number
  last_seq: number
  entries: ChatEntry[]
}

/**
 * 取最近 N 条聊天（正序，最老的在前）。
 * 接口刻意不支持翻页/游标 —— 那等于给匿名访问者一个导出全服聊天历史的入口。
 * 准实时刷新请重取最近 N 条，按 seq 在前端去重。
 */
export async function fetchChat(
  limit: number,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const capped = Math.min(Math.max(1, Math.trunc(limit)), 500)
  return request<ChatResponse>(`/api/chat?limit=${capped}`, { signal })
}

/** 只保留真正的玩家聊天，其余 type 的 message 是 null，渲染出来是空气泡 */
export function onlyChatMessages(entries: ChatEntry[]): ChatEntry[] {
  return entries.filter((e) => e.type === CHAT_TYPE_MESSAGE && e.message)
}

/* ---------- 服务器状态 / 排行榜 ---------- */

export interface OnlinePlayer {
  id: number
  name: string
}

export interface ServerStatusBody {
  server_version: string
  m_v_avatar_seed: number
  m_v_replay_seed: number
  online_sessions: number
  online_player_list: OnlinePlayer[]
  /** 运行时长，.NET TimeSpan 字符串如 "00:39:02.588" */
  server_uptime?: string | number
  /** 已用内存，字节 */
  memory_used?: number
  cached_accounts?: number
  online_connections?: number
  incoming_message_count?: number
  outgoing_message_count?: number
  account_save_failures?: number
  datetime_utcnow?: string
  game_server_address?: string
  game_server_host_name?: string
  save_mode?: string
  use_patch?: boolean
  patch_sha?: string
  patch_url?: string
  refresh_api_objects_ms?: number
  [key: string]: unknown
}

export async function fetchServerStatus(
  signal?: AbortSignal
): Promise<ServerStatusBody> {
  const json = await request<Record<string, unknown>>('/api/server', { signal })
  const data = (json?.body ?? json) as ServerStatusBody
  if (!data?.server_version) throw new ApiError(0, 'server', 'invalid payload')
  return data
}

/**
 * 排行榜。WARSHIP_GLOBAL / WARSHIP_LOCAL 目前返回 404，别做入口。
 */
export async function fetchLeaderboard<T>(type: string): Promise<T> {
  return request<T>(`/api/leaderboard/${type}`)
}

export async function fetchReservedAlliance<T>(type: string): Promise<T> {
  return request<T>(`/api/reserved_alliance/${type}`)
}

/* ---------- 全服统计 ---------- */

export interface GlobalStatistics {
  /** 709 个计数器，多数带 ID 后缀；不带后缀的是汇总项 */
  PlayerStatistics: Record<string, number>
  /** 历次开服时间 */
  ServerOpenTime: string[]
  /** 历次关服时间 */
  ServerCloseTime: string[]
}

export async function fetchGlobalStatistics(
  signal?: AbortSignal
): Promise<GlobalStatistics> {
  const json = await request<Record<string, unknown>>('/api/global_statistics', {
    signal
  })
  const data = (json?.body ?? json) as GlobalStatistics
  if (!data?.PlayerStatistics) throw new ApiError(0, 'server', 'invalid payload')
  return data
}

/* ---------- 玩家基地 ---------- */

export interface HomeBuilding {
  /** 建筑 ID，可用 lib/game-data 映射为名称 */
  data: number
  lvl: number
  x: number
  y: number
}

export interface PlayerHome {
  buildings?: HomeBuilding[]
  obstacles?: unknown[]
  traps?: unknown[]
  decos?: unknown[]
  island_skin?: number
  seed?: number
  boosters?: { t: number; e: number; v: number }[]
  season?: { name?: string; season_id?: number }
}

export interface PlayerMap {
  MapRegions?: { Explored?: boolean }[]
  Outposts?: unknown[]
  Frags?: number
  ExplorationCounter?: number
  DeepseaMissionsLeft?: number
}

export interface PlayerBase {
  player_id: number
  home: PlayerHome
  map: PlayerMap
}

/**
 * 玩家基地数据。/api/base/{id} 一次返回 home + map，比分别取省一个请求。
 *
 * 注意：这组接口按来源 IP 限速 60 次/分钟，超出返回 429。
 * 只允许「点击某个玩家」这种交互触发，**不要**写循环批量拉取。
 */
export async function fetchPlayerBase(
  playerId: number,
  signal?: AbortSignal
): Promise<PlayerBase> {
  const json = await request<Record<string, unknown>>(
    `/api/base/${playerId}`,
    { signal }
  )
  const data = (json?.body ?? json) as PlayerBase
  if (!data?.home) throw new ApiError(0, 'server', 'invalid payload')
  return data
}

/* ---------- 网页指令会话 ---------- */

export interface VerifyResponse {
  token: string
  player_id: number
  expires_in_days: number
}

export interface SessionResponse {
  player_id: number
  valid: boolean
}

export interface CommandResponse {
  player_id: number
  command: string
  /** 1 = 已执行；0 = 指令无法识别或参数错误 */
  result: number
}

/** 用游戏内 /webcode 拿到的 6 位验证码换取 7 天令牌 */
export async function verifyCode(
  playerId: number,
  code: string
): Promise<VerifyResponse> {
  return request<VerifyResponse>('/api/web/verify', {
    method: 'POST',
    body: { player_id: playerId, code }
  })
}

/** 校验已存令牌，页面加载时先调这个，避免回头客重复验证 */
export async function checkSession(signal?: AbortSignal): Promise<SessionResponse> {
  return request<SessionResponse>('/api/web/session', { auth: true, signal })
}

/**
 * 执行指令。注意：执行结果不通过 HTTP 返回，
 * result 只表示「指令是否被识别并执行」，文字反馈全部发到玩家的游戏客户端里。
 */
export async function runCommand(command: string): Promise<CommandResponse> {
  return request<CommandResponse>('/api/web/command', {
    method: 'POST',
    body: { command },
    auth: true
  })
}

export async function logout(): Promise<void> {
  try {
    await request<{ revoked: boolean }>('/api/web/logout', {
      method: 'POST',
      auth: true
    })
  } catch {
    /* 令牌可能已过期，本地照样清掉 */
  } finally {
    setToken(null)
  }
}
