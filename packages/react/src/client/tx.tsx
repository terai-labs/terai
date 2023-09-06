// Dependencies
import { prepareMessage, toHash } from '@rewordlabs/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Components
import { Text } from './text'

// Types
import type { MessageExpression } from '@rewordlabs/formatter'
import type { ObservableState, SetupOptions } from './types'
import type { ReactNode } from 'react'

export type TxOptions = {
  context: string
}

export interface Tx {
  (strings: TemplateStringsArray, ...variables: MessageExpression[]): ReactNode
  (options: TxOptions): Tx
}

export type CreateTxOptions = {
  queryClient: QueryClient
  loader: SetupOptions['loader']
  locale$: ObservableState
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}

export function createTx(options: CreateTxOptions): Tx {
  const { queryClient, loader, locale$ } = options

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
      const locale = locale$.use()
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(strings.raw.join('${VAR}'))
      const id = toHash(rawMessage)

      return (
        <QueryClientProvider client={queryClient}>
          <Text
            id={id}
            loader={loader}
            locale={locale}
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
