// Dependencies
import { getLocale } from './get-locale'
import { createSetupServer } from '@rewordlabs/react/core/server'

// Types
import type { SetupServer } from '@rewordlabs/react/core/server'

export const setupServer: SetupServer = createSetupServer({
  getLocale
})
