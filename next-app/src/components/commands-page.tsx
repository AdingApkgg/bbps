'use client'

import { useState, useMemo } from 'react'
import { Copy, Check } from 'lucide-react'
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
import { FadeIn } from '@/components/motion'

export function CommandsPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [activeCategory, setActiveCategory] = useState('common')
  const [selectedCommand, setSelectedCommand] = useState('')
  const [generatedCommand, setGeneratedCommand] = useState('')
  const [copied, setCopied] = useState(false)

  const filteredCommands = useMemo(() => {
    if (activeCategory === 'all') return commands
    return commands.filter((cmd) => cmd.category === activeCategory)
  }, [activeCategory])

  const categoryName = useMemo(() => {
    const c = categories.find((x) => x.id === activeCategory)
    return locale === 'en' ? c?.nameEn ?? 'Command' : c?.nameZh ?? '指令'
  }, [activeCategory, locale])

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
              onValueChange={setActiveCategory}
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

            <Textarea
              readOnly
              value={generatedCommand}
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
