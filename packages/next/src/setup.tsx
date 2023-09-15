// Dependencies
import React, { Suspense, type ReactNode } from 'react'
import { createTx } from '@rewordlabs/formatter'

// Types
import type { InterpolateOptions } from '@rewordlabs/formatter'
import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react'

// Components
import { Text } from './text'
import { getLocaleCache } from './get-locale-cache'

export type SetupServerOptions = CommonSetupOptions

export function setupServer({
  loader,
  components,
  format,
  plugins
}: SetupServerOptions & InterpolateOptions) {
  const tx = createTx<ReactNode, TxReactOptions>({
    loader,
    getLocale: getLocaleCache,
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
    tx
  }
}
