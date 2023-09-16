import { setupServer } from '@rewordlabs/next'

export const { tx } = setupServer({
  loader: (locale: string, id: string) =>
    import(`../locale/${locale}/${id}.json`).then(msg => msg[id])
})
