'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { stripHtml, sortPosts, BLOG_SORT_KEYS, type WPPost, type BlogSortKey } from '@/lib/blog'
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
 posts: WPPost[]
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
 <div className="container-page max-w-3xl py-16 md:py-24">
 <div>
 <h1 className="text-headline-md font-normal">{dict.title}</h1>
 <p className="mt-2 text-on-surface-medium">{dict.description}</p>
 </div>

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

 <ul className="mt-6 space-y-4">
 {sorted.map((post) => {
 const excerpt = stripHtml(post.excerpt?.rendered ?? '')
 const thumb = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

 return (
 <li key={post.id}>
 <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
 <Card className="overflow-hidden transition-colors duration-fast-01 hover:bg-surface-hover-01">
 <div className="flex flex-col sm:flex-row">
 {thumb && (
 <div className="relative h-40 w-full shrink-0 bg-surface-variant-01 sm:h-auto sm:w-48">
 <Image src={thumb} alt="" fill className="object-cover" />
 </div>
 )}
 <div className="flex-1">
 <CardHeader className="pb-2">
 <h2 className="line-clamp-2 text-body-02 font-medium">
 {stripHtml(post.title?.rendered ?? '')}
 </h2>
 <p className="text-label text-on-surface-medium">
 {sortKey === 'modified'
 ? `${dict.updatedAt} ${formatDate(post.modified, locale)}`
 : formatDate(post.date, locale)}
 </p>
 </CardHeader>
 {excerpt && (
 <CardContent className="pt-0">
 <p className="line-clamp-2 text-body-02 text-on-surface-medium">{excerpt}</p>
 <span className="mt-2 inline-flex items-center gap-1 text-body-02 font-medium">
 {dict.openPost}
 <ExternalLink className="size-3.5" aria-hidden />
 </span>
 </CardContent>
 )}
 </div>
 </div>
 </Card>
 </a>
 </li>
 )
 })}
 </ul>
 </div>
 )
}
