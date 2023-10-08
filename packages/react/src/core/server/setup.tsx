// Dependencies
import { createFormat } from '@koi18n/formatter'
import { createTs } from '@koi18n/ts'
import { SsrText } from './ssr-text'

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
    const ts = createTs<JSX.Element, TsReactRenderProps>({
      render: props => {
        return (
          // @ts-ignore
          // @https://github.com/microsoft/TypeScript/pull/51328
          <SsrText
            {...props}
            getLocale={getLocale}
            loader={loader}
            components={{
              ...components,
              ...props.components
            }}
            format={{
              ...format,
              ...props.format
            }}
          />
        )
      }
    })

    return {
      ts,
      getFormat
    }
  }
}
