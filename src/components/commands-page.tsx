'use client'

import { useState } from 'react'
import { Info, Send, Terminal, Zap } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { QUICK_COMMANDS } from '@/lib/quick-commands'
import { useCommandRunner, RunFeedback, SessionBar, VerifyPanel } from '@/components/remote-console'
import { CommandCatalog } from '@/components/command-catalog'
import { CommandBrowser } from '@/components/command-browser'
import { CommandHistory, useCommandHistory } from '@/components/command-history'
import { CrabDeckCalculator } from '@/components/crab-deck-calculator'
import { Button } from '@/components/ui/button'
import { RunButton } from '@/components/run-button'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/motion'
import { toast } from '@/components/ui/toast-store'

/* 指令页
 *
 * HIG 版式：页级大标题左对齐（34/41 700），说明退到其下一行。
 * 页面主体不再是一串「卡片」，而是连续的分组区段——iOS 设置页那种：
 * 13px 分组抬头 + 10dp 圆角容器 + 行内缩进分隔线，区段之间靠留白拉开。
 * 只有真正的临时结果（计算器输出）才浮起来。
 */

function SectionTitle({ icon: Icon, children }: { icon?: typeof Zap; children: string }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 px-4 text-label font-semibold text-on-surface-medium">
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </h2>
  )
}

export function CommandsPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.commands
  const runner = useCommandRunner()
  const history = useCommandHistory()
  const [calcOutput, setCalcOutput] = useState('')
  const [freeInput, setFreeInput] = useState('')

  // 所有执行入口都过这里，顺带记进本地历史
  const run = (command: string) => {
    history.push(command)
    runner.execute(command)
  }

  return (
    <div className="container-page max-w-4xl pt-8 pb-16 md:pt-12 md:pb-24">
      <FadeIn eager>
        <h1 className="text-display-lg">{t.title}</h1>
        <p className="mt-1 text-headline-sm text-on-surface-medium">{t.subtitle}</p>
      </FadeIn>

      {/* 常驻提示：指令结果只回游戏内。纯文字说明，不占容器 */}
      <FadeIn delay={0.05}>
        <p className="mt-4 flex gap-2 text-label text-on-surface-medium">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {t.resultInGameOnly}
        </p>
      </FadeIn>

      {/* 会话 */}
      <FadeIn delay={0.1} className="mt-6">
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
      </FadeIn>

      {runner.feedback && (
        <div className="mt-4">
          <RunFeedback feedback={runner.feedback} />
        </div>
      )}

      {/* 常用指令：按组排列，组之间是行内小节，不用卡片套卡片 */}
      <FadeIn delay={0.15} className="mt-8">
        <SectionTitle icon={Zap}>{t.quickTitle}</SectionTitle>
        <div data-list-group className="overflow-hidden rounded-sm bg-surface-02">
          {QUICK_COMMANDS.map((group) => (
            <div key={group.id} data-list-item className="px-4 py-3">
              <p className="text-body-02 font-semibold">
                {locale === 'en' ? group.labelEn : group.labelZh}
              </p>
              {(group.noteZh || group.noteEn) && (
                <p className="mt-0.5 text-label text-on-surface-medium">
                  {locale === 'en' ? group.noteEn : group.noteZh}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
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
        </div>
      </FadeIn>

      {/* 可用指令目录 */}
      <FadeIn delay={0.2} className="mt-10">
        <h2 className="text-headline-sm">{t.catalogTitle}</h2>
        <div className="mt-3 space-y-1 text-label leading-relaxed text-on-surface-medium">
          <p className="font-semibold text-on-surface">{t.paramNotationTitle}</p>
          <p>{t.notationPlayer}</p>
          <p>{t.notationData}</p>
        </div>
        <div className="mt-4">
          <CommandCatalog canRun={runner.canRun} onRun={run} />
        </div>
      </FadeIn>

      {/* 高级模式：自由输入 + 本地历史 */}
      <FadeIn delay={0.25} className="mt-10">
        <SectionTitle icon={Terminal}>{dict.console.advancedTitle}</SectionTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (freeInput.trim()) run(freeInput)
          }}
          className="flex gap-2 px-4"
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
        <p className="mt-2 px-4 text-label text-on-surface-medium">{t.repeatHint}</p>
        <div className="mt-3">
          <CommandHistory
            items={history.items}
            canRun={runner.canRun}
            onRun={run}
            onClear={history.clear}
            onRemove={history.remove}
          />
        </div>
      </FadeIn>

      {/* 指令生成器：按 ID 挑具体建筑/部队/资源 */}
      <FadeIn delay={0.3} className="mt-10">
        <SectionTitle>{t.browserTitle}</SectionTitle>
        <p className="mb-3 px-4 text-label text-on-surface-medium">{t.copyHint}</p>
        <CommandBrowser canRun={runner.canRun} onRun={run} />
      </FadeIn>

      {/* 螃蟹甲板计算器 */}
      <FadeIn delay={0.35} className="mt-10">
        <SectionTitle>{t.calculatorTitle}</SectionTitle>
        <div className="rounded-sm bg-surface-02 px-4 py-3">
          <CrabDeckCalculator onOutput={setCalcOutput} />
        </div>
        {calcOutput && (
          <div className="shadow-scrim mt-3 flex flex-wrap items-center gap-2 rounded-sm bg-surface-01 px-3 py-2.5">
            <code className="flex-1 break-all font-mono text-label">{calcOutput}</code>
            <Button
              variant="ghost"
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
      </FadeIn>

      <FadeIn delay={0.4}>
        <p className="mt-8 text-label leading-relaxed text-on-surface-medium">
          {dict.console.permissionNote}
        </p>
      </FadeIn>
    </div>
  )
}
