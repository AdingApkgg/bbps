import Link from 'next/link'
import type { Dict } from '@/lib/i18n'
import type { BlogPostFull } from '@/lib/blog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

interface BlogPostProps {
  post: BlogPostFull
  dict: Dict['blog']
  locale: 'zh' | 'en'
}

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function BlogPost({ post, dict, locale }: BlogPostProps) {
  const blogBase = locale === 'en' ? '/en/blog' : '/blog'

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={locale === 'en' ? '/en' : '/'}>
                {locale === 'zh' ? '首页' : 'Home'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={blogBase}>{dict.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">
              {post.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-8 text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatDate(post.date, locale)}
      </p>

      <article className="mt-8">{post.content}</article>
    </div>
  )
}
