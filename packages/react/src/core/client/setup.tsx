'use client'

// Dependencies
import 'client-only'
import { createFormat } from '@koi18n/formatter'
import { createTs } from '@koi18n/ts'
import { CsrText } from './csr-text'

// Types
import type { CreateSetupOptions } from '../types'
import type { SetupReactOptions, TsReactRenderProps } from '../types'

export type SetupClient = ReturnType<typeof createSetupClient>
export type SetupClientOptions = SetupReactOptions

export function createSetupClient({ getLocale }: CreateSetupOptions) {
  return function createSetup({
    loader,
    components = {},
    format = {}
  }: SetupReactOptions) {
    const useFormat = createFormat(getLocale)
    const ts = createTs<JSX.Element, TsReactRenderProps>({
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
      ts,
      useFormat,
      useLocale: getLocale
    }
  }
}
