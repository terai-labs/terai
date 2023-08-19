export type Config = {
  include: string[]
  exclude?: string[]
  outDir: string
  baseLocale: string
  outExtension: '.ts' | '.js'
}
