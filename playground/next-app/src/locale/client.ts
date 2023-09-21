import { setupClient } from '@rewordlabs/next/client'

export const { tx, setLocale, useLocaleSync } = setupClient({
  locale: 'en',
  loader: async (locale: string, chunkId: string, id: string) =>
    (await import(`./locale/${locale}/${chunkId}.json`))[id]
})
