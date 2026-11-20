import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts } from '@/lib/blog'
import { BlogList } from '@/components/blog-list'

import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/blog/',
  title: 'Blog',
  description: 'Latest announcements, changelogs and guides for Horsebean Private Server'
})

export default async function BlogEnPage() {
  const dict = getDictionary('en')

  // 静态导出：拉取失败必须让构建失败，而不是把空列表烤进产物发上线
  const posts = await fetchBlogPosts({ perPage: 20 })

  return <BlogList posts={posts} dict={dict.blog} locale="en" />
}
