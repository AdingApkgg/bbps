# 设计系统约定

取向：**Apple Human Interface Guidelines**。一层令牌、一层组件、一层布局语汇。
新增页面、组件时按本文执行；与本文冲突的写法视为缺陷。

只做 HIG 单皮肤，令牌前缀 `--hig-*`。2026-11 之前试过 Apple / Material / Carbon / Fluent
四皮肤并存的矩阵，现在 `src/styles/` 下只有 `tokens.css`、`hig.css`、`prefs.css` 三个文件，
没有皮肤开关，也没有任何一份按别的系统命名的样式。
改外观只改这三份文件和组件的工具类；要引外部系统，先在这里写一条差异，不要另开一套并行样式。

HIG 的版式不是卡片堆：内容分「组」，一组是一块填充容器，组内每行用缩进分隔线，
小标题永远在容器外、13px、次要色。深色是指纹层级（`#000` 画布 / `#1C1C1E` 组底），
不是把亮色反相。阴影只属于浮层，平铺内容零影零边框。

## 零、样式来源与优先级（先读这节）

外观真源只有一处：`src/components/ui/*.tsx` 里的工具类。`hig.css` 只负责版面语汇
（分组列表、材质栏、抽屉让位）与组件不会自己写的少量兜底。

`hig.css` 现有两段：头段是层内基样式（字号默认值、`*` 的 `border-color` 等），
主体整份在 `@layer components` 里，**低于 utilities**。所以组件里的同名工具类总能
盖掉 `hig.css`；`hig.css` 里只是「兜底」，写得再重也压不住组件（要压住才需要
`!important`，现在整份仓库只剩 `src/app/globals.css` 的 `prefers-reduced-motion` 段那 4 处）。

推论：

- 组件已经写过的外观，`hig.css` 里就不要再写一遍；写了就是两份真源，改一处忘一处就漂。
- 组件类没生效，先查 `hig.css` 的同名属性，别在组件里加 `!important` 硬顶。
- `hig.css` 只该留组件不可能自己写的：原生元素兜底（裸 `<button>`、裸 `<hr>`）、
  版面语汇（`[data-list-item]::after`、`[data-divider]`、材质栏）、通配继承（`*` 的
  `border-color`、`::placeholder`）。

（历史：2026-11 之前 `hig.css` 在层外，`*` 的 `border-color` 与输入段曾把
`input.tsx` 的 `border-outline-field`、`hover:bg-field-hover-01`、焦点 `shadow-[...]`
整片抹掉。收入 `@layer components` 后这一类静默失效才消失。）

## 一、三层令牌，只准单向引用

| 层 | 位置 | 示例 | 谁可以引用 |
| --- | --- | --- | --- |
| L0 原子 | `src/styles/tokens.css` 的 `--hig-shape-*`、`--hig-motion-*`、`--hig-size-*`；`src/app/globals.css` 的 `--text-*`、`--spacing`、`--radius-*` | `--hig-shape-04`、`--hig-motion-short-3`、`--text-body-02` | 只有 L1 |
| L1 语义 | `src/styles/tokens.css` 的 `--hig-color-*`、`--hig-elevation-*`、`--hig-shadow-*` | `--hig-color-primary`、`--hig-elevation-02` | 组件、`hig.css`（层内基样式） |
| L2 组件 | 组件自身（Tailwind 主题别名的 `bg-surface-02` / `text-on-surface` 等） | `bg-surface-hover-01` | 只在本组件内 |

规则：

- 组件里写语义名或 Tailwind 别名，**不写裸 hex、不写 `rgba()` 字面量**（除非是在定义令牌）。
- 字号只用 `--text-*` 阶（`text-body-02`、`text-headline-sm`…），禁止 `text-[13px]` 这类裸 px；行高与字重随阶走。
  字阶表本身镜像 iOS 动态字体，改字号就是改 HIG，须同时改 `hig.css` 头注释里的对照表。
- 间距只走刻度。`--spacing` 在 `src/app/globals.css` 的 `@theme` 里钉为 `0.25rem`，长度工具按它相乘，
  刻度 = 相邻两档至少差 4px 的那组值：`1(4) 2(8) 3(12) 4(16) 6(24) 8(32) 10(40) 12(48) 16(64) 20(80) 24(96)`。
  不成档的 `1.5 / 2.5 / 3.5 / 7 / 9 / 14 / 28` 并到相邻档（`gap-1.5→gap-2`、`pl-9→pl-8`、`py-28→py-24`）。
  `0.5`（2px）是唯一的亚刻度值，只用于描边对齐、图标微调这类 1px 级缝隙（`-mt-px` 的替代）。
