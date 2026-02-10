import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        'fa6-solid': () => import('@iconify-json/fa6-solid/icons.json').then(i => i.default),
        'fa6-brands': () => import('@iconify-json/fa6-brands/icons.json').then(i => i.default)
      },
      scale: 1.2,
      warn: true
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        display: 'Barlow Condensed:700,800,900',
        game: 'Russo One:400'
      }
    })
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  theme: {
    colors: {
      // 海岛奇兵真实配色
      bb: {
        blue: {
          DEFAULT: '#0891D1',
          light: '#3DB2E8',
          dark: '#06668F'
        },
        green: {
          DEFAULT: '#5FB82E',
          light: '#7FD14A',
          dark: '#4A9123',
          army: '#4A6741'
        },
        orange: {
          DEFAULT: '#FF8C00',
          light: '#FFB347',
          dark: '#CC7000'
        },
        red: {
          DEFAULT: '#E63946',
          light: '#FF6B77',
          dark: '#B8212A'
        },
        yellow: {
          DEFAULT: '#FFD60A',
          light: '#FFE566',
          dark: '#CCAB08'
        },
        bg: {
          light: '#F5F5DC',
          DEFAULT: '#E8E0C8',
          dark: '#C8C0A8'
        },
        border: {
          DEFAULT: '#8B7355',
          light: '#A89070',
          dark: '#6B5535'
        },
        text: {
          DEFAULT: '#2C2416',
          light: '#5C5446',
          white: '#FFFFFF'
        }
      }
    },
    boxShadow: {
      'bb': '0 2px 0 rgba(0,0,0,0.2)',
      'bb-lg': '0 4px 0 rgba(0,0,0,0.25)',
      'bb-xl': '0 6px 0 rgba(0,0,0,0.3)',
      'bb-inset': 'inset 0 2px 4px rgba(0,0,0,0.15)'
    },
    borderRadius: {
      'bb': '6px',
      'bb-lg': '10px',
      'bb-xl': '14px'
    }
  },
  shortcuts: {
    // 游戏按钮 - 扁平但有深度
    'btn-bb': 'relative inline-flex items-center justify-center gap-2 px-6 py-3 font-game font-bold text-base uppercase transition-all duration-150 cursor-pointer border-b-4 rounded-bb select-none active:border-b-2 active:translate-y-[2px]',
    'btn-blue': 'btn-bb bg-bb-blue text-white border-bb-blue-dark hover:brightness-110',
    'btn-green': 'btn-bb bg-bb-green text-white border-bb-green-dark hover:brightness-110',
    'btn-orange': 'btn-bb bg-bb-orange text-white border-bb-orange-dark hover:brightness-110',
    'btn-red': 'btn-bb bg-bb-red text-white border-bb-red-dark hover:brightness-110',
    'btn-yellow': 'btn-bb bg-bb-yellow text-bb-text border-bb-yellow-dark hover:brightness-110',

    // 面板 - 浅色背景,清晰边框
    'panel-bb': 'bg-bb-bg-light border-3 border-bb-border rounded-bb-lg shadow-bb-lg relative',
    'panel-bb-dark': 'bg-bb-bg border-3 border-bb-border-dark rounded-bb-lg shadow-bb-lg relative',

    // 卡片
    'card-bb': 'panel-bb overflow-hidden',
    'card-header-bb': 'bg-bb-green text-white px-4 py-3 font-game font-bold text-lg flex items-center gap-2 border-b-3 border-bb-green-dark',

    // 徽章 - 鲜艳色彩
    'badge-bb': 'inline-flex items-center gap-2 px-3 py-1 bg-bb-yellow text-bb-text font-game font-bold text-sm rounded-full border-2 border-bb-yellow-dark',
    'badge-bb-blue': 'inline-flex items-center gap-2 px-3 py-1 bg-bb-blue text-white font-game font-bold text-sm rounded-full border-2 border-bb-blue-dark',
    'badge-bb-green': 'inline-flex items-center gap-2 px-3 py-1 bg-bb-green text-white font-game font-bold text-sm rounded-full border-2 border-bb-green-dark',

    // 容器
    'container-bb': 'max-w-7xl mx-auto px-4',

    // 标题 - 大号粗体
    'title-bb': 'font-display text-5xl font-black text-bb-text uppercase leading-tight tracking-tight',
    'title-bb-lg': 'font-display text-6xl font-black text-bb-text uppercase leading-tight tracking-tight',
    'title-bb-white': 'font-display text-5xl font-black text-white uppercase leading-tight tracking-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]',

    // 文本
    'text-bb': 'text-bb-text font-sans',
    'text-bb-light': 'text-bb-text-light font-sans',

    // 图标容器 - 简洁圆形
    'icon-bb': 'flex items-center justify-center w-12 h-12 rounded-full',
    'icon-bb-blue': 'icon-bb bg-bb-blue text-white border-2 border-bb-blue-dark',
    'icon-bb-green': 'icon-bb bg-bb-green text-white border-2 border-bb-green-dark',
    'icon-bb-orange': 'icon-bb bg-bb-orange text-white border-2 border-bb-orange-dark',

    // 分隔线
    'divider-bb': 'h-1 bg-bb-border rounded-full',

    // 输入框
    'input-bb': 'px-4 py-3 bg-white border-3 border-bb-border rounded-bb text-bb-text font-sans shadow-bb-inset focus:border-bb-blue focus:outline-none'
  },
  safelist: [
    'i-fa6-solid-anchor',
    'i-fa6-solid-ship',
    'i-fa6-solid-bomb',
    'i-fa6-solid-trophy',
    'i-fa6-solid-star',
    'i-fa6-solid-shield',
    'i-fa6-solid-swords',
    'i-fa6-solid-users',
    'i-fa6-solid-user',
    'i-fa6-solid-download',
    'i-fa6-solid-comments',
    'i-fa6-solid-globe'
  ]
})
