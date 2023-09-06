import { setupReword } from '@rewordlabs/react/client'

export const { tx, changeLocale } = setupReword({
  locale: 'en',
  loader: (locale: string, id: string) =>
    fetch(`../locale/${locale}/${id}.json`)
      .then(res => res.json())
      .then(msg => msg[id])
})
