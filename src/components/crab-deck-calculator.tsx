'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { Plus, X, Trash2, Calculator } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { ASSETS } from '@/lib/assets'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ── 螃蟹甲板计算器 ── */

export function CrabDeckCalculator({
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
        src={ASSETS.crabDeck}
        alt="螃蟹甲板开关示例"
        width={600}
        height={400}
        className="mx-auto mt-2 max-w-full rounded-lg"
      />
    </div>
  )
}
