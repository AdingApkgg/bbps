# Horsebean Private Server Next.js (SSG + Material Design 2)

蚕豆私服 **已从 Nuxt 完整迁移** 至 Next.js 静态导出版本。界面是一套自建的 
[Material Design 2](https://m2.material.io) 设计系统——没有引入任何 CSS 框架，
组件手写在 `src/components/ui/`，令牌在 `src/styles/tokens.css`。

## 技术栈

- **Next.js 16**（`output: 'export'` 静态导出）
- **React 19**
- **Tailwind CSS 4**
- **Material Design 2** 设计系统（自建：令牌 + 手写组件，无 UI 框架依赖）
- **Radix UI primitives**（Switch / Checkbox / RadioGroup / Slider / Toast / Popover / Collapsible，只管行为与无障碍，样式全部自己写）
- **Framer Motion**、**Lucide React**、**Artalk** 等

## 开发

```bash
bun install
bun dev
```

## 设计系统

**令牌**（`src/styles/tokens.css`）全部前缀 `--md-sys-*`，明暗两套：

- 颜色 `--md-sys-color-*`：`surface` / `surface-0N` 分层、`on-surface` 87→38% 四级前景、
  `outline` / `outline-emphasis` / `outline-variant` 边框、`state-hover|pressed|selected`
  叠加层、`chip-*`、`error|success|warning|info`、`primary` / `on-primary` / `error-text`
- 形状 `--md-sys-shape-*`、高度 `--md-sys-elevation-00…24`、动效 `--md-sys-motion-*`、
  尺寸 `--md-sys-size-*`（按钮 36/32/28dp、输入框 56dp、触达区 48dp）
- 接线在 `src/app/globals.css` 的 `@theme inline`：`bg-surface-01`、`text-on-surface-medium`、
  `border-outline`、`rounded-pill`、`shadow-raised`。**新增字号必须同时登记到
  `cn` 的 tailwind-merge 白名单**（`src/lib/utils.ts` 的 `extendTailwindMerge`），否则
  `text-body text-on-surface-medium` 里的字号会被当成颜色吞掉

**组件**（`src/components/ui/`）：button、input、textarea、checkbox、radio-group、switch、
slider、progress、select、dropdown-menu、sheet、toast、tabs、table、card、badge、
breadcrumb、separator、skeleton。状态一律用状态层叠加，不用换色。

**校验**（合并前全绿）：

```bash
bun run typecheck
bunx biome check src
```

再用 Playwright 跑明暗 × 1280/390 的横向溢出与对比度（正文 4.5:1，游戏 `§` 色码除外）。

## 构建与导出

```bash
bun run build
```

静态文件输出到 `out/`，可直接部署到 GitHub Pages / Netlify / Vercel。

## 目录说明

- `src/app/` — App Router：`/`（中文首页）、`/en`（英文首页）、`/commands`、`/en/commands`
- `src/components/` — 业务组件；`src/components/ui/` — 设计系统组件（手写，Material 2）
- `src/styles/tokens.css` — 设计令牌，改配色/圆角/动效只动这里
- `src/contexts/locale-context.tsx` — 基于 pathname 的 locale（zh/en）
- `src/locales/` — zh.json、en.json
- `src/lib/` — utils、i18n、commands-data
- `src/hooks/use-server-stats.ts` — 服务器统计轮询
- `src/lib/utils.ts` — `cn`（clsx + tailwind-merge，含字号白名单）

## 主题

- 明暗两套令牌都在 `src/styles/tokens.css`，暗色走 `@media (prefers-color-scheme: dark)`
  跟随系统（没有 class 切换、没有手动开关），因此要在暗色下验证就换系统的外观设置；
  不要在新代码里写死颜色
- 游戏原生 `§` 色码保持原色（对比度不达标是游戏本身行为）
- 名字只有一套 Material 语义，没有 shadcn 的 `card` / `muted-foreground` 别名
