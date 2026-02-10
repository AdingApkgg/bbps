import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts } from '@/lib/blog'
import { BlogList } from '@/components/blog-list'

export const revalidate = 600

export default async function BlogPage() {
  const dict = getDictionary('zh')

  let posts
  try {
    posts = await fetchBlogPosts({ perPage: 20 })
  } catch {
    posts = []
  }

  return <BlogList posts={posts} dict={dict.blog} locale="zh" />
}
