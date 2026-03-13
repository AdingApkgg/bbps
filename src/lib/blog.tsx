/**
 * 本地 MDX 博客 — 文章列表 & 单篇文章
 */

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { compileMDX } from 'next-mdx-remote/rsc'

const BLOG_DIR = join(process.cwd(), 'src/content/blog')

export interface BlogFrontmatter {
  title: string
  date: string
  slug: string
  excerpt: string
  featuredImage?: string
  wpId?: number
}

export interface BlogPostMeta {
  title: string
  date: string
  slug: string
  excerpt: string
  featuredImage?: string
  wpId?: number
}

export interface BlogPostFull extends BlogPostMeta {
  content: React.ReactElement
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl font-semibold" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-lg font-semibold" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-6 font-semibold" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-3 leading-relaxed text-muted-foreground" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="mt-3 list-decimal space-y-1 pl-6 text-muted-foreground"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-4 border-l-4 border-primary/30 pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="mt-4 rounded-lg" alt="" loading="lazy" {...props} />
  ),
}

async function parseMdxFile(
  filePath: string
): Promise<{ frontmatter: BlogFrontmatter; content: React.ReactElement }> {
  const source = await readFile(filePath, 'utf-8')
  return compileMDX<BlogFrontmatter>({
    source,
    options: { parseFrontmatter: true },
    components: mdxComponents,
  })
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const files = await readdir(BLOG_DIR)
  const mdxFiles = files.filter((f) => f.endsWith('.mdx'))

  const posts: BlogPostMeta[] = []
  for (const file of mdxFiles) {
    const filePath = join(BLOG_DIR, file)
    const source = await readFile(filePath, 'utf-8')
    const fmMatch = source.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch) continue

    const fm: Record<string, string> = {}
    for (const line of fmMatch[1].split('\n')) {
      const idx = line.indexOf(':')
      if (idx === -1) continue
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      fm[key] = val
    }

    posts.push({
      title: fm.title ?? '',
      date: fm.date ?? '',
      slug: fm.slug ?? file.replace(/\.mdx$/, ''),
      excerpt: fm.excerpt ?? '',
      featuredImage: fm.featuredImage,
      wpId: fm.wpId ? Number(fm.wpId) : undefined,
    })
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return posts
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPostFull | null> {
  const filePath = join(BLOG_DIR, `${slug}.mdx`)
  try {
    const { frontmatter, content } = await parseMdxFile(filePath)
    return {
      title: frontmatter.title,
      date: frontmatter.date,
      slug: frontmatter.slug,
      excerpt: frontmatter.excerpt,
      featuredImage: frontmatter.featuredImage,
      wpId: frontmatter.wpId,
      content,
    }
  } catch {
    return null
  }
}
