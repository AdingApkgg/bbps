import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import Link from 'next/link'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { Locale } from '@/lib/i18n'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

const LEGAL_DIR = join(process.cwd(), 'src/content/legal')

const LEGAL_KEY_TO_FILE: Record<'privacy' | 'serverRules', string> = {
  privacy: 'privacy',
  serverRules: 'server-rules'
}

interface Frontmatter {
  title: string
  lastUpdated: string
}

interface LegalMdxPageProps {
  locale: Locale
  legalKey: 'privacy' | 'serverRules'
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl font-semibold" {...props} />
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
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  )
}

export async function LegalMdxPage({ locale, legalKey }: LegalMdxPageProps) {
  const fileBase = LEGAL_KEY_TO_FILE[legalKey]
  const filename = `${fileBase}-${locale}.mdx`
  const filePath = join(LEGAL_DIR, filename)
  const source = await readFile(filePath, 'utf-8')

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: { parseFrontmatter: true },
    components: mdxComponents
  })

  const lastUpdatedLabel = locale === 'zh' ? '最后更新：' : 'Last updated: '
  const homeLabel = locale === 'zh' ? '首页' : 'Home'

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={locale === 'en' ? '/en' : '/'}>{homeLabel}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{frontmatter.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-8 text-3xl font-bold tracking-tight">
        {frontmatter.title}
      </h1>
      <div className="mt-10">{content}</div>
      <p className="mt-10 text-sm text-muted-foreground">
        {lastUpdatedLabel}
        {frontmatter.lastUpdated}
      </p>
    </div>
  )
}
