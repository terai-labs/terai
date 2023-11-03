'use client'

import { setupClient } from '@koi18n/next'

export const options = setupClient({
  loader: (locale: string, id: string) =>
    import(`../locale/${locale}/${id}.json`)
})

export const SetupComponent = () => {
  return null
}
