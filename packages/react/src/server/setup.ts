// Dependencies
import { createTx } from './tx'

// Types
import type { Locale } from '@rewordlabs/types'

export type SetupServerOptions = {
  loader: (locale: string, id: string) => Promise<string>
}

export type CreateSetupServerOptions = {
  getLocale: () => Promise<Locale>
}

export const createSetupServer =
  ({ getLocale }: CreateSetupServerOptions) =>
  ({ loader }: SetupServerOptions) => {
    return {
      tx: createTx({ loader, getLocale })
    }
  }
