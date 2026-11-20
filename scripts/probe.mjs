#!/usr/bin/env node
/* 样式探针：一次性看清某个元素「实际算出什么」与「被谁选中」
 *
 * 用途是核样式改动是否真的生效、以及为什么没生效。用无头 Chromium 直接算
 * computedStyle，比在 devtools 里手点快，也能进脚本比对。
 *
 * 用法（在构建机上，对着已起的 dev 服务）：
 *   PROBE_BASE=http://127.0.0.1:3000 bun scripts/probe.mjs computed 'input[type=checkbox]'
 *   ... probe.mjs computed --focus 'input[placeholder*="搜索"]'   先聚焦再取（焦点环）
 *   ... probe.mjs computed --hover  'button[data-slot="button"]'  强置 :hover 再取
 *   ... probe.mjs css-hits 'input'          列出命中该选择器的规则及所在 @layer
 *   ... probe.mjs chain    '[data-slot="switch"]'  从元素往上的祖先链：overflow/position/transform
 *   ... probe.mjs layout   /commands        关键元素纵向位置与文档高度（找溢出）
 *   ... probe.mjs boxes    '[data-slot="badge"]' /maps  包围盒尺寸（尺寸回归）
 *
 * 第三个位置参数是页面路径，默认 /commands。选择器只取第一个匹配，每个模式都跑明暗两套。
 * hover 必须走 CDP `CSS.forcePseudoState`：`locator.hover()` 在无头下常有假阳性。
 */
const { chromium } = await (async () => {
  for (const spec of [
    'playwright',
    '/home/i/.pi/agent/mcp-runtime/node_modules/playwright/index.mjs'
  ]) {
    try {
      return await import(spec)
    } catch {}
  }
  throw new Error('找不到 playwright：npm i -D playwright 或装到 pi 的 MCP 运行时')
})()

const BASE = process.env.PROBE_BASE ?? 'http://localhost:3100'
const CHROME = process.env.PLAYWRIGHT_CHROME ?? '/usr/bin/chromium'

const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith('--')))
const positional = args.filter((a) => !a.startsWith('--'))
const mode = positional[0]
const target = positional[1]
/* 第三个位置参数可指定页面路径（默认 /commands，很多控件只在特定页出现） */
const route = positional[2] ?? '/commands'

if (!mode || (!target && mode !== 'layout')) {
  console.error(
    '用法：probe.mjs <computed|css-hits|chain|layout|boxes> [--focus|--hover] <选择器|路径> [路径]'
  )
  process.exit(2)
}

const browser = await chromium.launch({ executablePath: CHROME })
try {
  for (const scheme of ['light', 'dark']) {
    const page = await (
      await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme })
    ).newPage()
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    /* 强制伪态要先把节点标进 CDP 的 nodeId 映射 */
    let client
    if (flags.has('--hover') || flags.has('--focus')) {
      client = await page.context().newCDPSession(page)
      await client.send('DOM.enable')
      await client.send('CSS.enable')
    }
    await page.waitForTimeout(800)

    const sel = mode === 'layout' ? '' : target
    if (sel && (flags.has('--hover') || flags.has('--focus'))) {
      const { root } = await client.send('DOM.getDocument', { depth: -1 })
      const { nodeIds } = await client.send('DOM.querySelectorAll', {
        nodeId: root.nodeId,
        selector: sel
      })
      for (const nodeId of nodeIds.slice(0, 1)) {
        if (flags.has('--hover'))
          await client.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] })
        if (flags.has('--focus'))
          await page
            .locator(sel)
            .first()
            .focus()
            .catch(() => {})
      }
      await page.mouse.move(2, 2)
      await page.waitForTimeout(300)
    }

    const out = await page.evaluate(
      ({ mode, sel }) => {
        const el = sel ? document.querySelector(sel) : null
        if (mode === 'layout') {
          const rows = []
          for (const s of ['h1', 'h2', '[role="tablist"]', 'form', 'input', 'table']) {
            for (const e of [...document.querySelectorAll(s)].slice(0, 3)) {
              const r = e.getBoundingClientRect()
              rows.push(`${s} y=${Math.round(r.top + scrollY)} h=${Math.round(r.height)}`)
            }
          }
          return (
            `docH=${document.documentElement.scrollHeight} docW=${document.documentElement.scrollWidth}` +
            ` clientW=${document.documentElement.clientWidth}\n${rows.join('\n')}`
          )
        }
        if (!el) return `MISSING ${sel}`

        if (mode === 'boxes') {
          const r = el.getBoundingClientRect()
          return `w=${Math.round(r.width)} h=${Math.round(r.height)}`
        }
        if (mode === 'chain') {
          const rows = []
          for (let n = el; n && n.tagName !== 'BODY'; n = n.parentElement) {
            const s = getComputedStyle(n)
            const odd = []
            if (s.overflow !== 'visible') odd.push(`overflow=${s.overflow}`)
            if (s.position !== 'static') odd.push(`pos=${s.position}`)
            if (s.transform !== 'none') odd.push('transform')
            if (s.contain !== 'none') odd.push(`contain=${s.contain}`)
            rows.push(`${n.tagName}.${String(n.className).slice(0, 50)} | ${odd.join(' ')}`)
          }
          return rows.join('\n')
        }
        if (mode === 'css-hits') {
          const hits = []
          for (const sheet of document.styleSheets) {
            let rules
            try {
              rules = sheet.cssRules
            } catch {
              continue
            }
            const walk = (rs, layer) => {
              for (const r of rs) {
                if (r.cssRules && !r.selectorText) {
                  walk(r.cssRules, r.name ?? layer)
                  continue
                }
                if (!r.selectorText) continue
                try {
                  if (!el.matches(r.selectorText)) continue
                } catch {
                  continue
                }
                const rel =
                  r.style.borderTopWidth ||
                  r.style.border ||
                  r.style.backgroundColor ||
                  r.style.boxShadow
                if (rel)
                  hits.push(
                    `${layer ? `layer:${layer}` : 'UNLAYERED'} | ${r.selectorText.slice(0, 70)} | ${r.cssText.slice(0, 90)}`
                  )
              }
            }
            walk(rules, null)
          }
          return hits.join('\n') || '(无命中)'
        }
        /* computed：只取外观相关，免得被几十个无关属性刷屏 */
        const s = getComputedStyle(el)
        return [
          `bg=${s.backgroundColor}`,
          `color=${s.color}`,
          `border=${s.borderTopWidth} ${s.borderTopColor}`,
          `radius=${s.borderTopLeftRadius}`,
          `shadow=${s.boxShadow}`,
          `font=${s.fontSize}/${s.fontWeight}`,
          `display=${s.display}`
        ].join(' ')
      },
      { mode, sel }
    )
    console.log(`== ${scheme}\n${out}`)
    await page.context().close()
  }
} finally {
  await browser.close()
}

/* rollup: 合并自根目录的一次性探针 _con*.mjs / _spec.mjs / _dbg2..9.mjs；
 * 各处硬编码的 127.0.0.1:3100 与 /usr/bin/chromium 改为 PROBE_BASE / PLAYWRIGHT_CHROME。 */
