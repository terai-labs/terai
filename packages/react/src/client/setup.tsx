import 'client-only'

// Dependencies
import { createTx } from '@rewordlabs/formatter'
import { observable, type Observable } from '@legendapp/state'
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

// Components
import { Text } from './text'

export type SetupClientOptions = {
  locale: Locale
  loader: (locale: string, id: string) => Promise<string>
  usePersist?: boolean
}

export type State = Locale
export type ObservableState = Observable<State>

enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export function setupClient({
  loader,
  locale,
  usePersist = false
}: SetupClientOptions) {
  const locale$ = observable<State>(locale)
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
  const tx = createTx<ReactNode>({
    loader,
    getLocale,
    render: props => {
      return (
        <QueryClientProvider client={queryClient}>
          <Text {...props} />
        </QueryClientProvider>
      )
    }
  })

  return {
    tx,
    changeLocale,
    useLocale: getLocale,
    useLocaleSync
  }
}
