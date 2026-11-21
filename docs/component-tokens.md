# 组件槽位索引

> 本文件由 `scripts/gen-cmp-tokens.mjs` 生成，不要手改。
> 改完槽位后跑 `node scripts/gen-cmp-tokens.mjs --write`；`bun run check` 会拒绝过期版本。

组件槽位不预先声明，而是在 TSX 里内联写成 `var(--hig-cmp-x, 默认值)`，
外部用 Tailwind 的任意属性 `[--hig-cmp-x:值]` 覆盖。
「默认」列就是没人覆盖时生效的值，「使用处」列是它出现的位置。

共 246 个槽位，21 组。

## alert（12）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-alert-bg` | `var(--hig-color-surface-02)` | src/components/ui/alert.tsx:11 |
| `--hig-cmp-alert-border` | `var(--hig-color-separator-01)` | src/components/ui/alert.tsx:6 |
| `--hig-cmp-alert-border-width` | `1px` | src/components/ui/alert.tsx:6 |
| `--hig-cmp-alert-danger-bg` | `var(--hig-color-surface-02)` | src/components/ui/alert.tsx:13 |
| `--hig-cmp-alert-danger-border` | `var(--hig-color-error)` | src/components/ui/alert.tsx:13 |
| `--hig-cmp-alert-danger-fg` | `var(--hig-color-error)` | src/components/ui/alert.tsx:13 |
| `--hig-cmp-alert-desc-fg` | `var(--hig-color-label-secondary)` | src/components/ui/alert.tsx:52 |
| `--hig-cmp-alert-fg` | `var(--hig-color-label)` | src/components/ui/alert.tsx:11 |
| `--hig-cmp-alert-icon` | `1rem` | src/components/ui/alert.tsx:6 |
| `--hig-cmp-alert-px` | `1rem` | src/components/ui/alert.tsx:6 |
| `--hig-cmp-alert-py` | `0.75rem` | src/components/ui/alert.tsx:6 |
| `--hig-cmp-alert-radius` | `var(--hig-shape-control)` | src/components/ui/alert.tsx:6 |

## badge（28）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-badge-bg` | `var(--hig-color-chip-background-blue)` | src/components/ui/badge.tsx:25 |
| `--hig-cmp-badge-cyan-bg` | `var(--hig-color-chip-background-cyan)` | src/components/ui/badge.tsx:40 |
| `--hig-cmp-badge-cyan-fg` | `var(--hig-color-chip-color-cyan)` | src/components/ui/badge.tsx:40 |
| `--hig-cmp-badge-danger-bg` | `var(--hig-color-chip-background-red)` | src/components/ui/badge.tsx:32 |
| `--hig-cmp-badge-danger-fg` | `var(--hig-color-chip-color-red)` | src/components/ui/badge.tsx:32 |
| `--hig-cmp-badge-fg` | `var(--hig-color-chip-color-blue)` | src/components/ui/badge.tsx:25 |
| `--hig-cmp-badge-green-bg` | `var(--hig-color-chip-background-green)` | src/components/ui/badge.tsx:34 |
| `--hig-cmp-badge-green-fg` | `var(--hig-color-chip-color-green)` | src/components/ui/badge.tsx:34 |
| `--hig-cmp-badge-h` | `var(--hig-size-control-sm)` | src/components/ui/badge.tsx:47 |
| `--hig-cmp-badge-h-lg` | `var(--hig-size-control-lg)` | src/components/ui/badge.tsx:48 |
| `--hig-cmp-badge-h-sm` | `var(--hig-size-chip-sm)` | src/components/ui/badge.tsx:46 |
| `--hig-cmp-badge-magenta-bg` | `var(--hig-color-chip-background-magenta)` | src/components/ui/badge.tsx:37 |
| `--hig-cmp-badge-magenta-fg` | `var(--hig-color-chip-color-magenta)` | src/components/ui/badge.tsx:37 |
| `--hig-cmp-badge-max-w` | `13rem` | src/components/ui/badge.tsx:17 |
| `--hig-cmp-badge-neutral-bg` | `var(--hig-color-chip-background-gray)` | src/components/ui/badge.tsx:27 |
| `--hig-cmp-badge-neutral-fg` | `var(--hig-color-chip-color-gray)` | src/components/ui/badge.tsx:27 |
| `--hig-cmp-badge-outline-border` | `var(--hig-color-separator-emphasis)` | src/components/ui/badge.tsx:30 |
| `--hig-cmp-badge-outline-fg` | `var(--hig-color-label)` | src/components/ui/badge.tsx:30 |
| `--hig-cmp-badge-purple-bg` | `var(--hig-color-chip-background-purple)` | src/components/ui/badge.tsx:39 |
| `--hig-cmp-badge-purple-fg` | `var(--hig-color-chip-color-purple)` | src/components/ui/badge.tsx:39 |
| `--hig-cmp-badge-px` | `0.75rem` | src/components/ui/badge.tsx:18 |
| `--hig-cmp-badge-px-lg` | `1rem` | src/components/ui/badge.tsx:48 |
| `--hig-cmp-badge-px-sm` | `0.5rem` | src/components/ui/badge.tsx:46 |
| `--hig-cmp-badge-radius` | `var(--hig-shape-max)` | src/components/ui/badge.tsx:18 |
| `--hig-cmp-badge-teal-bg` | `var(--hig-color-chip-background-teal)` | src/components/ui/badge.tsx:35 |
| `--hig-cmp-badge-teal-fg` | `var(--hig-color-chip-color-teal)` | src/components/ui/badge.tsx:35 |
| `--hig-cmp-badge-warm-gray-bg` | `var(--hig-color-chip-background-warm-gray)` | src/components/ui/badge.tsx:42 |
| `--hig-cmp-badge-warm-gray-fg` | `var(--hig-color-chip-color-warm-gray)` | src/components/ui/badge.tsx:42 |

