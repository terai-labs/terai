import { setup } from '@rewordlabs/react'

export const { tx, changeLocale } = setup({
  locale: 'en',
  loader: (locale: string, id: string) =>
    fetch(`locale/${locale}/${id}.json`)
      .then(res => res.json())
      .then(msg => {
        console.log(msg)
        return msg[id]
      })
})
