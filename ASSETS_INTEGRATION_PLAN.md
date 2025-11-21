# 官方素材集成实施计划

## 🎯 目标

使用 [Boom Beach 官方 Fan Kit](https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets) 素材，提升网站的游戏原汁原味感。

## 📋 分阶段实施

### 阶段 1: 品牌标识 ⭐⭐⭐⭐⭐

**优先级**: 最高  
**预计时间**: 30 分钟

#### 任务清单
- [ ] 下载 Boom Beach Logo (PNG, 透明背景)
- [ ] 替换导航栏的 ⚓ emoji 为官方 Logo
- [ ] 下载 Favicon (32x32, 192x192, 512x512)
- [ ] 更新 `nuxt.config.ts` 中的 favicon 配置
- [ ] 添加 Apple Touch Icon

#### 实施位置
```
components/TheNavbar.vue - 品牌 Logo
nuxt.config.ts - Favicon 和 meta 图标
public/favicon.ico - 网站图标
```

#### 代码示例
```vue
<!-- TheNavbar.vue -->
<NuxtLink to="/" class="navbar-brand">
  <NuxtImg 
    src="/assets/images/logo/boom-beach-logo.png"
    alt="Boom Beach Private Server"
    width="40"
    height="40"
    class="brand-logo"
  />
  <span class="brand-text">{{ t('site.name') }}</span>
</NuxtLink>
```

---

### 阶段 2: 资源图标 ⭐⭐⭐⭐

**优先级**: 高  
**预计时间**: 45 分钟

#### 任务清单
- [ ] 下载资源图标 (金币、木材、石头、铁矿、钻石)
- [ ] 替换 ServerStats 组件中的 emoji 图标
- [ ] 添加图标动画效果
- [ ] 优化图标加载性能

#### 实施位置
```
components/ServerStats.vue - 统计卡片图标
```

#### 素材需求
- `gold.png` - 金币图标 (64x64)
- `trophy.png` - 奖杯图标 (64x64)
- `replay.png` - 回放图标 (64x64)

#### 代码示例
```vue
<div class="stat-card card main-stat">
  <NuxtImg
    src="/assets/images/resources/gold.png"
    alt="Players"
    width="64"
    height="64"
    class="stat-icon"
    loading="lazy"
  />
  <div class="stat-value">{{ stats?.online_sessions }}</div>
  <div class="stat-label">{{ t('stats.onlinePlayers') }}</div>
</div>
```

---

### 阶段 3: 木质 UI 元素 ⭐⭐⭐

**优先级**: 中高  
**预计时间**: 1 小时

#### 任务清单
- [ ] 下载木质按钮纹理
- [ ] 下载木质面板背景
- [ ] 更新按钮样式使用纹理
- [ ] 更新卡片背景
- [ ] 调整文字阴影以适配新背景

#### 实施位置
```
assets/styles/main.sass - 按钮和卡片样式
components/ServerStats.vue - 卡片背景
components/CtaSection.vue - CTA 按钮
```

#### 素材需求
- `wooden-button.png` - 木质按钮
- `wooden-panel.png` - 木质面板
- `border-decoration.png` - 边框装饰

#### 代码示例
```sass
.btn-game
  background: url('/assets/images/ui/wooden-button.png') no-repeat center
  background-size: 100% 100%
  padding: 16px 32px
  border: none
  color: $white
  text-shadow: 2px 2px 0 rgba($black, 0.6)
  font-family: $font-family-game
  
  &:hover
    filter: brightness(1.1)
    transform: translateY(-2px)
```

---

### 阶段 4: 背景图片 ⭐⭐⭐

**优先级**: 中  
**预计时间**: 45 分钟

#### 任务清单
- [ ] 下载岛屿/海滩背景图
- [ ] 下载海洋纹理
- [ ] 应用到 HeroSection 背景
- [ ] 添加渐变叠加层保持可读性
- [ ] 优化图片大小 (使用 WebP)

#### 实施位置
```
components/HeroSection.vue - 英雄区背景
```

#### 素材需求
- `island-background.jpg` - 岛屿背景 (1920x1080)
- `ocean-texture.jpg` - 海洋纹理 (1920x1080)

