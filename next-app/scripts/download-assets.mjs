#!/usr/bin/env node
/**
 * 从 Supercell Fan Kit 拉取 Boom Beach 游戏素材到 public/assets/images/game/
 * 源: https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets?
 *
 * 优先使用 scripts/fankit-urls.json（从上述页面复制 20 条图片/show 链接，顺序对应
 * commander, hammerman, island, map-1..13, creative-1..4）；若无则尝试抓取 Fan Kit 页；
 * 否则回退到 Fandom 维基。
 * 运行: pnpm run download-assets
 */
import { mkdir, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'images', 'game')
const FANKIT_URL = 'https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets?'

const OUTPUT_FILES = [
  'commander.png',
  'hammerman.png',
  'island.png',
  ...Array.from({ length: 13 }, (_, i) => `map-${i + 1}.png`),
  ...Array.from({ length: 4 }, (_, i) => `creative-${i + 1}.png`)
]

async function downloadUrl(url) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

/** 尝试从 Fan Kit 页面 HTML 中解析出 /show/ 或图片 URL */
function parseFankitUrls(html, baseUrl) {
  const urls = []
  const showRegex = /(?:href|src)="([^"]*\/d\/pZyVfhcaMuFD[^"]*\/show\/[^"]+)"/g
  const imgRegex = /(?:href|src)="(https:\/\/[^"]*fankit\.supercell\.com[^"]*\.(?:png|jpg|jpeg|webp))"/gi
  let m
  while ((m = showRegex.exec(html)) !== null) {
    const u = m[1].startsWith('http') ? m[1] : new URL(m[1], baseUrl).href
    if (!urls.includes(u)) urls.push(u)
  }
  while ((m = imgRegex.exec(html)) !== null) {
    if (!urls.includes(m[1])) urls.push(m[1])
  }
  return urls
}

/** 从 Fan Kit 的 show 页面或直链取图 */
async function fetchImageFromUrl(url) {
  const res = await fetch(url, { redirect: 'follow' })
  const contentType = res.headers.get('content-type') || ''
  if (contentType.startsWith('image/')) {
    return Buffer.from(await res.arrayBuffer())
  }
  const html = await res.text()
  const imgMatch = html.match(/<img[^>]+src="(https:\/\/[^"]+)"/) ||
    html.match(/src="(https:\/\/[^"]*fankit[^"]*\.(?:png|jpg|jpeg|webp))"/i)
  if (imgMatch) {
    const buf = await downloadUrl(imgMatch[1])
    return buf
  }
  throw new Error('no image in response')
}

async function tryFankit() {
  const res = await fetch(FANKIT_URL, {
    redirect: 'follow',
    headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
  })
  const html = await res.text()
  const urls = parseFankitUrls(html, FANKIT_URL)
  if (urls.length < OUTPUT_FILES.length) return null
  return urls.slice(0, OUTPUT_FILES.length)
}

async function loadFankitUrlsFromFile() {
  try {
    const path = join(__dirname, 'fankit-urls.json')
    const { readFile } = await import('fs/promises')
    const raw = await readFile(path, 'utf8')
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length >= OUTPUT_FILES.length) {
      return arr.filter((u) => typeof u === 'string' && u.includes('fankit')).slice(0, OUTPUT_FILES.length)
    }
  } catch {
    // no file or invalid
  }
  return null
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  let urls = await loadFankitUrlsFromFile()
  if (urls) {
    console.log('Using Fan Kit URLs from scripts/fankit-urls.json')
  }
  if (!urls) {
    try {
      console.log('Trying Fan Kit page...')
      urls = await tryFankit()
    } catch (e) {
      console.log('Fan Kit fetch failed:', e.message)
    }
  }

  if (urls && urls.length >= OUTPUT_FILES.length) {
    console.log(`Found ${urls.length} assets from Fan Kit.`)
    for (let i = 0; i < OUTPUT_FILES.length; i++) {
      const file = OUTPUT_FILES[i]
      process.stdout.write(`Downloading ${file} ... `)
      try {
        const buf = await fetchImageFromUrl(urls[i])
        await writeFile(join(OUT_DIR, file), buf)
        console.log('ok')
      } catch (e) {
        console.log('fail:', e.message)
      }
    }
  } else {
    console.log('No assets from Fan Kit. Using Fandom wiki as source.')
    await downloadFallback()
  }

  console.log('Done. Assets in', OUT_DIR)
}

// ---------- Fallback: Fandom 维基 ----------
const WIKI = 'https://static.wikia.nocookie.net/boombeach/images'
const WIKI_V2 = 'https://vignette2.wikia.nocookie.net/boombeach/images'
const WIKI_V3 = 'https://vignette3.wikia.nocookie.net/boombeach/images'
const WIKI_V4 = 'https://vignette4.wikia.nocookie.net/boombeach/images'
const WIKI_V1 = 'https://vignette1.wikia.nocookie.net/boombeach/images'
const rev = (path, cb) => `${path}/revision/latest?cb=${cb}`

const ARCHIPELAGO_MAP = rev(`${WIKI}/5/50/Archipelago_Map.PNG`, '20150704000801')
const BOSS_BASES = [
  rev(`${WIKI_V2}/e/ef/Boss_Base_1.png`, '20161125192755'),
  rev(`${WIKI_V2}/8/80/Boss_Base_2.png`, '20161125192755'),
  rev(`${WIKI_V2}/f/f7/Boss_Base_3.png`, '20161125192756'),
  rev(`${WIKI_V4}/b/b2/Boss_Base_4.png`, '20161125192757'),
  rev(`${WIKI_V3}/f/fa/Boss_Base_5.png`, '20161125192757'),
  rev(`${WIKI_V4}/f/f7/Boss_Base_6.png`, '20161125192758'),
  rev(`${WIKI_V1}/9/93/Boss_Base_7.png`, '20161125192758'),
  rev(`${WIKI_V4}/2/28/Boss_Base_8.png`, '20161125192758')
]
const MAP_SLOTS = [...BOSS_BASES, BOSS_BASES[0], BOSS_BASES[1], BOSS_BASES[2], BOSS_BASES[3], BOSS_BASES[4]]
const FALLBACK_TASKS = [
  { url: ARCHIPELAGO_MAP, file: 'commander.png' },
  { url: BOSS_BASES[0], file: 'hammerman.png' },
  { url: BOSS_BASES[1], file: 'island.png' },
  ...MAP_SLOTS.map((url, i) => ({ url, file: `map-${i + 1}.png` })),
  ...BOSS_BASES.slice(0, 4).map((url, i) => ({ url, file: `creative-${i + 1}.png` }))
]

async function downloadFallback() {
  for (const { url, file } of FALLBACK_TASKS) {
    process.stdout.write(`Downloading ${file} ... `)
    try {
      const buf = await downloadUrl(url)
      await writeFile(join(OUT_DIR, file), buf)
      console.log('ok')
    } catch (e) {
      console.log('fail:', e.message)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
