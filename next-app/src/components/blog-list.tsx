import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { stripHtml, type WPPost } from '@/lib/blog'
import type { Dict } from '@/lib/i18n'

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

interface BlogListProps {
  posts: WPPost[]
  dict: Dict['blog']
  locale: 'zh' | 'en'
}

export function BlogList({ posts, dict, locale }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="container max-w-3xl px-4 py-12 text-center text-muted-foreground">
        <p>{dict.error}</p>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{dict.title}</h1>
        <p className="text-muted-foreground">{dict.description}</p>
      </div>

      <ul className="space-y-4">
        {posts.map((post) => {
          const excerpt = stripHtml(post.excerpt?.rendered ?? '')
          const thumb =
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url

          return (
            <li key={post.id}>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-opacity hover:opacity-90"
              >
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  {thumb && (
                    <div className="relative h-40 w-full bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <h2 className="line-clamp-2 text-lg font-semibold">
                      {stripHtml(post.title?.rendered ?? '')}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.date, locale)}
                    </p>
                  </CardHeader>
                  {excerpt && (
                    <CardContent className="pt-0">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {excerpt}
                      </p>
                      <span className="mt-2 inline-block text-sm font-medium text-primary">
                        {dict.openPost} →
                      </span>
                    </CardContent>
                  )}
                </Card>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
