import type { Locale } from './locale'

export type Config = {
  include: string[]
  exclude?: string[]
  openaiApiKey: string
  projectLocale: Locale
  outDir: string
  context?: string
  codeSplitting?: 'file' | number
}
