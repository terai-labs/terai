'use client'

import 'client-only'

// Dependencies
import { createTx, format } from '@rewordlabs/formatter'
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { CommonSetupOptions, TxReactOptions } from './types'
import type { Locale } from '@rewordlabs/types'
import type { QueryObserverOptions } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Components
import { Text } from './text'

enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export type SetupClientOptions = {
  locale: Locale
  persist?: boolean
  suspense?: boolean
  networkMode?: QueryObserverOptions['networkMode']
  staleTime?: QueryObserverOptions['staleTime']
} & CommonSetupOptions

export function setup({
  loader,
  locale,
  persist = false,
  suspense = true,
  networkMode = 'offlineFirst',
  staleTime = 60 * 60 * 1000,
  ...global
}: SetupClientOptions) {
  const locale$ = observable(locale)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode,
        suspense,
        staleTime
      }
    }
  })

  if (persist) {
    persistObservable(locale$, {
      local: 'locale'
    })
  }

  const getLocale = () => locale$.get()
  const useLocale = () => locale$.use()
  const useLocaleSync = (locale: string) => locale$.set(locale as Locale)
  const setLocale = (locale: Locale) => locale$.set(locale)
  const tx = createTx<ReactNode, TxReactOptions>({
    loader,
    getLocale: useLocale,
    render: props => {
      return (
        <QueryClientProvider client={queryClient}>
          <Text {...props} global={global} />
        </QueryClientProvider>
      )
    }
  })

  return {
    format,
    tx,
    useLocale,
    useLocaleSync,
    setLocale,
    getLocale
  }
}
