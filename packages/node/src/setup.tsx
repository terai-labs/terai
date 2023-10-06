// Dependencies
import { createTs, type TsRenderProps } from '@tsmu/ts'
import { observable } from '@legendapp/state'
import { createFormat, interpolate } from '@tsmu/formatter'

// Types
import type { Dictionaries, Loader, Locale } from '@tsmu/types'
import type { InterpolateOptions } from '@tsmu/formatter'

export type SetupOptions = InterpolateOptions & {
  getLocale: () => Locale
  locales: Locale[]
  loader: Loader
}

type TsNodeRenderProps = TsRenderProps & { locale: Locale }

export function setup({
  loader,
  locales,
  getLocale,
  format = {}
}: SetupOptions) {
  const state$ = observable<Dictionaries>({})
  const getFormat = createFormat(getLocale)
  const ts = createTs<string, TsNodeRenderProps>({
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
    ts,
    getFormat
  }
}
