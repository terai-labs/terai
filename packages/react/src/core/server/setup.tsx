// Dependencies
import { createFormat } from '@koi18n/formatter'
import { createTs } from '@koi18n/ts'
import { tsRender } from '../ts-render'
import { tsrRender } from '../tsr-render'

// Types
import type { ReactNode } from 'react'
import type {
  SetupReactOptions,
  TsReactRenderProps,
  CreateSetupOptions,
  GetTsProps
} from '../types'

export type SetupServer = ReturnType<typeof createSetupServer>

export const createSetupServer =
  ({ getLocale }: CreateSetupOptions) =>
  ({ loader, components = {}, format = {} }: SetupReactOptions) => {
    const getFormat = createFormat(getLocale)
    const getTs = async ({ chunkId }: GetTsProps = {}) => {
      const locale = getLocale()
      const dictionary = await loader(locale, chunkId ?? locale)
      const ts = createTs<string, {}>(props =>
        tsRender({
          ...props,
          locale,
          dictionary,
          format: {
            ...format,
            ...props.format
          }
        })
      )

      const tsr = createTs<ReactNode, TsReactRenderProps>(props =>
        tsrRender({
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
      )

      return {
        ts,
        tsr
      }
    }

    return {
      getTs,
      getFormat
    }
  }
