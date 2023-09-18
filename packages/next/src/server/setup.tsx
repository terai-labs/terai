'use server'

import 'server-only'

// Dependencies
import { Suspense, type ReactNode } from 'react'
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
  ...global
}: SetupServerOptions & InterpolateOptions) {
  const tx = createTx<ReactNode, TxReactOptions>({
    loader,
    getLocale: getLocaleCache,
    render: props => {
      return (
        <Suspense>
          {/* @ts-ignore */}
          <Text {...props} global={global} />
        </Suspense>
      )
    }
  })

  return {
    tx
  }
}
