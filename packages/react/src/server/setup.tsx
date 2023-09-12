// Dependencies
import { Suspense, type ReactNode } from 'react'
import {
  createTx,
  type InterpolateOptions,
  format as formatter
} from '@rewordlabs/formatter'

// Types
import type { Locale } from '@rewordlabs/types'
import type { CommonSetupOptions, TxReactOptions } from '../types'

// Components
import { Text } from './text'

export type SetupServerOptions = CommonSetupOptions

export type CreateSetupServerOptions = {
  getLocale: () => Locale
}

export const createSetupServer =
  ({ getLocale }: CreateSetupServerOptions) =>
  ({
    loader,
    components,
    format,
    plugins
  }: SetupServerOptions & InterpolateOptions) => {
    const tx = createTx<ReactNode, TxReactOptions>({
      loader,
      getLocale,
      render: props => {
        return (
          <Suspense>
            {/* @ts-ignore */}
            <Text
              {...props}
              global={{
                components,
                format,
                plugins
              }}
            />
          </Suspense>
        )
      }
    })

    return {
      tx,
      format: formatter
    }
  }
