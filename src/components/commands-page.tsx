'use client'

import { useState } from 'react'
import { ChevronsDownUp, ChevronsUpDown, Info, Send, Terminal, Zap } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { QUICK_COMMANDS } from '@/lib/quick-commands'
import { useCommandRunner, RunFeedback, SessionBar, VerifyPanel } from '@/components/remote-console'
import { CommandCatalog } from '@/components/command-catalog'
import { CommandBrowser } from '@/components/command-browser'
import { CommandHistory, useCommandHistory } from '@/components/command-history'
import { CrabDeckCalculator } from '@/components/crab-deck-calculator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RunButton } from '@/components/run-button'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/motion'
import { toast } from '@/components/ui/toast-store'

/* 指令页
 *
 * 一进来就要用的两件事（连上账号、点常用指令）都在首屏；生成器、计算器、自由
 * 输入这类低频工具退到第二段去，不再把「指令库」顶到第 1 万像素。目录本身一条
 * 指令都没删 —— 只把 9 个组的默认展开改成收起，并给一个「全部展开」通读开关。
 *
 * 分段控件只切开「目录 / 工具」两段；目录里的参数记号说明留在第一段顶部，
 * 因为它正是读下面语法要用的图例。
 */

export function CommandsPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.commands
  const runner = useCommandRunner()
  const history = useCommandHistory()
  const [calcOutput, setCalcOutput] = useState('')
  const [freeInput, setFreeInput] = useState('')
  // 目录整体展开开关：null = 默认全收起，true = 全部摊开
  const [catalogAll, setCatalogAll] = useState<boolean | null>(null)

  // 所有执行入口都过这里，顺带记进本地历史
  const run = (command: string) => {
    history.push(command)
    runner.execute(command)
  }

  return (
    <div className="container-page max-w-4xl pt-10 pb-16 md:pt-16 md:pb-24">
      <FadeIn eager>
        <h1 className="text-display-lg">{t.title}</h1>
        <p className="mt-2 text-body-02 text-on-surface-medium">{t.subtitle}</p>
      </FadeIn>

      {/* 常驻提示：指令结果只回游戏内 */}
      <FadeIn delay={0.05}>
        <p className="mt-5 flex gap-2 text-label leading-relaxed text-on-surface-medium">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {t.resultInGameOnly}
        </p>
      </FadeIn>

      {/* 会话：验证码 / 已登录状态条 */}
      <FadeIn delay={0.1}>
        <div className="mt-4">
          {runner.status === 'authed' ? (
            <SessionBar
              playerId={runner.playerId}
              isOnline={runner.isOnline}
              snapshotAgeSec={runner.snapshotAgeSec}
              statsLoading={runner.statsLoading}
              onLogout={runner.logout}
            />
          ) : (
            <VerifyPanel onVerify={runner.verify} />
          )}
        </div>
      </FadeIn>

      {runner.feedback && (
        <div className="mt-4">
          <RunFeedback feedback={runner.feedback} />
        </div>
      )}

      {/* 常用指令：首屏的第二块就是真正能点的按钮 */}
      <FadeIn delay={0.15}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-body-02">
              <Zap className="h-4 w-4" />
              {t.quickTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {QUICK_COMMANDS.map((group) => (
              <div key={group.id}>
                <p className="text-label font-semibold">
                  {locale === 'en' ? group.labelEn : group.labelZh}
                </p>
                {(group.noteZh || group.noteEn) && (
                  <p className="mt-0.5 text-label text-on-surface-medium">
                    {locale === 'en' ? group.noteEn : group.noteZh}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    /* 危险级别由 RunButton 从目录反查，与目录里的确认行为一致 */
                    <RunButton
                      key={item.command}
                      command={item.command}
                      canRun={runner.canRun}
                      onRun={run}
                      variant="outline"
                    >
                      {locale === 'en' ? item.labelEn : item.labelZh}
                    </RunButton>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-title-lg">{t.catalogTitle}</h2>
          {/* 组默认全收起；想通读时一键摊开，再点一次收回 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCatalogAll((v) => (v ? null : true))}
            aria-pressed={catalogAll === true}
          >
            {catalogAll ? (
              <ChevronsDownUp className="mr-1 h-3.5 w-3.5" />
            ) : (
              <ChevronsUpDown className="mr-1 h-3.5 w-3.5" />
            )}
            {catalogAll ? t.collapseAll : t.expandAll}
          </Button>
        </div>

        {/* 参数记号图例 */}
        <div className="mt-3 space-y-1 rounded-sm bg-field-01 p-3 text-label leading-relaxed text-on-surface-medium">
          <p className="font-semibold text-on-surface">{t.paramNotationTitle}</p>
          <p>{t.notationPlayer}</p>
          <p>{t.notationData}</p>
        </div>

        <div className="mt-4">
          <CommandCatalog canRun={runner.canRun} onRun={run} openAll={catalogAll} />
        </div>
      </FadeIn>

      {/* 低频工具 */}
      <FadeIn delay={0.25}>
        <div className="mt-10 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-body-02">{t.browserTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-label text-on-surface-medium">{t.copyHint}</p>
              <CommandBrowser canRun={runner.canRun} onRun={run} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-body-02">{t.calculatorTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CrabDeckCalculator onOutput={setCalcOutput} />
              {calcOutput && (
                <div className="flex flex-wrap items-center gap-2 rounded-sm bg-surface-01 p-3 shadow-sm">
                  <code className="flex-1 break-all font-mono text-label">{calcOutput}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(calcOutput)
                        toast({ description: t.copied })
                      } catch {
                        toast({ description: t.copyFailed })
                      }
                    }}
                  >
                    {t.copyButton}
                  </Button>
                  <Button size="sm" disabled={!runner.canRun} onClick={() => run(calcOutput)}>
                    {t.runButton}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 高级模式：自由输入 + 本地历史 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-body-02">
                <Terminal className="h-4 w-4" />
                {dict.console.advancedTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (freeInput.trim()) run(freeInput)
                }}
                className="flex gap-2"
              >
                <Input
                  value={freeInput}
                  onChange={(e) => setFreeInput(e.target.value)}
                  placeholder={dict.console.advancedPlaceholder}
                  className="font-mono"
                  maxLength={2048}
                />
                <Button type="submit" disabled={!runner.canRun || !freeInput.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">{dict.console.send}</span>
                </Button>
              </form>
              <p className="text-label text-on-surface-medium">{t.repeatHint}</p>
              <CommandHistory
                items={history.items}
                canRun={runner.canRun}
                onRun={run}
                onClear={history.clear}
                onRemove={history.remove}
              />
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <p className="mt-8 text-label leading-relaxed text-on-surface-medium">
          {dict.console.permissionNote}
        </p>
      </FadeIn>
    </div>
  )
}
