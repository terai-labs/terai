// Depedencies
import { observable } from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'

// Global configuration
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Dictionaries, Loader, Locale } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

type Setup = {
  dictionaries: Dictionaries
  locale: Locale
  loader: Loader
  format?: GlobalFormat
  persist?: boolean
}

type SetupOptions = Pick<Setup, 'format' | 'loader' | 'persist'> & {
  defaultLocale: string
}

export const setup$ = observable<Setup>()

export const setupClient = ({ defaultLocale, ...options }: SetupOptions) => {
  if (options.persist) {
    configureObservablePersistence({
      pluginLocal: ObservablePersistLocalStorage
    })
    persistObservable(setup$, {
      local: 'locale'
    })
  }

  setup$.set({ ...options, locale: defaultLocale, dictionaries: {} })
}
