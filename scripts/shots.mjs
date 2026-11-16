#!/usr/bin/env node
/* 皮肤截图 + 预览页生成
 *
 * 目标：一次跑完「四皮肤 × 明暗 × 宽窄 × 关键状态」的截图，并重写 public/preview.html
 * 对照页（两者都不入库，需要时本地重跑）。
 *
 * 用法（在构建机上）：
 *   SHOT_BASE=http://localhost:3100 PLAYWRIGHT_WS=ws://localhost:3000 bun scripts/shots.mjs
 * PLAYWRIGHT_WS 指向一个已启动的 playwright server；不设则本地 chromium 启动。
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

/* 仓库不装 playwright（只用于截图）：先试本地 node_modules，再退到 pi 的 MCP 运行时。 */
const { chromium } = await (async () => {
  for (const spec of [
    'playwright',
    '/home/i/.pi/agent/mcp-runtime/node_modules/playwright/index.mjs'
  ]) {
    try {
      return await import(spec)
    } catch {}
  }
  throw new Error('找不到 playwright：npm i -D playwright 或设 PLAYWRIGHT_PATH')
})()
const CHROME = process.env.PLAYWRIGHT_CHROME ?? '/usr/bin/chromium'

const BASE = process.env.SHOT_BASE ?? 'http://localhost:3100'
const OUT = 'public/_preview'
const SKINS = [
  { id: '', label: '默认（Apple HIG）' },
  { id: 'm2', label: 'Material 2' },
  { id: 'carbon', label: 'Carbon' },
  { id: 'fluent', label: 'Fluent' }
]
const DESKTOP = { width: 1280, height: 1000 }
const PHONE = { width: 390, height: 844 }

/* 每项：路径、标题、视口、可选的前置操作（先点开抽屉 / 选一首歌等） */
const SHOTS = [
  { path: '/', title: '首页', vp: DESKTOP },
  { path: '/commands', title: '指令 · 复选框与表单', vp: DESKTOP },
  { path: '/maps', title: '地图 · 下拉选择', vp: DESKTOP },
  { path: '/stats', title: '状态 · 开关', vp: DESKTOP },
  { path: '/', title: '手机首页', vp: PHONE },
  { path: '/', title: '手机 · 抽屉打开', vp: PHONE, act: 'drawer' },
  { path: '/', title: '手机 · 直接打开菜单', vp: PHONE },
  { path: '/', title: '顶栏 · 皮肤菜单', vp: DESKTOP, act: 'appearance' }
]
const STATES = [
  { id: 'light', label: '亮色', scheme: 'light' },
  { id: 'dark', label: '暗色', scheme: 'dark' }
]

const slug = (s) =>
  s
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

async function openAppearance(page) {
  const btn = page.locator('header [aria-label="切换皮肤与样式"]')
  if (await btn.count()) {
    await btn.first().click()
    await page.waitForTimeout(400)
    return true
  }
  return false
}

async function openDrawer(page) {
  const btn = page.locator('[data-menu]')
  if (await btn.count()) {
    await btn.first().click()
    await page.waitForTimeout(500)
    return true
  }
  return false
}

