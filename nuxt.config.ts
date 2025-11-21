// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 启用完全静态生成
  ssr: true,

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxt/eslint'
  ],

  css: [
    '~/assets/styles/main.sass'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "~/assets/styles/_variables.sass" as *\n'
        }
      }
    }
  },

  i18n: {
    locales: [
      { code: 'zh', language: 'zh-CN', file: 'zh.json', name: '简体中文' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'zh',
    langDir: 'locales',
    strategy: 'prefix_except_default'
  },

  app: {
    head: {
      title: '蚕豆私服 - Boom Beach 最佳私人服务器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Boom Beach 私服 - 无限资源，永久免费！立即加入！' }
      ],
      link: [
        { rel: 'canonical', href: 'https://30hb.cn/' }
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

