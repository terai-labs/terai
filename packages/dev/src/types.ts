import type { Config } from '@rewordlabs/types'

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
