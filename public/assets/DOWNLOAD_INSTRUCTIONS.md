# 📥 素材下载说明

## 🎮 官方素材来源

访问 Boom Beach 官方 Fan Kit:
👉 https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

## 📦 需要下载的素材

### 1️⃣ Logo & Icons (优先级: ⭐⭐⭐⭐⭐)

从 Fan Kit 下载:
- **Boom Beach Logo** (PNG, 透明背景)
  - 保存为: `images/logo/boom-beach-logo.png`
  
- **应用图标** (多种尺寸)
  - 保存为: `images/logo/icon-32.png`
  - 保存为: `images/logo/icon-192.png`
  - 保存为: `images/logo/icon-512.png`

### 2️⃣ 资源图标 (优先级: ⭐⭐⭐⭐)

从 Fan Kit 下载:
- **金币图标** → `images/resources/gold.png`
- **木材图标** → `images/resources/wood.png`
- **石头图标** → `images/resources/stone.png`
- **铁矿图标** → `images/resources/iron.png`
- **钻石图标** → `images/resources/diamond.png`
- **奖杯图标** → `images/resources/trophy.png`

### 3️⃣ UI 元素 (优先级: ⭐⭐⭐)

从 Fan Kit 下载:
- **木质按钮** → `images/ui/wooden-button.png`
- **木质面板** → `images/ui/wooden-panel.png`
- **边框装饰** → `images/ui/border.png`
- **星星图标** → `images/ui/star.png`

### 4️⃣ 背景图片 (优先级: ⭐⭐⭐)

从 Fan Kit 下载:
- **岛屿场景** → `images/backgrounds/island-beach.jpg`
- **海洋背景** → `images/backgrounds/ocean.jpg`
- **战斗场景** → `images/backgrounds/battle.jpg`

### 5️⃣ 游戏元素 (优先级: ⭐⭐)

从 Fan Kit 下载:
- **总部建筑** → `images/buildings/hq.png`
- **雷达** → `images/buildings/radar.png`
- **坦克** → `images/troops/tank.png`
- **重机兵** → `images/troops/heavy.png`
- **登陆艇** → `images/troops/landing-craft.png`

## 📂 文件结构

下载后的文件应该按以下结构放置:

```
public/assets/
├── images/
│   ├── logo/
│   │   ├── boom-beach-logo.png
│   │   ├── icon-32.png
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   │
│   ├── resources/
│   │   ├── gold.png
│   │   ├── wood.png
│   │   ├── stone.png
│   │   ├── iron.png
│   │   ├── diamond.png
│   │   └── trophy.png
│   │
│   ├── ui/
│   │   ├── wooden-button.png
│   │   ├── wooden-panel.png
│   │   ├── border.png
│   │   └── star.png
│   │
│   ├── backgrounds/
│   │   ├── island-beach.jpg
│   │   ├── ocean.jpg
│   │   └── battle.jpg
│   │
│   ├── buildings/
│   │   ├── hq.png
│   │   └── radar.png
│   │
│   └── troops/
│       ├── tank.png
│       ├── heavy.png
│       └── landing-craft.png
│
└── fonts/
    └── (如果 Fan Kit 提供字体)
```

## 💡 下载步骤

1. **访问 Fan Kit**
   ```
   https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets
   ```

2. **浏览素材包**
   - 查找 Logo & Icons 包
   - 查找 Game Assets 包
   - 查找 UI Elements 包

3. **下载素材**
   - 下载需要的素材包
   - 解压到临时文件夹

4. **重命名和整理**
   - 按照上述结构重命名文件
   - 保持文件名简洁易读

5. **复制到项目**
   - 将文件复制到对应的目录
   - 确保路径正确

## 🔍 验证安装

运行开发服务器检查:

```bash
npm run dev
```

访问 http://localhost:3000 查看:
- [ ] 导航栏 Logo 显示正常
- [ ] 统计卡片图标显示正常
- [ ] 背景图片加载正常
- [ ] Favicon 正确显示

## ⚠️ 注意事项

1. **文件格式**
   - Logo/图标: PNG (透明背景)
   - 背景图: JPG 或 WebP
   - UI 元素: PNG

2. **文件大小**
   - Logo: < 100KB
   - 图标: < 50KB 每个
   - 背景: < 500KB

3. **图片尺寸**
   - 不要上传过大的图片
   - 建议先使用在线工具压缩

4. **命名规范**
   - 使用小写字母
   - 使用连字符分隔
   - 例如: `boom-beach-logo.png`

## 🎨 在线优化工具

压缩图片:
- https://tinypng.com/
- https://squoosh.app/
- https://compressor.io/

## 📞 获取帮助

如果下载遇到问题:
1. 检查 Fan Kit 网站是否可访问
2. 确认已创建目录结构 (`npm run setup:assets`)
3. 查看 `ASSETS_QUICK_START.md` 获取详细说明

## 🚀 开始下载

现在访问 Fan Kit 开始下载素材吧！

👉 https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

