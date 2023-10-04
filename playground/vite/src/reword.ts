import { setup } from '@rewordlabs/react'

export const { tx, setLocale, useFormat, useChunk } = setup({
  // locale: 'en',
  // persist: false,
  loader: (locale: string, chunkId: string) =>
    import(`./locale/${locale}/${chunkId}.json`)
})
