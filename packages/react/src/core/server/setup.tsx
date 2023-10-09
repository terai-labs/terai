'use server'

// Dependencies
import 'server-only'
import { createFormat } from '@koi18n/formatter'
import { createTs } from '@koi18n/ts'
import { tsRender } from '../ts-render'

// Types
import type {
  SetupReactOptions,
  TsReactRenderProps,
  CreateSetupOptions
} from '../types'

export type SetupServer = ReturnType<typeof createSetupServer>

export function createSetupServer({ getLocale }: CreateSetupOptions) {
  return function setupServer({
    loader,
    components = {},
    format = {}
  }: SetupReactOptions) {
    const getFormat = createFormat(getLocale)
    const getTs = async () => {
      const locale = getLocale()
      const dictionary = (await loader(locale, locale)).default

      const ts = createTs<string, TsReactRenderProps>({
        render: props => {
          return tsRender({
            ...props,
            locale,
            dictionary,
            components: {
              ...components,
              ...props.components
            },
            format: {
              ...format,
              ...props.format
            }
          })
        }
      })

      return ts
    }

    return {
      getTs,
      getFormat
    }
  }
}
