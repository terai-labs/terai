// Dependencies
import { useLocale as getLocale } from './use-locale'
import { createSetupClient } from '@rewordlabs/react/core/client'

// Types
import type { SetupClient } from '@rewordlabs/react/core/client'

export const setupClient: SetupClient = createSetupClient({
  getLocale
})
