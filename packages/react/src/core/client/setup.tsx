'use client'

// Dependencies
import 'client-only'
import { createFormat } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { CsrText } from './csr-text'

// Types
import type { CreateSetupOptions } from '../types'
import type { SetupReactOptions, TxReactRenderProps } from '../types'

export type SetupClient = ReturnType<typeof createSetupClient>

export function createSetupClient({ getLocale }: CreateSetupOptions) {
  return function createSetup({
    loader,
    components = {},
    format = {}
  }: SetupReactOptions) {
    const useFormat = createFormat(getLocale)
    const tx = createTx<JSX.Element, TxReactRenderProps>({
      render: props => {
        return (
          <CsrText
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
      useFormat
    }
  }
}
