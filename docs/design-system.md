# 设计系统约定

四套皮肤（Apple HIG 默认 / M2 / Carbon / Fluent 2）共用一套令牌、一套组件、一套不变式。
新增页面、组件或皮肤时按本文执行；与本文冲突的写法视为缺陷。

## 一、三层令牌，只准单向引用

| 层 | 位置 | 示例 | 谁可以引用 |
| --- | --- | --- | --- |
| L0 原子 | `src/styles/tokens.css` 的 `--md-sys-shape-*`、`--md-sys-motion-*`、`--md-sys-size-*`；`src/app/globals.css` 的 `--text-*`、`--spacing`、`--radius-*` | `--md-sys-shape-04`、`--md-sys-motion-short-3`、`--text-body-02` | 只有 L1 |
| L1 语义 | `src/styles/tokens.css` 的 `--md-sys-color-*`、`--md-sys-elevation-*` | `--md-sys-color-primary`、`--md-sys-elevation-02` | 皮肤、组件 |
| L2 组件 | 组件自身（Tailwind 主题别名的 `bg-surface-01` / `text-on-surface` 等） | `bg-surface-hover-01` | 只在本组件内 |

规则：

- 组件里写语义名或 Tailwind 别名，**不写裸 hex、不写 `rgba()` 字面量**（除非是在定义令牌）。
- 字号只用 `--text-*` 阶（`text-body-02`、`text-headline-05`…），禁止 `text-[13px]` 这类裸 px；行高与字重随阶走。
- 间距按 Tailwind 的 4px 基数阶（`p-4`、`gap-2`），不要 13px / 18px 的野生值。
- 圆角只用 `--md-sys-shape-*` 或 `rounded-*` 别名，直角皮肤在皮肤层把它改 0，组件不判断皮肤。

## 二、语义色契约（改皮肤必须守恒的部分）

一层皮肤可以换掉**颜色值**，但不能减少语义——每个语义变量都必须有定义，且满足对应的对比度下限：

| 语义 | 用途 | 不变量 |
| --- | --- | --- |
| `--md-sys-color-on-primary` / `-primary-container` | 实底按钮、徽标前景 | 对 primary ≥ 4.5:1；不足时补白/黑内衬 |
| `--md-sys-color-on-surface` | 正文 | 对 surface 系列 ≥ 4.5:1 |
| `--md-sys-color-on-surface-medium` / `-light` | 次级/说明文字 | 对大字号 ≥ 3:1，正文 ≥ 4.5:1；**半透明面板下要按合成后的底色复核** |
| `--md-sys-color-highlight` / `--skin-focus-ring` | 焦点环 | 对相邻两个 layer 都 ≥ 3:1 |
| `--md-sys-color-outline` / `-variant` | 边框、分隔线 | 可见即可，不承载文字 |

已知陷阱：Fluent 的亚克力抽屉（`--skin-acrylic` 78% 白）透出下层后，`#616161` 的次级前景只有 4.02:1——所以抽屉/侧栏条目统一用主前景，靠 `aria-current` 与底色表示激活，不靠压暗文字。

## 三、皮肤只许改四件事

1. **形状**：圆角、描边、分隔线位置（Carbon 只留底线的输入框、Apple 的 16 圆角卡片）。
2. **层级**：layer / 阴影 / 材质（Carbon 的 layer 阶梯、Fluent 的亚克力与 8px 偏移、Apple 的 sheet 材质）。
3. **密度与尺寸**：栏宽、行高、触达区域（Apple 44px、Carbon 12rem 直角栏）。
4. **焦点与状态表现**：焦点环形状与颜色（见第五节）、hover/按下/选中的具体视觉。

皮肤**不许**改：DOM 结构、文案、断点语义、修饰符开关、组件 Prop 名。

每套皮肤文件顶部必须有一段头注释写清来源规范与理由（现有四份都是这个格式），新皮肤照写。

## 四、修饰符与皮肤正交

`data-style` 放在 `<html>` 上，取值来自 `pointer | underline | compact | text-xl`（`src/styles/modifiers.css`）。
修饰符改的是「同一皮肤下的可读性/密度偏好」，不要把它做成第 5 套皮肤；新增修饰符要有默认关闭、可组合、不引发布局溢出的证明。

## 五、可访问性钩子

- 跳转链接：`[data-skip-link]`，Tab 首焦点，实底块上必须带自身内衬（`box-shadow: inset 0 0 0 2px var(--md-sys-color-on-primary)`），否则焦点环被自己的 primary 底色吃掉。
- 侧栏 `[data-rail] nav > a`、抽屉 `[data-drawer] nav > a`、手机底栏 `[data-tabbar] a` 的焦点环一律内收：`outline-offset: -2px`，贴边容器改成 `box-shadow` 内环（外扩环会压到相邻行、被屏幕或抽屉边缘裁掉）。
- 抽屉用 `SheetTrigger asChild` 包住触发按钮，不要手写 `onClick(() => setOpen(true))`——Radix 需要知道自己被谁触发，Esc/点关闭后焦点才能回落到菜单键。
- 焦点只能内嵌、不能删：`outline: none` 的规则必须补等价的 `box-shadow`。
- 语义结构：一个 `<h1>`；导航区 `<nav>` 带 `aria-label`；当前项 `aria-current="page"`；纯图标按钮带 `sr-only` 文案。

## 六、校验（提交前）

```bash
bun run typecheck
bunx biome check src scripts
bun scripts/shots.mjs   # 四皮肤 × 明暗 × 1280/390，含三道闸门
```

`scripts/shots.mjs` 会在四皮肤 × 明暗 × 1280/390 下逐页截图，并同时输出三道闸门，任一非 0 都要处理：

- `overflow` —— 横向溢出 px（必须全 0，含抽屉打开态）。
- `drawerFail` —— 手机端抽屉、宽屏皮肤菜单没打开（必须 0）。
- `lowContrast` —— 对比度低于 4.5:1（大字 3:1）的文字节点，附选择器与实测比值。
  探针取最近的不透明祖先做底色；背景图/渐变会自动跳过，所以**命中即真问题**，跳过不等于合格。
  报告值不含子像素抗锯齿，4.4~4.5 的边缘值按失败处理。

截图默认落在 `public/_preview/`，`public/preview.html` 可整页速览（目录在 `.gitignore` 里，跑完重生成）。

## 七、新增页面配方

用现有组件（`Card`、`Button`、`Input`、`Sheet`、`Table`…）而不是手搓类名组合；容器用 `container-page`，区块间距用 `space-y-5` 级别的一档并保持页内统一。纯展示区可以直连令牌，但禁止出现第三套自造色板。
