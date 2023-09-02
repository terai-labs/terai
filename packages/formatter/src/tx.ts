// Dependencies
import { prepareMessage, toHash } from '@rosetta.js/utils'
import { interpolate } from './interpolation'

// Types
import type { Dictionary, Locale } from '@rosetta.js/types'
import type { MessageExpression } from './types'

type CreateTxOptions = {
  getLocale: () => Locale
  getDictionary: () => Dictionary
}

type TxOptions = {
  context: string
}

export interface Tx {
  (strings: TemplateStringsArray, ...variables: MessageExpression[]): string
  (options: TxOptions): Tx
}

export function createTx(options: CreateTxOptions) {
  function tx(
    stringsOrOptions: TemplateStringsArray,
    ...variables: MessageExpression[]
  ): string
  function tx(stringsOrOptions: TxOptions): Tx
  function tx(
    stringsOrOptions: TemplateStringsArray | TxOptions,
    ...variables: MessageExpression[]
  ): string | Tx {
    const { getLocale, getDictionary } = options
    const locale = getLocale()
    const dictionary = getDictionary()

    if (isTemplateStringsArray(stringsOrOptions)) {
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(strings.raw.join('${VAR}'))
      const id = toHash(rawMessage)
      let message = dictionary?.[id] || rawMessage

      message = interpolate({
        message,
        locale,
        variables
      })

      return message
    } else {
      return createTx(options)
    }
  }

  return tx
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}
