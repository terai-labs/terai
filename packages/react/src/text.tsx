'use client'

// Dependencies
import { useQuery } from '@tanstack/react-query'
import { createReactInterpolate } from './interpolate'
import { useCallback } from 'react'

// Types
import type { TextProps } from './types'

export const Text = ({
  getLocale,
  id,
  loader,
  rawMessage,
  variables,
  components,
  format,
  global
}: TextProps) => {
  const locale = getLocale()
  const interpolate = useCallback(
    createReactInterpolate({
      locale,
      plugins: global.plugins,
      components: {
        ...global?.components,
        ...components
      },
      format: {
        ...global?.format,
        ...format
      }
    }),
    []
  )

  const query = useQuery({
    queryKey: [locale, id],
    queryFn: () => loader(locale, id)
  })

  const message = interpolate({
    message: typeof query?.data === 'string' ? query?.data : rawMessage,
    locale,
    variables
  })

  return <>{message}</>
}