## breadcrumb（6）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-breadcrumb-current-fg` | `var(--hig-color-label)` | src/components/ui/breadcrumb.tsx:68 |
| `--hig-cmp-breadcrumb-ellipsis` | `1.5rem` | src/components/ui/breadcrumb.tsx:93 |
| `--hig-cmp-breadcrumb-fg` | `var(--hig-color-label-secondary)` | src/components/ui/breadcrumb.tsx:20 |
| `--hig-cmp-breadcrumb-gap` | `0.5rem` | src/components/ui/breadcrumb.tsx:20 |
| `--hig-cmp-breadcrumb-link-fg` | `var(--hig-color-link)` | src/components/ui/breadcrumb.tsx:48<br>src/components/ui/breadcrumb.tsx:93 |
| `--hig-cmp-breadcrumb-link-fg-hover` | `var(--hig-color-link-hover)` | src/components/ui/breadcrumb.tsx:48<br>src/components/ui/breadcrumb.tsx:93 |

## button（46）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-button-disabled-bg` | `var(--hig-color-button-filled-disabled)` | src/components/ui/button.tsx:39<br>src/components/ui/button.tsx:46<br>src/components/ui/button.tsx:67 |
| `--hig-cmp-button-disabled-border` | `var(--hig-color-separator-disabled)` | src/components/ui/button.tsx:53 |
| `--hig-cmp-button-disabled-fg` | `var(--hig-color-label-disabled)` | src/components/ui/button.tsx:39<br>src/components/ui/button.tsx:46<br>src/components/ui/button.tsx:53<br>src/components/ui/button.tsx:60<br>src/components/ui/button.tsx:67 |
| `--hig-cmp-button-error-bg` | `var(--hig-color-button-filled-error)` | src/components/ui/button.tsx:64 |
| `--hig-cmp-button-error-bg-active` | `var(--hig-color-button-error-active)` | src/components/ui/button.tsx:66 |
| `--hig-cmp-button-error-bg-hover` | `var(--hig-color-button-error-hover)` | src/components/ui/button.tsx:65 |
| `--hig-cmp-button-error-fg` | `var(--hig-color-on-primary)` | src/components/ui/button.tsx:64 |
| `--hig-cmp-button-filled-bg` | `var(--hig-color-button-filled)` | src/components/ui/button.tsx:36 |
| `--hig-cmp-button-filled-bg-active` | `var(--hig-color-button-filled-active)` | src/components/ui/button.tsx:38 |
| `--hig-cmp-button-filled-bg-hover` | `var(--hig-color-button-filled-hover)` | src/components/ui/button.tsx:37 |
| `--hig-cmp-button-filled-fg` | `var(--hig-color-on-button-filled)` | src/components/ui/button.tsx:36 |
| `--hig-cmp-button-font-size` | `1.0625rem` | src/components/ui/button.tsx:25 |
| `--hig-cmp-button-font-weight` | `600` | src/components/ui/button.tsx:25 |
| `--hig-cmp-button-gap` | `0.5rem` | src/components/ui/button.tsx:23 |
| `--hig-cmp-button-ghost-bg-active` | `var(--hig-color-fill-selected)` | src/components/ui/button.tsx:59 |
| `--hig-cmp-button-ghost-bg-hover` | `var(--hig-color-fill-hover)` | src/components/ui/button.tsx:58 |
| `--hig-cmp-button-ghost-fg` | `var(--hig-color-link)` | src/components/ui/button.tsx:57 |
| `--hig-cmp-button-h` | `var(--hig-size-control)` | src/components/ui/button.tsx:75 |
| `--hig-cmp-button-h-lg` | `var(--hig-size-control-lg)` | src/components/ui/button.tsx:76 |
| `--hig-cmp-button-h-sm` | `var(--hig-size-control-sm)` | src/components/ui/button.tsx:74 |
| `--hig-cmp-button-h-xl` | `var(--hig-size-control-xl)` | src/components/ui/button.tsx:77 |
| `--hig-cmp-button-h-xs` | `var(--hig-size-control-xs)` | src/components/ui/button.tsx:73 |
| `--hig-cmp-button-icon` | `1.125rem` | src/components/ui/button.tsx:29 |
| `--hig-cmp-button-line-height` | `1.2941` | src/components/ui/button.tsx:25 |
| `--hig-cmp-button-link-fg` | `var(--hig-color-link)` | src/components/ui/button.tsx:69 |
| `--hig-cmp-button-link-fg-hover` | `var(--hig-color-link-hover)` | src/components/ui/button.tsx:69 |
| `--hig-cmp-button-max-w` | `20rem` | src/components/ui/button.tsx:23 |
| `--hig-cmp-button-outline-bg-active` | `var(--hig-color-fill-selected)` | src/components/ui/button.tsx:52 |
| `--hig-cmp-button-outline-bg-hover` | `var(--hig-color-fill-hover)` | src/components/ui/button.tsx:51 |
| `--hig-cmp-button-outline-color` | `var(--hig-color-separator-emphasis)` | src/components/ui/button.tsx:50 |
| `--hig-cmp-button-outline-fg` | `var(--hig-color-link)` | src/components/ui/button.tsx:50 |
| `--hig-cmp-button-outline-width` | `1px` | src/components/ui/button.tsx:50 |
| `--hig-cmp-button-px` | `1rem` | src/components/ui/button.tsx:75 |
| `--hig-cmp-button-px-lg` | `1.5rem` | src/components/ui/button.tsx:76 |
| `--hig-cmp-button-px-sm` | `0.75rem` | src/components/ui/button.tsx:74 |
| `--hig-cmp-button-px-xl` | `2rem` | src/components/ui/button.tsx:77 |
| `--hig-cmp-button-px-xs` | `0.5rem` | src/components/ui/button.tsx:73 |
| `--hig-cmp-button-radius` | `var(--hig-shape-control)` | src/components/ui/button.tsx:24 |
| `--hig-cmp-button-size-icon` | `var(--hig-size-control-xl)` | src/components/ui/button.tsx:78 |
| `--hig-cmp-button-size-icon-lg` | `var(--hig-size-control-2xl)` | src/components/ui/button.tsx:80 |
| `--hig-cmp-button-size-icon-sm` | `var(--hig-size-control)` | src/components/ui/button.tsx:79 |
| `--hig-cmp-button-tonal-bg` | `var(--hig-color-button-tonal)` | src/components/ui/button.tsx:43 |
| `--hig-cmp-button-tonal-bg-active` | `var(--hig-color-button-tonal-active)` | src/components/ui/button.tsx:45 |
| `--hig-cmp-button-tonal-bg-hover` | `var(--hig-color-button-tonal-hover)` | src/components/ui/button.tsx:44 |
| `--hig-cmp-button-tonal-fg` | `var(--hig-color-on-button-tonal)` | src/components/ui/button.tsx:43 |
| `--hig-cmp-button-tracking` | `-0.011em` | src/components/ui/button.tsx:25 |

