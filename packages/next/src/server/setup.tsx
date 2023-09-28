'use server'

import 'server-only'

// Dependencies
import { Suspense } from 'react'
import { createTx } from '@rewordlabs/tx'
import { createFormat } from '@rewordlabs/formatter'

// Types
import type { InterpolateOptions } from '@rewordlabs/formatter'
import type { ReactNode } from 'react'
import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react'

// Components
import { Text } from './text'
import { getLocaleCache } from './get-locale-cache'

export type SetupServerOptions = CommonSetupOptions

export function setupServer({
  loader,
  ...global
}: SetupServerOptions & InterpolateOptions) {
  const useFormat = createFormat(getLocaleCache)
  const tx = createTx<ReactNode, TxReactOptions>({
    render: props => {
      return (
        <Suspense>
          {/* @ts-ignore */}
          <Text
            {...props}
            loader={loader}
            getLocale={getLocaleCache}
            global={global}
          />
        </Suspense>
      )
    }
  })

  return {
    useFormat,
    tx
  }
}
