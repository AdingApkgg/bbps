import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

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

      <section className="space-y-4">
        <h2 className="text-title-md">按钮</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button>默认</Button>
          <Button variant="outline">描边</Button>
          <Button variant="secondary">次要</Button>
          <Button disabled>禁用</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-title-md">选择控件</h2>
        <div className="flex items-center gap-3">
          <Checkbox id="c1" defaultChecked />
          <label htmlFor="c1" className="text-body-02">
            已勾选
          </label>
          <Checkbox id="c2" />
          <label htmlFor="c2" className="text-body-02">
            未勾选
          </label>
          <Checkbox id="c3" disabled defaultChecked />
        </div>
        <RadioGroup defaultValue="a" className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="a" id="r1" />
            <label htmlFor="r1" className="text-body-02">
              选项 A
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="b" id="r2" />
            <label htmlFor="r2" className="text-body-02">
              选项 B
            </label>
          </div>
        </RadioGroup>
        <RadioGroup defaultValue="x" variant="segmented" className="w-fit">
          <RadioGroupItem value="x">分段一</RadioGroupItem>
          <RadioGroupItem value="y">分段二</RadioGroupItem>
          <RadioGroupItem value="z">分段三</RadioGroupItem>
        </RadioGroup>
        <div className="flex items-center gap-3">
          <Switch id="s1" defaultChecked />
          <label htmlFor="s1" className="text-body-02">
            开关（开）
          </label>
          <Switch id="s2" />
          <label htmlFor="s2" className="text-body-02">
            开关（关）
          </label>
          <Switch id="s3" disabled defaultChecked />
        </div>
        <Slider defaultValue={[40]} />
      </section>

      <section className="space-y-4">
        <h2 className="text-title-md">分段控件（tabs）</h2>
        <Tabs defaultValue="1">
          <TabsList>
            <TabsTrigger value="1">第一次</TabsTrigger>
            <TabsTrigger value="2">第二次</TabsTrigger>
            <TabsTrigger value="3">第三次</TabsTrigger>
          </TabsList>
          <TabsContent value="1" className="text-body-02 text-(--hig-color-label-secondary)">
            内容一
          </TabsContent>
          <TabsContent value="2" className="text-body-02 text-(--hig-color-label-secondary)">
            内容二
          </TabsContent>
          <TabsContent value="3" className="text-body-02 text-(--hig-color-label-secondary)">
            内容三
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h2 className="text-title-md">标记与表格</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>默认</Badge>
          <Badge variant="secondary">次要</Badge>
          <Badge variant="outline">描边</Badge>
          <Badge variant="destructive">危险</Badge>
          <Badge size="sm">小</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>数量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>第一行</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第二行</TableCell>
              <TableCell>2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
