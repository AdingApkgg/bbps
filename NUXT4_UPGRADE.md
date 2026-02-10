# Nuxt 4 升级完成

## 升级摘要

项目已成功从 Nuxt 3 升级到 Nuxt 4.2.1,并更新了所有相关依赖。

## 主要变更

### 核心依赖更新

| 包名 | 旧版本 | 新版本 |
|------|--------|--------|
| nuxt | 3.16.0 | 4.2.1 |
| vue | 3.4.31 | 3.5.24 |
| vite | 5.3.5 | 6.4.1 |
| @nuxtjs/i18n | 8.2.0 | 9.5.6 |
| eslint | 8.57.0 | 9.39.1 |
| @typescript-eslint/eslint-plugin | 7.16.0 | 8.47.0 |
| @typescript-eslint/parser | 7.16.0 | 8.47.0 |

### 配置变更

#### 1. i18n 配置 (nuxt.config.ts)

**旧配置:**
```typescript
i18n: {
  locales: [
    { code: 'zh', language: 'zh-CN', file: 'zh.json', name: '简体中文' },
    { code: 'en', language: 'en-US', file: 'en.json', name: 'English' }
  ],
  defaultLocale: 'zh',
  langDir: 'locales',
  strategy: 'prefix_except_default'
}
```

**新配置:**
```typescript
i18n: {
  locales: [
    { 
      code: 'zh', 
      language: 'zh-CN', 
      name: '简体中文'
    },
    { 
      code: 'en', 
      language: 'en-US', 
      name: 'English'
    }
  ],
  defaultLocale: 'zh',
  strategy: 'prefix_except_default',
  bundle: {
    optimizeTranslationDirective: false
  }
  // vueI18n 配置会自动从 i18n/i18n.config.ts 加载
}
```

#### 2. 新增 i18n/i18n.config.ts

Nuxt 4 + @nuxtjs/i18n v9 需要在 `i18n/` 目录下创建配置文件来加载翻译:

```typescript
import zh from '../locales/zh.json'
import en from '../locales/en.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh',
  messages: {
    zh,
    en
  }
}))
```

**注意**: 配置文件必须放在 `i18n/` 目录下,这是 @nuxtjs/i18n v9 的默认查找位置。

### 修复的问题

1. **@nuxtjs/i18n 版本不兼容**
   - 问题: v8.5.6 与 Nuxt 4 不兼容,缺少 `getActiveHead` 导出
   - 解决: 升级到 v9.5.6

2. **ESLint 版本不兼容**
   - 问题: TypeScript ESLint 插件 v7 不支持 ESLint v9
   - 解决: 升级到 v8.47.0

3. **Vite 版本不兼容**
   - 问题: @nuxt/devtools 需要 Vite v6+
   - 解决: 升级到 v6.4.1

4. **/news/ 404 错误**
   - 问题: 导航栏中有不存在的页面链接
   - 解决: 从 `TheNavbar.vue` 中删除该链接

### 构建结果

✅ **构建成功!**

```bash
pnpm generate
```

生成的文件位于 `.output/public/`:
- `index.html` - 中文首页
- `en/index.html` - 英文页面
- `_nuxt/` - 静态资源
- `404.html` 和 `200.html` - 错误页面

### 已知警告

构建过程中可能会出现一些 Node.js console.time 相关的警告,这些是 Nuxt 内部的问题,不影响功能。翻译已经正确加载并渲染到生成的 HTML 中。

### 部署

项目仍然配置为完全静态生成 (SSG),可以部署到任何静态托管服务:

```bash
# 预览构建结果
pnpm serve

# 或使用
npx serve .output/public
```

### 后续建议

1. **更新 CI/CD 配置**: 确保 GitHub Actions、Netlify 和 Vercel 配置使用正确的 pnpm 和 Node.js 版本
2. **监控依赖更新**: Vite 7.2.4 已经可用,可以考虑进一步升级
3. **测试功能**: 在部署前全面测试所有功能,特别是国际化和导航

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

## 升级日期

2025年11月21日

