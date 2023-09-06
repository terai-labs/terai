// Dependencies
import { prepareMessage, toHash } from '@rewordlabs/utils'
import { interpolate } from './interpolation'

// Types
import type { Locale } from '@rewordlabs/types'
import type { MessageExpression } from './types'

type CreateTxOptions = {
  getLocale: () => Locale
  getMessage: (id: string) => string
}

type TxOptions = {
  context: string
}

export interface Tx {
  (strings: TemplateStringsArray, ...variables: MessageExpression[]): string
  (options: TxOptions): Tx
}

export function createTx(options: CreateTxOptions): Tx {
  function tx(
    stringsOrOptions: TemplateStringsArray,
    ...variables: MessageExpression[]
  ): string
  function tx(stringsOrOptions: TxOptions): Tx
  function tx(
    stringsOrOptions: TemplateStringsArray | TxOptions,
    ...variables: MessageExpression[]
  ): string | Tx {
    if (isTemplateStringsArray(stringsOrOptions)) {
      const locale = options.getLocale()
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(strings.raw.join('${VAR}'))
      const id = toHash(rawMessage)
      const msg = options.getMessage(id)
      let message = typeof msg === 'string' ? msg : rawMessage

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
