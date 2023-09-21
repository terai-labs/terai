import { setupServer } from '@rewordlabs/next/server'

export const { tx } = setupServer({
  loader: async (locale: string, chunkId: string, id: string) =>
    (await import(`./locale/${locale}/${chunkId}.json`))[id]
})
