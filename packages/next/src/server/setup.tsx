'use server'

import 'server-only'

// Dependencies
import { createFormat } from '@rewordlabs/formatter'
import { createReactInterpolate } from '@rewordlabs/react/core'
import { createTx } from '@rewordlabs/tx'
import { getLocale } from './get-locale'

// Types
import type { ReactNode } from 'react'
import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react'

export function setupServer({
  loader,
  components = {},
  format = {}
}: CommonSetupOptions) {
  const getFormat = createFormat(getLocale)
  const tx = createTx<ReactNode, TxReactOptions>({
    // @ts-ignore
    render: async ({ id, variables, rawMessage }) => {
      const locale = getLocale()
      const dictionary = (await loader(locale, locale)).default
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
    getFormat
  }
}