## card（8）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-card-bg` | `var(--hig-color-surface-02)` | src/components/ui/card.tsx:21 |
| `--hig-cmp-card-desc-fg` | `var(--hig-color-label-secondary)` | src/components/ui/card.tsx:70 |
| `--hig-cmp-card-px` | `1rem` | src/components/ui/card.tsx:114<br>src/components/ui/card.tsx:37<br>src/components/ui/card.tsx:83 |
| `--hig-cmp-card-radius` | `var(--hig-shape-control)` | src/components/ui/card.tsx:21 |
| `--hig-cmp-card-row-bg-active` | `var(--hig-color-fill-pressed)` | src/components/ui/card.tsx:115 |
| `--hig-cmp-card-row-bg-hover` | `var(--hig-color-fill-secondary)` | src/components/ui/card.tsx:115 |
| `--hig-cmp-card-row-py` | `0.75rem` | src/components/ui/card.tsx:114 |
| `--hig-cmp-card-title-fg` | `var(--hig-color-label-secondary)` | src/components/ui/card.tsx:53 |

## checkbox（7）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-checkbox-bg` | `var(--hig-color-surface-01)` | src/components/ui/checkbox.tsx:26 |
| `--hig-cmp-checkbox-border` | `var(--hig-color-separator-01)` | src/components/ui/checkbox.tsx:26 |
| `--hig-cmp-checkbox-border-width` | `var(--hig-size-border-thin)` | src/components/ui/checkbox.tsx:26 |
| `--hig-cmp-checkbox-checked-bg` | `var(--hig-color-success)` | src/components/ui/checkbox.tsx:34<br>src/components/ui/checkbox.tsx:35 |
| `--hig-cmp-checkbox-mark` | `var(--hig-color-on-button-filled)` | src/components/ui/checkbox.tsx:45 |
| `--hig-cmp-checkbox-radius` | `var(--hig-shape-08)` | src/components/ui/checkbox.tsx:25 |
| `--hig-cmp-checkbox-size` | `1.1875rem` | src/components/ui/checkbox.tsx:25 |

