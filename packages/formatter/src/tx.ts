// Dependencies
import { prepareMessage, toHash } from '@rewordlabs/utils'

// Types
import type { Locale } from '@rewordlabs/types'
import type { MessageExpression } from './types'

export type TxRenderProps = {
  id: string
  rawMessage: string
  variables: MessageExpression[]
  getLocale: () => Locale
  loader: (locale: string, id: string) => Promise<string>
}

export type CreateTxOptions<T> = {
  getLocale: () => Locale
  loader: (locale: string, id: string) => Promise<string>
  render: (options: TxRenderProps) => T
}

export type TxOptions = {
  context: string
}

export interface Tx<T> {
  (strings: TemplateStringsArray, ...variables: MessageExpression[]): T
  (options: TxOptions): Tx<T>
}

export function createTx<T>(
  options: CreateTxOptions<T>,
  opts?: TxOptions
): Tx<T> {
  function tx(
    stringsOrOptions: TemplateStringsArray,
    ...variables: MessageExpression[]
  ): T
  function tx(stringsOrOptions: TxOptions): Tx<T>
  function tx(
    stringsOrOptions: TemplateStringsArray | TxOptions,
    ...variables: MessageExpression[]
  ): T | Tx<T> {
    if (isTemplateStringsArray(stringsOrOptions)) {
      console.log('tx', opts)
      const { render, ...restOfOptions } = options
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(strings.raw.join('${VAR}'))
      const id = toHash(rawMessage)

      return render({
        ...restOfOptions,
        id,
        rawMessage,
        variables
      })
    } else {
      return createTx(options, stringsOrOptions)
    }
  }

  return tx
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}
