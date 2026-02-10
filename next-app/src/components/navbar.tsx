'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, Moon, Sun, Globe } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

function getLocaleSwitchPath(
  pathname: string,
  currentLocale: 'zh' | 'en'
): string {
  if (currentLocale === 'zh') {
    if (pathname === '/') return '/en'
    return `/en${pathname}`
  }
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/'
  return '/'
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [open, setOpen] = useState(false)
  const otherLocalePath = getLocaleSwitchPath(pathname ?? '/', locale)

  const prefix = locale === 'en' ? '/en' : ''

  const navItems = [
    { href: `${prefix}/downloads`, label: dict.nav.downloads },
    { href: `${prefix}/commands`, label: dict.nav.commands },
    { href: `${prefix}/stats`, label: dict.nav.stats },
    { href: `${prefix}/rank`, label: dict.nav.rank },
    { href: `${prefix}/blog`, label: dict.nav.blog },
    { href: `${prefix}/comments`, label: dict.nav.comments }
  ]

  const externalItems = [
    { href: 'https://drive.30hb.cn/', label: dict.nav.drive },
    {
      href: 'https://webapi.30hb.cn/basebuilder/Layout-Builder.htm',
      label: dict.nav.editor
    }
  ]

  function isActive(href: string) {
    return pathname === href || pathname === href + '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        {/* Logo */}
        <Link
          href={locale === 'en' ? '/en' : '/'}
          className="mr-6 flex items-center gap-2"
        >
          <Image
            src="/assets/images/logo/logo.avif"
            alt={dict.site.name}
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="hidden font-semibold sm:inline-block">
            {dict.site.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          {externalItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Switch language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={locale === 'en' ? otherLocalePath : (pathname ?? '/')}>
                  中文
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={locale === 'zh' ? otherLocalePath : (pathname ?? '/en')}>
                  English
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Mobile nav trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{dict.nav.toggleMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Image
                    src="/assets/images/logo/logo.avif"
                    alt={dict.site.name}
                    width={24}
                    height={24}
                    className="rounded-md"
                  />
                  {dict.site.name}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                {externalItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
