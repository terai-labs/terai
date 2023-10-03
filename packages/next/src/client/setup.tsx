'use client'

import 'client-only'

// Dependencies
import { createUseDictionary } from './use-dictionary'
import { createReactInterpolate } from '@rewordlabs/react/core'
import { createFormat } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { useLocale } from './use-locale'
import { QueryClient } from '@tanstack/react-query'

// Types
import type { ReactNode } from 'react'
import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react/core'

export const setupClient = ({
  loader,
  components = {},
  format = {}
}: CommonSetupOptions) => {
  const queryClient = new QueryClient()
  const useFormat = createFormat(useLocale)
  const useDictionary = createUseDictionary(queryClient)

  const tx = createTx<ReactNode, TxReactOptions>({
    render: ({ rawMessage, id, variables }) => {
      const locale = useLocale()
      const dictionary = useDictionary({
        queryKey: [locale],
        queryFn: async () => (await loader(locale, locale)).default
      })
      const message = dictionary?.[id]

      const interpolate = createReactInterpolate({
        locale,
        components,
        format
      })

      return interpolate({
        message: message ?? rawMessage,
        locale,
        variables
      })
    }
  })

  return {
    tx,
    useFormat
  }
}
