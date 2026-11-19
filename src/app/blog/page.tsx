import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts } from '@/lib/blog'
import { BlogList } from '@/components/blog-list'

export const revalidate = 600

export const metadata: Metadata = {
  title: '博客',
  description: '蚕豆私服最新公告、更新日志与攻略分享',
  alternates: {
    canonical: `${SITE_URL}/blog/`,
    languages: {
      zh: `${SITE_URL}/blog/`,
      en: `${SITE_URL}/en/blog/`,
      'x-default': `${SITE_URL}/en/blog/`
    }
  },
  openGraph: {
    title: '博客 | 蚕豆私服',
    description: '蚕豆私服最新公告、更新日志与攻略分享',
    url: `${SITE_URL}/blog/`
  }
}

export default async function BlogPage() {
  const dict = getDictionary('zh')

  // 静态导出：拉取失败必须让构建失败，而不是把空列表烤进产物发上线
  const posts = await fetchBlogPosts({ perPage: 20 })

  return <BlogList posts={posts} dict={dict.blog} locale="zh" />
}