## field（43）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-field-bg` | `var(--hig-color-field)` | src/components/ui/input.tsx:21<br>src/components/ui/select.tsx:22<br>src/components/ui/textarea.tsx:16 |
| `--hig-cmp-field-bg-disabled` | `var(--hig-color-fill-disabled)` | src/components/ui/input.tsx:29<br>src/components/ui/select.tsx:30<br>src/components/ui/textarea.tsx:24 |
| `--hig-cmp-field-bg-focus` | `var(--hig-color-surface-01)` | src/components/ui/input.tsx:27<br>src/components/ui/select.tsx:27<br>src/components/ui/select.tsx:28<br>src/components/ui/select.tsx:29<br>src/components/ui/textarea.tsx:22 |
| `--hig-cmp-field-bg-hover` | `var(--hig-color-field-hover)` | src/components/ui/input.tsx:26<br>src/components/ui/select.tsx:24<br>src/components/ui/textarea.tsx:21 |
| `--hig-cmp-field-border` | `var(--hig-color-separator-field)` | src/components/ui/input.tsx:21<br>src/components/ui/select.tsx:22<br>src/components/ui/textarea.tsx:16 |
| `--hig-cmp-field-border-disabled` | `var(--hig-color-separator-disabled)` | src/components/ui/input.tsx:29<br>src/components/ui/select.tsx:30<br>src/components/ui/textarea.tsx:24 |
| `--hig-cmp-field-border-focus` | `var(--hig-color-primary)` | src/components/ui/input.tsx:27<br>src/components/ui/select.tsx:27<br>src/components/ui/select.tsx:28<br>src/components/ui/select.tsx:29<br>src/components/ui/textarea.tsx:22 |
| `--hig-cmp-field-border-hover` | `var(--hig-color-separator-emphasis)` | src/components/ui/input.tsx:26<br>src/components/ui/select.tsx:24<br>src/components/ui/textarea.tsx:21 |
| `--hig-cmp-field-border-invalid` | `var(--hig-color-error)` | src/components/ui/input.tsx:28<br>src/components/ui/select.tsx:31<br>src/components/ui/textarea.tsx:23 |
| `--hig-cmp-field-border-width` | `1px` | src/components/ui/input.tsx:21<br>src/components/ui/select.tsx:22<br>src/components/ui/textarea.tsx:16 |
| `--hig-cmp-field-content-gap` | `0.5rem` | src/components/ui/field.tsx:101 |
| `--hig-cmp-field-desc-fg` | `var(--hig-color-label-secondary)` | src/components/ui/field.tsx:142 |
| `--hig-cmp-field-desc-link-fg` | `var(--hig-color-primary)` | src/components/ui/field.tsx:144 |
| `--hig-cmp-field-desc-size` | `0.9375rem` | src/components/ui/field.tsx:142 |
| `--hig-cmp-field-error-fg` | `var(--hig-color-error)` | src/components/ui/field.tsx:221 |
| `--hig-cmp-field-error-size` | `0.9375rem` | src/components/ui/field.tsx:221 |
| `--hig-cmp-field-fg` | `var(--hig-color-label)` | src/components/ui/input.tsx:22<br>src/components/ui/select.tsx:22<br>src/components/ui/textarea.tsx:17 |
| `--hig-cmp-field-fg-disabled` | `var(--hig-color-label-disabled)` | src/components/ui/input.tsx:29<br>src/components/ui/select.tsx:30<br>src/components/ui/textarea.tsx:24 |
| `--hig-cmp-field-gap` | `0.75rem` | src/components/ui/field.tsx:58 |
| `--hig-cmp-field-group-gap` | `2rem` | src/components/ui/field.tsx:49 |
| `--hig-cmp-field-group-gap-nested` | `1rem` | src/components/ui/field.tsx:49 |
| `--hig-cmp-field-group-gap-tight` | `0.75rem` | src/components/ui/field.tsx:49 |
| `--hig-cmp-field-h` | `var(--hig-size-field)` | src/components/ui/input.tsx:21<br>src/components/ui/select.tsx:22 |
| `--hig-cmp-field-invalid-fg` | `var(--hig-color-error)` | src/components/ui/field.tsx:58 |
| `--hig-cmp-field-label-box-p` | `1rem` | src/components/ui/field.tsx:115 |
| `--hig-cmp-field-label-box-radius` | `var(--hig-shape-08)` | src/components/ui/field.tsx:115 |
| `--hig-cmp-field-label-gap` | `0.5rem` | src/components/ui/field.tsx:114<br>src/components/ui/field.tsx:129 |
| `--hig-cmp-field-legend-fg` | `var(--hig-color-label)` | src/components/ui/field.tsx:34 |
| `--hig-cmp-field-legend-size` | `1.0625rem` | src/components/ui/field.tsx:35 |
| `--hig-cmp-field-legend-size-sm` | `0.9375rem` | src/components/ui/field.tsx:36 |
| `--hig-cmp-field-legend-weight` | `500` | src/components/ui/field.tsx:34 |
| `--hig-cmp-field-px` | `1rem` | src/components/ui/input.tsx:21<br>src/components/ui/select.tsx:22<br>src/components/ui/textarea.tsx:16 |
| `--hig-cmp-field-radius` | `var(--hig-shape-control)` | src/components/ui/input.tsx:21<br>src/components/ui/select.tsx:22<br>src/components/ui/textarea.tsx:16 |
| `--hig-cmp-field-sep-bg` | `var(--hig-color-surface)` | src/components/ui/field.tsx:172 |
| `--hig-cmp-field-sep-bleed` | `0.5rem` | src/components/ui/field.tsx:164 |
| `--hig-cmp-field-sep-fg` | `var(--hig-color-label-secondary)` | src/components/ui/field.tsx:172 |
| `--hig-cmp-field-sep-h` | `1.25rem` | src/components/ui/field.tsx:164 |
| `--hig-cmp-field-sep-size` | `0.9375rem` | src/components/ui/field.tsx:164 |
| `--hig-cmp-field-set-gap` | `1.5rem` | src/components/ui/field.tsx:15 |
| `--hig-cmp-field-set-gap-tight` | `0.75rem` | src/components/ui/field.tsx:16 |
| `--hig-cmp-field-title-fg` | `var(--hig-color-label)` | src/components/ui/field.tsx:129 |
| `--hig-cmp-field-title-size` | `0.9375rem` | src/components/ui/field.tsx:129 |
| `--hig-cmp-field-title-weight` | `500` | src/components/ui/field.tsx:129 |

