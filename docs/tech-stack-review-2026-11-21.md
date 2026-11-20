# 技术栈审计与改进建议（2026-11-21）

审计对象：`main` @ `cfaa8071`，Next.js 16 静态导出 → Cloudflare Pages。
审计方式：全量读 `src/`（117 文件）、跑通 `typecheck`/`build`/`biome`/`check:data`、量产物体积、对线上域名做真实请求。

**基线（全部实测，先说结论：底子是好的）**

| 项目 | 结果 |
| --- | --- |
| `bun run typecheck` | exit 0 |
| `bun run build` | 成功，完整静态导出 |
| `bunx biome check src scripts` | exit 0，0 告警 |
| `bun run check:data` | exit 0，162 + 162 条一致 |
| `bun install` | 175 包，无漏洞报告 |

设计系统（`tokens.css` 354 行三层令牌 + `docs/design-system.md` 173 行契约）、`§` 色码豁免、skip link、灯箱遮罩做成独立按钮、`locale-suggest-bar` 宁可提示也不 302 —— 这些都是有判断力的写法，下面不是要推翻它们。

问题集中在**静态导出这条约束没被贯彻**：好几处按「有服务端」的习惯写的，导出后静默失效或变成体积。

---

## A. 现网缺陷：装着但没用，或者根本没装

### A1 `bun run start` 必然失败

`package.json:8` 是 `next start`。`output: 'export'` 下 Next 直接报错：

```
Error: "next start" does not work with "output: export" configuration. Use "npx serve@latest out" instead.
```

换成 `"start": "npx serve@latest out"`（或 `bunx serve out`）。现在任何人照 README 跑 `start` 都会撞墙。

### A2 全站 15 个英文页 `lang="zh-Hans"`

`src/app/en/` 下没有 `layout.tsx`，只有 15 个页面目录。实测：

```
$ grep -o 'lang="[a-zA-Z-]*"' out/en/index.html
lang="zh-Hans"
```

`out/en/**/index.html` 15 个文件**全部**是 `lang="zh-Hans"`。后果不止是读屏念错：`x-default` 指向 `/en/`，Google 抓到一整个英文站标着中文。

改法：加 `src/app/en/layout.tsx`，只覆写 `<html lang>`（`Next` 的 `lang` 走 layout，不合并）。或把 `RootLayout` 的 `<html>` 提成一个接受 `lang` 的组件，两个 layout 各传各的。这是结构性 bug，不是配置问题。

### A3 三处轮询在后台标签页照跑

```
src/hooks/use-chat.ts:11       POLL_INTERVAL = 12000
src/hooks/use-server-stats.ts:6  POLL_INTERVAL = 30000
src/hooks/use-rank.ts:6         POLL_INTERVAL = 60000
```

全仓库 `grep visibilitychange` → **0**。用户挂着标签页去看视频，`/comments` 每分钟打 5 次接口、`/stats` 每 30 秒一次，接口没有限速（`use-chat.ts:10` 注释自己写的）。挂一夜就是几千次请求。

改法：一个共用 `usePolling(fn, ms)`，内部监听 `visibilitychange`，隐藏时 `clearInterval`、可见时立即补一次再恢复。顺带把三处重复的 interval + AbortController 逻辑收成一份。

### A4 `next/image` 在 `unoptimized` 下不产 `srcset`

`next.config.ts` 有 `images: { unoptimized: true }`，实测：

```
$ grep -c srcset out/gallery/index.html
0
```

`gallery-page.tsx:90-96` 老老实实传了 `width`/`height`（还配了 skeleton + `onLoad`），但浏览器无论什么视口都只下原图。`public/assets/images/gallery/` 里 `7.avif` 1150861、`14.avif` 1149032、`8.avif` 1000010，手机首屏要吞 1MB/张，而它渲染宽度不到 400px。

改法见 B1。

### A5 `sitemap.ts` 漏了 `/music/`

`src/app/sitemap.ts:13-28` 的 `STATIC_ROUTES` 列了 14 条，实测 `out/sitemap.xml` 28 个 `<loc>`；实际路由 31 条 —— 差集正是 `/music/` 和 `/ds-lab/`。

`/music/` 是真页面（手写全量 metadata、有播放器），只是漏登记。改法：`sitemap.ts` 直接 `import` `src/lib/nav-items.ts` 的导航表，让导航、sitemap、`SitePivot` 同源，别再手抄第三份路由清单。

