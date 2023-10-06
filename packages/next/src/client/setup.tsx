'use client'

// Dependencies
import { useLocale } from './use-locale'
import { createSetupClient } from '@tsmu/react/core/client'

// Types
import type { SetupClient } from '@tsmu/react/core/client'

export const setupClient: SetupClient = createSetupClient({
  getLocale: useLocale
})
