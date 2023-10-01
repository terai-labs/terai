const { setupClient } = require('@rewordlabs/next/client')

export const { tx } = setupClient({
  loader: (locale: string, id: string) => import(`./${locale}/${id}.json`)
})
