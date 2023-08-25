// Types
import type { Dictionary, Locale, MessageVariables } from '@rosetta.js/types'
import { getMessage } from '../shared/get-message'

export const createTx =
  (dictionary: Dictionary, locale: Locale) =>
  (strings: TemplateStringsArray, ...vars: MessageVariables[]) => {
    return getMessage({
      strings,
      vars,
      dictionary,
      locale
    })
  }
