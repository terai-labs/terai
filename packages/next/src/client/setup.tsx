'use client'

import 'client-only'

// Dependencies
import { createFormat } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { useLocale } from './use-locale'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Types
import type { ReactNode } from 'react'
import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react/core'

// Components
import { CSRText } from './text'

export type SetupClientOptions = CommonSetupOptions

export const setupClient = ({
  loader,
  components = {},
  format = {}
}: SetupClientOptions) => {
  const queryClient = new QueryClient()
  const useFormat = createFormat(useLocale)

  const tx = createTx<ReactNode, TxReactOptions>({
    render: props => {
      return (
        <QueryClientProvider client={queryClient}>
          {/* @ts-ignore */}
          <CSRText
            {...props}
            loader={loader}
            components={{
              ...components,
              ...props.components
            }}
            format={{
              ...format,
              ...props.format
            }}
          />
        </QueryClientProvider>
      )
    }
  })

  return {
    tx,
    useFormat
  }
}
