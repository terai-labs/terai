import { setup } from '@rewordlabs/react'

export const { tx, setLocale } = setup({
  locale: 'en',
  loader: async (locale: string, chunkId: string, id: string) =>
    (await import(`./locale/${locale}/${chunkId}.json`))[id]
})