## label（4）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-label-fg` | `var(--hig-color-label-secondary)` | src/components/ui/label.tsx:16 |
| `--hig-cmp-label-gap` | `0.5rem` | src/components/ui/label.tsx:16 |
| `--hig-cmp-label-size` | `0.8125rem` | src/components/ui/label.tsx:16 |
| `--hig-cmp-label-weight` | `500` | src/components/ui/label.tsx:16 |

## menu（13）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-menu-bg` | `var(--hig-color-surface-02)` | src/components/ui/dropdown-menu.tsx:51<br>src/components/ui/dropdown-menu.tsx:72 |
| `--hig-cmp-menu-border` | `var(--hig-color-separator-01)` | src/components/ui/dropdown-menu.tsx:51<br>src/components/ui/dropdown-menu.tsx:72 |
| `--hig-cmp-menu-item-bg-checked` | `var(--hig-color-fill-selected-solid-strong)` | src/components/ui/select.tsx:139 |
| `--hig-cmp-menu-item-bg-focus` | `var(--hig-color-fill-pressed)` | src/components/ui/dropdown-menu.tsx:113<br>src/components/ui/dropdown-menu.tsx:138<br>src/components/ui/dropdown-menu.tsx:31<br>src/components/ui/dropdown-menu.tsx:95<br>src/components/ui/select.tsx:138 |
| `--hig-cmp-menu-item-bg-hover` | `var(--hig-color-fill-tertiary)` | src/components/ui/dropdown-menu.tsx:113<br>src/components/ui/dropdown-menu.tsx:138<br>src/components/ui/dropdown-menu.tsx:31<br>src/components/ui/dropdown-menu.tsx:95<br>src/components/ui/select.tsx:138 |
| `--hig-cmp-menu-item-h` | `var(--hig-size-row)` | src/components/ui/dropdown-menu.tsx:112<br>src/components/ui/dropdown-menu.tsx:137<br>src/components/ui/dropdown-menu.tsx:94<br>src/components/ui/select.tsx:136 |
| `--hig-cmp-menu-item-indicator-inset` | `0.5rem` | src/components/ui/select.tsx:145 |
| `--hig-cmp-menu-item-pe` | `0.5rem` | src/components/ui/dropdown-menu.tsx:112<br>src/components/ui/dropdown-menu.tsx:137<br>src/components/ui/dropdown-menu.tsx:30<br>src/components/ui/dropdown-menu.tsx:94 |
| `--hig-cmp-menu-item-ps` | `1rem` | src/components/ui/dropdown-menu.tsx:120<br>src/components/ui/dropdown-menu.tsx:144<br>src/components/ui/dropdown-menu.tsx:163<br>src/components/ui/dropdown-menu.tsx:30<br>src/components/ui/dropdown-menu.tsx:94 |
| `--hig-cmp-menu-item-px` | `1rem` | src/components/ui/select.tsx:136 |
| `--hig-cmp-menu-min-w` | `11.5rem` | src/components/ui/dropdown-menu.tsx:51<br>src/components/ui/dropdown-menu.tsx:72 |
| `--hig-cmp-menu-radius` | `var(--hig-shape-08)` | src/components/ui/dropdown-menu.tsx:51<br>src/components/ui/dropdown-menu.tsx:72 |
| `--hig-cmp-menu-separator` | `var(--hig-color-separator)` | src/components/ui/dropdown-menu.tsx:178<br>src/components/ui/select.tsx:161 |

