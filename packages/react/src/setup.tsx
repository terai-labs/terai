// Dependencies
import { createTx, format as formatter } from '@rewordlabs/formatter'
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Locale } from '@rewordlabs/types'
import type { ReactNode } from 'react'
import type { CommonSetupOptions, TxReactOptions } from './types'

// Components
import { Text } from './text'

export type SetupClientOptions = {
  locale: Locale
  usePersist?: boolean
} & CommonSetupOptions

enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export function setup({
  loader,
  locale,
  usePersist = false,
  components,
  format,
  plugins
}: SetupClientOptions) {
  const locale$ = observable(locale)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode: 'offlineFirst',
        suspense: true,
        staleTime: Infinity
      }
    }
  })

  if (usePersist) {
    persistObservable(locale$, {
      local: 'locale'
    })
  }

  const getLocale = () => locale$.use()
  const useLocaleSync = (locale: string) => locale$.set(locale as Locale)
  const changeLocale = (locale: Locale) => locale$.set(locale)
  const tx = createTx<ReactNode, TxReactOptions>({
    loader,
    getLocale,
    render: props => {
      return (
        <QueryClientProvider client={queryClient}>
          <Text
            {...props}
            global={{
              components,
              format,
              plugins
            }}
          />
        </QueryClientProvider>
      )
    }
  })

  return {
    tx,
    changeLocale,
    useLocale: getLocale,
    useLocaleSync,
    format: formatter
  }
}
