'use client'

import { useState } from 'react'
import { Terminal, Zap } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { QUICK_COMMANDS } from '@/lib/quick-commands'
import {
  useCommandRunner,
  RunFeedback,
  SessionBar,
  VerifyPanel
} from '@/components/remote-console'
import { CommandBrowser } from '@/components/command-browser'
import { CrabDeckCalculator } from '@/components/crab-deck-calculator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'

export function CommandsPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.commands
  const runner = useCommandRunner()
  const [calcOutput, setCalcOutput] = useState('')

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <FadeIn className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
      </FadeIn>

      {/* 会话：未验证给验证面板，已验证给状态条 */}
      <FadeIn delay={0.1}>
        <div className="mt-10">
          {runner.status === 'authed' ? (
            <SessionBar
              playerId={runner.playerId}
              isOnline={runner.isOnline}
              statsLoading={runner.statsLoading}
              onLogout={runner.logout}
            />
          ) : (
            <VerifyPanel onVerify={runner.verify} />
          )}
        </div>
      </FadeIn>

      {/* 执行反馈：指令结果只发往游戏客户端，这里只报送达与否 */}
      {runner.feedback && (
        <div className="mt-4">
          <RunFeedback feedback={runner.feedback} />
        </div>
      )}

      {/* 常用指令：新手不知道有哪些指令，这里给一条捷径 */}
      <FadeIn delay={0.15}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4" />
              {t.quickTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {QUICK_COMMANDS.map((group) => (
              <div key={group.id}>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {locale === 'en' ? group.labelEn : group.labelZh}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Button
                      key={item.command}
                      variant="outline"
                      size="sm"
                      disabled={!runner.canRun}
                      onClick={() => runner.execute(item.command)}
                      title={`/${item.command}`}
                    >
                      {locale === 'en' ? item.labelEn : item.labelZh}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </FadeIn>

      {/* 指令库：搜索 + 分类筛选 + 参数填写 + 复制/执行 */}
      <FadeIn delay={0.2}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Terminal className="h-4 w-4" />
              {t.browserTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">{t.copyHint}</p>
            <CommandBrowser canRun={runner.canRun} onRun={runner.execute} />
          </CardContent>
        </Card>
      </FadeIn>

      {/* 螃蟹甲板计算器 */}
      <FadeIn delay={0.25}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">{t.calculatorTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CrabDeckCalculator onOutput={setCalcOutput} />
            {calcOutput && (
              <div className="flex flex-wrap items-center gap-2 rounded-md border p-3">
                <code className="flex-1 break-all font-mono text-xs">
                  {calcOutput}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard?.writeText(calcOutput)}
                >
                  {t.copyButton}
                </Button>
                <Button
                  size="sm"
                  disabled={!runner.canRun}
                  onClick={() => runner.execute(calcOutput)}
                >
                  {t.runButton}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* 权限说明 */}
      <FadeIn delay={0.3}>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          {dict.console.permissionNote}
        </p>
      </FadeIn>
    </div>
  )
}
