import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { getDictionary } from '@/lib/i18n'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { BlogPost } from '@/components/blog-post'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const image = post.featuredImage
    ? `${SITE_URL}${post.featuredImage}`
    : undefined

  return {
    title: post.title,
    description: post.excerpt.slice(0, 160),
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}/`,
      languages: { en: `${SITE_URL}/en/blog/${slug}/` }
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt.slice(0, 160),
      url: `${SITE_URL}/blog/${slug}/`,
      type: 'article',
      publishedTime: post.date,
      ...(image ? { images: [{ url: image }] } : {})
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt.slice(0, 160),
      ...(image ? { images: [image] } : {})
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const dict = getDictionary('zh')
  const post = await getPostBySlug(slug)

  if (!post) {
    return (
      <div className="container max-w-3xl px-4 py-12 text-center text-muted-foreground">
        <p>{dict.blog.error}</p>
      </div>
    )
  }

  return <BlogPost post={post} dict={dict.blog} locale="zh" />
}
