'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { Copy, Check, Plus, X, Trash2, Calculator } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { categories, commands } from '@/lib/commands-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/motion'

/* ── 螃蟹甲板计算器 ── */

function CrabDeckCalculator({
  onOutput
}: {
  onOutput: (v: string) => void
}) {
  const [selectedDecks, setSelectedDecks] = useState<number[]>([])
  const [pendingValue, setPendingValue] = useState<number | null>(null)
  const [result, setResult] = useState<{ sum: number; command: string } | null>(null)

  // 可选甲板值（排除已选的）
  const availableValues = useMemo(
    () => Array.from({ length: 17 }, (_, i) => i).filter((v) => !selectedDecks.includes(v)),
    [selectedDecks]
  )

  const sorted = useMemo(
    () => [...selectedDecks].sort((a, b) => a - b),
    [selectedDecks]
  )

  const handleAdd = useCallback(() => {
    if (pendingValue === null) return
    setSelectedDecks((prev) => [...prev, pendingValue])
    setPendingValue(null)
    setResult(null)
  }, [pendingValue])

  const handleRemove = useCallback((val: number) => {
    setSelectedDecks((prev) => prev.filter((v) => v !== val))
    setResult(null)
    onOutput('')
  }, [onOutput])

  const handleGenerate = useCallback(() => {
    if (selectedDecks.length === 0) return
    const sum = selectedDecks.reduce((acc, v) => acc + Math.pow(2, v), 0)
    const command = `/blockingmask ${sum}`
    setResult({ sum, command })
    onOutput(command)
  }, [selectedDecks, onOutput])

  const handleClear = useCallback(() => {
    setSelectedDecks([])
    setPendingValue(null)
    setResult(null)
    onOutput('')
  }, [onOutput])

  return (
    <div className="space-y-4">
      {/* 选择 + 添加 */}
      <div className="flex items-center gap-2">
        <Select
          value={pendingValue !== null ? String(pendingValue) : undefined}
          onValueChange={(v) => setPendingValue(parseInt(v, 10))}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="选择甲板值 (0-16)" />
          </SelectTrigger>
          <SelectContent>
            {availableValues.map((i) => (
              <SelectItem key={i} value={String(i)}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={handleAdd} disabled={pendingValue === null}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* 已选列表（可点击移除） */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">已选择:</span>
        {sorted.length > 0 ? (
          sorted.map((v) => (
            <Badge
              key={v}
              variant="secondary"
              className="cursor-pointer gap-1 pr-1"
              onClick={() => handleRemove(v)}
            >
              {v}
              <X className="h-3 w-3" />
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">无</span>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleGenerate} disabled={sorted.length === 0}>
          <Calculator className="mr-2 h-4 w-4" />
          生成指令
        </Button>
        <Button variant="outline" onClick={handleClear} disabled={sorted.length === 0 && result === null}>
          <Trash2 className="mr-2 h-4 w-4" />
          清空
        </Button>
      </div>

      {/* 计算结果 */}
      {result && (
        <div className="space-y-1 rounded-md border bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            计算总和: <span className="font-mono font-medium text-foreground">{result.sum}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            生成指令: <code className="font-mono font-medium text-foreground">{result.command}</code>
          </p>
        </div>
      )}

      {/* 甲板示例图 */}
      <Image
        src="/assets/images/game/crab-deck.avif"
        alt="螃蟹甲板开关示例"
        width={600}
        height={400}
        className="mx-auto mt-2 max-w-full rounded-lg"
      />
    </div>
  )
}

/* ── 命令页面主体 ── */

export function CommandsPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [activeCategory, setActiveCategory] = useState('common')
  const [selectedCommand, setSelectedCommand] = useState('')
  const [generatedCommand, setGeneratedCommand] = useState('')
  const [copied, setCopied] = useState(false)

  const isCalculator = activeCategory === 'calculator'

  const filteredCommands = useMemo(() => {
    if (activeCategory === 'all') return commands
    return commands.filter((cmd) => cmd.category === activeCategory)
  }, [activeCategory])

  const categoryName = useMemo(() => {
    const c = categories.find((x) => x.id === activeCategory)
    return locale === 'en' ? c?.nameEn ?? 'Command' : c?.nameZh ?? '指令'
  }, [activeCategory, locale])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setSelectedCommand('')
    setGeneratedCommand('')
  }

  const handleSelectChange = (id: string) => {
    setSelectedCommand(id)
    const cmd = commands.find((c) => c.id === id)
    setGeneratedCommand(cmd ? cmd.command : '')
  }

  const handleCopy = async () => {
    if (!generatedCommand) return
    try {
      await navigator.clipboard.writeText(generatedCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const placeholder =
    locale === 'zh'
      ? `请选择${categoryName}（不要加<>）`
      : `Please select ${categoryName} (don't add <>)`

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <FadeIn className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {dict.commands.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{dict.commands.subtitle}</p>
      </FadeIn>

      {/* Command generator */}
      <FadeIn delay={0.15}>
        <Card className="mt-10">
          <CardHeader>
            <Tabs
              value={activeCategory}
              onValueChange={handleCategoryChange}
              className="w-full"
            >
              <TabsList className="h-auto w-full flex-wrap">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    {locale === 'en' ? cat.nameEn : cat.nameZh}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCalculator ? (
              <CrabDeckCalculator onOutput={setGeneratedCommand} />
            ) : (
              <Select
                value={selectedCommand || undefined}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCommands.map((cmd) => (
                    <SelectItem key={cmd.id} value={cmd.id}>
                      {cmd.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Textarea
              value={generatedCommand}
              onChange={(e) => setGeneratedCommand(e.target.value)}
              placeholder={dict.commands.outputPlaceholder}
              className="min-h-[100px] resize-y font-mono text-sm"
            />

            <Button
              onClick={handleCopy}
              variant={copied ? 'secondary' : 'default'}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {dict.commands.copiedButton}
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  {dict.commands.copyButton}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      {/* How to use */}
      <FadeIn delay={0.25}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              {dict.commands.howToUse}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: dict.commands.step1Title,
                  desc: dict.commands.step1Desc
                },
                {
                  step: 2,
                  title: dict.commands.step2Title,
                  desc: dict.commands.step2Desc
                },
                {
                  step: 3,
                  title: dict.commands.step3Title,
                  desc: dict.commands.step3Desc
                }
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-semibold">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
