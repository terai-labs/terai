// Depedencies
import { observable } from '@legendapp/state'

// Types
import type { Loader } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

export type SetupClient = {
  loader: Loader
  format?: GlobalFormat
  persist?: boolean
}

export const setup$ = observable<SetupClient>()

export const setupClient = (options: SetupClient) => {
  console.log('setup client', options)
  setup$.set(options)
  return options
}
