# 设计系统约定

取向：**Apple Human Interface Guidelines**。一层令牌、一层组件、一层 HIG 布局语汇。
新增页面、组件时按本文执行；与本文冲突的写法视为缺陷。

只做 HIG 单皮肤。历史上试过 Apple / M2 / Carbon / Fluent 四皮肤并存的矩阵，2026-11 收敛成一套：
`src/styles/` 下只剩 `tokens.css`、`hig.css`、`modifiers.css`，令牌名仍叫 `--md-sys-*`（历史前缀，与 Material 2 无关），
`src/components/ui/` 的注释从「M2 规格原文」改写为「HIG 取形 + 哪些 M2 语义还留着」。
对照别的系统时，把差异写成这里的条目，不再开一套并行样式。

iOS 的版式不是卡片堆：内容分「组」，一组是一块填充容器，组内每行用缩进分隔线，
小标题永远在容器外、13px、次要色。深色是指纹层级（`#000` 画布 / `#1C1C1E` 组底），
不是把亮色反相。阴影只属于浮层，平铺内容零影零边框。

## 一、三层令牌，只准单向引用

| 层 | 位置 | 示例 | 谁可以引用 |
| --- | --- | --- | --- |
| L0 原子 | `src/styles/tokens.css` 的 `--md-sys-shape-*`、`--md-sys-motion-*`、`--md-sys-size-*`；`src/app/globals.css` 的 `--text-*`、`--spacing`、`--radius-*` | `--md-sys-shape-04`、`--md-sys-motion-short-3`、`--text-body-02` | 只有 L1 |
| L1 语义 | `src/styles/tokens.css` 的 `--md-sys-color-*`、`--md-sys-elevation-*`、`--md-sys-shadow-*` | `--md-sys-color-primary`、`--md-sys-elevation-02` | 组件、`hig.css` |
| L2 组件 | 组件自身（Tailwind 主题别名的 `bg-surface-02` / `text-on-surface` 等） | `bg-surface-hover-01` | 只在本组件内 |

规则：

- 组件里写语义名或 Tailwind 别名，**不写裸 hex、不写 `rgba()` 字面量**（除非是在定义令牌）。
- 字号只用 `--text-*` 阶（`text-body-02`、`text-headline-sm`…），禁止 `text-[13px]` 这类裸 px；行高与字重随阶走。
  字阶表本身镜像 iOS 动态字体，改字号就是改 HIG，须同时改 `hig.css` 头注释里的对照表。
- 间距按 Tailwind 的 4px 基数阶（`p-4`、`gap-2`），不要 13px / 18px 的野生值。
- 圆角只用 `--md-sys-shape-*`、`--radius-*` 别名，或 `rounded-sm`（=`--md-sys-shape-control`，10px；分组容器）/ `rounded-full`（胶囊与图标圈）。

## 二、语义色契约

每个语义变量都必须有定义，且满足对应的对比度下限：

| 语义 | 用途 | 不变量 |
| --- | --- | --- |
| `--md-sys-color-on-primary` / `-primary-container` | 实底按钮、徽标前景 | 对 primary ≥ 4.5:1；不足时补白/黑内衬 |
| `--md-sys-color-on-surface` | 正文 | 对 surface 系列 ≥ 4.5:1 |
| `--md-sys-color-on-surface-medium` / `-light` | 次级/说明文字 | 对大字号 ≥ 3:1，正文 ≥ 4.5:1；**材质面板下要按合成后的底色复核** |
| `--md-sys-color-highlight` | 焦点环 | 对相邻两个 layer 都 ≥ 3:1 |
| `--md-sys-color-outline-01` / `-variant-01` | 分隔线、浮层描边 | 可见即可，不承载文字 |

已知陷阱：材质面板（`--md-sys-material-sheet` = `blur(20px) saturate(180%)`）透出下层后，
`on-surface-medium` 会掉到 4.02:1——所以抽屉/侧栏条目统一用主前景，靠 `aria-current` 与底色表示激活，不靠压暗文字。

## 三、布局语汇：组，不是卡

页面骨架固定为：

1. 页头左对齐：`text-display-lg` 标题 + `text-headline-sm` 副题，`pt-8 pb-16 md:pt-12 md:pb-24`。
2. 区块抬头在容器外：`mb-2 px-4 text-label font-semibold text-on-surface-medium`，可有右侧 `aside`（计数 Badge、开关、刷新按钮）。
3. 容器：`rounded-sm bg-surface-02`，**零边框零阴影**。
4. 容器内的行一律 `data-list-item`；容器本身 `data-list-group`。分隔线与缩进由 `hig.css` 的 `[data-list-item]::after` 统一画（从 1rem 缩进、末项自动消失），**不要在行上手写 `border-b … last:border-b-0`**。
5. 行内：图标/头像在左，标题 + 说明两行在左对齐的 `min-w-0 flex-1` 里，行尾是 chevron 或数值；`hover:bg-surface-hover-01 active:bg-surface-pressed-01` 加 `duration-fast-02`。

可用的现成件：

