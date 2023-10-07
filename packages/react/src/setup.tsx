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
import type { Locale } from '@tsmu/types'
import type { SetupClientOptions } from './core/client'

enableReactUse()

export const setup = ({
  defaultLocale,
  persist,
  ...options
}: SetupClientOptions & { defaultLocale: string; persist?: boolean }) => {
  const locale$ = observable<Locale>(defaultLocale)

  if (persist) {
    configureObservablePersistence({
      persistLocal: ObservablePersistLocalStorage
    })
    persistObservable(locale$, {
      local: 'locale'
    })
  }

  function getLocale() {
    return locale$.use()
  }

  function setLocale(locale: Locale) {
    locale$.set(locale)
  }

  const setup = createSetupClient({
    getLocale
  })({ ...options })

  return {
    ...setup,
    setLocale,
    useChunk: () => 'hola'
  }
}
