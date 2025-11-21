# 🎨 Boom Beach 官方素材快速集成

## 📥 第一步：下载素材

### 访问官方 Fan Kit
👉 https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

### 推荐下载清单

#### ✅ 必备素材（优先级最高）

1. **Logo & Icons**
   - Boom Beach Logo (PNG, 透明背景)
   - 应用图标 (32x32, 192x192, 512x512)
   - 保存到: `public/assets/images/logo/`

2. **资源图标**
   - 金币/Gold 图标
   - 木材/Wood 图标  
   - 石头/Stone 图标
   - 钻石/Diamond 图标
   - 保存到: `public/assets/images/resources/`

3. **UI 元素**
   - 木质按钮纹理
   - 木质面板背景
   - 边框装饰
   - 保存到: `public/assets/images/ui/`

#### 📦 推荐素材

4. **背景图片**
   - 岛屿/海滩场景
   - 海洋纹理
   - 保存到: `public/assets/images/backgrounds/`

5. **游戏元素**
   - 总部/HQ 建筑
   - 坦克/Tank
   - 登陆艇/Landing Craft
   - 保存到: `public/assets/images/buildings/` 和 `troops/`

## 📁 第二步：组织文件

运行命令创建目录结构：

```bash
pnpm setup:assets
```

这将创建：
```
public/assets/
├── images/
│   ├── logo/          # Logo 和图标
│   ├── resources/     # 资源图标
│   ├── ui/            # UI 元素
│   ├── backgrounds/   # 背景图
│   ├── buildings/     # 建筑
│   └── troops/        # 单位
└── fonts/             # 字体（如果有）
```

## 🎨 第三步：集成素材

### 1. 更新导航栏 Logo

编辑 `components/TheNavbar.vue`:

```vue
<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="container navbar-container">
      <NuxtLink to="/" class="navbar-brand">
        <!-- 替换 emoji 为官方 Logo -->
        <NuxtImg 
          src="/assets/images/logo/boom-beach-logo.png"
          alt="Boom Beach"
          width="40"
          height="40"
          class="brand-logo"
        />
        <span class="brand-text">{{ t('site.name') }}</span>
      </NuxtLink>
      <!-- ... 其他代码 -->
    </div>
  </nav>
</template>

<style scoped lang="sass">
.brand-logo
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))
</style>
```

### 2. 更新统计卡片图标

编辑 `components/ServerStats.vue`:

```vue
<template>
  <!-- 在线玩家数 -->
  <div class="stat-card card main-stat">
    <!-- 替换 emoji 为资源图标 -->
    <NuxtImg
      src="/assets/images/resources/gold.png"
      alt="Online Players"
      width="64"
      height="64"
      class="stat-icon-img"
    />
    <div class="stat-value">{{ stats?.online_sessions }}</div>
    <div class="stat-label">{{ t('stats.onlinePlayers') }}</div>
  </div>

  <!-- 玩家总数 -->
  <div class="stat-card card">
    <NuxtImg
      src="/assets/images/resources/trophy.png"
      alt="Total Players"
      width="64"
      height="64"
      class="stat-icon-img"
    />
    <!-- ... -->
  </div>

  <!-- 回放数 -->
  <div class="stat-card card">
    <NuxtImg
      src="/assets/images/resources/diamond.png"
      alt="Replays"
      width="64"
      height="64"
      class="stat-icon-img"
    />
    <!-- ... -->
  </div>
</template>

<style scoped lang="sass">
.stat-icon-img
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))
  margin-bottom: $spacing-sm
</style>
```

### 3. 添加木质纹理按钮

更新 `assets/styles/main.sass`:

```sass
.btn
  // ... 现有样式
  
  &.btn-wood
    background: url('/assets/images/ui/wooden-button.png') no-repeat center
    background-size: 100% 100%
    border: none
    color: $white
    text-shadow: 2px 2px 0 rgba($black, 0.6)
    
    &:hover
      filter: brightness(1.1)
```

### 4. 使用岛屿背景

编辑 `components/HeroSection.vue`:

```vue
<style scoped lang="sass">
.hero-bg
  background-image: url('/assets/images/backgrounds/island-beach.jpg')
  background-size: cover
  background-position: center
  background-attachment: fixed
  
  &::before
    content: ''
    position: absolute
    inset: 0
    background: linear-gradient(135deg, rgba($primary-blue, 0.75) 0%, rgba($primary-blue-dark, 0.85) 100%)
</style>
```

