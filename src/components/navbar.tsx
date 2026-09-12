'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu,
  Globe,
  HandCoins,
  Languages,
  ExternalLink,
  Download,
  Terminal,
  BarChart3,
  Trophy,
  Newspaper,
  Shield,
  Users,
  Images,
  Music,
  MessageSquare,
  HardDrive,
  Map,
  type LucideIcon
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

export function Navbar() {
  const pathname = usePathname()
  const locale = useLocale()
  const { pref, setPref } = useLocalePref()
  const dict = getDictionary(locale)

  const prefix = locale === 'en' ? '/en' : ''

  const navItems: { href: string; label: string; icon: LucideIcon }[] = [
    { href: `${prefix}/downloads`, label: dict.nav.downloads, icon: Download },
    { href: `${prefix}/commands`, label: dict.nav.commands, icon: Terminal },
    { href: `${prefix}/stats`, label: dict.nav.stats, icon: BarChart3 },
    { href: `${prefix}/rank`, label: dict.nav.rank, icon: Trophy },
    { href: `${prefix}/maps`, label: dict.nav.maps, icon: Map },
    { href: `${prefix}/blog`, label: dict.nav.blog, icon: Newspaper },
    { href: `${prefix}/teams`, label: dict.nav.team, icon: Shield },
    { href: `${prefix}/community`, label: dict.nav.community, icon: Users },
    { href: `${prefix}/gallery`, label: dict.nav.gallery, icon: Images },
    { href: `${prefix}/music`, label: dict.nav.music, icon: Music },
    {
      href: `${prefix}/comments`,
      label: dict.nav.comments,
      icon: MessageSquare
    }
  ]

  /* 地图编辑器已并入「自制地图」页，不再单列外链 */
  const externalItems: { href: string; label: string; icon: LucideIcon }[] = [
    { href: 'https://drive.saop.cc/%E7%99%BD%E9%B9%85%E7%BD%91%E7%9B%98', label: dict.nav.drive, icon: HardDrive }
  ]

  function isActive(href: string) {
    return pathname === href || pathname === `${href}/`
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
            </DropdownMenuContent>
          </DropdownMenu>

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
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {externalItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {item.label}
                    <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className={cn(
                  isActive(`${prefix}/donate`) && 'bg-accent font-semibold'
                )}
              >
                <Link href={`${prefix}/donate`}>
                  <HandCoins className="mr-2 h-4 w-4 text-amber-500" />
                  {dict.nav.donate}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