### A6 `lastModified` 每次构建都变

`src/app/sitemap.ts:27` `const now = new Date()`，28 条全用它。每次部署所有页面都宣称「刚刚改过」，`dailly` 之外的权重信号等于没有。

改法：`lastModified` 留空，或按路由取 git 提交时间（`git log -1 --format=%cI -- src/app/about`），`/` 单独用 `daily`。

### A7 `biome check` 会连根目录 `_*.mjs` 一起查

当前 `bun run check` exit 1（12 errors / 4 warnings），逐条都在未跟踪文件：`_con.mjs:11:23`、`_con2.mjs`、`_dbg3.mjs:12:10`、`_shot5.mjs`……`biome.json` 覆盖仓库根，谁在根上丢个探针脚本，门禁就红。

改法：探针挪进 `scripts/probe/`，或 `biome.json` 的 `files.includes` 加 `"!_[a-z0-9]*.mjs"`。

### A8 死依赖 4 个 + 文档不存在的包

`grep` 全仓库 0 引用的依赖：

- `dayjs`（`package.json:38`）
- `@radix-ui/react-collapsible`（只出现在类名 / CSS 里，从没 `import`）
- `@radix-ui/react-popover`
- `@radix-ui/react-tooltip`

另外 `next-themes` 既没装也不在 `node_modules`，主题实际是纯 CSS `@media (prefers-color-scheme: dark)`（`README.md:89` 也是这么写的）—— 但历史上按「有 next-themes」写的说明散落在几处。删 4 个依赖，全站体积能掉一截。

### A9 环境变量没有 `.env.example`

`src/lib/api.ts:12-14`、`src/lib/blog.ts:5`、`scripts/generate-feed.mjs:10` 共读 3 个 `NEXT_PUBLIC_*`（`API_BASE`、`WP_BLOG_URL`），README 一次没提。新接手的人只能翻代码。加一个 `.env.example` 三行注释上默认值。

---

## B. 体积：38M 产物里的浪费

`out/` 38M，`_next` 的 JS 合计 1542603（gzip 481411），`out/blog/index.html` 单页 1168419（gzip 154959）。

### B1 建一个构建期图片管线（sharp 已经在 devDependencies 里）

`images.unoptimized: true` 是必须的，但没人说图片只能有一种尺寸。`sharp` 已在 `package.json:57`，`src/lib/gallery.ts:16` 也已经用它读 metadata 了 —— 只在构建期，不进客户端。

做法：`scripts/responsive-images.mjs` 在 `prebuild` 里跑，对 `public/assets/images/**` 按 `[400, 800, 1600]` 出多档，产出 `img.srcset` 用的三行，再把 `src`/`srcSet`/`sizes` 直接传给 `next/image`（unoptimized 下它会把 `srcSet` 原样输出）。

顺带说清一条**已验证的死路**：

```
$ curl "https://30hb.cn/cdn-cgi/image/width=600,format=avif/.../hero.avif"
HTTP 415  ERROR 9520: Original image has unsupported format
$ curl "https://30hb.cn/cdn-cgi/image/width=400/blog/hb-boom-beach-changelog.png"
HTTP 200  78376（原 2046945）
$ curl "https://30hb.cn/cdn-cgi/image/width=300,format=auto/blog/setup-clash-of-clans.jpg"
HTTP 200  17495
```

即：**Cloudflare Images 变换不吃 AVIF 源**，但吃 PNG/JPG。而站内英雄图与 15 张画廊图全是 AVIF（全库共 28 个 `.avif`，其余在 `public/assets/images/game/`）—— 所以「挂 `/cdn-cgi/image/` 就行」对画廊无效，必须走构建期 sharp。反过来，三张 1.4–2.0M 的 `public/blog/*.png`（`hb-boom-beach-changelog.png` 2046945、`setup-clash-royale.png` 1489645、`setup-boom-beach.png` 1400223）可以立刻用 CDN 变换压到 78K 量级，或者干脆转 WebP 入仓。

### B2 博客列表页把 20 篇文章的渲染 HTML 全烤进首屏

`out/blog/index.html` 1168419 字节、154959 gzip，里面 8751 个 `\u003c`、24 处 `wp:featuredmedia`、160 处 `rendered`。`blog-list.tsx:66-99` 只用 `stripHtml(post.excerpt)` 显示摘要，可 `fetchBlogPosts` 返回的是整包 WP 对象，`_embedded` 里的 featuredmedia 全量序列化进了 RSC flight。

