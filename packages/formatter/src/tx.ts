// Dependencies
import { prepareMessage, toHash } from '@rewordlabs/utils'

// Types
import type { Locale } from '@rewordlabs/types'
import type { MessageExpression } from './types'
import type { InterpolateOptions } from './interpolation'

export type TxRenderProps<P = unknown> = {
  id: string
  rawMessage: string
  variables: MessageExpression[]
  getLocale: () => Locale
  loader: (locale: string, id: string) => Promise<string>
} & TxOptions<P>

export type CreateTxOptions<T> = {
  getLocale: () => Locale
  loader: (locale: string, id: string) => Promise<string>
  render: (options: TxRenderProps) => T
}

export type TxOptions<P = unknown> = {
  context?: string
} & InterpolateOptions &
  P

export interface Tx<T, P = unknown> {
  (strings: TemplateStringsArray, ...variables: MessageExpression[]): T
  (options: TxOptions<P>): Tx<T, P>
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}

export function createTx<T, P = unknown>(
  options: CreateTxOptions<T>,
  opts?: TxOptions<P>
): Tx<T, P> {
  function tx(
    stringsOrOptions: TemplateStringsArray,
    ...variables: MessageExpression[]
  ): T
  function tx(stringsOrOptions: TxOptions<P>): Tx<T, P>
  function tx(
    stringsOrOptions: TemplateStringsArray | TxOptions<P>,
    ...variables: MessageExpression[]
  ): T | Tx<T, P> {
    if (isTemplateStringsArray(stringsOrOptions)) {
      const { render, ...restOfOptions } = options
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(strings.raw.join('${VAR}'))
      const id = toHash(rawMessage)

      return render({
        ...restOfOptions,
        ...opts,
        id,
        rawMessage,
        variables
      })
    } else {
      return createTx<T, P>(options, stringsOrOptions)
    }
  }

  return tx
}
