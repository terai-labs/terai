// Depedencies
import { observable } from '@legendapp/state'

// Types
import type { Loader } from '@koi18n/types'
import type { GlobalFormat } from '@koi18n/formatter'

export type SetupClient = {
  loader: Loader
  format?: GlobalFormat
  persist?: boolean
}

export const setup$ = observable<SetupClient>()

export const setupClient = (options: SetupClient) => {
  setup$.set(options)
}
