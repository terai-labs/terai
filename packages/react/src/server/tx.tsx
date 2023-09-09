// Dependencies
import { prepareMessage, toHash } from '@rewordlabs/utils'
import { Suspense } from 'react'
import { Text } from './text'

// Types
import type { MessageExpression } from '@rewordlabs/formatter'
import type { ReactNode } from 'react'
import type { CreateSetupServerOptions, SetupServerOptions } from './setup'

export type TxOptions = {
  context: string
}

export interface Tx {
  (strings: TemplateStringsArray, ...variables: MessageExpression[]): ReactNode
  (options: TxOptions): Tx
}

export type CreateTxOptions = {
  loader: SetupServerOptions['loader']
  getLocale: CreateSetupServerOptions['getLocale']
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}

export function createTx(options: CreateTxOptions): Tx {
  function tx(
    stringsOrOptions: TemplateStringsArray,
    ...variables: MessageExpression[]
  ): ReactNode
  function tx(stringsOrOptions: TxOptions): Tx
  function tx(
    stringsOrOptions: TemplateStringsArray | TxOptions,
    ...variables: MessageExpression[]
  ): ReactNode | Tx {
    if (isTemplateStringsArray(stringsOrOptions)) {
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(strings.raw.join('${VAR}'))
      const id = toHash(rawMessage)

      return (
        <Suspense>
          {/* @ts-ignore */}
          <Text
            {...options}
            id={id}
            rawMessage={rawMessage}
            variables={variables}
          />
        </Suspense>
      )
    } else {
      return createTx(options)
    }
  }

  return tx
}
