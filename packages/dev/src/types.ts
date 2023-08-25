import type { Config } from '@rosetta.js/types'

export type ExtractOptions = {
  cwd: string
  force?: boolean
  silent?: boolean
  watch?: boolean
  outExtension?: string
}

export type InitOptions = Pick<Config, 'outExtension' | 'projectLocale'> & {
  cwd: string
  force?: boolean
  silent?: boolean
}
