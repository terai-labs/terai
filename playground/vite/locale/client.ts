import { setupReword } from '@rewordlabs/react/client'

export const reword = setupReword({
  locale: 'en',
  loader: (locale: string, id: string) =>
    fetch(`./locale/${locale}/${id}.json`)
      .then(res => res.json())
      .then(msg => msg[id])
})
