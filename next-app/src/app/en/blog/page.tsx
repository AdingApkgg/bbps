import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts, type WPPost } from '@/lib/blog'
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

  let posts: WPPost[]
  try {
    posts = await fetchBlogPosts({ perPage: 20 })
  } catch {
    posts = []
  }

  return <BlogList posts={posts} dict={dict.blog} locale="en" />
}
