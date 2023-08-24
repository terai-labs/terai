// Types
import type { Locale } from '@rosetta.js/types'
import type { ObservableState, SetupOptions } from './types'

export const createUseChangeLocale =
  (setupOptions: SetupOptions, state$: ObservableState) => () => {
    async function changeLocale(locale: Locale) {
      try {
        const messages = state$.messages.get()

        if (messages[locale]) {
          state$.locale.set(locale)
        } else {
          const mod = await setupOptions.messages[locale]()
          state$.set({
            locale,
            messages: {
              ...messages,
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
