/**
 * 构建期出站 HTTP 策略。
 *
 * 构建机到 Cloudflare 后面那些主机（blog.30hb.cn）的 TCP 连接有约 1/4 概率
 * 卡住直到超时。逐项排查（代理、`--dns-result-order`、单次重试）后，稳定的组合是：
 *
 *  0. 带一个完整浏览器的 UA —— 见下方「CF 托管挑战」一节。
 *  1. 优先 IPv4 —— 失败样本里全都在试 `2606:4700::` 的 IPv6 地址，
 *     本机 IPv6 出口只是偶尔通。用 undici 的 `family: 4` 强制，而不用
 *     `dns.setDefaultResultOrder` —— 后者要 `node:dns`，Turbopack 的
 *     server chunk 上下文会报 `does not support external modules`；
 *  2. 连接超时放宽到 30s —— 默认 10s 卡在「正在连」和「已连上」之间反复；
 *  3. 开 keep-alive 并复用 dispatcher —— 一旦连上，后续请求不再新建 TCP，
 *     重试才有意义（原来每次重试都要重新连，等于再赌一次）；
 *  4. 并发压到 4 —— 构建期本来就低并发，也不至于打爆对方。
 *
 * 这里刻意用 undici 自己的 `fetch` 而不是全局 fetch：Next 会包装全局 fetch 做
 * 去重/缓存，`dispatcher` 传进去不一定生效，而我们已经不需要它的缓存
 * （静态导出没有 ISR）。
 *
 * 只在 Node 侧使用（Server Component 与 scripts/*.mjs），不进客户端 bundle。
 *
 * == CF 托管挑战 ==
 *
 * GitHub Actions 跑 next build 时，blog.30hb.cn 的 WP API 一律 `403`，body 是
 * `Just a moment...` 而不是 JSON，响应头带 `cf-mitigated: challenge`。
 * 根因是 zone 上的 Bot Fight Mode（`enable_js: true` + `fight_mode: true`）：
 * 它给自动化流量下发 JS 挑战，undici 不解 JS，于是永远卡在 403。
 * 2026-11-21 已把它关掉，之后空 UA 也能 200。
 *
 * 关掉不等于不会再开，所以 UA 这层保留着（实测有它在时即便 BFM 开着，HTTP/1.1
 * 与 HTTP/2 都能过；undici 与 curl 同 header 同版本的表现差异已排除）。
 * 若再次出现成片的 403 + `cf-mitigated: challenge`，先查 zone 的
 * `cf bot-management get`，而不是改这里的请求头。
 */
import { Agent, fetch } from 'undici'

let dispatcher: Agent | undefined

/**
 * 冒充普通浏览器。缺了它 Cloudflare 会对 GitHub Actions 的 IP 直接下发挑战页，
 * 拿到的 body 是 HTML 而不是 JSON。范式取当前 Chrome 桌面版。
 */
export const BROWSER_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

/** 给请求补上 UA（调用方已显式给了就不覆盖） */
export function withBrowserUA(init: Parameters<typeof fetch>[1] = {}): Parameters<typeof fetch>[1] {
  // undici 的 HeadersInit 有自己的 HeaderRecord（值可为 undefined），
  // 全局 Headers 收不下，先宽化再交给它
  const headers = new globalThis.Headers(init.headers as HeadersInit | undefined)
  if (!headers.has('user-agent')) headers.set('User-Agent', BROWSER_UA)
  return { ...init, headers }
}

function getDispatcher(): Agent {
  dispatcher ??= new Agent({
    connect: { timeout: 30_000, family: 4 },
    keepAliveTimeout: 60_000,
    keepAliveMaxTimeout: 60_000,
    connections: 4
  })
  return dispatcher
}

/** 走上面那套连接策略的 fetch */
export function fetchOutbound(url: string, init: Parameters<typeof fetch>[1] = {}) {
  return fetch(url, { ...withBrowserUA(init), dispatcher: getDispatcher() })
}

/** 退避重试。只重试网络层错误 —— 有状态码就代表对方已经答复了 */
export async function fetchWithBackoff(
  url: string,
  init: Parameters<typeof fetch>[1] = {},
  delaysMs: number[] = [1000, 2000, 4000, 8000, 15000]
) {
  let lastError: unknown
  for (let attempt = 0; attempt <= delaysMs.length; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, delaysMs[attempt - 1]))
    }
    try {
      return await fetchOutbound(url, init)
    } catch (err) {
      lastError = err
      console.warn(
        `[http] ${url} 第 ${attempt + 1}/${delaysMs.length + 1} 次失败：`,
        err instanceof Error ? err.message : err
      )
    }
  }
  throw lastError
}
