# BBPS Next.js (SSG + shadcn/ui)

蚕豆私服 **已从 Nuxt 完整迁移** 至 Next.js 静态导出版本，使用 [shadcn/ui](https://ui.shadcn.com) 组件库。

## 技术栈

- **Next.js 16**（`output: 'export'` 静态导出）
- **React 19**
- **Tailwind CSS 4**
- **shadcn/ui**（New York 风格，RSC）
- **Framer Motion**、**Lucide React**、**next-themes**、**Waline** 等

## 开发

```bash
pnpm install
pnpm dev
```

## 添加 shadcn 组件

按需添加组件（会写入 `src/components/ui/`）：

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add tooltip
```

或一次添加多个：

```bash
npx shadcn@latest add button card tabs dialog select tooltip badge
```

## 构建与导出

```bash
pnpm build
```

静态文件输出到 `out/`，可直接部署到 GitHub Pages / Netlify / Vercel。

## 目录说明

- `src/app/` — App Router：`/`（中文首页）、`/en`（英文首页）、`/commands`、`/en/commands`
- `src/components/` — 业务组件（Navbar、Footer、Hero、CTA、Maps、Creative、ServerStats、Comments、CommandsPage）；`src/components/ui/` — shadcn 组件（按需添加）
- `src/contexts/locale-context.tsx` — 基于 pathname 的 locale（zh/en）
- `src/locales/` — zh.json、en.json
- `src/lib/` — utils、i18n、commands-data
- `src/hooks/use-server-stats.ts` — 服务器统计轮询
- `components.json` — shadcn CLI 配置

## 主题

- 游戏色板：`tailwind.config.ts` 中 `theme.extend.colors.bb`
- 明暗主题变量：`src/app/globals.css` 中 `:root` / `.dark`
