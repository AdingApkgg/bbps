# UnoCSS + Font Awesome 迁移完成

## 迁移摘要

项目已成功从 SASS 迁移到 UnoCSS,并使用 Font Awesome 图标替换了所有 emoji。

## 主要变更

### 1. 新增依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| @unocss/nuxt | 66.5.9 | UnoCSS Nuxt 模块 |
| @iconify-json/fa6-solid | 1.2.4 | Font Awesome 6 Solid 图标集 |
| @iconify-json/fa6-brands | 1.2.6 | Font Awesome 6 Brands 图标集 |
| @waline/client | latest | Waline 评论系统客户端 |

### 2. 配置文件

#### uno.config.ts

创建了完整的 UnoCSS 配置:

- **预设**:
  - `presetUno()` - 默认预设
  - `presetAttributify()` - 属性化模式
  - `presetIcons()` - 图标支持(Font Awesome)
  - `presetTypography()` - 排版预设
  - `presetWebFonts()` - Web 字体(Inter, Orbitron, Fira Code)

- **主题色**:
  - `military`: 军事绿色系
  - `ocean`: 海洋蓝色系
  - `sand`: 沙黄色系
  - `danger`: 危险红色
  - `neutral`: 中性色系

- **快捷类**:
  - 按钮: `btn`, `btn-primary`, `btn-military`, `btn-gold`, `btn-lg`
  - 卡片: `card`, `card-header`, `card-body`
  - 徽章: `badge`, `badge-lg`
  - 容器: `container`
  - 标题: `section-title`
  - 文本效果: `text-shadow-game`, `text-glow`

### 3. 样式迁移

#### 全局样式 (assets/styles/global.css)

保留了必要的全局重置和基础样式:
- Box-sizing 重置
- 平滑滚动
- 字体设置
- 关键帧动画(pulse, float, wave)
- 自定义滚动条样式

#### 组件样式转换

所有组件从 SASS 转换为 UnoCSS 原子类:

1. **layouts/default.vue**
   - 使用 Tailwind 风格的 utility classes
   - `min-h-screen flex flex-col`
   - `flex-1 pt-[70px]`

2. **components/TheNavbar.vue**
   - 响应式导航栏
   - Font Awesome 锚图标 (`i-fa6-solid-anchor`)
   - 渐变背景和过渡效果
   - 移动端菜单动画

3. **components/TheFooter.vue**
   - 简洁的页脚布局
   - 不蒜子统计集成
   - 渐变背景

4. **components/HeroSection.vue**
   - 英雄区块with 视频
   - Font Awesome 图标:
     - 闪电 (`i-fa6-solid-bolt`)
     - 游戏手柄 (`i-fa6-solid-gamepad`)
     - 礼物 (`i-fa6-solid-gift`)
     - 树 (`i-fa6-solid-tree`)
   - 波浪和装饰动画

5. **components/ServerStats.vue**
   - 服务器统计卡片
   - Font Awesome 图标:
     - 用户组 (`i-fa6-solid-users`)
     - 奖杯 (`i-fa6-solid-trophy`)
     - 视频 (`i-fa6-solid-video`)
     - 剑 (`i-fa6-solid-swords`)
     - 用户 (`i-fa6-solid-user`)
   - 响应式网格布局

6. **components/CtaSection.vue**
   - 行动号召区块
   - Font Awesome 图标:
     - 评论 (`i-fa6-solid-comments`)
     - 锚 (`i-fa6-solid-anchor`)
     - 热带岛屿 (`i-fa6-solid-island-tropical`)
     - 炸弹 (`i-fa6-solid-bomb`)
     - 船 (`i-fa6-solid-ship`)
   - 浮动图标动画

7. **components/CommentsSection.vue**
   - Waline 评论系统集成
   - 简洁的容器样式

### 4. SEO 优化

#### composables/useSEO.ts

创建了 SEO composable,统一管理元标签:

- **Open Graph 标签**:
  - `og:type`, `og:title`, `og:description`
  - `og:image`, `og:url`, `og:site_name`
  - `og:locale`, `og:locale:alternate`
  - 图片尺寸和 alt 文本

