import { setup } from '@koi18n/react'

export const { ts, setLocale, useFormat, useChunk } = setup({
  defaultLocale: 'en',
  persist: true,
  loader: (locale: string, chunkId: string) =>
    import(`./locale/${locale}/${chunkId}.json`)
})
