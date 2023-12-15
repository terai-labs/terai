'use client'

import { setupClient } from '@terai/next'

export const options = setupClient({
  loader: (locale: string, id: string) =>
    import(`../locale/${locale}/${id}.json`)
})

export const SetupComponent = () => {
  return null
}
