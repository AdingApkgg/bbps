import type { LucideIcon } from 'lucide-react'
import {
  Download, Terminal, BarChart3, Trophy, Map, Newspaper,
  Shield, Users, Images, Music, MessageSquare, HardDrive
} from 'lucide-react'
import type { getDictionary } from '@/lib/i18n'

type Dict = ReturnType<typeof getDictionary>

export type NavItem = { href: string; label: string; icon: LucideIcon }

/* 导航数据集中在这里：顶栏下拉（M2 默认 / 小屏）与各皮肤的桌面结构导航共用一份 */
export function getNavItems(prefix: string, dict: Dict): NavItem[] {
  return [
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
    { href: `${prefix}/comments`, label: dict.nav.comments, icon: MessageSquare }
  ]
}

/* 地图编辑器已并入「自制地图」页，不再单列外链 */
export function getExternalItems(dict: Dict): NavItem[] {
  return [
    {
      href: 'https://drive.saop.cc/%E7%99%BD%E9%B9%85%E7%BD%91%E7%9B%98',
      label: dict.nav.drive,
      icon: HardDrive
    }
  ]
}
