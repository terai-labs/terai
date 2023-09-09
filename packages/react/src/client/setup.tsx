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
}

export type State = Locale
export type ObservableState = Observable<State>

enableReactUse()

export function setupClient({ loader, locale }: SetupClientOptions) {
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

  configureObservablePersistence({
    persistLocal: ObservablePersistLocalStorage
  })

  persistObservable(locale$, {
    local: 'locale'
  })

  const getLocale = () => locale$.get()
  const changeLocale = (locale: Locale) => locale$.set(locale)
  const tx = createTx({
    queryClient,
    loader,
    getLocale
  })

  return {
    tx,
    getLocale,
    changeLocale
  }
}
