// Dependencies
import { getLocaleCache } from '../get-locale-cache'
import {
  createSetupServer,
  type SetupServerOptions
} from '@rewordlabs/react/server'

// Types
import type { ReactNode } from 'react'
import type { Tx } from '@rewordlabs/formatter'

export const setupServer: ({ loader }: SetupServerOptions) => {
  tx: Tx<ReactNode>
} = createSetupServer({
  getLocale: getLocaleCache
})