async function contrastAudit(page) {
  return page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/)
      if (!m) return null
      const p = m[1].split(',').map((v) => parseFloat(v))
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
    }
    /* fg 叠在 bg 上：bg 是下层、必须已经合成到不透明才能得到真实颜色 */
    const over = (fg, bg) => {
      const a = fg.a + bg.a * (1 - fg.a)
      return {
        r: fg.r * fg.a + bg.r * bg.a * (1 - fg.a),
        g: fg.g * fg.a + bg.g * bg.a * (1 - fg.a),
        b: fg.b * fg.a + bg.b * bg.a * (1 - fg.a),
        a
      }
    }
    const lum = ({ r, g, b }) => {
      const ch = (v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)
    }
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
      return (x + 0.05) / (y + 0.05)
    }
    /* 背景取最近的不透明祖先；碰到背景图就放弃该元素（渐变/图片算不准） */
    const bgOf = (el) => {
      let acc = { r: 255, g: 255, b: 255, a: 0 }
      for (let n = el; n; n = n.parentElement) {
        const s = getComputedStyle(n)
        if (s.backgroundImage !== 'none' && n !== el) return null
        const c = parse(s.backgroundColor)
        if (!c || c.a === 0) continue
        acc = over(acc, c)
        if (acc.a >= 1) return acc
      }
      const root = parse(getComputedStyle(document.documentElement).backgroundColor)
      return root && root.a >= 1 ? over(acc, root) : acc.a >= 1 ? acc : null
    }

    const bad = []
    let checked = 0
    for (const el of document.querySelectorAll('body *')) {
      const own = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1
      )
      if (!own) continue
      const rect = el.getBoundingClientRect()
      if (rect.width < 4 || rect.height < 4) continue
      const st = getComputedStyle(el)
      if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity === 0) continue
      const bg = bgOf(el)
      if (!bg) continue
      const fgRaw = parse(st.color)
      if (!fgRaw) continue
      const fg = over(fgRaw, bg)
      checked++
      const size = parseFloat(st.fontSize)
      const bold = +st.fontWeight >= 700
      const large = size >= 24 || (size >= 18.66 && bold)
      const min = large ? 3 : 4.5
      const r = ratio(fg, bg)
      if (r < min - 0.02) {
        bad.push({
          sel: el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(' ')[0]}` : ''),
          text: el.textContent.trim().slice(0, 18),
          r: Math.round(r * 100) / 100,
          min,
          size
        })
      }
    }
    bad.sort((a, b) => a.r - b.r)
    return { checked, violations: bad.length, worst: bad.slice(0, 8) }
  })
}

async function main() {
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const browser = process.env.PLAYWRIGHT_WS
    ? await chromium.connect(process.env.PLAYWRIGHT_WS)
    : await chromium.launch({ executablePath: CHROME })
  const ctx = await browser.newContext({ deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  page.setDefaultTimeout(90_000)

  const captured = []
  for (const shot of SHOTS) {
    for (const state of STATES) {
      for (const skin of SKINS) {
        await page.setViewportSize(shot.vp)
        await page.emulateMedia({ colorScheme: state.scheme })
        await page.goto(BASE + shot.path, { waitUntil: 'commit' })
        await page.evaluate((s) => {
          if (s) localStorage.setItem('bbps-skin', s)
          else localStorage.removeItem('bbps-skin')
        }, skin.id)
        await page.reload({ waitUntil: 'commit' })
        await page.waitForTimeout(2500)

        let opened = false
        let appearance = false
        if (shot.act === 'drawer') opened = await openDrawer(page)
        if (shot.act === 'appearance') appearance = await openAppearance(page)
        await page.evaluate(async () => {
          await document.fonts.ready
        })
        await page.mouse.move(2, 2)
        await page.waitForTimeout(150)

        const file = `${slug(`${skin.id || 'default'}-${state.id}-${shot.title}`)}.jpg`
        const abs = path.join(OUT, file)
        await page.screenshot({ path: abs, type: 'jpeg', quality: 82 })
        const contrast = await contrastAudit(page)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
        captured.push({ ...shot, state, skin, file, overflow, opened, appearance, contrast })
        process.stderr.write(
          `▸ ${file} overflow=${overflow} contrast=${contrast.violations}/${contrast.checked}` +
            `${opened || appearance ? ' ' : ''}\n`
        )
      }
    }
  }

  const section = (title, filter) => {
    const rows = captured.filter(filter)
    if (rows.length === 0) return ''
    return `<section><h2>${title}</h2><div class="row">${rows
      .map(
        (r) =>
          `<figure class="${r.vp === PHONE ? 'mobile' : ''}"><figcaption>${r.skin.label}</figcaption><a href="/_preview/${r.file}" target="_blank"><img src="/_preview/${r.file}" alt="${r.title} ${r.skin.label}" loading="lazy"></a></figure>`
      )
      .join('')}</div></section>`
  }

  const pages = [...new Set(SHOTS.map((s) => s.title))]
  const html = `<!doctype html>
<meta charset="utf-8">
<title>皮肤对照预览</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #111; color: #eee; font: 14px/1.6 system-ui, "PingFang SC", sans-serif; }
  header { padding: 20px 24px; border-bottom: 1px solid #333; }
  h1 { margin: 0 0 6px; font-size: 18px; }
  p.hint { margin: 0; color: #999; }
  section { padding: 20px 24px; border-bottom: 1px solid #222; }
  h2 { font-size: 15px; margin: 0 0 12px; color: #fff; }
  .row { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
  figure { margin: 0; background: #1b1b1b; border: 1px solid #2c2c2c; border-radius: 8px; padding: 8px; }
  figcaption { font-size: 12px; color: #9a9a9a; margin-bottom: 6px; }
  img { display: block; border-radius: 4px; height: 520px; width: auto; }
  .mobile img { height: 520px; width: 240px; object-fit: cover; object-position: top; }
  a { color: #6cb6ff; }
</style>
<header>
  <h1>设计系统皮肤对照</h1>
  <p class="hint">由 <code>scripts/shots.mjs</code> 生成（${captured.length} 张）。默认皮肤是 Apple HIG，站点顶栏调色板可实时切换皮肤与修饰符（窄屏在抽屉底部）。</p>
</header>
${pages
  .map((p) =>
    ['亮色', '暗色']
      .map((label, i) =>
        section(`${p} · ${label}`, (r) => r.title === p && r.state.id === STATES[i].id)
      )
      .join('')
  )
  .join('\n')}
`
  await writeFile('public/preview.html', html)

  const over = captured.filter((r) => r.overflow > 0)
  const bad = captured.filter(
    (r) => (r.act === 'drawer' && !r.opened) || (r.act === 'appearance' && !r.appearance)
  )
  const lowContrast = captured.filter((r) => r.contrast.violations > 0)
  console.log(
    `shots=${captured.length} overflow=${over.length} drawerFail=${bad.length} lowContrast=${lowContrast.length}`
  )
  for (const r of over) console.log(` OVERFLOW ${r.file} ${r.overflow}px`)
  for (const r of bad) console.log(` NO-DRAWER ${r.file}`)
  for (const r of lowContrast) {
    console.log(` CONTRAST ${r.file} ${r.contrast.violations}/${r.contrast.checked}`)
    for (const w of r.contrast.worst)
      console.log(`   ${w.r}:1 (需 ${w.min}) ${w.size}px ${w.sel} 「${w.text}」`)
  }

  await browser.close()
}

await main()