### 5. 更新 Favicon

将下载的 favicon 文件复制到项目根目录：

```bash
# 复制 favicon
cp /path/to/downloaded/boom-beach-icon-32.png public/favicon.ico
```

更新 `nuxt.config.ts`:

```typescript
app: {
  head: {
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/assets/images/logo/icon-192.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/images/logo/icon-180.png' }
    ]
  }
}
```

## 🖼️ 素材优化

### 压缩图片

```bash
# 安装压缩工具
npm install -g @squoosh/cli

# 转换为 WebP 格式（更小的文件大小）
squoosh-cli --webp auto public/assets/images/**/*.{png,jpg}

# 优化 PNG
squoosh-cli --oxipng auto public/assets/images/**/*.png
```

### Nuxt Image 自动优化

Nuxt Image 会自动优化图片，使用时添加参数：

```vue
<NuxtImg
  src="/assets/images/logo/boom-beach-logo.png"
  alt="Boom Beach"
  width="200"
  height="80"
  format="webp"
  quality="80"
  loading="lazy"
/>
```

## 📐 建议的图片尺寸

| 用途 | 建议尺寸 | 格式 |
|------|---------|------|
| 导航栏 Logo | 150x50px 或 200x80px | PNG/WebP |
| Favicon | 32x32, 192x192, 512x512 | PNG |
| 资源图标 | 64x64px 或 128x128px | PNG/WebP |
| 背景图 | 1920x1080px | JPG/WebP |
| UI 按钮 | 根据实际需要 | PNG/WebP |
| 建筑图标 | 128x128px 或 256x256px | PNG/WebP |

## ✅ 完成检查清单

- [ ] 从 Fan Kit 下载素材
- [ ] 运行 `npm run setup:assets` 创建目录
- [ ] 将素材放入对应目录
- [ ] 更新导航栏 Logo
- [ ] 更新统计图标
- [ ] 添加背景图片
- [ ] 更新 Favicon
- [ ] 压缩优化图片
- [ ] 测试所有页面显示正常

## 🎯 实用命令

```bash
# 创建素材目录
pnpm setup:assets

# 启动开发服务器查看效果
pnpm dev

# 生成生产版本
pnpm generate

# 预览生成的静态站点
pnpm serve
```

## 🎨 颜色参考

从官方素材中提取的主要颜色已在 `assets/styles/_variables.sass` 中定义：

```sass
$primary-blue: #00a8e8      // 海洋蓝
$military-green: #4a7c59    // 军事绿
$sand-yellow: #f4d03f       // 沙滩黄
$wood-brown: #8b6f47        // 木质棕
$danger-red: #e63946        // 警告红
```

## ⚠️ 版权声明

所有素材版权归 Supercell Oy 所有。根据 [Supercell Fan Content Policy](https://supercell.com/en/fan-content-policy/)：

✅ **允许:**
- 非商业粉丝项目使用
- 适当编辑素材用于设计
- 在项目中展示游戏内容

❌ **禁止:**
- 商业用途
- 修改官方 Logo
- 声称为官方产品

**建议在页脚添加版权声明**（已在项目中实现）：
> Boom Beach 是 Supercell 的商标。本站是非官方粉丝项目。

## 🚀 快速开始

```bash
# 1. 访问 Fan Kit 下载素材
open https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

# 2. 创建目录
pnpm setup:assets

# 3. 放置素材到对应目录
# public/assets/images/logo/
# public/assets/images/resources/
# public/assets/images/ui/
# public/assets/images/backgrounds/

# 4. 启动开发服务器
pnpm dev

# 5. 查看效果
open http://localhost:3000
```

## 📚 相关文档

- `ASSETS_GUIDE.md` - 详细素材使用指南
- `ASSETS_INTEGRATION_PLAN.md` - 分阶段集成计划
- `SSG_GUIDE.md` - 静态站点生成指南
- [Boom Beach Fan Kit](https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets)
- [Nuxt Image 文档](https://image.nuxt.com/)

开始使用官方素材，打造最具游戏感的私服网站！🎮🏝️

