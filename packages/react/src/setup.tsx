// Utils
import { createState } from './state'
import { createMessageComponent } from './message'
import { createTx } from './tx'
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
    messages: {}
  })

  persistObservable(state$, {
    local: 'ROSETTA'
  })

  state$.locale.onChange(({ value }) =>
    console.log('Locale changed to:', value)
  )

  const Message = createMessageComponent(state$)
  const tx = createTx(Message)
  const useLocale = createUseLocale(state$)
  const useChangeLocale = createUseChangeLocale(options, state$)

  options.messages[options.locale]().then(loc =>
    state$.messages[options.locale].set(loc.default)
  )

  return {
    tx,
    useLocale,
    useChangeLocale
  }
}
