// Depedencies
import { observable } from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Dictionaries, Loader, Locale } from '@koi18n/types'
import type { GlobalFormat } from '@koi18n/formatter'

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

export const setup = ({ defaultLocale, ...options }: SetupOptions) => {
  if (options.persist) {
    configureObservablePersistence({
      persistLocal: ObservablePersistLocalStorage
    })
    persistObservable(setup$, {
      local: 'locale'
    })
  }

  setup$.set({ ...options, locale: defaultLocale, dictionaries: {} })
}
