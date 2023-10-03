// Dependencies
import { joinTemplateStrings, prepareMessage, toHash } from '@rewordlabs/utils'

// Types
import type { InterpolateOptions, DynamicValue } from '@rewordlabs/formatter'

export type CreateTxOptions<R, E> = {
  render: (options: E) => R
}

export type TxRenderProps = TxOptions & {
  id: string
  rawMessage: string
  variables: DynamicValue[]
}

export type TxOptions = InterpolateOptions & {
  context?: string
}

export interface Tx<R, E> {
  (strings: TemplateStringsArray, ...variables: DynamicValue[]): R
  (options: TxOptions & E): Tx<R, E>
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}

export function createTx<R, E extends TxRenderProps>(
  options: CreateTxOptions<R, E>,
  opts?: E
): Tx<R, E> {
  function tx(
    stringsOrOptions: TemplateStringsArray,
    ...variables: DynamicValue[]
  ): R
  function tx(stringsOrOptions: E): Tx<R, E>
  function tx(
    stringsOrOptions: TemplateStringsArray | E,
    ...variables: DynamicValue[]
  ): R | Tx<R, E> {
    if (isTemplateStringsArray(stringsOrOptions)) {
      const { render } = options
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(joinTemplateStrings(strings.raw))
      const id = toHash(rawMessage)
      const args = {
        ...opts,
        id,
        rawMessage,
        variables
      } as E

      return render(args)
    } else {
      return createTx<R, E>(options, stringsOrOptions)
    }
  }

  return tx
}
