import 'server-only'

// Dependencies
import { Suspense, type ReactNode } from 'react'
import { createTx, type Tx } from '@rewordlabs/formatter'

// Types
import type { Locale } from '@rewordlabs/types'

// Components
import { Text } from './text'

export type SetupServerOptions = {
  loader: (locale: string, id: string) => Promise<string>
}

export type CreateSetupServerOptions = {
  getLocale: () => Locale
}

export const createSetupServer =
  ({ getLocale }: CreateSetupServerOptions) =>
  ({ loader }: SetupServerOptions): { tx: Tx<ReactNode> } => {
    const tx = createTx<ReactNode>({
      loader,
      getLocale,
      render: props => {
        return (
          <Suspense>
            {/* @ts-ignore */}
            <Text {...props} />
          </Suspense>
        )
      }
    })

    return {
      tx
    }
  }
