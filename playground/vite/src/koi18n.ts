import { setup } from '@koi18n/react'

export const { useTs, setLocale, useFormat } = setup({
  defaultLocale: 'en',
  persist: true,
  loader: (locale: string, chunkId: string) =>
    import(`./locale/${locale}/${chunkId}.json`)
})
