'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { X, Trash2, Calculator } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { ASSETS } from '@/lib/assets'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

/* ── 螃蟹甲板计算器 ── */

export function CrabDeckCalculator({ onOutput }: { onOutput: (v: string) => void }) {
  const t = getDictionary(useLocale()).commands
  const [selectedDecks, setSelectedDecks] = useState<number[]>([])
  const [result, setResult] = useState<{ sum: number; command: string } | null>(null)

  const sorted = useMemo(() => [...selectedDecks].sort((a, b) => a - b), [selectedDecks])

  const toggle = useCallback(
    (val: number, on: boolean) => {
      setSelectedDecks((prev) => (on ? [...prev, val] : prev.filter((v) => v !== val)))
      setResult(null)
      onOutput('')
    },
    [onOutput]
  )

  const handleSelectAll = useCallback(
    (on: boolean) => {
      setSelectedDecks(on ? Array.from({ length: 17 }, (_, i) => i) : [])
      setResult(null)
      onOutput('')
    },
    [onOutput]
  )

  const handleGenerate = useCallback(() => {
    if (selectedDecks.length === 0) return
    const sum = selectedDecks.reduce((acc, v) => acc + 2 ** v, 0)
    const command = `/blockingmask ${sum}`
    setResult({ sum, command })
    onOutput(command)
  }, [selectedDecks, onOutput])

  const handleClear = useCallback(() => {
    setSelectedDecks([])
    setResult(null)
    onOutput('')
  }, [onOutput])

  return (
    <div className="space-y-4">
      {/* 位掩码面板：每个值对应 2^n 的一位 */}
      <div className="flex items-center justify-between">
        <p className="text-label text-(--hig-color-label-secondary)">{t.deckLabel}</p>
        <label
          htmlFor="deck-select-all"
          className="flex items-center gap-2 text-label text-(--hig-color-label-secondary)"
        >
          <Checkbox
            id="deck-select-all"
            checked={sorted.length === 17}
            onCheckedChange={(v) => handleSelectAll(v === true)}
          />
          {t.deckSelectAll}
        </label>
      </div>
      <div className="grid grid-cols-6 gap-1 rounded-sm bg-(--hig-color-field) p-3 sm:grid-cols-9 lg:grid-cols-[repeat(17,minmax(0,1fr))]">
        {Array.from({ length: 17 }, (_, i) => i).map((v) => (
          <label
            key={v}
            htmlFor={`deck-${v}`}
            className="flex flex-col items-center gap-1 text-label text-(--hig-color-label-secondary)"
          >
            <Checkbox
              id={`deck-${v}`}
              checked={selectedDecks.includes(v)}
              onCheckedChange={(on) => toggle(v, on === true)}
            />
            <span className="font-mono">{v}</span>
          </label>
        ))}
      </div>

      {/* 已选列表（可点击移除） */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body-02 text-(--hig-color-label-secondary)">已选择:</span>
        {sorted.length > 0 ? (
          sorted.map((v) => (
            <Badge
              key={v}
              variant="secondary"
              className="cursor-pointer gap-1 pr-1"
              onClick={() => toggle(v, false)}
            >
              {v}
              <X className="h-3 w-3" />
            </Badge>
          ))
        ) : (
          <span className="text-body-02 text-(--hig-color-label-secondary)">无</span>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleGenerate} disabled={sorted.length === 0}>
          <Calculator className="mr-2 h-4 w-4" />
          生成指令
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={sorted.length === 0 && result === null}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          清空
        </Button>
      </div>

      {/* 计算结果 */}
      {result && (
        <div className="space-y-1 rounded-sm bg-(--hig-color-field) p-3">
          <p className="text-body-02 text-(--hig-color-label-secondary)">
            计算总和:{' '}
            <span className="font-mono font-medium text-(--hig-color-label)">{result.sum}</span>
          </p>
          <p className="text-body-02 text-(--hig-color-label-secondary)">
            生成指令:{' '}
            <code className="font-mono font-medium text-(--hig-color-label)">{result.command}</code>
          </p>
        </div>
      )}

      {/* 甲板示例图 */}
      <Image
        src={ASSETS.crabDeck}
        alt="螃蟹甲板开关示例"
        width={600}
        height={400}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="mx-auto mt-2 max-w-full "
      />
    </div>
  )
}
