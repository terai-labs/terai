import { setup } from '@rewordlabs/react'

export const { tx, setLocale } = setup({
  locale: 'en',
  loader: (locale: string, id: string) =>
    import(`./locale/${locale}/${id}.json`).then(msg => msg[id])
})
