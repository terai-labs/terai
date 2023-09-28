// Dependencies
import { joinTemplateStrings, prepareMessage, toHash } from '@rewordlabs/utils'

// Types
import type { InterpolateOptions, DynamicValue } from '@rewordlabs/formatter'

export type TxRenderProps<P> = {
  id: string
  rawMessage: string
  variables: DynamicValue[]
} & TxOptions<P>

export type CreateTxOptions<T, P> = {
  render: (options: TxRenderProps<P>) => T
}

export type TxOptions<P> = {
  context?: string
  chunkId?: string
} & InterpolateOptions &
  P

export interface Tx<T, P> {
  (strings: TemplateStringsArray, ...variables: DynamicValue[]): T
  (options: TxOptions<P>): Tx<T, P>
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}

export function createTx<T, P>(
  options: CreateTxOptions<T, P>,
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
    if (isTemplateStringsArray(stringsOrOptions)) {
      const { render, ...restOfOptions } = options
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(joinTemplateStrings(strings.raw))
      const id = toHash(rawMessage)

      // @ts-ignore
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
