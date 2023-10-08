// Dependencies
import { getLocale } from './get-locale'
import { createSetupServer } from '@koi18n/react/core/server'

// Types
import type { SetupServer } from '@koi18n/react/core/server'

export const setupServer: SetupServer = createSetupServer({
  getLocale
})
