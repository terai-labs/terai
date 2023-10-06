import { setup } from '@tsmu/react'

export const { ts, setLocale, useFormat, useChunk } = setup({
  // locale: 'en',
  // persist: false,
  loader: (locale: string, chunkId: string) =>
    import(`./locale/${locale}/${chunkId}.json`)
})
