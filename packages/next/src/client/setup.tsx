// Dependencies
import { useLocale as getLocale } from './use-locale'
import { createSetupClient } from '@tsmu/react/core/client'

// Types
import type { SetupClient } from '@tsmu/react/core/client'

export const setupClient: SetupClient = createSetupClient({
  getLocale
})
