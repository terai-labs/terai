// Dependencies
import { createTx } from './tx'
import { observable, type Observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { QueryClient } from '@tanstack/react-query'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Locale } from '@rewordlabs/types'

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
  const changeLocale = (locale: Locale) => locale$.set(locale)
  const tx = createTx({
    queryClient,
    loader,
    getLocale
  })
  const useLocaleSync = (locale: string) => {
    locale$.set(locale as Locale)
  }

  return {
    tx,
    changeLocale,
    useLocale: getLocale,
    useLocaleSync
  }
}