- 上面这条管的是间距（`p* m* gap-* space-* inset-*`）。控件高度与图标不跟间距阶，
  走 `--hig-size-*` 令牌或 `h-4 w-4` 这类固定值，避免改间距时把控件尺寸一起带飞。
- 断点只用 `sm` / `md` / `lg` / `xl` / `2xl`，值在 `globals.css` 的 `@theme` 里声明（40/48/64/80/96rem）。
  CSS 原生媒体查询写 rem 字面量，改断点值时要一起改，不能只改令牌。
- 圆角只用 `--hig-shape-*`、`--radius-*` 别名，或 `rounded-sm`（=`--hig-shape-control`，10px；分组容器）/ `rounded-full`（胶囊与图标圈）。

## 二、语义色契约

每个语义变量都必须有定义，且满足对应的对比度下限：

| 语义 | 用途 | 不变量 |
| --- | --- | --- |
| `--hig-color-on-primary` / `-primary-container` | 实底按钮、徽标前景 | 对 primary ≥ 4.5:1；不足时补白/黑内衬 |
| `--hig-color-on-surface` | 正文 | 对 surface 系列 ≥ 4.5:1 |
| `--hig-color-on-surface-medium` / `-light` | 次级/说明文字 | 对大字号 ≥ 3:1，正文 ≥ 4.5:1；**材质面板下要按合成后的底色复核** |
| `--hig-color-highlight` | 焦点环 | 对相邻两个 layer 都 ≥ 3:1 |
| `--hig-color-outline-01` / `-variant-01` | 分隔线、浮层描边 | 可见即可，不承载文字 |

已知陷阱：材质面板（`--hig-material-sheet` = `blur(20px) saturate(180%)`）透出下层后，
`on-surface-medium` 会掉到 4.02:1——所以抽屉/侧栏条目统一用主前景，靠 `aria-current` 与底色表示激活，不靠压暗文字。

## 三、布局语汇：组，不是卡

页面骨架固定为：

1. 页头左对齐：`text-display-lg` 标题 + `text-headline-sm` 副题，`pt-8 pb-16 md:pt-12 md:pb-24`。
   全站页面的页头间距就是这个值，新页面照抄 `music-page.tsx` / `server-stats.tsx` 那几处，不要自创 `pt-10`。
2. 区块抬头在容器外：`mb-2 px-4 text-label font-semibold text-on-surface-medium`，可有右侧 `aside`（计数 Badge、开关、刷新按钮）。
3. 容器：`rounded-sm bg-surface-02`，**零边框零阴影**。
4. 容器内的行一律 `data-list-item`；容器本身 `data-list-group`。分隔线与缩进由 `hig.css` 的 `[data-list-item]::after` 统一画（从 1rem 缩进、末项自动消失），**不要在行上手写 `border-b … last:border-b-0`**。
5. 行内：图标/头像在左，标题 + 说明两行在左对齐的 `min-w-0 flex-1` 里，行尾是 chevron 或数值；`hover:bg-surface-hover-01 active:bg-surface-pressed-01` 加 `duration-fast-02`。

可用的现成件：

- `Card` / `CardHeader` / `CardTitle` / `CardContent` —— 一个组就是一张 `Card`（内部已带 `data-slot="card"` 与 `data-list-group`），行用 `CardRow` 或 `data-list-item`。
  `card.tsx:18` 自身就是 `overflow-hidden rounded-sm bg-surface-02` 的一块填充容器：叫 Card 只是沿用旧名，形制是 iOS 分组区段，不是带边框投影的卡片。
- `ListRow` 式行（`<li data-list-item>` + 上面的行内结构）用于纯链接/按钮列表。
- 表格：`Table` 自带底色/圆角/横向滚动，**不要再套 `overflow-x-auto rounded-sm bg-surface-02` 的 div**（会叠两层底、两个滚动盒）；行分隔线已统一到 0.5px `outline-variant-01`，表头 13px/600 不放大写。
- 指标：`grid` + `data-divider`（`src/styles/hig.css` 画 0.5px 竖线，2 列时每行首格自动不画），**不要用 Tailwind 的 `divide-x`**：它生成 `:where(...)` 零特异性选择器，`border-color` 会被 `@layer base` 的 `*` 改回 `outline-01`，颜色淡不下来。
- 第三方面板（评论、地图这类接管 DOM 的）：外壳用一块裸 `rounded-sm bg-surface-02`，不强行套 `data-list-group`。
- 分组多而独立时，每组各给一块 `linked` 或独立容器（组之间留 `space-y-6`），小标题始终留在容器外。

