/**
 * 指令家族：把写死的数值参数变成可编辑字段。
 *
 * commands.json 里 70%（732/1042）的条目其实是同一条指令的 ID 排列，
 * 每条都把数量/等级/品质/坐标冻死了：
 *   /setboat 1 4000000 1   数量永远是 1
 *   /resource 1 9999999    数量永远是 999 万
 *   /place 1 1 1000000 1   坐标永远 1,1、等级永远 1
 * 这里给每个家族标注各数字位的含义，实体位保持不动（它是这条的身份），
 * 其余位开放成带标签的输入框。
 */

export type ArgRole = 'entity' | 'value'

export interface FamilyArg {
  /** 第几个数字参数，0 起 */
  index: number
  role: ArgRole
  labelZh: string
  labelEn: string
  presets?: number[]
  min?: number
}

export interface CommandFamily {
  id: string
  labelZh: string
  labelEn: string
  match: RegExp
  args: FamilyArg[]
  /** 名字里写死的值，展示时剥掉：「获取9百万金币」→「金币」 */
  stripName?: RegExp
}

const AMOUNT_PRESETS = [999, 99999, 9999999]
const COUNT_PRESETS = [1, 10, 50]
const LEVEL_PRESETS = [1, 10, 25]

export const COMMAND_FAMILIES: CommandFamily[] = [
  {
    id: 'resource',
    labelZh: '资源',
    labelEn: 'Resource',
    match: /^\/resource\s+\d+\s+\d+\s*$/i,
    args: [
      { index: 0, role: 'entity', labelZh: '资源', labelEn: 'Resource' },
      {
        index: 1,
        role: 'value',
        labelZh: '数量',
        labelEn: 'Amount',
        presets: AMOUNT_PRESETS,
        min: 0
      }
    ],
    stripName: /^获取\d*百?万?/
  },
  {
    id: 'setboat',
    labelZh: '部队',
    labelEn: 'Troop',
    match: /^\/setboat\s+\d+\s+\d+\s+\d+\s*$/i,
    args: [
      { index: 0, role: 'value', labelZh: '船位', labelEn: 'Boat', presets: [1, 2, 3], min: 1 },
      { index: 1, role: 'entity', labelZh: '部队', labelEn: 'Troop' },
      { index: 2, role: 'value', labelZh: '数量', labelEn: 'Count', presets: COUNT_PRESETS, min: 1 }
    ]
  },
  {
    id: 'place-building',
    labelZh: '建筑',
    labelEn: 'Building',
    match: /^\/place\s+\d+\s+\d+\s+\d+\s+\d+\s*$/i,
    args: [
      { index: 0, role: 'value', labelZh: 'X', labelEn: 'X', min: 0 },
      { index: 1, role: 'value', labelZh: 'Y', labelEn: 'Y', min: 0 },
      { index: 2, role: 'entity', labelZh: '建筑', labelEn: 'Building' },
      { index: 3, role: 'value', labelZh: '等级', labelEn: 'Level', presets: LEVEL_PRESETS, min: 0 }
    ]
  },
  {
    id: 'place-deco',
    labelZh: '装饰 / 障碍',
    labelEn: 'Decoration',
    match: /^\/place\s+\d+\s+\d+\s+\d+\s*$/i,
    args: [
      { index: 0, role: 'value', labelZh: 'X', labelEn: 'X', min: 0 },
      { index: 1, role: 'value', labelZh: 'Y', labelEn: 'Y', min: 0 },
      { index: 2, role: 'entity', labelZh: '对象', labelEn: 'Object' }
    ]
  },
  {
    id: 'engraving-level',
    labelZh: '雕刻等级',
    labelEn: 'Engraving level',
    match: /^\/engraving\s+level\s+\d+\s+\d+\s*$/i,
    args: [
      { index: 0, role: 'entity', labelZh: '雕刻', labelEn: 'Engraving' },
      { index: 1, role: 'value', labelZh: '等级', labelEn: 'Level', presets: [0, 5, 10], min: 0 }
    ],
    stripName: /\s*\d+\s*级\s*$/
  },
  {
    id: 'engraving-quality',
    labelZh: '雕刻品质',
    labelEn: 'Engraving quality',
    match: /^\/engraving\s+quality\s+\d+\s+\d+\s*$/i,
    args: [
      { index: 0, role: 'entity', labelZh: '雕刻', labelEn: 'Engraving' },
      { index: 1, role: 'value', labelZh: '品质', labelEn: 'Quality', presets: [0, 3, 6], min: 0 }
    ],
    stripName: /\s*\d+\s*品质\s*$/
  },
  {
    id: 'getstatue',
    labelZh: '雕像',
    labelEn: 'Statue',
    match: /^\/getstatue\s+\d+\s+\d+\s+\d+\s*$/i,
    args: [
      { index: 0, role: 'entity', labelZh: '类型', labelEn: 'Type' },
      { index: 1, role: 'entity', labelZh: '属性', labelEn: 'Attribute' },
      {
        index: 2,
        role: 'value',
        labelZh: '百分比',
        labelEn: 'Percent',
        presets: [100, 999, 9999],
        min: 0
      }
    ],
    stripName: /\d+%\s*$/
  }
]

export function matchFamily(command: string): CommandFamily | null {
  return COMMAND_FAMILIES.find((f) => f.match.test(command.trim())) ?? null
}

/** 取出指令里所有数字参数 */
export function extractNumbers(command: string): string[] {
  return command.match(/\d+/g) ?? []
}

/** 用新的数字参数拼回指令，保留原有分隔与前后缀 */
export function applyNumbers(command: string, values: string[]): string {
  let i = 0
  return command.replace(/\d+/g, (orig) => {
    const v = values[i++]
    return v !== undefined && v !== '' ? v : orig
  })
}

/** 展示名去掉写死的数值，如「获取9百万金币」→「金币」、「肾上腺素 1级」→「肾上腺素」 */
export function displayName(name: string, family: CommandFamily | null): string {
  if (!family?.stripName) return name
  const cleaned = name.replace(family.stripName, '').trim()
  return cleaned || name
}
