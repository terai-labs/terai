const { setupClient } = require('@koi18n/next/client')
// import { setupClient } from '@koi18n/next/client'

export const { useTs } = setupClient({
  loader: (locale: string, id: string) => import(`./${locale}/${id}.json`)
})
