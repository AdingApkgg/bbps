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

const LEGAL_KEY_TO_FILE: Record<'privacy' | 'serverRules' | 'donate', string> = {
  privacy: 'privacy',
  serverRules: 'server-rules',
  donate: 'donate'
}

interface Frontmatter {
  title: string
  lastUpdated: string
}

interface LegalMdxPageProps {
  locale: Locale
  legalKey: 'privacy' | 'serverRules' | 'donate'
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-headline-md font-normal" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-title-lg font-medium" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-3 leading-relaxed text-(--hig-color-label-secondary)" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-3 list-disc space-y-1 pl-6 text-(--hig-color-label-secondary)" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-(--hig-color-link) underline underline-offset-4 hover:text-(--hig-color-link-hover) transition-colors duration-fast-01"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
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
    <div className="container-page max-w-3xl py-16 md:py-24">
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

      <h1 className="mt-8 text-headline-md font-normal">{frontmatter.title}</h1>
      <div className="mt-10">{content}</div>
      <p className="mt-10 text-body-02 text-(--hig-color-label-secondary)">
        {lastUpdatedLabel}
        {frontmatter.lastUpdated}
      </p>
    </div>
  )
}
