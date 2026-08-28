/**
 * 聊天彩色字体的色号表。
 *
 * 这不是游戏数据 —— CSV 里没有，是社区整理的一份配色，原先埋在
 * commands.json 的 colorfulText 分类里。删那个文件前必须先搬出来，
 * 否则「彩色字体」功能会无声消失。
 *
 * 用法是把 <cRRGGBB>文字</c> 贴进游戏聊天框。注意昵称里的同款标记是
 * 玩家可控输入，渲染一律走 PlayerName 组件，不要拼 innerHTML。
 */
export interface ColorTag {
  hex: string
  zh: string
}

export const COLOR_TAGS: ColorTag[] = [
  { hex: "8B0016", zh: "深暗红" },
  { hex: "B2001F", zh: "艳暗红" },
  { hex: "C50023", zh: "亮暗红" },
  { hex: "DF0029", zh: "纯红" },
  { hex: "E54646", zh: "淡粉红" },
  { hex: "EE7C6B", zh: "橙红色" },
  { hex: "F5A89A", zh: "浅橙红" },
  { hex: "FCDAD5", zh: "极浅红" },
  { hex: "8E1E20", zh: "深橙红" },
  { hex: "B6292B", zh: "艳橙红" },
  { hex: "C82E31", zh: "亮橙红" },
  { hex: "E33539", zh: "纯橙红" },
  { hex: "EB7153", zh: "淡橙红" },
  { hex: "F19373", zh: "浅橙红" },
  { hex: "F6B297", zh: "极浅橙红" },
  { hex: "FCD9C4", zh: "肉色" },
  { hex: "945305", zh: "深橙黄" },
  { hex: "BD6B09", zh: "艳橙黄" },
  { hex: "D0770B", zh: "亮橙黄" },
  { hex: "EC870E", zh: "纯橙黄" },
  { hex: "F09C42", zh: "淡橙黄" },
  { hex: "F5B16D", zh: "浅橙黄" },
  { hex: "FCE0A6", zh: "极浅橙黄" },
  { hex: "FDE2CA", zh: "米黄" },
  { hex: "976D00", zh: "深黄" },
  { hex: "C18C00", zh: "艳黄" },
  { hex: "D59B00", zh: "亮黄" },
  { hex: "F1AF00", zh: "纯黄" },
  { hex: "F3C246", zh: "淡黄" },
  { hex: "F9CC76", zh: "浅黄" },
  { hex: "FCE0A6", zh: "极浅黄" },
  { hex: "FEEBD0", zh: "奶黄" },
  { hex: "367517", zh: "深绿" },
  { hex: "489620", zh: "艳绿" },
  { hex: "50A625", zh: "亮绿" },
  { hex: "5BBD2B", zh: "纯绿" },
  { hex: "83C75D", zh: "淡绿" },
  { hex: "AFD788", zh: "浅绿" },
  { hex: "C8E2B1", zh: "极浅绿" },
  { hex: "E6F1D8", zh: "豆绿" },
  { hex: "006241", zh: "深青绿" },
  { hex: "007F54", zh: "艳青绿" },
  { hex: "008C5E", zh: "亮青绿" },
  { hex: "00A06B", zh: "纯青绿" },
  { hex: "00AE72", zh: "淡青绿" },
  { hex: "67BF7F", zh: "浅青绿" },
  { hex: "98D0B9", zh: "极浅青绿" },
  { hex: "C9E4D6", zh: "水绿" },
  { hex: "00676B", zh: "深青蓝" },
  { hex: "008489", zh: "艳青蓝" },
  { hex: "009298", zh: "亮青蓝" },
  { hex: "00A6AD", zh: "纯青蓝" },
  { hex: "00B2BF", zh: "淡青蓝" },
  { hex: "6EC3C9", zh: "浅青蓝" },
  { hex: "99D1D3", zh: "极浅青蓝" },
  { hex: "CAE5E8", zh: "天蓝" },
  { hex: "184785", zh: "深蓝" },
  { hex: "205AA7", zh: "艳蓝" },
  { hex: "426EB4", zh: "亮蓝" },
  { hex: "7388C1", zh: "纯蓝" },
  { hex: "94AAD6", zh: "淡蓝" },
  { hex: "BFCAE6", zh: "浅蓝" },
  { hex: "211551", zh: "靛蓝" },
  { hex: "2D1E69", zh: "藏蓝" },
  { hex: "38044B", zh: "深紫" },
  { hex: "5D0C7B", zh: "艳紫" },
  { hex: "79378B", zh: "亮紫" },
  { hex: "8C63A4", zh: "纯紫" },
  { hex: "AA87B8", zh: "淡紫" },
  { hex: "C9B5D4", zh: "浅紫" },
  { hex: "64004B", zh: "暗紫" },
  { hex: "A2007C", zh: "绛紫" },
  { hex: "363636", zh: "深灰" },
  { hex: "555555", zh: "中灰" },
  { hex: "707070", zh: "浅灰" },
  { hex: "898989", zh: "淡灰" },
  { hex: "A0A0A0", zh: "银灰" },
  { hex: "B7B7B7", zh: "亮灰" },
  { hex: "D7D7D7", zh: "极浅灰" },
  { hex: "ECECEC", zh: "近白" },
  { hex: "000000", zh: "纯黑" }
]

/** 拼成可直接粘贴的片段 */
export function colorSnippet(t: ColorTag): string {
  return `<c${t.hex}>${t.zh}</c>`
}
