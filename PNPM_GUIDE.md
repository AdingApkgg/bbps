# pnpm 包管理器使用指南

## 📦 为什么选择 pnpm？

### 优势

1. **更快的安装速度** ⚡
   - 使用硬链接和符号链接
   - 比 npm 快 2-3 倍

2. **节省磁盘空间** 💾
   - 所有包只存储一次
   - 多个项目共享依赖

3. **严格的依赖管理** 🔒
   - 避免幽灵依赖
   - 更安全的依赖解析

4. **完全兼容** ✅
   - 支持所有 npm 脚本
   - 兼容 package.json

## 🚀 安装 pnpm

### macOS/Linux

```bash
# 使用 curl
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 或使用 npm
npm install -g pnpm

# 或使用 Homebrew (macOS)
brew install pnpm
```

### Windows

```powershell
# 使用 PowerShell
iwr https://get.pnpm.io/install.ps1 -useb | iex

# 或使用 npm
npm install -g pnpm

# 或使用 Scoop
scoop install pnpm
```

### 验证安装

```bash
pnpm --version
# 应该显示版本号，如: 9.0.0
```

## 📋 常用命令对照

| npm 命令 | pnpm 命令 | 说明 |
|---------|----------|------|
| `npm install` | `pnpm install` | 安装所有依赖 |
| `npm install <pkg>` | `pnpm add <pkg>` | 添加依赖 |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` | 添加开发依赖 |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` | 删除依赖 |
| `npm update` | `pnpm update` | 更新依赖 |
| `npm run <script>` | `pnpm run <script>` | 运行脚本 |
| `npm run <script>` | `pnpm <script>` | 运行脚本（简写）|
| `npx <cmd>` | `pnpm dlx <cmd>` | 执行包命令 |

## 🔧 项目配置

### package.json

已配置 packageManager 字段：

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

这确保团队使用相同版本的 pnpm。

### .pnpmrc

项目配置文件：

```ini
shamefully-hoist=true        # 提升依赖到 node_modules 根目录
strict-peer-dependencies=false  # 不严格检查 peer 依赖
auto-install-peers=true      # 自动安装 peer 依赖
```

## 📝 常用命令

### 依赖管理

```bash
# 安装所有依赖
pnpm install

# 安装并锁定版本（推荐用于 CI）
pnpm install --frozen-lockfile

# 添加依赖
pnpm add vue
pnpm add -D typescript
pnpm add -O eslint  # 可选依赖

# 添加全局包
pnpm add -g typescript

# 删除依赖
pnpm remove vue

# 更新依赖
pnpm update           # 更新所有
pnpm update vue      # 更新指定包
pnpm update --latest # 更新到最新版本
```

### 运行脚本

```bash
# 完整命令
pnpm run dev
pnpm run build
pnpm run lint

# 简写（推荐）
pnpm dev
pnpm build
pnpm lint
```

### 其他命令

```bash
# 列出依赖
pnpm list
pnpm list --depth 0  # 只显示顶级依赖

# 检查过时的包
pnpm outdated

# 清理缓存
pnpm store prune

# 执行包命令（类似 npx）
pnpm dlx create-nuxt-app
```

## 🏗️ 本项目使用

### 首次设置

```bash
# 1. 确保已安装 pnpm
pnpm --version

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

### 日常开发

```bash
# 开发
pnpm dev              # 启动开发服务器

# 构建
pnpm generate         # 生成静态站点

# 预览
pnpm serve            # 预览生成的站点

# 代码规范
pnpm lint             # 检查代码
pnpm lint:fix         # 自动修复

# 素材
pnpm setup:assets     # 创建素材目录
```

### 添加新依赖

```bash
# 生产依赖
pnpm add vue-router

# 开发依赖
pnpm add -D sass

# 指定版本
pnpm add vue@3.4.31
```

## 🔍 Workspace 支持

pnpm 原生支持 monorepo，如果将来需要：

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

## ⚡ 性能优化

### 使用 .pnpmfile.cjs 钩子

```javascript
// .pnpmfile.cjs
function readPackage(pkg) {
  // 自定义包解析逻辑
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
```

### 使用过滤器

```bash
# 只安装生产依赖
pnpm install --prod

# 忽略脚本
pnpm install --ignore-scripts
```

## 🐛 常见问题

### Q: pnpm 和 npm 可以混用吗？
A: 不推荐。选择一个包管理器并坚持使用。

### Q: 如何迁移现有项目？
A: 
```bash
# 1. 删除旧的 lock 文件
rm package-lock.json yarn.lock

# 2. 删除 node_modules
rm -rf node_modules

# 3. 使用 pnpm 安装
pnpm install
```

### Q: CI/CD 中如何使用？
A: 已在 `.github/workflows/deploy.yml` 中配置，使用 `pnpm/action-setup@v3`。

### Q: 为什么 node_modules 结构不同？
A: pnpm 使用符号链接，这是正常的。不影响使用。

## 📊 性能对比

| 场景 | npm | pnpm | 提升 |
|------|-----|------|------|
| 首次安装 | 51s | 14s | 3.6x |
| 重复安装 | 41s | 7.5s | 5.5x |
| 有缓存 | 20s | 1.5s | 13x |
| 磁盘空间 | 100% | 30-50% | 2-3x |

## 🔗 相关链接

- [pnpm 官网](https://pnpm.io/)
- [pnpm GitHub](https://github.com/pnpm/pnpm)
- [pnpm vs npm vs yarn](https://pnpm.io/benchmarks)
- [pnpm CLI](https://pnpm.io/cli/add)

## 💡 最佳实践

1. **使用 pnpm 脚本简写**
   ```bash
   pnpm dev  # 而不是 pnpm run dev
   ```

2. **CI 中使用 --frozen-lockfile**
   ```bash
   pnpm install --frozen-lockfile
   ```

3. **定期清理缓存**
   ```bash
   pnpm store prune
   ```

4. **使用 .pnpmrc 统一配置**
   - 提交到版本控制
   - 团队共享配置

5. **检查过时依赖**
   ```bash
   pnpm outdated
   pnpm update --latest
   ```

## 🎯 快速参考

```bash
# 安装
pnpm install
pnpm i                    # 简写

# 添加
pnpm add <pkg>
pnpm add -D <pkg>        # 开发依赖
pnpm add -g <pkg>        # 全局

# 删除
pnpm remove <pkg>
pnpm rm <pkg>            # 简写

# 更新
pnpm update
pnpm up                  # 简写

# 运行
pnpm <script>            # 推荐
pnpm run <script>

# 执行
pnpm dlx <cmd>           # 类似 npx

# 列表
pnpm list
pnpm ls                  # 简写

# 其他
pnpm outdated           # 检查过时
pnpm why <pkg>          # 依赖分析
pnpm store prune        # 清理缓存
```

## ✅ 迁移清单

- [x] 安装 pnpm
- [x] 更新 package.json
- [x] 创建 .pnpmrc
- [x] 更新 .gitignore
- [x] 更新 CI/CD 配置
- [x] 更新部署配置
- [x] 更新文档中的命令
- [ ] 删除 package-lock.json（如果存在）
- [ ] 删除 node_modules
- [ ] 运行 `pnpm install`

开始使用 pnpm，享受更快的开发体验！⚡

