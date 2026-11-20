'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { sortPosts, BLOG_SORT_KEYS, type BlogPost, type BlogSortKey } from '@/lib/blog'
import type { Dict } from '@/lib/i18n'

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const SORT_LABEL_KEY: Record<BlogSortKey, 'sortByDate' | 'sortByModified'> = {
  date: 'sortByDate',
  modified: 'sortByModified'
}

interface BlogListProps {
  posts: BlogPost[]
  dict: Dict['blog']
  locale: 'zh' | 'en'
}

export function BlogList({ posts, dict, locale }: BlogListProps) {
  const [sortKey, setSortKey] = useState<BlogSortKey>('date')
  const sorted = useMemo(() => sortPosts(posts, sortKey), [posts, sortKey])

  if (posts.length === 0) {
    return (
      <div className="container-page max-w-3xl py-16 text-center text-on-surface-medium">
        <p>{dict.error}</p>
      </div>
    )
  }

  return (
    <div className="container-page max-w-3xl pt-8 pb-16 md:pt-12 md:pb-24">
      <h1 className="text-display-lg">{dict.title}</h1>
      <p className="mt-1 text-headline-sm text-on-surface-medium">{dict.description}</p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-body-02 text-on-surface-medium">{dict.sortBy}</span>
        <RadioGroup
          variant="segmented"
          value={sortKey}
          onValueChange={(v) => setSortKey(v as BlogSortKey)}
          aria-label={dict.sortBy}
          className="inline-flex gap-0 rounded-sm bg-surface-variant-01 p-1"
        >
          {BLOG_SORT_KEYS.map((key) => (
            <RadioGroupItem key={key} value={key}>
              {dict[SORT_LABEL_KEY[key]]}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>

      <ul data-list-group className="mt-6 overflow-hidden rounded-sm bg-surface-02">
        {sorted.map((post) => {
          const { excerpt, thumb } = post

          return (
            <li key={post.id} data-list-item>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 px-4 py-3 transition-colors duration-fast-02 hover:bg-surface-hover-01 active:bg-surface-pressed-01 sm:gap-4"
              >
                {thumb && (
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-surface-variant-01 sm:h-20 sm:w-28">
                    <Image src={thumb} alt="" fill className="object-cover" sizes="112px" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-body-01 font-semibold">{post.title}</span>
                  {/* 日期与原文链接同一行：两行元信息在窄屏会把每行顶到 160px */}
                  <span className="mt-0.5 flex items-center gap-2 text-label text-on-surface-medium">
                    {sortKey === 'modified'
                      ? `${dict.updatedAt} ${formatDate(post.modified, locale)}`
                      : formatDate(post.date, locale)}
                    <span className="opacity-40">·</span>
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      {dict.openPost}
                      <ExternalLink className="size-3" aria-hidden />
                    </span>
                  </span>
                  {excerpt && (
                    <span className="mt-1 line-clamp-2 hidden text-body-02 text-on-surface-medium sm:block">
                      {excerpt}
                    </span>
                  )}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
