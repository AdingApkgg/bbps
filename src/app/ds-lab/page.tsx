import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

/* shadcn CLI 产物 + HIG 令牌别名的对照台：只验证「拉进来就能渲染」，用完可删 */
export default function DsPage() {
  return (
    <div className="container-page max-w-2xl space-y-6 pt-8 pb-16 md:pt-12 md:pb-24">
      <h1 className="text-display-sm">CLI 产物对照</h1>
      <Alert>
        <AlertTitle>Alert 标题</AlertTitle>
        <AlertDescription>这是 CLI 拉进来的 alert，配色走别名层。</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>危险态。</AlertDescription>
      </Alert>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="a">标签</FieldLabel>
          <Input id="a" placeholder="占位符文本" />
          <FieldDescription>说明文字，走 muted-foreground。</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
