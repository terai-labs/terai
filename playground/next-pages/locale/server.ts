import { setupServer } from '@rewordlabs/next/server'

export const { tx } = setupServer({
  loader: (locale: string, id: string) =>
    import(`./${locale}/${id}.json`).then(msg => msg[id])
})
