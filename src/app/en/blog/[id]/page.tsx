import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { getDictionary } from '@/lib/i18n'
import { fetchBlogPosts, fetchBlogPost, stripHtml, type WPPost } from '@/lib/blog'
import { BlogPost } from '@/components/blog-post'

export const revalidate = 600

export async function generateStaticParams() {
  let posts: WPPost[] = []
  try {
    posts = await fetchBlogPosts({ perPage: 50 })
  } catch {
    /* empty */
  }
  return posts.map((p) => ({ id: String(p.id) }))
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await fetchBlogPost(id)
  if (!post) return {}

  const title = stripHtml(post.title.rendered)
  const description = stripHtml(post.excerpt.rendered).slice(0, 160)
  const image =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? undefined

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/en/blog/${id}/`,
      languages: { 'zh-CN': `${SITE_URL}/blog/${id}/` }
    },
    openGraph: {
      title: `${title} | Horsebean Private Server`,
      description,
      url: `${SITE_URL}/en/blog/${id}/`,
      type: 'article',
      locale: 'en_US',
      publishedTime: post.date,
      ...(image ? { images: [{ url: image }] } : {})
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {})
    }
  }
}

export default async function BlogPostEnPage({ params }: Props) {
  const { id } = await params
  const dict = getDictionary('en')
  const post = await fetchBlogPost(id)

  if (!post) {
    return (
      <div className="container max-w-3xl px-4 py-12 text-center text-muted-foreground">
        <p>{dict.blog.error}</p>
      </div>
    )
  }

  return <BlogPost post={post} dict={dict.blog} locale="en" />
}
