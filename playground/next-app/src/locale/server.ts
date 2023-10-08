import { setupServer } from '@koi18n/next/server'

export const { ts } = setupServer({
  loader: (locale: string, id: string) => import(`./${locale}/${id}.json`)
})