- **Twitter Card**:
  - `twitter:card` (summary_large_image)
  - `twitter:title`, `twitter:description`
  - `twitter:image`

- **其他 SEO**:
  - 关键词
  - 作者信息
  - 主题颜色
  - Canonical URL

#### 页面级 SEO

- `pages/index.vue`: 中文 SEO 配置
- `pages/en/index.vue`: 英文 SEO 配置

### 5. 删除的文件

- `assets/styles/_variables.sass`
- `assets/styles/main.sass`

### 6. 图标映射

| 原 Emoji | Font Awesome 图标 | 类名 |
|---------|------------------|------|
| ⚓ | Anchor | `i-fa6-solid-anchor` |
| ⚡ | Bolt | `i-fa6-solid-bolt` |
| 🎮 | Gamepad | `i-fa6-solid-gamepad` |
| 🎁 | Gift | `i-fa6-solid-gift` |
| 🌴 | Tree | `i-fa6-solid-tree` |
| 👥 | Users | `i-fa6-solid-users` |
| 🏆 | Trophy | `i-fa6-solid-trophy` |
| 📹 | Video | `i-fa6-solid-video` |
| ⚔️ | Swords | `i-fa6-solid-swords` |
| 👤 | User | `i-fa6-solid-user` |
| 💬 | Comments | `i-fa6-solid-comments` |
| 🏝️ | Island Tropical | `i-fa6-solid-island-tropical` |
| 💣 | Bomb | `i-fa6-solid-bomb` |
| 🚢 | Ship | `i-fa6-solid-ship` |

## 构建结果

✅ **构建成功!**

```bash
pnpm generate
```

生成的文件:
- `index.html` - 中文首页(包含完整 Open Graph 标签)
- `en/index.html` - 英文页面(包含完整 Open Graph 标签)
- `_nuxt/` - 优化的资源文件
- UnoCSS 生成的原子 CSS

## 性能优势

### 与 SASS 相比:

1. **更小的 CSS 文件**
   - UnoCSS 只生成使用的样式
   - 原子化 CSS 减少重复

2. **更快的开发体验**
   - 即时的 HMR
   - 无需预处理器编译

3. **更好的可维护性**
   - 样式与 HTML 在一起
   - 减少样式冲突

4. **图标优化**
   - Font Awesome 图标按需加载
   - SVG 格式,可缩放无损

## 使用指南

### 添加新样式

使用 UnoCSS 原子类:

```vue
<div class="flex items-center gap-4 px-6 py-4 bg-white rounded-lg shadow-soft">
  <div class="i-fa6-solid-star text-2xl text-sand-yellow" />
  <span class="font-bold text-military-green-dark">内容</span>
</div>
```

### 使用快捷类

```vue
<button class="btn btn-primary btn-lg">
  <div class="i-fa6-solid-download" />
  下载
</button>
```

### 添加 Font Awesome 图标

1. 在 [Font Awesome](https://fontawesome.com/icons) 查找图标
2. 使用格式: `i-fa6-solid-{icon-name}`
3. 示例: `<div class="i-fa6-solid-heart" />`

### 自定义主题色

在 `uno.config.ts` 的 `theme.colors` 中添加:

```typescript
theme: {
  colors: {
    custom: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4'
    }
  }
}
```

使用: `bg-custom-primary`, `text-custom-secondary`

## 命令参考

```bash
# 开发
pnpm dev

# 构建
pnpm generate

# 预览
pnpm serve

# Lint
pnpm lint
pnpm lint:fix
```

## 后续优化建议

1. **图片优化**
   - 使用 `@nuxt/image` 组件
   - 添加 WebP 格式支持
   - 实现懒加载

2. **性能监控**
   - 添加 Web Vitals 追踪
   - 监控 CSS 文件大小

3. **可访问性**
   - 添加 ARIA 标签
   - 键盘导航支持
   - 颜色对比度检查

4. **PWA 支持**
   - 添加 Service Worker
   - 离线支持
   - 应用图标

## 迁移日期

2025年11月21日

