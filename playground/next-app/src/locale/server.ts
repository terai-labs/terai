import { setupServer } from '@tsmu/next/server'

export const { ts } = setupServer({
  loader: (locale: string, id: string) => import(`./${locale}/${id}.json`)
})
