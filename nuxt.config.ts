// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 启用完全静态生成
  ssr: true,

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxt/eslint',
    '@unocss/nuxt'
  ],

  css: [
    '~/assets/styles/global.css'
  ],

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
  },

  app: {
    head: {
      title: '蚕豆私服 - Boom Beach 最佳私人服务器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Boom Beach 私服 - 无限资源，永久免费！立即加入！' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '蚕豆私服' },
        { property: 'og:title', content: '蚕豆私服 - Boom Beach 最佳私人服务器' },
        { property: 'og:description', content: 'Boom Beach 私服 - 无限资源，永久免费！立即加入最好的海岛奇兵私人服务器！' },
        { property: 'og:url', content: 'https://30hb.cn/' },
        { property: 'og:image', content: 'https://r2.30hb.cn/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: '蚕豆私服 - Boom Beach Private Server' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:locale:alternate', content: 'en_US' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '蚕豆私服 - Boom Beach 最佳私人服务器' },
        { name: 'twitter:description', content: 'Boom Beach 私服 - 无限资源，永久免费！' },
        { name: 'twitter:image', content: 'https://r2.30hb.cn/og-image.jpg' },

        // 其他 SEO
        { name: 'keywords', content: 'Boom Beach,海岛奇兵,私服,私人服务器,无限资源,免费,蚕豆服' },
        { name: 'author', content: '蚕豆' },
        { name: 'theme-color', content: '#4A7C59' }
      ],
      link: [
        { rel: 'canonical', href: 'https://30hb.cn/' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  nitro: {
    static: true,
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en'],
      ignore: []
    }
  },

  // 路由配置
  routeRules: {
    '/': { prerender: true },
    '/en': { prerender: true }
  },

  // 实验性功能
  experimental: {
    payloadExtraction: false
  },

  // 构建配置
  build: {
    transpile: []
  }
})

