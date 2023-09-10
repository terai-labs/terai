import 'client-only'

// Dependencies
import { createTx } from '@rewordlabs/formatter'
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { InterpolateOptions } from '@rewordlabs/formatter'
import type { Locale } from '@rewordlabs/types'
import type { ReactNode } from 'react'

// Components
import { Text } from './text'
import { createInterpolate } from '../interpolate'
import type { CommonSetupOptions } from '../types'

export type SetupClientOptions = {
  locale: Locale
  usePersist?: boolean
} & CommonSetupOptions &
  InterpolateOptions

enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export function setupClient({
  loader,
  locale,
  usePersist = false,
  components,
  ...interpolateOptions
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

  const interpolate = createInterpolate({
    locale,
    components,
    ...interpolateOptions
  })
  const getLocale = () => locale$.use()
  const useLocaleSync = (locale: string) => locale$.set(locale as Locale)
  const changeLocale = (locale: Locale) => locale$.set(locale)
  const tx = createTx<ReactNode>({
    loader,
    getLocale,
    render: props => {
      return (
        <QueryClientProvider client={queryClient}>
          <Text {...props} interpolate={interpolate} />
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
