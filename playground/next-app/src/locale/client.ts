import { setupClient } from '@rewordlabs/next/client'

export const { tx, setLocale, useLocaleSync } = setupClient({
  locale: 'en',
  loader: (locale: string, id: string) =>
    import(`./${locale}/${id}.json`).then(msg => msg.default[id])
})
