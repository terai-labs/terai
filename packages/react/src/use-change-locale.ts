// Dependencies
import { ref } from 'valtio'

// Types
import type { Locale } from '@rosetta.js/types'
import type { SetupOptions, State } from './types'

export const createUseChangeLocale =
  (setupOptions: SetupOptions, state: State) => () => (locale: Locale) => {
    state.locale = locale

    setupOptions.dictionaries[locale]().then(dynamicLocale => {
      state.dictionary = ref(dynamicLocale.default)
    })
  }
