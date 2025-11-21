# 🚀 启动指南

## 项目已完成重构！



您的网站已经使用 **Vue 3 + Nuxt 3 + TypeScript + SASS（缩进语法）** 完全重构，采用了接近 Boom Beach 游戏的 UI/UX 设计风格，并配置为完全静态生成（SSG）模式。

## 🎯 设计亮点

### 🎨 游戏风格设计
- **热带岛屿主题**: 海洋蓝、沙滩黄、军事绿的配色方案
- **军事风格元素**: 木质纹理、边框装饰、徽章样式
- **动画效果**: 浮动动画、脉冲效果、过渡动画
- **游戏字体**: 粗体大写字母，带阴影效果

### 🌟 核心功能
- ✅ 响应式设计（完美适配移动端）
- ✅ 双语支持（中文/英文）
- ✅ 实时服务器状态监控
- ✅ 在线玩家列表（每5秒自动刷新）
- ✅ Waline 评论系统集成
- ✅ 不蒜子访问统计
- ✅ SEO 优化

## 📦 开始使用

### 1️⃣ 安装依赖

```bash
npm install
```

或使用其他包管理器：
```bash
pnpm install
# 或
yarn install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

然后在浏览器访问: http://localhost:3000

### 3️⃣ 构建生产版本

```bash
npm run generate
```

这将在 `.output/public` 目录生成静态文件，可直接部署。

## 📂 项目结构说明

```
bbps/
├── assets/styles/          # SCSS 样式文件
│   ├── _variables.scss    # 游戏风格配色和变量
│   └── main.scss          # 全局样式和组件样式
├── components/            # Vue 组件
│   ├── TheNavbar.vue     # 导航栏（带移动端菜单）
│   ├── TheFooter.vue     # 页脚（统计信息）
│   ├── HeroSection.vue   # 英雄区（视频和下载按钮）
│   ├── ServerStats.vue   # 服务器状态（实时数据）
│   ├── CtaSection.vue    # 号召行动区域
│   └── CommentsSection.vue # 评论系统
├── composables/           # 组合式函数
│   └── useServerStats.ts # 服务器数据获取
├── layouts/              # 布局模板
│   └── default.vue      # 默认布局
├── locales/             # 国际化翻译
│   ├── zh.json         # 中文
│   └── en.json         # 英文
├── pages/              # 页面路由
│   ├── index.vue      # 首页（中文）
│   └── en/index.vue   # 首页（英文）
└── nuxt.config.ts     # Nuxt 配置文件
```

## 🎨 自定义样式

所有颜色和样式变量都在 `assets/styles/_variables.scss` 中定义，您可以轻松修改：

```scss
// 主色调
$primary-blue: #00a8e8;
$military-green: #4a7c59;
$sand-yellow: #f4d03f;
// ...更多变量
```

## 🔧 配置修改

### 修改 API 地址
在 `composables/useServerStats.ts` 中：
```typescript
const response = await fetch('YOUR_API_URL')
```

### 修改评论系统
在 `components/CommentsSection.vue` 中修改 Waline 配置。

### 添加新语言
1. 在 `locales/` 创建新的 JSON 文件
2. 在 `nuxt.config.ts` 添加语言配置

## 🌐 部署

### Vercel / Netlify
直接连接 Git 仓库，选择 Nuxt 框架预设即可自动部署。

### 静态托管
```bash
npm run generate
```
将 `.output/public` 目录内容上传到任何静态托管服务。

### 服务器部署
```bash
npm run build
npm run preview  # 测试
```
使用 PM2 或其他进程管理器运行。

## 🎮 游戏风格组件使用

### 按钮样式
```vue
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-military">军事风格</button>
<button class="btn btn-gold">金色按钮</button>
```

### 卡片样式
```vue
<div class="card">
  <div class="card-header">标题</div>
  <div class="card-body">内容</div>
</div>
```

### 徽章
```vue
<span class="badge">徽章文字</span>
```

## 💡 提示

- 开发时热重载已启用，修改代码即可实时预览
- SCSS 变量已全局注入，组件中可直接使用
- 所有图标使用 Emoji，无需额外图标库
- 响应式断点：640px (sm)、768px (md)、1024px (lg)、1280px (xl)

## 📞 需要帮助？

- 查看 `README.md` 了解更多技术细节
- Nuxt 文档: https://nuxt.com
- Vue 文档: https://vuejs.org

## 🎉 完成！

您的游戏风格私服网站已经准备就绪！运行 `npm run dev` 开始开发吧！

