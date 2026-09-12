'use client'

import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Lock,
  Search,
  SquarePen
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import {
  useBaseLevels,
  useCustomBases,
  useDebounced
} from '@/hooks/use-custom-bases'
import { customBaseDownloadUrl, type CustomBase, type CustomBaseSort } from '@/lib/api'
import { baseLevelLabel } from '@/lib/custom-bases'
import { formatBytes, formatServerTime } from '@/lib/format'
import { CustomBaseSheet } from '@/components/custom-base-sheet'
import { FadeIn } from '@/components/motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const EDITOR_URL = 'https://webapi.30hb.cn/basebuilder/Layout-Builder.htm'
const PAGE_SIZE = 20

/** 下拉里不放 all 之外的空值 —— Radix Select 不接受空串作为 item value */
const ALL_LEVELS = 'all'

export function CustomBasesPage() {
  const locale = useLocale()
  const t = getDictionary(locale).maps

  const [search, setSearch] = useState('')
  const [level, setLevel] = useState(ALL_LEVELS)
  const [sort, setSort] = useState<CustomBaseSort>('updated')
  const [selected, setSelected] = useState<CustomBase | null>(null)

  const q = useDebounced(search)
  const levels = useBaseLevels()

  /*
   * 页码跟着筛选条件走：条件一换就回到第 1 页，否则换了条件还停在第 7 页
   * 很容易落到空结果上。把条件和页码存在一起推导，而不是用 effect 去同步 ——
   * 后者会触发一次额外渲染，也会先用旧页码发一次注定作废的请求。
   */
  const filterKey = JSON.stringify([q, level, sort])
  const [paging, setPaging] = useState({ key: filterKey, page: 1 })
  const page = paging.key === filterKey ? paging.page : 1

  function goToPage(next: number) {
    setPaging({ key: filterKey, page: next })
  }

  const { items, total, loading, error } = useCustomBases(
    useMemo(
      () => ({
        q: q || undefined,
        level: level === ALL_LEVELS ? undefined : level,
        sort,
        page,
        pageSize: PAGE_SIZE
      }),
      [q, level, sort, page]
    )
  )

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const sortOptions: { value: CustomBaseSort; label: string }[] = [
    { value: 'updated', label: t.sortUpdated },
    { value: 'created', label: t.sortCreated },
    { value: 'downloads', label: t.sortDownloads },
    { value: 'size', label: t.sortSize },
    { value: 'name', label: t.sortName }
  ]

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-4 text-muted-foreground">{t.description}</p>
        <Button asChild className="mt-6">
          <a href={EDITOR_URL} target="_blank" rel="noopener noreferrer">
            <SquarePen className="mr-2 h-4 w-4" />
            {t.openEditor}
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
      </FadeIn>

      <div className="mx-auto mt-12 max-w-5xl">
        {/* 工具条 */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="pl-9"
            />
          </div>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_LEVELS}>{t.allTypes}</SelectItem>
              {levels.map((l) => (
                <SelectItem key={l} value={l}>
                  {baseLevelLabel(l, locale, t.uncategorized)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as CustomBaseSort)}
          >
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 列表 */}
        <div className="mt-6">
          {loading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="ml-auto h-4 w-24" />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="py-12 text-center text-sm text-destructive">
              {error === 'rate' ? t.rateLimited : t.error}
            </p>
          ) : !items.length ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {t.empty}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.colName}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {t.colType}
                    </TableHead>
                    <TableHead className="hidden text-right md:table-cell">
                      {t.colBuildings}
                    </TableHead>
                    <TableHead className="hidden text-right md:table-cell">
                      {t.colTraps}
                    </TableHead>
                    <TableHead className="hidden text-right lg:table-cell">
                      {t.colSize}
                    </TableHead>
                    <TableHead className="text-right">
                      {t.colDownloads}
                    </TableHead>
                    <TableHead className="hidden text-right lg:table-cell">
                      {t.colUpdated}
                    </TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((base) => (
                    <TableRow
                      key={base.name}
                      onClick={() => setSelected(base)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="line-clamp-1 break-all">
                            {base.name}
                          </span>
                          {base.locked && (
                            <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className="font-normal">
                          {baseLevelLabel(
                            base.base_level,
                            locale,
                            t.uncategorized
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums md:table-cell">
                        {base.building_count}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums md:table-cell">
                        {base.trap_count}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums lg:table-cell">
                        {formatBytes(base.byte_size)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {base.download_count}
                      </TableCell>
                      <TableCell className="hidden text-right text-muted-foreground lg:table-cell">
                        {formatServerTime(base.updated_at, locale)}
                      </TableCell>
                      <TableCell>
                        {/* 行点击会打开详情，下载是另一个动作，别让它冒泡 */}
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={customBaseDownloadUrl(base.name)}
                            aria-label={t.download}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* 翻页。首次加载还没有总数，先不渲染，免得闪一下「共 0 座」 */}
        {!error && !(loading && total === 0) && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t.totalCount.replace('{n}', total.toLocaleString())}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => goToPage(Math.max(1, page - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                {t.previous}
              </Button>
              <span className="text-sm tabular-nums text-muted-foreground">
                {t.pageInfo
                  .replace('{page}', String(page))
                  .replace('{total}', String(totalPages))}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => goToPage(page + 1)}
              >
                {t.next}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CustomBaseSheet
        base={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  )
}
