import { setup } from '@koi18n/react'

export const { useTs, setLocale, useFormat } = setup({
  defaultLocale: 'en',
  persist: false,
  loader: (locale: string, chunkId: string) =>
    fetch(`./locale/${locale}/${chunkId}.json`, { cache: 'force-cache' }).then(
      res => res.json()
    )
})
