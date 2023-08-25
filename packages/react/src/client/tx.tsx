// Types
import type { MessageVariables } from '@rosetta.js/types'
import { getMessage } from '../shared/get-message'

export const createTx =
  state$ =>
  (strings: TemplateStringsArray, ...vars: MessageVariables[]) => {
    const { locale, dictionaries } = state$.use()
    const dictionary = dictionaries[locale]

    return getMessage({
      strings,
      vars,
      dictionary,
      locale
    })
  }
