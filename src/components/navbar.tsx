'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Menu,
  Moon,
  Sun,
  Monitor,
  Globe,
  Heart,
  Languages,
  ExternalLink
} from 'lucide-react'
import { useLocale, useLocalePref } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

function ThemeToggle({ isEn }: { isEn: boolean }) {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(theme === 'light' && 'font-semibold')}
        >
          <Sun className="mr-2 h-4 w-4" />
          {isEn ? 'Light' : '浅色'}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(theme === 'dark' && 'font-semibold')}
        >
          <Moon className="mr-2 h-4 w-4" />
          {isEn ? 'Dark' : '深色'}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(theme === 'system' && 'font-semibold')}
        >
          <Monitor className="mr-2 h-4 w-4" />
          {isEn ? 'System' : '跟随系统'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const locale = useLocale()
  const { pref, setPref } = useLocalePref()
  const dict = getDictionary(locale)

  const prefix = locale === 'en' ? '/en' : ''

  const navItems = [
    { href: `${prefix}/downloads`, label: dict.nav.downloads },
    { href: `${prefix}/commands`, label: dict.nav.commands },
    { href: `${prefix}/stats`, label: dict.nav.stats },
    { href: `${prefix}/rank`, label: dict.nav.rank },
    { href: `${prefix}/blog`, label: dict.nav.blog },
    { href: `${prefix}/teams`, label: dict.nav.team },
    { href: `${prefix}/community`, label: dict.nav.community },
    { href: `${prefix}/gallery`, label: dict.nav.gallery },
    { href: `${prefix}/music`, label: dict.nav.music },
    { href: `${prefix}/comments`, label: dict.nav.comments }
  ]

  const externalItems = [
    { href: 'https://disk.saop.cc/', label: dict.nav.drive },
    {
      href: 'https://webapi.30hb.cn/basebuilder/Layout-Builder.htm',
      label: dict.nav.editor
    },
    {
      href: 'https://disk.saop.cc/%E7%99%BD%E9%B9%85%E7%BD%91%E7%9B%98/%E8%9A%95%E8%B1%86%E6%9C%8D%E5%9C%B0%E5%9B%BE',
      label: dict.nav.browseMaps
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
          className="flex items-center gap-2"
        >
          <Image
            src="/assets/images/logo/logo.avif"
            alt={dict.site.name}
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-semibold">
            {dict.site.name}
          </span>
        </Link>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Donate */}
          <Button variant="ghost" size="icon" asChild>
            <Link href={`${prefix}/donate`}>
              <Heart className="h-[1.2rem] w-[1.2rem] text-pink-500" />
              <span className="sr-only">{dict.nav.donate}</span>
            </Link>
          </Button>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Switch language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setPref('zh')}
                className={cn(pref === 'zh' && 'font-semibold')}
              >
                <Languages className="mr-2 h-4 w-4" />
                中文
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPref('en')}
                className={cn(pref === 'en' && 'font-semibold')}
              >
                <Languages className="mr-2 h-4 w-4" />
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPref('system')}
                className={cn(pref === 'system' && 'font-semibold')}
              >
                <Monitor className="mr-2 h-4 w-4" />
                {locale === 'zh' ? '跟随系统' : 'System'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <ThemeToggle isEn={locale === 'en'} />

          {/* Menu trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{dict.nav.toggleMenu}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[calc(100dvh-4.5rem)] w-44 overflow-y-auto"
            >
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  asChild
                  className={cn(isActive(item.href) && 'bg-accent font-semibold')}
                >
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {externalItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                    <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
