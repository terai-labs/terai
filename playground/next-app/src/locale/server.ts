import { setupServer } from '@koi18n/next/server'

export const { getTs } = setupServer({
  loader: (locale: string, id: string) => import(`./${locale}/${id}.json`)
})
