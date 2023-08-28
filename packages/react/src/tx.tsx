// Dependencies
import { txFormat } from '@rosetta.js/formatter'

// Types
import type { MessageVariables } from '@rosetta.js/types'
import type { ObservableState } from './types'

export const createTx =
  (state$: ObservableState) =>
  (strings: TemplateStringsArray, ...vars: MessageVariables[]) => {
    const { locale, dictionaries } = state$.use()
    const dictionary = dictionaries[locale]

    return txFormat({
      strings,
      vars,
      dictionary,
      locale
    })
  }
