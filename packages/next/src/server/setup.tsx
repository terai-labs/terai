// Depedencies
import { observable } from '@legendapp/state'

// Types
import type { Loader } from '@koi18n/types'
import type { GlobalFormat } from '@koi18n/formatter'

export type Setup = {
  loader: Loader
  format?: GlobalFormat
}

export const setup$ = observable<Setup>()

export const setupServer = (options: Setup) => {
  setup$.set(options)
}
