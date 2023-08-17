export type Config = {
  include: string[]
  exclude?: string[]
  outDir: string
  outExtension: 'ts' | 'js'
}
