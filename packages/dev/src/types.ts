import type { Config } from '@rosetta.js/types'

export type ExtractOptions = {
  cwd: string
  force?: boolean
  silent?: boolean
  watch?: boolean
}

export type InitOptions = Pick<Config, 'projectLocale'> & {
  cwd: string
  force?: boolean
  silent?: boolean
}
