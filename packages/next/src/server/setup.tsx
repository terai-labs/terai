// Depedencies
import { observable } from '@legendapp/state'

// Types
import type { Loader } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

export type Setup = {
  loader: Loader
  format?: GlobalFormat
}

export const setup$ = observable<Setup>()

export const setupServer = (options: Setup) => {
  setup$.set(options)
}
