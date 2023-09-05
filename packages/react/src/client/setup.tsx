import 'client-only'

// Dependencies
import { createTx } from '@rewordlabs/formatter'
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { SetupOptions, State } from './types'
import type { Locale } from '@rewordlabs/types'

// Setup
enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export function setupReword(options: SetupOptions) {
  const state$ = observable<State>({
    locale: options.locale,
    dictionary: {}
  })

  options.dictionaries[options.locale]().then(mod =>
    state$.dictionary.set(mod.default)
  )

  persistObservable(state$, {
    local: 'reword'
  })

  const getLocale = () => state$.locale.use()
  const changeLocale = (locale: Locale) => {
    state$.locale.set(locale)
    options.dictionaries[locale]().then(mod =>
      state$.dictionary.set(mod.default)
    )
  }

  const tx = createTx({
    getLocale: () => state$.locale.use(),
    getDictionary: () => state$.dictionary.use()
  })

  return {
    tx,
    getLocale,
    changeLocale
  }
}
