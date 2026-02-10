'use client'

import { useState, useMemo } from 'react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { categories, commands } from '@/lib/commands-data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
    <div className="container max-w-4xl space-y-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold md:text-3xl">
          {dict.commands.title}
        </h1>
        <p className="text-muted-foreground">{dict.commands.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/50">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="data-[state=active]:bg-background"
                >
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
            className="min-h-[100px] font-mono resize-y"
          />

          <Button
            onClick={handleCopy}
            variant={copied ? 'secondary' : 'default'}
            className="w-full"
          >
            {copied ? dict.commands.copiedButton : dict.commands.copyButton}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-6 text-center text-xl font-semibold">
            {dict.commands.howToUse}
          </h2>
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
              <div
                key={step}
                className="flex gap-4 md:items-start"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step}
                </div>
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
