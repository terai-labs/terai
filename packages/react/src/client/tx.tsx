// Dependencies
import { prepareMessage, toHash } from '@rewordlabs/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Components
import { Text } from './text'

// Types
import type { MessageExpression } from '@rewordlabs/formatter'
import type { ReactNode } from 'react'
import type { SetupClientOptions } from './setup'
import type { Locale } from '@rewordlabs/types'

export type TxOptions = {
  context: string
}

export interface Tx {
  (strings: TemplateStringsArray, ...variables: MessageExpression[]): ReactNode
  (options: TxOptions): Tx
}

export type CreateTxOptions = {
  queryClient: QueryClient
  loader: SetupClientOptions['loader']
  getLocale: () => Locale
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}

export function createTx(options: CreateTxOptions): Tx {
  const { queryClient, loader, getLocale } = options

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
        <QueryClientProvider client={queryClient}>
          <Text
            getLocale={getLocale}
            id={id}
            loader={loader}
            rawMessage={rawMessage}
            variables={variables}
          />
        </QueryClientProvider>
      )
    } else {
      return createTx(options)
    }
  }

  return tx
}
