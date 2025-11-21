# SSG (静态站点生成) 配置指南

## ✅ 已配置完成

项目现已完全配置为 SSG (Static Site Generation) 模式。

## 🎯 SSG 配置说明

### Nuxt 配置 (nuxt.config.ts)

```typescript
{
  ssr: true,  // 启用 SSR 以在构建时生成静态 HTML
  
  nitro: {
    static: true,  // 完全静态模式
    prerender: {
      crawlLinks: true,  // 自动爬取所有链接
      routes: ['/', '/en'],  // 预渲染的路由
      ignore: []  // 忽略的路由
    }
  },
  
  routeRules: {
    '/': { prerender: true },  // 首页预渲染
    '/en': { prerender: true }  // 英文页面预渲染
  }
}
```

## 🚀 构建和部署

### 本地构建

```bash
# 生成静态站点
pnpm generate

# 预览生成的站点
pnpm serve
# 或
pnpm dlx serve .output/public
```

### 输出目录

静态文件将生成到 `.output/public/` 目录，包含：
- `index.html` - 中文首页
- `en/index.html` - 英文页面
- `_nuxt/` - 打包的 JS/CSS
- `assets/` - 静态资源
- 其他公共文件

## 📦 部署平台

### Netlify

已包含 `netlify.toml` 配置：

```toml
[build]
  command = "npm run generate"
  publish = ".output/public"
```

**部署步骤:**
1. 连接 Git 仓库到 Netlify
2. Netlify 会自动检测配置
3. 点击 Deploy

### Vercel

已包含 `vercel.json` 配置。

**部署步骤:**
1. 连接 Git 仓库到 Vercel
2. 选择 Nuxt 框架
3. 部署

### GitHub Pages

```bash
# 构建
pnpm generate

# 部署到 GitHub Pages
# 将 .output/public/ 内容推送到 gh-pages 分支
```

### 自定义服务器

```bash
# 生成静态文件
pnpm generate

# 将 .output/public/ 目录内容上传到服务器
# 可以使用任何静态文件托管服务
```

## 🔧 SSG 优势

### ✅ 性能优势
- **极快的加载速度**: 纯静态 HTML，无需服务器渲染
- **CDN 友好**: 可以部署到全球 CDN
- **低延迟**: 文件直接从 CDN 边缘节点提供

### ✅ 成本优势
- **零服务器成本**: 无需运行 Node.js 服务器
- **免费托管**: 可用 Netlify、Vercel、GitHub Pages 等免费服务
- **低带宽成本**: 静态文件通常有更好的压缩和缓存

### ✅ 安全性
- **更安全**: 没有服务器端代码执行
- **抗攻击**: 静态文件难以被攻击
- **简单**: 无需维护服务器

### ✅ SEO 优势
- **完美 SEO**: 静态 HTML，搜索引擎可直接抓取
- **快速索引**: 无需等待 SSR
- **社交分享**: Meta 标签直接在 HTML 中

## ⚠️ 注意事项

### 动态内容处理

本项目中的动态内容（服务器状态）使用客户端 API 调用：

```typescript
// composables/useServerStats.ts
// 在客户端运行，每 5 秒获取最新数据
const { stats } = useServerStats()
```

这意味着：
- ✅ 初始 HTML 立即加载（快速首屏）
- ✅ 数据在客户端实时获取
- ✅ 无需重新构建即可更新数据
- ⚠️ 需要 JavaScript 才能看到动态数据

### 构建时预渲染

构建时会生成所有页面的静态 HTML：
- `/` - 中文首页
- `/en` - 英文页面

如果添加新页面，需要：
1. 在 `pages/` 目录创建页面
2. 更新 `nuxt.config.ts` 中的 `prerender.routes`
3. 重新运行 `npm run generate`

## 🎨 添加新路由

### 1. 创建页面

```bash
# 例如：创建关于页面
mkdir -p pages/about
touch pages/about/index.vue
```

### 2. 更新配置

```typescript
// nuxt.config.ts
nitro: {
  prerender: {
    routes: ['/', '/en', '/about']  // 添加新路由
  }
}

routeRules: {
  '/about': { prerender: true }  // 添加路由规则
}
```

### 3. 重新生成

```bash
pnpm generate
```

## 📊 构建优化

### 自动优化

Nuxt 自动进行以下优化：
- ✅ 代码分割 (Code Splitting)
- ✅ Tree Shaking
- ✅ CSS 提取和压缩
- ✅ 图片优化 (通过 @nuxt/image)
- ✅ 字体优化
- ✅ 预加载关键资源

### 手动优化建议

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 图片优化
  image: {
    format: ['webp'],
    quality: 80
  },
  
  // 压缩
  nitro: {
    compressPublicAssets: true
  }
})
```

## 🔍 验证 SSG

### 检查生成的文件

```bash
# 查看生成的文件
ls -la .output/public/

# 检查 HTML 内容
cat .output/public/index.html
cat .output/public/en/index.html
```

### 本地测试

```bash
# 启动静态文件服务器
pnpm serve

# 访问 http://localhost:3000
# 检查网络请求（应该只有静态文件和 API 调用）
```

### 性能测试

使用 Lighthouse 或 PageSpeed Insights：
- 应该获得 90+ 的性能分数
- FCP (First Contentful Paint) < 1s
- LCP (Largest Contentful Paint) < 2.5s

## 📝 CI/CD 示例

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .output/public
```

## 🎯 最佳实践

1. **定期重新生成**: 虽然数据是动态的，但定期重新生成可以更新静态内容
2. **使用 CDN**: 将生成的文件部署到 CDN 以获得最佳性能
3. **监控**: 监控 API 端点的可用性（服务器状态 API）
4. **缓存策略**: 为静态资源设置长期缓存，HTML 设置短期缓存
5. **错误处理**: 确保 API 调用失败时有友好的错误提示

## 🚀 快速部署

```bash
# 1. 构建
pnpm generate

# 2. 测试
pnpm serve

# 3. 部署
# 将 .output/public/ 推送到你的托管服务
```

## 📚 相关文档

- [Nuxt 静态生成](https://nuxt.com/docs/getting-started/deployment#static-hosting)
- [Nitro 预渲染](https://nitro.unjs.io/config#prerender)
- [部署到 Netlify](https://nuxt.com/deploy/netlify)
- [部署到 Vercel](https://nuxt.com/deploy/vercel)

完成！项目现在已完全配置为 SSG 模式，可以生成纯静态站点部署到任何静态托管服务。🎉

