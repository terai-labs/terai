// Dependencies
import type { Dictionary, Locale, MessageVariables } from '@rosetta.js/types'
import { txFormat } from '@rosetta.js/formatter'

// Types
import type { SetupOptions } from './types'
import { getLocaleCache } from './get-locale-cache'

export function setupServer({ dictionaries }: SetupOptions) {
  return {
    getTx: async () => {
      const locale = (await getLocaleCache()) ?? 'es'
      const dictionary = (await dictionaries[locale]()).default
      return createGetTx(dictionary, locale)
    }
  }
}

export const createGetTx =
  (dictionary: Dictionary, locale: Locale) =>
  (strings: TemplateStringsArray, ...vars: MessageVariables[]) => {
    return txFormat({
      strings,
      vars,
      dictionary,
      locale
    })
  }
