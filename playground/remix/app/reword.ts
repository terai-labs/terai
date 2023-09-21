import { setup } from '@rewordlabs/react'

export const { tx, setLocale } = setup({
  locale: 'en',
  loader: (locale: string, chunkId: string, id: string) =>
    fetch(`locale/${locale}/${chunkId}.json`)
      .then(res => res.json())
      .then(msg => {
        console.log(msg)
        return msg[id]
      })
})
