# Horsebean Private Server Next.js (SSG + 设计系统)

蚕豆私服 **已从 Nuxt 完整迁移** 至 Next.js 静态导出版本。界面是一套自建设计系统——没有引入任何 CSS 框架：
一套语义令牌 + 手写组件，取向是 Apple Human Interface Guidelines，外加正交的显示修饰符。
令牌在 `src/styles/tokens.css`，HIG 布局语汇在 `src/styles/hig.css`，约定见 [`docs/design-system.md`](docs/design-system.md)。

## 技术栈

- **Next.js 16**（`output: 'export'` 静态导出）
- **React 19**
- **Tailwind CSS 4**
- **Apple HIG** 单皮肤（自建令牌 + 手写组件，无 UI 框架依赖）
- **Radix UI primitives**（Checkbox / Dialog / DropdownMenu / Label / Progress / RadioGroup / Select / Separator / Slider / Slot / Switch / Tabs / Toast，只管行为与无障碍，样式全部自己写）
- **Framer Motion**、**Lucide React**、**Artalk** 等

## 开发

```bash
bun install
bun dev
```

## 设计系统

完整约定见 [`docs/design-system.md`](docs/design-system.md)（令牌三层、语义色契约、可达性钩子、校验流程）。

**令牌**（`src/styles/tokens.css`）只有两层：L0 形状/动效/尺寸阶 → L1 语义色与影。
组件只写语义名与 `--text-*` 阶，不写裸 hex 和裸 px：

- 颜色 `--hig-color-*`：`surface` / `surface-01|02` 分层、`label` 级前景、
  `separator` / `separator-01|variant|emphasis|field|active` 分隔与描边、
  `fill-hover|pressed|selected|…` 叠加层、`chip-*`、`error|success|warning|info`、
  `primary` / `on-primary` / `error-text`
- 形状 `--hig-shape-*`、影 `--hig-layer-*`、动效 `--hig-motion-*`、
  尺寸 `--hig-size-*`（控件 36–56px、输入框 44px、触达区 44px）
- 类名直写任意值：`bg-(--hig-color-surface-01)`、`text-(--hig-color-label-secondary)`、
  `border-(--hig-color-separator)`、`rounded-pill`、`shadow-raised`。没有 `--color-*`
  转发层，Tailwind 的配色命名空间是空的。**新增字号必须同时登记到
  `cn` 的 tailwind-merge 白名单**（`src/lib/utils.ts` 的 `extendTailwindMerge`），否则
  `text-body text-(--hig-color-label-secondary)` 里的字号会被当成颜色吞掉

令牌前缀是 `--hig-*`，直接标示它属于这套 HIG 系统；配色与控件表现按 HIG 走。

**布局语汇**（`src/styles/hig.css`）：列表组、缩进分隔线、指标条、内联提示这些 HIG 结构都在这里，
与 Tailwind 类配合使用；改结构前先读 `docs/design-system.md` 的对应条目。

**阅读偏好**（`src/styles/prefs.css`）：`--pref-*` 一组变量，默认给指针/下划线/纵向节奏/字阶的正常值；
要换偏好改默认值即可，不必进组件，也没有切换 UI。

**组件**（`src/components/ui/`）：button、input、textarea、checkbox、radio-group、switch、
slider、progress、select、dropdown-menu、sheet、toast、tabs、table、card、badge、
breadcrumb、separator、skeleton。状态一律用状态层叠加，不用换色。

**校验**（合并前全绿）：

```bash
bun run typecheck
bunx biome check src scripts
bun scripts/shots.mjs   # 明暗 × 1280/390 截图，顺带查溢出/抽屉/对比度
```

`scripts/shots.mjs` 的四道闸门（`overflow` / `drawerFail` / `themeFail` / `lowContrast`）必须全 0；
正文对比度按 4.5:1、大字 3:1，游戏 `§` 色码除外。截图落在 `public/_preview/`，`public/preview.html` 可整页速览；
两者都在 `.gitignore` 里，按需本地重生成，不随站上线。

## 构建与导出

```bash
bun run build
```

静态文件输出到 `out/`，部署目标是 Cloudflare Pages（`public/_worker.js` 把任何 host 301 到 `30hb.cn`，`public/_redirects` 把未知路径导去 `/404.html`）。
想让构建里带上 RSS，就别把 `bun` 之外的步骤插进 `build` 链：`build` 已经是
`next build → generate-feed → strip-preview` 三段，其中 `generate-feed` 在 build 末尾跑。

