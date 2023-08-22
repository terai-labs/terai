import type { Locale } from './locale'

export type Config = {
  include: string[]
  exclude?: string[]
  outDir: string
  outLocales: Locale[]
  projectLocale: Locale
  outExtension: '.ts' | '.js'
}