## popover（4）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-popover-bg` | `var(--hig-color-material-sheet)` | src/components/ui/select.tsx:89 |
| `--hig-cmp-popover-blur` | `20px` | src/components/ui/select.tsx:89 |
| `--hig-cmp-popover-border` | `var(--hig-color-separator-01)` | src/components/ui/select.tsx:89 |
| `--hig-cmp-popover-radius` | `var(--hig-shape-08)` | src/components/ui/select.tsx:89 |

## progress（3）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-progress-h` | `var(--hig-size-progress-height)` | src/components/ui/progress.tsx:27<br>src/components/ui/progress.tsx:51 |
| `--hig-cmp-progress-indicator` | `var(--hig-color-primary)` | src/components/ui/progress.tsx:35<br>src/components/ui/progress.tsx:56<br>src/components/ui/progress.tsx:57 |
| `--hig-cmp-progress-track` | `var(--hig-color-primary)` | src/components/ui/progress.tsx:27<br>src/components/ui/progress.tsx:51 |

## radio（5）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-radio-border` | `var(--hig-color-separator-01)` | src/components/ui/radio-group.tsx:50 |
| `--hig-cmp-radio-border-checked` | `var(--hig-color-primary)` | src/components/ui/radio-group.tsx:58 |
| `--hig-cmp-radio-border-width` | `var(--hig-size-border-thin)` | src/components/ui/radio-group.tsx:50 |
| `--hig-cmp-radio-dot` | `var(--hig-color-primary)` | src/components/ui/radio-group.tsx:80 |
| `--hig-cmp-radio-size` | `1.25rem` | src/components/ui/radio-group.tsx:49 |

