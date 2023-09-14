import { setup } from '@rewordlabs/node'
import type { Tx } from '@rewordlabs/formatter'

const locale = 'es'
const getLocale = () => locale

export const {
  tx
}: {
  tx: Tx<Promise<string>, unknown>
  format: {
    number: ({ value, locale, options }: any) => string
    date: ({ value, locale, options }: any) => string
  }
} = setup({
  // @ts-ignore
  getLocale,
  loader: (locale: string, id: string) =>
    // @ts-ignore
    import(`./${locale}/${id}.json`).then(msg => msg[id], {
      // @ts-ignore
      assert: { type: 'json' }
    })
})
