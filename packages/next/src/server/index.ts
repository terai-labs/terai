// Dependencies
import { getLocaleCache } from './get-locale-cache'
import {
  createSetupServer,
  type SetupServerOptions
} from '@rewordlabs/react/server'

// Types
import type { ReactNode } from 'react'
import type { Tx } from '@rewordlabs/formatter'
import type { TxReactOptions } from '@rewordlabs/react'

export const setupServer: ({ loader }: SetupServerOptions) => {
  tx: Tx<ReactNode, TxReactOptions>
} = createSetupServer({
  getLocale: getLocaleCache
})
