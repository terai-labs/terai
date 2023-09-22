// Dependencies
import { joinTemplateStrings, prepareMessage, toHash } from '@rewordlabs/utils'

// Types
import type { Locale, Loader } from '@rewordlabs/types'
import type { DynamicValue } from './types'
import type { InterpolateOptions } from './interpolate'

export type TxRenderProps<P = unknown> = {
  id: string
  rawMessage: string
  variables: DynamicValue[]
  getLocale: () => Locale
  loader: Loader
} & TxOptions<P>

export type CreateTxOptions<T> = {
  getLocale: () => Locale
  loader: Loader
  render: (options: TxRenderProps) => T
}

export type TxOptions<P = unknown> = {
  context?: string
  chunkId?: string
} & InterpolateOptions &
  P

export interface Tx<T, P = unknown> {
  (strings: TemplateStringsArray, ...variables: DynamicValue[]): T
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
    ...variables: DynamicValue[]
  ): T
  function tx(stringsOrOptions: TxOptions<P>): Tx<T, P>
  function tx(
    stringsOrOptions: TemplateStringsArray | TxOptions<P>,
    ...variables: DynamicValue[]
  ): T | Tx<T, P> {
    console.log(variables)
    if (isTemplateStringsArray(stringsOrOptions)) {
      const { render, ...restOfOptions } = options
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(joinTemplateStrings(strings.raw))
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
