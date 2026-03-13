import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { getDictionary } from '@/lib/i18n'
import { getAllPosts } from '@/lib/blog'
import { BlogList } from '@/components/blog-list'

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
  const posts = await getAllPosts()
  return <BlogList posts={posts} dict={dict.blog} locale="zh" />
}
