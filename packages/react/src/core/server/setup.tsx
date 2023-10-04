// Dependencies
import { createFormat } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { SsrText } from './ssr-text'

// Types
import type {
  SetupReactOptions,
  TxReactRenderProps,
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
    const tx = createTx<JSX.Element, TxReactRenderProps>({
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
      tx,
      getFormat
    }
  }
}
