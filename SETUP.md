# 🚀 快速设置指南

## 📋 前置要求

- Node.js 18+ 
- pnpm 9+

## 🔧 安装 pnpm

### macOS/Linux

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Windows

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 或使用 npm

```bash
npm install -g pnpm
```

## 📦 项目设置

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd bbps
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 🎨 集成官方素材（可选）

### 1. 创建素材目录

```bash
pnpm setup:assets
```

### 2. 下载素材

访问 https://fankit.supercell.com/d/pZyVfhcaMuFD/game-assets

### 3. 放置素材

按照 `public/assets/DOWNLOAD_INSTRUCTIONS.md` 中的说明放置素材。

详细指南请查看 `ASSETS_QUICK_START.md`。

## ✅ 验证安装

```bash
# 检查 pnpm 版本
pnpm --version

# 运行 lint 检查
pnpm lint

# 生成静态站点
pnpm generate

# 预览生成的站点
pnpm serve
```

## 📝 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm generate` | 生成静态站点 |
| `pnpm serve` | 预览静态站点 |
| `pnpm lint` | 检查代码规范 |
| `pnpm lint:fix` | 自动修复代码问题 |
| `pnpm setup:assets` | 创建素材目录 |

## 🐛 常见问题

### Q: pnpm 命令找不到
**A:** 确保已正确安装 pnpm，并重新加载终端配置：
```bash
source ~/.zshrc  # 或 ~/.bashrc
```

### Q: 依赖安装失败
**A:** 清理缓存后重试：
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### Q: 端口 3000 被占用
**A:** 使用其他端口：
```bash
PORT=3001 pnpm dev
```

### Q: ESLint 报错
**A:** 先运行 dev 生成 `.nuxt` 目录：
```bash
pnpm dev
# Ctrl+C 停止
pnpm lint
```

## 📚 进一步阅读

- `README.md` - 项目主文档
- `PNPM_GUIDE.md` - pnpm 详细使用指南
- `SSG_GUIDE.md` - 静态站点生成指南
- `ASSETS_QUICK_START.md` - 素材集成指南
- `FINAL_SUMMARY.md` - 项目总结

## 🎉 开始开发

现在一切就绪！运行 `pnpm dev` 开始开发吧！

如有问题，请查看相关文档或提交 Issue。

