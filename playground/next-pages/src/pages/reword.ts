import { setup } from '@rewordlabs/react'

export const { tx, changeLocale } = setup({
  locale: 'en',
  loader: (locale: string, id: string) =>
    import(`../../${locale}/${id}.json`).then(msg => msg.default[id])
})
