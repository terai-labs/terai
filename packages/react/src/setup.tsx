// Utils
import { createTx } from './tx'
import { createState } from './state'
import { createUseLocale } from './use-locale'
import { createUseChangeLocale } from './use-change-locale'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { SetupOptions } from './types'

// Setup
enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export function setupRosetta(options: SetupOptions) {
  const state$ = createState({
    locale: options.locale,
    dictionaries: {}
  })

  persistObservable(state$, {
    local: 'rosetta'
  })

  state$.locale.onChange(({ value }) =>
    console.log('Rosetta: locale changed to ', value)
  )

  const tx = createTx(state$)
  const useLocale = createUseLocale(state$)
  const useChangeLocale = createUseChangeLocale(options, state$)

  options.dictionaries[options.locale]().then(loc =>
    state$.dictionaries[options.locale].set(loc.default)
  )

  return {
    tx,
    useLocale,
    useChangeLocale
  }
}
