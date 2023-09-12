import { setupClient } from '@rewordlabs/react/client'

export const { tx, changeLocale } = setupClient({
  locale: 'en',
  loader: (locale: string, id: string) =>
    import(`./${locale}/${id}.json`)
      // .then(res => res.json())
      .then(msg => msg.default[id])
})
