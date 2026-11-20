import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts } from '@/lib/blog'
import { BlogList } from '@/components/blog-list'

import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'blog/',
  title: '博客',
  description: '蚕豆私服最新公告、更新日志与攻略分享'
})

export default async function BlogPage() {
  const dict = getDictionary('zh')

  // 静态导出：拉取失败必须让构建失败，而不是把空列表烤进产物发上线
  const posts = await fetchBlogPosts({ perPage: 20 })

  return <BlogList posts={posts} dict={dict.blog} locale="zh" />
}
