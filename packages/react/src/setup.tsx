// Dependencies
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { createSetupClient } from './core/client'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Locale } from '@koi18n/types'
import type { SetupClientOptions } from './core/client'

enableReactUse()

export const setupClient = ({
  defaultLocale,
  persist = true,
  ...options
}: SetupClientOptions & { defaultLocale: string }) => {
  const locale$ = observable<Locale>(defaultLocale)
  const useLocale = () => locale$.use()
  const setLocale = (locale: Locale) => locale$.set(locale)

  if (persist) {
    configureObservablePersistence({
      persistLocal: ObservablePersistLocalStorage
    })
    persistObservable(locale$, {
      local: 'locale'
    })
  }

  const coreOutput = createSetupClient({
    getLocale: useLocale
  })(options)

  return {
    ...coreOutput,
    setLocale,
    useLocale
  }
}