#### 代码示例
```sass
.hero-bg
  background-image: url('/assets/images/backgrounds/island-background.jpg')
  background-size: cover
  background-position: center
  background-attachment: fixed
  
  &::before
    content: ''
    position: absolute
    inset: 0
    background: linear-gradient(135deg, rgba($primary-blue, 0.7) 0%, rgba($primary-blue-dark, 0.85) 100%)
```

---

### 阶段 5: 装饰元素 ⭐⭐

**优先级**: 低  
**预计时间**: 1 小时

#### 任务清单
- [ ] 下载总部、坦克等标志性元素
- [ ] 作为装饰添加到各个 Section
- [ ] 实现视差滚动效果
- [ ] 添加进入动画

#### 实施位置
```
components/HeroSection.vue - 英雄区装饰
components/CtaSection.vue - CTA 区装饰
```

#### 素材需求
- `hq.png` - 总部建筑
- `tank.png` - 坦克
- `landing-craft.png` - 登陆艇
- `palm-tree.png` - 棕榈树 (替换 emoji)

#### 代码示例
```vue
<div class="hero-decorations">
  <NuxtImg
    src="/assets/images/buildings/hq.png"
    alt=""
    width="200"
    height="200"
    class="decoration-hq"
  />
  <NuxtImg
    src="/assets/images/troops/tank.png"
    alt=""
    width="150"
    height="100"
    class="decoration-tank"
  />
</div>
```

---

## 🎨 样式增强

### 字体
如果 Fan Kit 提供字体，可以添加：

```sass
@font-face
  font-family: 'Boom Beach'
  src: url('/assets/fonts/boom-beach-font.woff2') format('woff2')
  font-weight: normal
  font-style: normal
  font-display: swap

$font-family-game: 'Boom Beach', 'Arial Black', 'Impact', sans-serif
```

### 音效 (可选)
如果有官方音效：
- 按钮点击音效
- 背景音乐
- 页面切换音效

---

## 📊 性能优化

### 图片优化清单
- [ ] 使用 WebP 格式
- [ ] 压缩所有图片 (TinyPNG)
- [ ] 设置合适的尺寸
- [ ] 使用 `loading="lazy"` 懒加载
- [ ] 生成响应式图片

### 优化命令
```bash
# 安装 Squoosh CLI
npm install -g @squoosh/cli

# 转换为 WebP
squoosh-cli --webp auto public/assets/images/**/*.{png,jpg}

# 优化 PNG
squoosh-cli --oxipng auto public/assets/images/**/*.png
```

---

## ✅ 验收标准

### 阶段 1
- ✓ 导航栏显示官方 Logo
- ✓ Favicon 正确显示
- ✓ Logo 在移动端正常显示

### 阶段 2
- ✓ 统计卡片使用官方图标
- ✓ 图标清晰无锯齿
- ✓ 加载速度 < 100ms

### 阶段 3
- ✓ 按钮呈现木质质感
- ✓ 卡片背景自然
- ✓ 文字清晰可读

### 阶段 4
- ✓ 背景图适配各种屏幕
- ✓ 不影响文字可读性
- ✓ 加载时间可接受

### 阶段 5
- ✓ 装饰元素不遮挡内容
- ✓ 动画流畅自然
- ✓ 增强而非干扰用户体验

---

## 🚀 快速开始

```bash
# 1. 创建素材目录
mkdir -p public/assets/images/{logo,buildings,troops,resources,ui,backgrounds}

# 2. 访问 Fan Kit 下载素材
# https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

# 3. 按照目录结构放置素材

# 4. 开始实施阶段 1
# 编辑 components/TheNavbar.vue

# 5. 测试效果
npm run dev
```

---

## 📝 注意事项

1. **版权合规**: 确保遵守 Supercell Fan Content Policy
2. **性能优先**: 大图必须压缩优化
3. **渐进增强**: 素材加载失败时仍能正常显示
4. **一致性**: 保持设计风格统一
5. **可访问性**: 为所有图片添加 alt 文本

---

## 📚 参考资源

- [Boom Beach Fan Kit](https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets)
- [Supercell Fan Content Policy](https://supercell.com/en/fan-content-policy/)
- [Nuxt Image 文档](https://image.nuxt.com/)
- [WebP 转换工具](https://squoosh.app/)

开始打造最具游戏感的 Boom Beach 私服网站！🎮🏝️