分组容器的 `data-slot="card"` / `data-list-item` 也是 HIG 样式表的挂点：`hig.css` 不再靠 `article`、
`.rounded-sm.bg-surface-01` 这类类名拼写认容器——换了底色的行不会漏，但组件必须自己声明语义属性。

## 四、浮层

浮层是唯一允许投影、材质、描边的地方，且只挂在语义钩子上：

- 菜单 `[role='menu']`、对话框 `[role='dialog']`、`[data-slot='sheet']`、`[data-slot='popover']`、`[data-slot='select-content']`。
- 新建自绘浮层必须补 `data-slot="popover"`；不要再写 `.rounded-sm.bg-surface-02` 这种类名选择器当浮层判据（分组容器会被误伤）。
- 内层下拉面板（listbox）不重复描边与影，由外层面板承担。

## 五、层叠

全站只有一组层叠令牌，按 `src/styles/tokens.css` 的「层叠顺序」段取用，**不许再写字面量 z-index**（写死值会随页面增加互相比大，最后靠 DOM 顺序偶然决定谁盖住谁）：

| 令牌 | 值 | 用在哪 |
| --- | --- | --- |
| `--hig-layer-rail` | 10 | 侧栏，从顶栏底边起算 |
| `--hig-layer-banner` | 20 | 提示条，紧贴顶栏下方 |
| `--hig-layer-header` | 30 | 顶栏 |
| `--hig-layer-modal` | 50 | 抽屉、模态对话框（Radix `Sheet` / `Dialog`） |
| `--hig-layer-dock` | 60 | 手机底栏 `[data-tabbar]`、播放条 |
| `--hig-layer-dock-player` | 61 | 播放条，压在底栏之上 |
| `--hig-layer-modal-full` | 65 | 灯箱、全屏歌词（自带完整控制） |
| `--hig-layer-popover` | 70 | 菜单 / 下拉 / 选择器 |
| `--hig-layer-toast` | 75 | 全局通知 |
| `--hig-layer-skip` | 80 | 跳转链接（只在焦点时出现） |

两条容易踩反的规则：

- **dock 压在 modal 之上**，不跟着 modal 一起被抽屉盖。常驻件带自己的实体底，在半屏浮层下它盖住的只是主内容，抽屉展开时照样能切 tab、切歌。代价是它是底部控件的地雷：贴底弹层（`SearchableSelect`）必须按 `[data-dock]` 上沿算可用高度并向上翻转，不能只按视口算；抽屉要自己让出 dock 高度（`src/styles/hig.css` 里 `[data-drawer]` 的 `padding-block-end`）并让 `nav` 内部滚，别让末项躺在 dock 底下。
- **层级正确 ≠ 可点**。Radix 模态会给 `body` 挂 `pointer-events: none`，浮层内的可点元素要显式 `pointer-events-auto`。改 z-index 或 positioning 都治不好。「点了没反应」先把层级和 `pointer-events` 分开查。

## 六、材质

| 用途 | 令牌 |
| --- | --- |
| 顶栏 / 底栏 | `--hig-material-bar`（0.85 + `blur(20px)`），`hig.css` 钩 `header.sticky` 与底部固定条 |
| 抽屉 / sheet / 弹窗 | `--hig-material-sheet`（0.9 + `blur(24px) saturate(180%)`） |
| 浮层投影 | `--hig-shadow-overlay`（单层淡影，暖色推进感） |
| 实心按钮 / 开关与滑块拇指 | `--hig-shadow-thumb`（开关、滑块）；按钮用 `shadow-sm` |

平铺内容只有一处例外可以用影：实心按钮与滑块拇指这类「抬起的实体」。

## 七、明暗主题与阅读偏好

**明暗是三档**：跟随系统 / 浅色 / 深色，开关在顶栏，状态存在 `localStorage` 的 `bbps-theme` 与
`<html data-theme>`，`src/lib/theme.ts` 的 `THEME_SCRIPT` 在首帧前内联执行防闪。三档而不是二值开关，
是因为二值会丢掉「跟随系统」这条默认路径。

代价是暗色令牌得写两遍（静态站没有服务端协商，`prefers-color-scheme` 与 `data-theme` 各一条通路），
两份必须字字相同：`bun run check:theme` 会逐条比对并列出差异，CI 也跑。改暗色只在
`tokens.css` 那两块里改，两处一起改；`globals.css`/`hig.css` 里零星的明暗分支同理。
JS 侧要判明暗只能走 `usePrefersDark()`（`data-theme` 优先，`auto` 才问系统），
不要直接 `matchMedia` —— 否则手动选深色时会跟正文反着来。

