import 'client-only'

// Dependencies
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { QueryClient } from '@tanstack/react-query'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Locale } from '@rewordlabs/types'

// Types
import type { SetupOptions, State } from './types'
import { createTx } from './tx'

// Setup
enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export function setupReword({ loader, locale }: SetupOptions) {
  const locale$ = observable<State>(locale)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
        staleTime: Infinity
      }
    }
  })

  persistObservable(locale$, {
    local: 'locale'
  })

  const getLocale = () => locale$.use()
  const changeLocale = (locale: Locale) => locale$.set(locale)
  const tx = createTx({
    queryClient,
    loader,
    locale$
  })

  return {
    tx,
    getLocale,
    changeLocale
  }
}
