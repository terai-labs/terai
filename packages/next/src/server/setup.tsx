// Dependencies
import { getLocale } from './get-locale'
import { createSetupServer } from '@tsmu/react/core/server'

// Types
import type { SetupServer } from '@tsmu/react/core/server'

export const setupServer: SetupServer = createSetupServer({
  getLocale
})