改法：`src/lib/blog.ts` 加 `mapWpPost()`，出站前只留 `id/slug/title/excerpt/date/link/封面 url`，列表页 payload 能砍掉一半以上；正文页 `perPage: 20` 改成按需。

### B3 轮询首屏量

`use-chat.ts:6` `INITIAL_LIMIT = 500`，注释自认「实测约 90KB」。`/comments` 一进就是 90KB JSON（未压缩在客户端解）。降到 200 先渲染，滚动/「加载更多」再补；或让服务端开 `?since=<seq>`。

### B4 `public/_preview/` 2.7M 跟着上线

`_preview/` 23 个 png 共 2.7M，`preview.html` 一起进 `out/`。截图是合并前审阅用的，线上没人看，但每次部署都在 R2/Pages 里存一份新的。

改法：`prebuild` 里 `git rm --cached` 那套太啰嗦，直接让 `shots.mjs` 输出的路径落到 `out/_preview`（`out` 本来就重新生成），或部署步骤加一步 `rm -rf out/_preview out/preview.html`。

### B5 两张一模一样的 490K PNG

`md5sum public/og-logo.png public/icon-512.png` 同一个值，各 489940。图标那位应该走 `generate-icons.mjs` 出正确尺寸的 512，现在是把 OG 图复制了一份。

### B6 framer-motion 121K，没有一处 `LazyMotion`

`grep -rn "LazyMotion\|domAnimation" src` → 0。`motion.tsx` 及 4 个直接用 `framer-motion` 的组件（`hero-section`、`intro-tabs`、`music-player-bar`、`music-page`）全部同步引入 `motion`，于是全量打进 `chunks/30ay-53-6wxwq.js`（121651）。

站点只有淡入 + 抽屉 + 播放条三种动效，用 `LazyMotion features={domAnimation}` + `m.div` 足够。`src/components/motion.tsx:1-46` 的 `DURATION_*`/`EASE_*` 常量照旧，只把 `motion` 换成 `m`。预计砍 60–80K。

---

## C. 安全头与可观测性

### C1 没有任何 CSP / 框架头

