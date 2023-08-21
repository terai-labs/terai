// Dependencies
import { ref } from 'valtio'

// Utils
import { createState } from './state'
import { createMessageComponent } from './message'
import { createTx } from './tx'
import { createUseLocale } from './use-locale'
import { createUseChangeLocale } from './use-change-locale'

// Types
import type { SetupOptions } from './types'

export function setupRosetta(options: SetupOptions) {
  const state = createState({
    locale: options.locale,
    dictionary: {}
  })
  const Message = createMessageComponent(state)
  const tx = createTx(Message)
  const useLocale = createUseLocale(state)
  const useChangeLocale = createUseChangeLocale(options, state)

  options.dictionaries[options.locale]().then(
    loc => (state.dictionary = ref(loc.default))
  )

  return {
    tx,
    useLocale,
    useChangeLocale
  }
}