## scrim（1）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-scrim` | `var(--hig-color-scrim)` | src/components/ui/sheet.tsx:12<br>src/components/ui/sheet.tsx:30 |

## segmented（6）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-segmented-h` | `2rem` | src/components/ui/radio-group.tsx:61 |
| `--hig-cmp-segmented-item-bg-checked` | `var(--hig-color-surface-01)` | src/components/ui/radio-group.tsx:69 |
| `--hig-cmp-segmented-item-radius` | `var(--hig-shape-08)` | src/components/ui/radio-group.tsx:62 |
| `--hig-cmp-segmented-px` | `1rem` | src/components/ui/radio-group.tsx:63 |
| `--hig-cmp-segmented-radius` | `var(--hig-shape-control)` | src/components/ui/radio-group.tsx:32 |
| `--hig-cmp-segmented-track-bg` | `var(--hig-color-fill-subtle)` | src/components/ui/radio-group.tsx:32 |

## separator（1）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-separator` | `var(--hig-color-separator-01)` | src/components/ui/separator.tsx:11<br>src/components/ui/separator.tsx:23 |

## sheet（8）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-sheet-bg` | `var(--hig-color-surface-01)` | src/components/ui/sheet.tsx:45 |
| `--hig-cmp-sheet-close-fg` | `var(--hig-color-label)` | src/components/ui/sheet.tsx:88 |
| `--hig-cmp-sheet-close-inset` | `0` | src/components/ui/sheet.tsx:88 |
| `--hig-cmp-sheet-close-size` | `3rem` | src/components/ui/sheet.tsx:88 |
| `--hig-cmp-sheet-desc-fg` | `var(--hig-color-label-secondary)` | src/components/ui/sheet.tsx:135 |
| `--hig-cmp-sheet-max-w` | `24rem` | src/components/ui/sheet.tsx:58<br>src/components/ui/sheet.tsx:60 |
| `--hig-cmp-sheet-p` | `1rem` | src/components/ui/sheet.tsx:45 |
| `--hig-cmp-sheet-radius` | `var(--hig-shape-container)` | src/components/ui/sheet.tsx:57 |

## slider（5）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-slider-range-bg` | `var(--hig-color-primary)` | src/components/ui/slider.tsx:47 |
| `--hig-cmp-slider-thumb` | `1.75rem` | src/components/ui/slider.tsx:55 |
| `--hig-cmp-slider-thumb-bg` | `var(--hig-palette-white)` | src/components/ui/slider.tsx:55 |
| `--hig-cmp-slider-track-bg` | `var(--hig-color-fill-quaternary)` | src/components/ui/slider.tsx:42 |
| `--hig-cmp-slider-track-h` | `0.25rem` | src/components/ui/slider.tsx:42 |

## switch（9）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-switch-offset-off` | `2px` | src/components/ui/switch.tsx:42 |
| `--hig-cmp-switch-offset-on` | `22px` | src/components/ui/switch.tsx:43 |
| `--hig-cmp-switch-thumb` | `var(--hig-size-switch-thumb)` | src/components/ui/switch.tsx:40 |
| `--hig-cmp-switch-thumb-bg` | `var(--hig-palette-white)` | src/components/ui/switch.tsx:40 |
| `--hig-cmp-switch-thumb-bg-on` | `var(--hig-color-on-button-filled)` | src/components/ui/switch.tsx:44 |
| `--hig-cmp-switch-track-bg` | `var(--hig-color-fill-quaternary)` | src/components/ui/switch.tsx:24 |
| `--hig-cmp-switch-track-bg-on` | `var(--hig-color-success)` | src/components/ui/switch.tsx:25 |
| `--hig-cmp-switch-track-h` | `var(--hig-size-switch-track-h)` | src/components/ui/switch.tsx:23 |
| `--hig-cmp-switch-track-w` | `var(--hig-size-switch-track-w)` | src/components/ui/switch.tsx:23 |