`public/_headers` 只有三段：HSTS、`/_next/static/*` immutable、`/sw.js` no-store。实测线上响应头有 `x-content-type-options: nosniff`、`access-control-allow-origin: *`，其余全无 —— 没有 `Content-Security-Policy`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`。

站点会 `fetch` `webapi.30hb.cn`、加载 `blog.30hb.cn` 的图、`r2.30hb.cn` 的 APK、Artalk 评论面板，被嵌站的风险是实打实的（钱包/登录页一起被套）。加一组：

```
/*
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://blog.30hb.cn https://*.30hb.cn; script-src 'self' 'unsafe-inline' https://blog.30hb.cn; connect-src 'self' https://webapi.30hb.cn https://*.30hb.cn; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'
```

Next 的 inline bootstrap 需要 `'unsafe-inline'`（没有 nonce 通道，静态导出下 nonce 除非走 worker）。先上，再按 CSP report-only 收紧。

### C2 没有 `error.tsx` / `global-error.tsx`

`src/app/` 有 `not-found.tsx`，但 `error.tsx`、`global-error.tsx`、`loading.tsx` 一个没有。任一客户端组件抛错，用户看到 Next 的默认黑屏「Application error」。静态导出下路由级 `error.tsx` 仍然有效（它就是客户端边界）。

### C3 没有任何测试，也没有 CI

`find . -name "*.test.*" -o -name "*.spec.*"` → 0；无 `.github/workflows`。`bun.lock`（101495 字节）还在 `.gitignore:16-17` 里被忽略 —— 无锁、无 CI、无测试，全靠本地自觉。

优先级排：先加 `.github/workflows/ci.yml`（`bun install --frozen-lockfile` → typecheck → biome → build），并把 `bun.lock` 纳入版本库。测试只需先覆盖 `sortPosts` 的稳定性、`stripHtml`、`lib/i18n` 的字典完整性。

---

## D. 数据可信度

### D1 `api.ts` 4 处 `as` 断言，接口返回全裸

```
src/lib/api.ts:125   return (await res.json()) as T
src/lib/api.ts:202   const data = (json?.body ?? json) as ServerStatusBody
src/lib/api.ts:233   const data = (json?.body ?? json) as GlobalStatistics
src/lib/api.ts:281   const data = (json?.body ?? json) as PlayerBase
```

游戏服务端是自己的，改字段时前端不会报错，只会在运行时空指针（`stats` 页读 `data.onlinePlayers` 直接炸）。`zod` 没装。

改法：这 4 个响应各写一个 `z.object`，`safeParse` 失败时返回 `null` + `console.warn`，页面渲染「数据暂不可用」而不是崩。装 `zod`（约 12K gzip，仅这几页用到）。

### D2 静态导出下 `revalidate` 是空转

`src/lib/blog.ts:62` `next: { revalidate: 600 }`、`src/app/blog/page.tsx:7` 与 `src/app/en/blog/page.tsx:7` 的 `export const revalidate = 600`。导出后没有 ISR，10 分钟重新验证永远不会发生 —— blog 内容停在构建那一刻。

不是 bug 而是误解：要么接受「内容靠重新部署」，删掉这三行免得误导；要么加一个定时 GitHub Action 每天 `repository_dispatch` 重新构建。

### D3 构建期的博客抓取吃过一次 0 条

首次 `bun run build` 打了 `[feed] Failed to fetch posts: fetch failed`，`out/feed.xml` 0 个 `<item>`；后一次 20 条。构建机不挂代理时 WordPress 就抓不到，而 `src/app/blog/page.tsx:19` 的注释保证「拉取失败必须让构建失败」—— 但 feed 那步没保证。

改法：`scripts/generate-feed.mjs` 抓到 0 条时 `process.exit(1)`；构建环境统一导 `HTTPS_PROXY`。

---

## E. 结构性重复

### E1 31 个文件各抄一份 `alternates`

`grep -rln "alternates" src/app | wc -l` → 31。每条都是手写的 zh/en/x-default 三行 + canonical + openGraph，内容几乎一致。

另外 `src/app/layout.tsx:70-77` 的 `en` / `x-default` 写成 `${SITE_URL}/en`（无尾斜杠），其余 30 处都是 `/en/xxx/`，与 `trailingSlash: true` 不符（产物里 Next 补了斜杠，但源码三层不一致）。

改法：`src/lib/metadata.ts` 一个 `pageMeta({ path, title, desc, locale })`，返回整份 `Metadata`，canonical/languages/openGraph 全在里面算。31 个文件各减 10 行，`lang` 也顺手在 A2 里一起收。

### E2 检查了 `aria-live`，没做手动主题开关

全库 `grep aria-live` 命中 0（`remote-console.tsx:118`、`ui/alert.tsx:29`、`ui/field.tsx:215` 用 `role="status"/"alert"`，`toast.tsx:14` 用 Radix 自带 live region）—— 这部分是对的。缺的是主题：只有跟随系统，没有手动切（`README.md:89` 明说「没有 class 切换、没有手动开关」）。系统是浅色而用户想要深色时无解。加一个 `data-theme` 覆盖层（`tokens.css` 的暗色块复制一份到 `[data-theme='dark']`），三档：跟随/浅/深，存 localStorage，写入前用 inline script 防闪。

### E3 `ds-lab` 是一次性页面

`src/app/ds-lab/page.tsx` 自注「只验证『拉进来就能渲染』，用完可删」，占一个路由、进不了 sitemap。要么删，要么补一句用途进 README 并加进 sitemap。

---

## 建议的落地顺序

1. **今天就能合**：A1 `start` 脚本、A9 `.env.example`、A7 biome 排除根目录探针、A8 删 4 个死依赖、B5 拆分 icon。
2. **本周**：A3 统一 `usePolling`、A5+A6 sitemap、C1 安全头、C2 `error.tsx`。
3. **需要点设计**：A2 `/en` layout、E1 `pageMeta()` helper、B2 博客 payload 瘦身、D1 zod 校验。
4. **有独立价值、可排期**：B1 构建期图片管线、B6 `LazyMotion`、C3 CI + 锁文件、E2 主题开关。

依赖升级方面：`typescript` 已升到 7.0.2（干净、typecheck 0.3s，5.9 是 2.5s）；`framer-motion` 13.5.1 → `motion` 14.14.0 官方升级指南明写「14 没有破坏性变更」，只把 import 从 `framer-motion` 换到 `motion/react`，可随 B6 一起做。其余依赖（next 16.4.6、react 19.3.1、tailwind 4.3.5、lucide 1.73.0、artalk 2.10.1）已都在 npm `latest`。