- `Card` / `CardHeader` / `CardTitle` / `CardContent` —— 一个组就是一张 `Card`（内部已带 `data-slot="card"` 与 `data-list-group`），行用 `CardRow` 或 `data-list-item`。
- `ListRow` 式行（`<li data-list-item>` + 上面的行内结构）用于纯链接/按钮列表。
- 表格：`Table` 自带底色/圆角/横向滚动，**不要再套 `overflow-x-auto rounded-sm bg-surface-02` 的 div**（会叠两层底、两个滚动盒）；行分隔线已统一到 0.5px `outline-variant-01`。
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
| `--md-sys-layer-rail` | 10 | 侧栏，从顶栏底边起算 |
| `--md-sys-layer-banner` | 20 | 提示条，紧贴顶栏下方 |
| `--md-sys-layer-header` | 30 | 顶栏 |
| `--md-sys-layer-modal` | 50 | 抽屉、模态对话框（Radix `Sheet` / `Dialog`） |
| `--md-sys-layer-dock` | 60 | 手机底栏 `[data-tabbar]`、播放条 |
| `--md-sys-layer-dock-player` | 61 | 播放条，压在底栏之上 |
| `--md-sys-layer-modal-full` | 65 | 灯箱、全屏歌词（自带完整控制） |
| `--md-sys-layer-popover` | 70 | 菜单 / 下拉 / 选择器 |
| `--md-sys-layer-toast` | 75 | 全局通知 |
| `--md-sys-layer-skip` | 80 | 跳转链接（只在焦点时出现） |

两条容易踩反的规则：

- **dock 压在 modal 之上**，不跟着 modal 一起被抽屉盖。常驻件带自己的实体底，在半屏浮层下它盖住的只是主内容，抽屉展开时照样能切 tab、切歌。代价是它是底部控件的地雷：贴底弹层（`SearchableSelect`）必须按 `[data-dock]` 上沿算可用高度并向上翻转，不能只按视口算；抽屉要自己让出 dock 高度（`src/styles/hig.css` 里 `[data-drawer]` 的 `padding-block-end`）并让 `nav` 内部滚，别让末项躺在 dock 底下。
- **层级正确 ≠ 可点**。Radix 模态会给 `body` 挂 `pointer-events: none`，浮层内的可点元素要显式 `pointer-events-auto`。改 z-index 或 positioning 都治不好。「点了没反应」先把层级和 `pointer-events` 分开查。

## 六、材质

| 用途 | 令牌 |
| --- | --- |
| 顶栏 / 底栏 | `--md-sys-material-bar`（0.85 + `blur(20px)`），`hig.css` 钩 `header.sticky` 与底部固定条 |
| 抽屉 / sheet / 弹窗 | `--md-sys-material-sheet`（0.9 + `blur(24px) saturate(180%)`） |
| 浮层投影 | `--md-sys-shadow-overlay`（单层淡影，暖色推进感） |
| 实心按钮/开关拇指 | `shadow-sm` |

平铺内容只有一处例外可以用影：实心按钮与滑块拇指这类「抬起的实体」。

## 七、修饰符

`data-style` 放在 `<html>` 上，取值来自 `pointer | underline | compact | text-xl`（`src/styles/modifiers.css`）。
修饰符改的是同一设计语言下的可读性/密度偏好，不是另一个主题；新增修饰符要有默认关闭、可组合、不引发布局溢出的证明。

## 八、可访问性钩子

- 跳转链接：`[data-skip-link]`，Tab 首焦点，实底块上必须带自身内衬（`box-shadow: inset 0 0 0 2px var(--md-sys-color-on-primary)`），否则焦点环被自己的 primary 底色吃掉。
- 侧栏 `[data-rail] nav > a`、抽屉 `[data-drawer] nav > a`、手机底栏 `[data-tabbar] a` 的焦点环一律内收：`outline-offset: -2px`，贴边容器改成 `box-shadow` 内环（外扩环会压到相邻行、被屏幕或抽屉边缘裁掉）。
- 抽屉用 `SheetTrigger asChild` 包住触发按钮，不要手写 `onClick(() => setOpen(true))`——Radix 需要知道自己被谁触发，Esc/点关闭后焦点才能回落到菜单键。
- 焦点只能内嵌、不能删：`outline: none` 的规则必须补等价的 `box-shadow`。
- 触达区 ≥ 44px（`--md-sys-size-touch-target`）；图标按钮给 `size-11`，紧凑行靠 `py-*` 撑到 44 而不是缩图标。
- 语义结构：一个 `<h1>`；导航区 `<nav>` 带 `aria-label`；当前项 `aria-current="page"`；纯图标按钮带 `sr-only` 文案。

## 九、校验（提交前）

```bash
bun run typecheck
bunx biome check src scripts
bun scripts/shots.mjs   # 明暗 × 1280/390，含三道闸门
```

`scripts/shots.mjs` 逐页截图并同时输出三道闸门，任一非 0 都要处理：
- `overflow` —— 横向溢出 px（必须全 0，含抽屉打开态）。
- `drawerFail` —— 手机端抽屉、样式修饰菜单没打开（必须 0）。
- `lowContrast` —— 对比度低于 4.5:1（大字 3:1）的文字节点，附选择器与实测比值。
  探针取最近的不透明祖先做底色；背景图/渐变会自动跳过，所以**命中即真问题**，跳过不等于合格。
  报告值不含子像素抗锯齿，4.4~4.5 的边缘值按失败处理。

截图默认落在 `public/_preview/`，`public/preview.html` 可整页速览（目录在 `.gitignore` 里，跑完重生成）。
