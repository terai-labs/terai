import { setupClient } from '@koi18n/vite'

export const { useTs, setLocale, useFormat } = setupClient({
  defaultLocale: 'en',
  persist: true,
  loader: (locale: string, chunkId: string) =>
    fetch(`./locale/${locale}/${chunkId}.json`, { cache: 'no-cache' }).then(
      res => res.json()
    )
})
