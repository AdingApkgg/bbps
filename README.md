# 蚕豆私服 (BBPS) - Boom Beach Private Server

基于 Vue 3 + Nuxt 3 + SCSS 构建的现代化私服网站，采用游戏风格的 UI/UX 设计。

## ✨ 特性

- 🎮 **游戏风格设计** - 仿照 Boom Beach 热带军事主题
- 🌐 **国际化支持** - 中文/英文双语
- 📱 **响应式布局** - 完美支持移动端
- ⚡ **实时数据** - 自动刷新服务器状态和在线玩家
- 💬 **评论系统** - 集成 Waline 评论
- 🎨 **SCSS 模块化** - 易于定制和维护

## 🚀 快速开始

### 安装依赖

本项目使用 **pnpm** 包管理器（更快、更高效）。

```bash
# 首次需要安装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

查看 `PNPM_GUIDE.md` 了解更多关于 pnpm 的信息。

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 生成静态站点（SSG）

```bash
# 生成完全静态的站点
pnpm generate

# 预览生成的静态站点
pnpm serve
```

项目已完全配置为 SSG 模式，详见 `SSG_GUIDE.md`。

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
bbps/
├── assets/
│   └── styles/
│       ├── _variables.sass    # SASS 变量（颜色、字体等）
│       └── main.sass           # 全局样式
├── components/
│   ├── TheNavbar.vue          # 导航栏组件
│   ├── TheFooter.vue          # 页脚组件
│   ├── HeroSection.vue        # 英雄区组件
│   ├── ServerStats.vue        # 服务器状态组件
│   ├── CtaSection.vue         # 号召行动组件
│   └── CommentsSection.vue    # 评论区组件
├── composables/
│   └── useServerStats.ts      # 服务器数据获取 Hook
├── layouts/
│   └── default.vue            # 默认布局
├── locales/
│   ├── zh.json                # 中文翻译
│   └── en.json                # 英文翻译
├── pages/
│   ├── index.vue              # 首页（中文）
│   └── en/
│       └── index.vue          # 首页（英文）
├── app.vue                    # 应用根组件
├── nuxt.config.ts             # Nuxt 配置
└── package.json               # 依赖配置
```

## 🎨 设计系统

### 颜色方案

- **主色调**: 热带海洋蓝 (#00a8e8)
- **军事绿**: #4a7c59
- **沙滩黄/金色**: #f4d03f
- **警告色**: #e63946 (橙红色)
- **木质材质**: #8b6f47

### 组件风格

- 游戏风格按钮（带光泽效果）
- 卡片式布局（带阴影和边框）
- 木质纹理背景
- 浮动动画效果
- 渐变背景

## 🔧 技术栈

- **框架**: Vue 3 + Nuxt 3 + TypeScript
- **样式**: SASS (缩进语法) + CSS Variables
- **代码规范**: ESLint + TypeScript ESLint
- **国际化**: @nuxtjs/i18n
- **图片优化**: @nuxt/image
- **评论系统**: Waline
- **统计**: 不蒜子

## 📝 配置说明

### API 配置

服务器状态 API 在 `composables/useServerStats.ts` 中配置：

```typescript
const response = await fetch(
  'https://vn-rank-api.adingapkgg.workers.dev/?target=https://webapi.30hb.cn/api/server',
  { cache: 'no-store' }
)
```

### 评论系统

Waline 配置在 `components/CommentsSection.vue` 中：

```typescript
init({
  el: '#waline',
  serverURL: 'https://waline.saop.cc',
  path: 'disk.saop.cc',
  // ...其他配置
})
```

## 🌍 多语言

添加新语言：

1. 在 `locales/` 目录创建新的 JSON 文件
2. 在 `nuxt.config.ts` 中添加语言配置
3. 更新导航栏的语言切换器

## 📄 License

© 蚕豆 - https://space.bilibili.com/87969522

## 🎨 官方素材集成

本项目支持使用 [Boom Beach 官方 Fan Kit](https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets) 素材。

### 📥 快速下载和集成

```bash
# 1. 创建素材目录
pnpm setup:assets

# 2. 下载官方素材
# 访问: https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

# 3. 按照指南放置素材
# 查看: public/assets/DOWNLOAD_INSTRUCTIONS.md
```

### 📚 相关文档

- 📖 `ASSETS_QUICK_START.md` - **快速集成指南（推荐）**
- 📥 `public/assets/DOWNLOAD_INSTRUCTIONS.md` - 下载说明
- 📋 `ASSETS_INTEGRATION_PLAN.md` - 分阶段集成计划
- 📖 `ASSETS_GUIDE.md` - 详细使用指南

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
