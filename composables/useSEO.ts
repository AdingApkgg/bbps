export const useSEO = (options: {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  locale?: string
}) => {
  const route = useRoute()

  const defaultTitle = '蚕豆私服 - Boom Beach 最佳私人服务器'
  const defaultDescription = 'Boom Beach 私服 - 无限资源，永久免费！立即加入最好的海岛奇兵私人服务器！'
  const defaultImage = 'https://r2.30hb.cn/og-image.jpg'
  const siteUrl = 'https://30hb.cn'

  const title = options.title || defaultTitle
  const description = options.description || defaultDescription
  const image = options.image || defaultImage
  const url = options.url || `${siteUrl}${route.path}`
  const type = options.type || 'website'
  const locale = options.locale || 'zh_CN'

  useHead({
    title,
    meta: [
      // 基础 Meta
      { name: 'description', content: description },
      { name: 'keywords', content: 'Boom Beach, 海岛奇兵, 私服, 私人服务器, 无限资源, 免费游戏, BBPS' },

      // Open Graph
      { property: 'og:type', content: type },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: '蚕豆私服' },
      { property: 'og:locale', content: locale },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },

      // 其他
      { name: 'theme-color', content: '#4A7C59' },
      { name: 'author', content: '蚕豆' }
    ],
    link: [
      { rel: 'canonical', href: url }
    ]
  })
}

