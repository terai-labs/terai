import { setupServer } from '@rewordlabs/next/server'

export const { tx, useFormat } = setupServer({
  loader: async (locale: string, chunkId: string, id: string) =>
    (await import(`./${locale}/${chunkId}.json`))[id]
})
