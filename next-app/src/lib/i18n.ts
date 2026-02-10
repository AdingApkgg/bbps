import zh from '@/locales/zh'
import en from '@/locales/en'

export type Locale = 'zh' | 'en'

export type Dict = typeof zh

const dictionaries: Record<Locale, Dict> = { zh, en }

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? zh
}
