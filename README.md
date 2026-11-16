# Horsebean Private Server Next.js (SSG + 设计系统)

蚕豆私服 **已从 Nuxt 完整迁移** 至 Next.js 静态导出版本。界面是一套自建设计系统——没有引入任何 CSS 框架：
一套语义令牌 + 手写组件，外加四套**皮肤**（Apple HIG 默认、M2、Carbon、Fluent 2）与正交的显示修饰符。
令牌在 `src/styles/tokens.css`，皮肤在 `src/styles/skins/`，约定见 [`docs/design-system.md`](docs/design-system.md)。

## 技术栈

- **Next.js 16**（`output: 'export'` 静态导出）
- **React 19**
- **Tailwind CSS 4**
- **Apple HIG** 默认皮肤（自建令牌 + 手写组件，无 UI 框架依赖）
- **Radix UI primitives**（Switch / Checkbox / RadioGroup / Slider / Toast / Popover / Collapsible，只管行为与无障碍，样式全部自己写）
- **Framer Motion**、**Lucide React**、**Artalk** 等

## 开发

```bash
bun install
bun dev
```

## 设计系统

完整约定见 [`docs/design-system.md`](docs/design-system.md)（令牌三层、语义色契约、皮肤边界、可达性钩子、校验流程）。

**令牌**（`src/styles/tokens.css`）分三层：`--md-ref-*` 原子色板、排版/间距/圆角/动效阶→ `--md-sys-*` 语义层（明暗两套）
→ 组件内的 Tailwind 别名。组件只写语义名与 `--text-*` 阶，不写裸 hex 和裸 px：

- 颜色 `--md-sys-color-*`：`surface` / `surface-0N` 分层、`on-surface` 87→38% 四级前景、
  `outline` / `outline-emphasis` / `outline-variant` 边框、`state-hover|pressed|selected`
  叠加层、`chip-*`、`error|success|warning|info`、`primary` / `on-primary` / `error-text`
- 形状 `--md-sys-shape-*`、高度 `--md-sys-elevation-00…24`、动效 `--md-sys-motion-*`、
  尺寸 `--md-sys-size-*`（按钮 36/32/28dp、输入框 56dp、触达区 48dp）
- 接线在 `src/app/globals.css` 的 `@theme inline`：`bg-surface-01`、`text-on-surface-medium`、
  `border-outline`、`rounded-pill`、`shadow-raised`。**新增字号必须同时登记到
  `cn` 的 tailwind-merge 白名单**（`src/lib/utils.ts` 的 `extendTailwindMerge`），否则
  `text-body text-on-surface-medium` 里的字号会被当成颜色吞掉

token 名沿用 M2 的 `--md-sys-*` 词汇（迁移存量，不为改名重写组件），默认皮肤是 Apple HIG。

**皮肤**（`src/styles/skins/`）：apple（HIG 系统蓝/材质/44px 触达，默认）、carbon（IBM Carbon 的零圆角/层阶/2px 焦点环）、
fluent（Fluent 2 亚克力/8px 偏移）与 m2（Material 2 原貌）。皮肤只改形状、层级、密度与状态表现，不改 DOM 与文案；
顶栏调色板按钮（窄屏在抽屉底部）写入 `localStorage` 的 `bbps-skin`，`<html data-skin>` 生效。

**修饰符**（`src/styles/modifiers.css`）：`data-style` 的 `pointer`（加大指针目标）、`underline`（链接下划线）、
`compact`（紧凑密度）、`text-xl`（放大正文），与皮肤可任意组合。

**组件**（`src/components/ui/`）：button、input、textarea、checkbox、radio-group、switch、
slider、progress、select、dropdown-menu、sheet、toast、tabs、table、card、badge、
breadcrumb、separator、skeleton。状态一律用状态层叠加，不用换色。

**校验**（合并前全绿）：

```bash
bun run typecheck
bunx biome check src scripts
bun scripts/shots.mjs   # 四皮肤 × 明暗 × 1280/390 截图，顺带查溢出/抽屉/对比度
```

`scripts/shots.mjs` 的三道闸门（`overflow` / `drawerFail` / `lowContrast`）必须全 0；
正文对比度按 4.5:1、大字 3:1，游戏 `§` 色码除外。截图落在 `public/_preview/`，`public/preview.html` 可整页速览；
两者都在 `.gitignore` 里，按需本地重生成，不随站上线。

## 构建与导出

```bash
bun run build
```

静态文件输出到 `out/`，可直接部署到 GitHub Pages / Netlify / Vercel。

## 目录说明

- `src/app/` — App Router：`/`（中文首页）、`/en`（英文首页）、`/commands`、`/en/commands`
- `src/components/` — 业务组件；`src/components/ui/` — 设计系统组件（手写，Material 2）
- `src/styles/tokens.css` — 设计令牌，改配色/圆角/动效只动这里
- `src/styles/skins/` — 四套皮肤（m2 默认在 tokens + globals，其余各占一个文件）
- `src/styles/modifiers.css` — 与皮肤正交的显示修饰符
- `scripts/shots.mjs` — 多皮肤截图与可达性闸门
- `docs/design-system.md` — 设计系统约定（改样式前先读）
- `src/contexts/locale-context.tsx` — 基于 pathname 的 locale（zh/en）
- `src/locales/` — zh.json、en.json
- `src/lib/` — utils、i18n、commands-data
- `src/hooks/use-server-stats.ts` — 服务器统计轮询
- `src/lib/utils.ts` — `cn`（clsx + tailwind-merge，含字号白名单）

## 主题

- 明暗两套令牌都在 `src/styles/tokens.css`，暗色走 `@media (prefers-color-scheme: dark)`
  跟随系统（没有 class 切换、没有手动开关），因此要在暗色下验证就换系统的外观设置；
  不要在新代码里写死颜色
- 皮肤切换是显式的（顶栏调色板 / `bbps-skin`），与系统明暗互不干扰
- 游戏原生 `§` 色码保持原色（对比度不达标是游戏本身行为）
- 名字只有一套语义（`--md-sys-*`），没有 shadcn 的 `card` / `muted-foreground` 别名；
  `--md-sys-*` 是历史前缀，M2 现在只是默认皮肤，不是唯一源
