# Boom Beach 官方素材集成指南

## 📦 素材来源

官方 Fan Kit: https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

## 🎨 可用素材类型

### 1. Logo 和图标
- Boom Beach 官方 Logo（多种尺寸）
- 应用图标
- 游戏标志

### 2. UI 元素
- 按钮样式
- 面板背景
- 边框装饰
- 图标集

### 3. 游戏内素材
- 建筑图片（总部、雷达、资源建筑等）
- 单位图片（坦克、火箭炮、登陆艇等）
- 防御建筑
- 资源图标（金币、木材、石头、铁矿）

### 4. 背景和纹理
- 海洋/岛屿背景
- 木质纹理
- 地形素材

## 📁 项目中的素材组织

建议的目录结构：

```
public/
├── assets/
│   ├── images/
│   │   ├── logo/              # Boom Beach Logo
│   │   ├── buildings/         # 建筑图片
│   │   ├── troops/            # 单位图片
│   │   ├── resources/         # 资源图标
│   │   ├── ui/                # UI 元素
│   │   └── backgrounds/       # 背景图片
│   └── fonts/                 # 游戏字体（如果有）
```

## 🔽 下载步骤

1. 访问 https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets
2. 下载需要的素材包
3. 解压到 `public/assets/` 目录
4. 按照上述结构组织文件

## 🎯 推荐使用的素材

### 优先级 1 - 品牌标识
- ✅ **Boom Beach Logo** - 用于导航栏和页面头部
- ✅ **应用图标** - 用于 favicon 和 PWA 图标

### 优先级 2 - UI 装饰
- ✅ **木质按钮/面板** - 替换当前的渐变按钮
- ✅ **资源图标** - 金币、木材、钻石等
- ✅ **星级/等级图标** - 用于玩家状态显示

### 优先级 3 - 游戏内容
- ✅ **总部图片** - 英雄区背景
- ✅ **登陆艇/坦克** - 作为装饰元素
- ✅ **岛屿背景** - 页面背景或 Section 背景

## 💡 使用示例

### 1. 更新 Logo

```vue
<!-- components/TheNavbar.vue -->
<NuxtLink to="/" class="navbar-brand">
  <NuxtImg 
    src="/assets/images/logo/boom-beach-logo.png" 
    alt="Boom Beach"
    width="150"
    height="50"
  />
</NuxtLink>
```

### 2. 使用资源图标

```vue
<!-- components/ServerStats.vue -->
<div class="stat-icon">
  <NuxtImg 
    src="/assets/images/resources/gold-icon.png"
    alt="Players"
    width="64"
    height="64"
  />
</div>
```

### 3. 背景图片

```sass
// components/HeroSection.vue
.hero-bg
  background-image: url('/assets/images/backgrounds/island-beach.jpg')
  background-size: cover
  background-position: center
  
  &::before
    content: ''
    position: absolute
    inset: 0
    background: linear-gradient(135deg, rgba($primary-blue, 0.8) 0%, rgba($primary-blue-dark, 0.9) 100%)
```

### 4. 游戏风格按钮

```sass
.btn-game
  background-image: url('/assets/images/ui/wooden-button.png')
  background-size: contain
  background-repeat: no-repeat
  padding: 20px 40px
  color: white
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5)
```

## 🖼️ Nuxt Image 优化

使用 Nuxt Image 模块自动优化图片：

```vue
<NuxtImg
  src="/assets/images/..."
  alt="描述"
  width="200"
  height="200"
  loading="lazy"
  format="webp"
  quality="80"
/>
```

## 📐 尺寸建议

| 用途 | 推荐尺寸 | 格式 |
|------|---------|------|
| 导航栏 Logo | 150x50px | PNG/SVG |
| Favicon | 32x32px, 192x192px | PNG |
| 背景图 | 1920x1080px | JPG/WebP |
| UI 图标 | 64x64px | PNG |
| 装饰元素 | 128x128px | PNG |
| 英雄区图片 | 800x600px | JPG/WebP |

## 🎨 颜色提取

从官方素材中提取主要颜色：
- **海洋蓝**: #00A8E8, #007EA7
- **沙滩黄**: #F4D03F, #E8D5B7
- **军事绿**: #4A7C59, #2F5233
- **木质棕**: #8B6F47, #5D4E37

这些颜色已在 `assets/styles/_variables.sass` 中定义。

## ⚠️ 版权和使用条款

根据 Supercell Fan Kit 的使用条款：
- ✅ 可用于非商业粉丝项目
- ✅ 必须标注 Supercell 版权
- ❌ 不得用于商业用途
- ❌ 不得修改 Logo
- ✅ 可适当编辑其他素材用于设计

## 📝 版权声明示例

在页脚添加：

```vue
<p class="copyright-notice">
  Boom Beach 是 Supercell 的商标。本站是非官方粉丝项目。
  <br>
  Boom Beach is a trademark of Supercell. This is an unofficial fan site.
</p>
```

## 🚀 快速开始

```bash
# 1. 创建素材目录
mkdir -p public/assets/images/{logo,buildings,troops,resources,ui,backgrounds}

# 2. 下载并放置素材
# 访问 Fan Kit 网站下载

# 3. 在组件中使用
# 使用 NuxtImg 组件引用素材

# 4. 优化和测试
npm run dev
```

## 💡 设计建议

1. **保持一致性**: 使用同一套 UI 风格
2. **适度使用**: 不要过度堆砌素材
3. **性能优化**: 压缩图片，使用 WebP 格式
4. **响应式**: 为不同屏幕尺寸准备不同尺寸的图片
5. **渐进增强**: 确保没有素材时页面仍能正常显示

## 🎯 优先实现清单

- [ ] 下载 Boom Beach Logo
- [ ] 添加到导航栏
- [ ] 下载资源图标（金币、钻石等）
- [ ] 用于统计卡片装饰
- [ ] 下载木质纹理
- [ ] 应用到按钮和卡片背景
- [ ] 下载岛屿/海滩背景
- [ ] 用作英雄区背景
- [ ] 添加版权声明到页脚

开始使用官方素材，让你的私服网站更具游戏原汁原味！🎮