本地产物预览用 `bun run start`（`serve out`，会自动带上 `public/_headers` 里的规则），
不要用 `bun dev` 当线上行为参照 —— 开发态有 rewrites 代理 API，线上是浏览器直连。

### 合并前必查

`bun run check` = `biome check` + `tsc --noEmit` + `check:theme`（暗色两条通路要一致），
再加上 `scripts/shots.mjs` 四道闸门归零。CI（`.github/workflows/ci.yml`）在 PR 上跑同一套，
只验证不部署 —— 部署走 Cloudflare Pages 自己的 Git 集成。

### 构建全红且满屏 403

`next build` 会拉 `blog.30hb.cn` 的 WP API。如果 CI 报 `WordPress API error: 403` 且
body 是 `Just a moment...`，那是 zone 上的 **Bot Fight Mode** 在给自动化流量下发 JS 挑战
（响应头带 `cf-mitigated: challenge`），不是 UA 也不是网络。

先查再改，别改请求头：

```bash
CLOUDFLARE_ACCOUNT_ID=<account> cf bot-management get --zone 30hb.cn
cf bot-management update --zone 30hb.cn --fight-mode false
```

关掉后空 UA 也能拿到 JSON（2026-11-21 实测），`src/lib/http.ts` 里的浏览器 UA 是留给
BFM 被重新开启时的兜底。

## 目录说明

- `src/app/` — App Router：`/`（中文首页）、`/en`（英文首页）、`/commands`、`/en/commands`
- `src/components/` — 业务组件；`src/components/ui/` — 设计系统组件（手写，按 HIG 取形）
- `src/styles/tokens.css` — 设计令牌，改配色/圆角/动效只动这里
- `src/styles/hig.css` — HIG 布局语汇（列表组、分隔线、指标条、提示）
- `src/styles/prefs.css` — 阅读偏好变量（`--pref-*`）
- `scripts/shots.mjs` — 截图与可达性闸门
- `docs/design-system.md` — 设计系统约定（改样式前先读）
- `src/contexts/locale-context.tsx` — 基于 pathname 的 locale（zh/en）
- `src/locales/` — 按语言分目录（`zh/`、`en/`），每种语言再按域拆 JSON，由同目录 `index.ts` 聚合
- `src/lib/` — utils、i18n、commands-data
- `src/lib/http.ts` — 出海请求（IPv4 优先、keep-alive 复用、指数退避）
- `src/lib/theme.ts` — 主题读写与防闪内联脚本
- `scripts/responsive-images.mjs` — 预生成 WebP 宽度档（`prebuild` 自动跑）
- `scripts/check-theme-parity.mjs` — 校验暗色的两条通路值一致（`check:theme`）
- `src/hooks/use-server-stats.ts` — 服务器统计轮询
- `src/lib/utils.ts` — `cn`（clsx + tailwind-merge，含字号白名单）

## 主题

三档：跟随系统 / 浅色 / 深色，开关在顶栏。手动选定会写 `localStorage` 的 `bbps-theme`
并给 `<html>` 加 `data-theme`，`src/lib/theme.ts` 的 `THEME_SCRIPT` 在首帧前内联执行防闪烁；
选「跟随系统」会清掉这两者。

- 明暗两套令牌都在 `src/styles/tokens.css`，**每次改暗色都要写两遍**：媒体查询里的
  `:root:not([data-theme='light'])` 管跟随系统，`:root[data-theme='dark']` 管手动选，
  两份值必须相同，`bun run check:theme` 会逐条比对并在不一致时报错
- 需要在暗色下验证就换开关（`scripts/shots.mjs` 会分别用两种 `color-scheme` 截图）；
  不要在新代码里写死颜色
- 阅读偏好的 `--pref-*`（`src/styles/prefs.css`）目前没有切换 UI，改默认值即改全站，与明暗互不干扰
- 游戏原生 `§` 色码保持原色（对比度不达标是游戏本身行为）
- 名字只有一套语义（`--hig-*` 前缀），也没有 shadcn 的 `card` / `muted-foreground` 别名；
  类名一律 `x-(--hig-*)` 任意值写法
