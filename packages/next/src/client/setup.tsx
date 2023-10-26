// 'use client'

// // Dependencies
// import { useLocale } from './use-locale'
// import { createSetupClient } from '@koi18n/react/core/client'

// // Types
// import type { SetupClient } from '@koi18n/react/core/client'

// export const setupClient: SetupClient = createSetupClient({
//   getLocale: useLocale
// })

export const setupClient = () => {
  return {
    useTs: () => (string: string) => string
  }
}