阅读偏好是另一套，与明暗正交：`src/styles/prefs.css` 一组 `--pref-*`：`cursor-interactive`、`link-decoration`、`pad-scale`、`type-scale`。
默认是正常值（`default` / `none` / `1` / `1`）；偏好改的是同一设计语言下的节奏，不是另一个主题。
没有切换 UI —— 要换就在 `:root` 改默认值，全站跟着走。

`type-scale` 用 `html { font-size: calc(1rem * …) }` 生效，字阶全是 rem，行高与比例等比跟涨，不需要逐类覆盖。

`prefs.css` 只写 `:root` 变量、不碰具体选择器，所以它即使也在层外也不会抹掉组件样式；
换任何一档偏好、组件的类名都仍归组件所有。

## 八、可访问性钩子

- 跳转链接：`[data-skip-link]`，Tab 首焦点，实底块上必须带自身内衬（`box-shadow: inset 0 0 0 2px var(--hig-color-on-primary)`），否则焦点环被自己的 primary 底色吃掉。
- 侧栏 `[data-rail] nav > a`、抽屉 `[data-drawer] nav > a`、手机底栏 `[data-tabbar] a` 的焦点环一律内收：`outline-offset: -2px`，贴边容器改成 `box-shadow` 内环（外扩环会压到相邻行、被屏幕或抽屉边缘裁掉）。
- 抽屉用 `SheetTrigger asChild` 包住触发按钮，不要手写 `onClick(() => setOpen(true))`——Radix 需要知道自己被谁触发，Esc/点关闭后焦点才能回落到菜单键。
- 焦点只能内嵌、不能删：`outline: none` 的规则必须补等价的 `box-shadow`。
- 触达区 ≥ 44px（`--hig-size-touch-target`）；图标按钮给 `size-11`，紧凑行靠 `py-*` 撑到 44 而不是缩图标。
- 语义结构：一个 `<h1>`；导航区 `<nav>` 带 `aria-label`；当前项 `aria-current="page"`；纯图标按钮带 `sr-only` 文案。

## 九、校验（提交前）

```bash
bun run check          # biome check + tsc --noEmit + check:theme，一起跑
bun scripts/shots.mjs   # 明暗 × 1280/390 × 跟随系统/手动选，含四道闸门
```

`scripts/shots.mjs` 逐页截图并同时输出四道闸门，任一非 0 都要处理：
- `overflow` —— 横向溢出 px（必须全 0，含抽屉打开态）。
- `drawerFail` —— 手机端抽屉、语言菜单没打开（必须 0）。
- `themeFail` —— 点菜单项后 `<html data-theme>` 没落上（必须 0）。这一路故意把系统配色
  设成与所选主题相反，手动选真生效才不会与系统撞成同一结果；只看 `emulateMedia` 验不出主题开关坏没坏。
- `lowContrast` —— 对比度低于 4.5:1（大字 3:1）的文字节点，附选择器与实测比值。
  探针取最近的不透明祖先做底色；背景图/渐变会自动跳过，所以**命中即真问题**，跳过不等于合格。
  报告值不含子像素抗锯齿，4.4~4.5 的边缘值按失败处理。
  **盲区**：只量文字 `color` 对底色的比，不量边框与背景填充。字段底色和页面底色撞在一起、
  描边被抹成透明，`lowContrast` 照样是 0。这一项要看截图，别只看数字。

截图默认落在 `public/_preview/`，`public/preview.html` 可整页速览（目录在 `.gitignore` 里，跑完重生成）。

## 十、从 CLI 拉组件（shadcn）

仓库有 `components.json`，可直接 `npx shadcn@latest add <name>`。三点注意：

- CLI 产物写的是 shadcn 词汇（`bg-card` / `border-input` / `text-muted-foreground`）。这些别名在
  `src/app/globals.css` 的「shadcn/ui 词汇别名」段映射到同义 HIG 令牌，能渲染但语义偏粗，
  **拉进来只是起点，须按本文重写成 `--hig-*` / `bg-surface-02` 口径**。
- v4 产物固定 `import { cn } from "cn"` 与 `import { Label } from "radix-ui"`（单体包）——
  与仓库 15 个 `@radix-ui/*` 分包不一致，改回 `@/lib/utils` 与对应分包。
- `add` 撞上同名文件会问覆盖；`--overwrite` 会整份替换，原文件里的 HIG 钩子（如
  `separator.tsx` 的 `bg-outline`）会丢，覆盖后必须重读 diff 把钩子补回去。