## table（11）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-table-bg` | `var(--hig-color-surface-02)` | src/components/ui/table.tsx:18 |
| `--hig-cmp-table-border` | `var(--hig-color-separator-01)` | src/components/ui/table.tsx:18 |
| `--hig-cmp-table-caption-fg` | `var(--hig-color-label-secondary)` | src/components/ui/table.tsx:111 |
| `--hig-cmp-table-cell-px` | `1rem` | src/components/ui/table.tsx:79<br>src/components/ui/table.tsx:95 |
| `--hig-cmp-table-head-bg` | `var(--hig-color-fill-subtle)` | src/components/ui/table.tsx:79 |
| `--hig-cmp-table-head-fg` | `var(--hig-color-label-secondary)` | src/components/ui/table.tsx:79 |
| `--hig-cmp-table-radius` | `var(--hig-shape-control)` | src/components/ui/table.tsx:18 |
| `--hig-cmp-table-row-bg-hover` | `var(--hig-color-fill-secondary)` | src/components/ui/table.tsx:63 |
| `--hig-cmp-table-row-bg-selected` | `var(--hig-color-fill-selected-solid)` | src/components/ui/table.tsx:63 |
| `--hig-cmp-table-row-border` | `var(--hig-color-separator-variant)` | src/components/ui/table.tsx:62 |
| `--hig-cmp-table-row-h` | `3.25rem` | src/components/ui/table.tsx:79<br>src/components/ui/table.tsx:95 |

## tabs（10）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-tabs-radius` | `var(--hig-shape-control)` | src/components/ui/tabs.tsx:25 |
| `--hig-cmp-tabs-track-bg` | `var(--hig-color-fill-subtle)` | src/components/ui/tabs.tsx:25 |
| `--hig-cmp-tabs-trigger-bg-active` | `var(--hig-color-surface-01)` | src/components/ui/tabs.tsx:44 |
| `--hig-cmp-tabs-trigger-bg-hover` | `var(--hig-color-fill-hover)` | src/components/ui/tabs.tsx:43 |
| `--hig-cmp-tabs-trigger-fg` | `var(--hig-color-label-secondary)` | src/components/ui/tabs.tsx:41 |
| `--hig-cmp-tabs-trigger-fg-active` | `var(--hig-color-label)` | src/components/ui/tabs.tsx:44 |
| `--hig-cmp-tabs-trigger-fg-hover` | `var(--hig-color-label)` | src/components/ui/tabs.tsx:43 |
| `--hig-cmp-tabs-trigger-h` | `var(--hig-size-control-sm)` | src/components/ui/tabs.tsx:41 |
| `--hig-cmp-tabs-trigger-px` | `1rem` | src/components/ui/tabs.tsx:41 |
| `--hig-cmp-tabs-trigger-radius` | `var(--hig-shape-08)` | src/components/ui/tabs.tsx:41 |

## toast（16）

| 槽位 | 默认 | 使用处 |
| --- | --- | --- |
| `--hig-cmp-toast-action-fg` | `var(--hig-color-on-inverse-primary)` | src/components/ui/toast.tsx:93 |
| `--hig-cmp-toast-action-px` | `0.5rem` | src/components/ui/toast.tsx:93 |
| `--hig-cmp-toast-action-radius` | `var(--hig-shape-control)` | src/components/ui/toast.tsx:93 |
| `--hig-cmp-toast-action-size` | `0.9375rem` | src/components/ui/toast.tsx:93 |
| `--hig-cmp-toast-action-tracking` | `0.02em` | src/components/ui/toast.tsx:93 |
| `--hig-cmp-toast-action-weight` | `600` | src/components/ui/toast.tsx:93 |
| `--hig-cmp-toast-bg` | `var(--hig-color-inverse-surface)` | src/components/ui/toast.tsx:47 |
| `--hig-cmp-toast-close-fg` | `var(--hig-color-label-inverse)` | src/components/ui/toast.tsx:109 |
| `--hig-cmp-toast-close-fg-hover` | `var(--hig-color-label-inverse)` | src/components/ui/toast.tsx:110 |
| `--hig-cmp-toast-desc-fg` | `var(--hig-color-label-inverse)` | src/components/ui/toast.tsx:79 |
| `--hig-cmp-toast-fg` | `var(--hig-color-label-inverse)` | src/components/ui/toast.tsx:47 |
| `--hig-cmp-toast-hover-bg` | `var(--hig-color-label-inverse)` | src/components/ui/toast.tsx:110 |
| `--hig-cmp-toast-max-w` | `var(--hig-size-toast-width)` | src/components/ui/toast.tsx:47 |
| `--hig-cmp-toast-min-h` | `var(--hig-size-row)` | src/components/ui/toast.tsx:47 |
| `--hig-cmp-toast-px` | `1rem` | src/components/ui/toast.tsx:20 |
| `--hig-cmp-toast-radius` | `var(--hig-shape-overlay)` | src/components/ui/toast.tsx:20 |
