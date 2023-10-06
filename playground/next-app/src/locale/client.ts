const { setupClient } = require('@tsmu/next/client')

export const { ts } = setupClient({
  loader: (locale: string, id: string) => import(`./${locale}/${id}.json`)
})
