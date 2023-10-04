// Dependencies
import { createTx, type TxRenderProps } from '@rewordlabs/tx'
import { observable } from '@legendapp/state'
import { createFormat, interpolate } from '@rewordlabs/formatter'

// Types
import type { Dictionaries, Loader, Locale } from '@rewordlabs/types'
import type { InterpolateOptions } from '@rewordlabs/formatter'

export type SetupOptions = InterpolateOptions & {
  getLocale: () => Locale
  locales: Locale[]
  loader: Loader
}

type TxNodeRenderProps = TxRenderProps & { locale: Locale }

export function setup({
  loader,
  locales,
  getLocale,
  format = {}
}: SetupOptions) {
  const state$ = observable<Dictionaries>({})
  const getFormat = createFormat(getLocale)
  const tx = createTx<string, TxNodeRenderProps>({
    render: ({ id, variables, rawMessage, ...props }) => {
      const locale = props.locale ?? getLocale()
      const message = state$?.[locale]?.[id]?.get() ?? rawMessage
      return interpolate(
        {
          message,
          locale,
          variables
        },
        {
          format: {
            ...format,
            ...props.format
          }
        }
      )
    }
  })

  locales.map(async locale => {
    const dic = (await loader(locale, locale)).default
    state$[locale].set(dic)
  })

  return {
    tx,
    getFormat
  }
}
