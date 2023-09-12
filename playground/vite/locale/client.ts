const { setupClient } = require('@rewordlabs/next/client')

export const { tx, changeLocale } = setupClient({
  locale: 'en',
  loader: (locale: string, id: string) =>
    fetch(`./locale/${locale}/${id}.json`)
      .then(res => res.json())
      .then(msg => msg[id])
})
