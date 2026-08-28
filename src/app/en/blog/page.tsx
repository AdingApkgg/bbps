import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts } from '@/lib/blog'
import { BlogList } from '@/components/blog-list'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest announcements, changelogs and guides for Horsebean Private Server',
  alternates: {
    canonical: `${SITE_URL}/en/blog/`,
    languages: { 'zh-CN': `${SITE_URL}/blog/` }
  },
  openGraph: {
    title: 'Blog | Horsebean Private Server',
    description: 'Latest announcements, changelogs and guides for Horsebean Private Server',
    url: `${SITE_URL}/en/blog/`,
    locale: 'en_US'
  }
}

export default async function BlogEnPage() {
  const dict = getDictionary('en')

  // 静态导出：拉取失败必须让构建失败，而不是把空列表烤进产物发上线
  const posts = await fetchBlogPosts({ perPage: 20 })

  return <BlogList posts={posts} dict={dict.blog} locale="en" />
}
