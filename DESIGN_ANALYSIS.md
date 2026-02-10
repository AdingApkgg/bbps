# 参考网站设计分析

参考网站：http://154.21.200.80:8889/%E5%AE%98%E7%BD%91.html

## 核心设计特点

### 1. 背景系统
- **Hero区域**：使用真实的游戏战斗场景作为背景
  - 海岛、船只、海洋等游戏场景
  - 天空和云层效果
  - 真实的游戏画面，不是CSS渐变

### 2. 角色展示
- **游戏角色图片**：
  - 船长（Captain）- 友军角色
  - Hammerman（哈莫曼中尉）- 反派角色
  - 这些都是游戏内的真实角色资源

### 3. 按钮系统
- **绿色按钮**：游戏内真实的绿色按钮背景图
  - 有立体感和纹理
  - 带圆角和阴影
  - 文字覆盖在按钮图片上
  
- **蓝色按钮**：游戏内真实的蓝色按钮背景图
  - 同样的立体效果
  - 用于次要操作

- **其他按钮**：黄色、红色等游戏内按钮样式

### 4. 导航栏
- **简洁设计**：
  - Logo + 文字
  - 横向链接列表
  - 语言切换
  - 连接状态指示器（检测中...）

### 5. 内容区块
- **使用游戏角色图片** + 文字说明
- **标题使用游戏风格字体**
- **描述文字清晰易读**

### 6. 社交链接
- QQ群、Discord图标
- 使用真实的品牌图标

## 需要的素材清单

### 必需素材：
1. ✅ 游戏场景背景图（海岛、战斗场景）
2. ✅ 游戏按钮背景图（绿色、蓝色、黄色）
3. ✅ 游戏角色图片（船长、Hammerman等）
4. ✅ Logo和图标
5. ✅ 社交媒体图标（QQ、Discord）

### 素材来源：
- Supercell Fan Kit
- 游戏内截图和提取的资源

## 实现策略

### 方案1：使用背景图片
```vue
<div 
  class="hero-section"
  style="background-image: url('/assets/images/backgrounds/game-scene.jpg')"
>
  <!-- 内容 -->
</div>
```

### 方案2：使用按钮图片
```vue
<button class="game-button">
  <img src="/assets/images/ui/green-button.png" class="button-bg">
  <span class="button-text">点击下载</span>
</button>
```

### 方案3：角色展示
```vue
<div class="feature-section">
  <img src="/assets/images/characters/captain.png" class="character">
  <div class="feature-content">
    <h2>标题</h2>
    <p>描述</p>
  </div>
</div>
```

## 与当前设计的差异

### 当前（CSS模拟）：
- ❌ 使用CSS渐变背景
- ❌ 使用CSS创建按钮样式
- ❌ 使用Font Awesome图标
- ❌ 没有游戏角色图片
- ❌ 没有真实的游戏场景

### 目标（真实素材）：
- ✅ 使用游戏截图作为背景
- ✅ 使用游戏内按钮图片
- ✅ 使用游戏角色资源
- ✅ 保留游戏原汁原味的视觉风格
- ✅ 文字清晰，易于阅读

## 重构计划

1. **收集素材**：
   - 从参考网站下载关键图片
   - 从Fan Kit获取官方素材
   
2. **重构组件**：
   - TheNavbar：简化，添加Logo
   - HeroSection：使用游戏背景图 + 真实按钮
   - ServerStats：保持面板设计，优化视觉
   - CtaSection：使用游戏角色 + 真实按钮
   - TheFooter：简化设计

3. **优化细节**：
   - 字体选择：使用游戏风格字体或清晰的无衬线字体
   - 配色：保持游戏内的配色
   - 动画：简洁的过渡效果，不要过度

## 开始实施

下一步：收集必需的素材并重构各个组件

