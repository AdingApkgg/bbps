import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts, type WPPost } from '@/lib/blog'
import { BlogList } from '@/components/blog-list'

export const revalidate = 600

export const metadata: Metadata = {
  title: '博客',
  description: '蚕豆私服最新公告、更新日志与攻略分享',
  alternates: {
    canonical: `${SITE_URL}/blog/`,
    languages: { en: `${SITE_URL}/en/blog/` }
  },
  openGraph: {
    title: '博客 | 蚕豆私服',
    description: '蚕豆私服最新公告、更新日志与攻略分享',
    url: `${SITE_URL}/blog/`
  }
}

export default async function BlogPage() {
  const dict = getDictionary('zh')

  let posts: WPPost[]
  try {
    posts = await fetchBlogPosts({ perPage: 20 })
  } catch {
    posts = []
  }

  return <BlogList posts={posts} dict={dict.blog} locale="zh" />
}
