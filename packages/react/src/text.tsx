'use client'

// Dependencies
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { createReactInterpolate } from './interpolate'

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
  global,
  chunkId = id
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
    queryKey: [locale, chunkId, id],
    queryFn: () => loader(locale, chunkId, id)
  })

  const message = interpolate({
    message: typeof query?.data === 'string' ? query?.data : rawMessage,
    locale,
    variables
  })

  return <>{message}</>
}
