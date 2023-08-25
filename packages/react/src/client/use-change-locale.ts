// Types
import type { Locale } from '@rosetta.js/types'
import type { ObservableState, SetupOptions } from './types'

export const createUseChangeLocale =
  (setupOptions: SetupOptions, state$: ObservableState) => () => {
    async function changeLocale(locale: Locale) {
      try {
        const dictionaries = state$.dictionaries.get()

        if (dictionaries[locale]) {
          state$.locale.set(locale)
        } else {
          const mod = await setupOptions.dictionaries[locale]()
          state$.set({
            locale,
            dictionaries: {
              ...dictionaries,
              [locale]: mod.default
            }
          })
        }
      } catch (e) {
        console.error('Error loading messages:', e)
      }
    }

    return changeLocale
  }
