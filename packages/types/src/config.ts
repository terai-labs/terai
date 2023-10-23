import type { Locale } from './locale'
import type { Translator } from './translator'

export type Config = {
  include: string[]
  exclude?: string[]
  projectLocale: Locale
  outDir: string
  outLocales: Locale[]
  translator: Translator
}
