const { setupClient } = require('@koi18n/next/client')

export const { ts } = setupClient({
  loader: (locale: string, id: string) => import(`./${locale}/${id}.json`)
})
