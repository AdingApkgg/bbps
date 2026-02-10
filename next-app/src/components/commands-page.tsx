'use client'

import { useState, useMemo } from 'react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { categories, commands } from '@/lib/commands-data'
import { cn } from '@/lib/utils'

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

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="m-0 mb-4 text-3xl font-black text-[#2C2416] md:text-4xl">
            {dict.commands.title}
          </h1>
          <p className="m-0 text-lg text-[#5C5446]">{dict.commands.subtitle}</p>
        </div>

        <div className="mx-auto mb-16 max-w-[800px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap gap-2 border-b-2 border-[#e9ecef] bg-[#f8f9fa] p-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-colors',
                  activeCategory === cat.id
                    ? 'border-bb-blue bg-bb-blue text-white'
                    : 'border-[#dee2e6] bg-white text-[#495057] hover:border-bb-blue hover:bg-[#f8f9fa]'
                )}
              >
                {locale === 'en' ? cat.nameEn : cat.nameZh}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4 p-8">
            <select
              value={selectedCommand}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="w-full cursor-pointer rounded-lg border-2 border-[#dee2e6] bg-white px-4 py-3 text-base transition-colors hover:border-bb-blue focus:border-bb-blue focus:outline-none"
            >
              <option value="">
                {locale === 'zh'
                  ? `请选择${categoryName}（不要加<>）`
                  : `Please select ${categoryName} (don't add <>)`}
              </option>
              {filteredCommands.map((cmd) => (
                <option key={cmd.id} value={cmd.id}>
                  {cmd.name}
                </option>
              ))}
            </select>
            <textarea
              readOnly
              value={generatedCommand}
              placeholder={dict.commands.outputPlaceholder}
              className="min-h-[100px] w-full resize-y rounded-lg border-2 border-[#dee2e6] bg-[#f8f9fa] p-4 font-mono text-base focus:border-bb-blue focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'w-full rounded-lg border-none px-4 py-4 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(8,145,209,0.3)] active:translate-y-0',
                copied ? 'bg-bb-green' : 'bg-bb-blue hover:bg-bb-blue-dark'
              )}
            >
              {copied ? dict.commands.copiedButton : dict.commands.copyButton}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[900px] rounded-2xl bg-white p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <h2 className="m-0 mb-8 text-center text-2xl font-bold text-[#2C2416]">
            {dict.commands.howToUse}
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bb-blue to-bb-blue-light text-xl font-black text-white">
                1
              </div>
              <div>
                <h3 className="m-0 mb-2 text-lg font-bold text-[#2C2416]">
                  {dict.commands.step1Title}
                </h3>
                <p className="m-0 text-base leading-relaxed text-[#5C5446]">
                  {dict.commands.step1Desc}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bb-blue to-bb-blue-light text-xl font-black text-white">
                2
              </div>
              <div>
                <h3 className="m-0 mb-2 text-lg font-bold text-[#2C2416]">
                  {dict.commands.step2Title}
                </h3>
                <p className="m-0 text-base leading-relaxed text-[#5C5446]">
                  {dict.commands.step2Desc}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bb-blue to-bb-blue-light text-xl font-black text-white">
                3
              </div>
              <div>
                <h3 className="m-0 mb-2 text-lg font-bold text-[#2C2416]">
                  {dict.commands.step3Title}
                </h3>
                <p className="m-0 text-base leading-relaxed text-[#5C5446]">
                  {dict.commands.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
