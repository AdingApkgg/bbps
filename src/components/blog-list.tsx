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
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        <p>{dict.error}</p>
      </div>
    )
  }

  const blogBase = locale === 'en' ? '/en/blog' : '/blog'

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{dict.title}</h1>
        <p className="mt-2 text-muted-foreground">{dict.description}</p>
      </div>

      <ul className="mt-10 space-y-4">
        {posts.map((post) => {
          const excerpt = stripHtml(post.excerpt?.rendered ?? '')
          const thumb =
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url

          return (
            <li key={post.id}>
              <Link
                href={`${blogBase}/${post.id}`}
                className="block"
              >
                <Card className="overflow-hidden transition-colors hover:bg-muted/50">
                  <div className="flex flex-col sm:flex-row">
                    {thumb && (
                      <div className="h-40 w-full shrink-0 bg-muted sm:h-auto sm:w-48">
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
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
                          <span className="mt-2 inline-block text-sm font-medium">
                            {dict.openPost} &rarr;
                          </span>
                        </CardContent>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
