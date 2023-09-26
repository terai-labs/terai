'use client'

// Dependencies
import { useCallback } from 'react'
import { createReactInterpolate } from './interpolate'

// Types
import type { TextProps } from './types'

export const text = ({
  getLocale,
  rawMessage,
  variables,
  components,
  format,
  global
}: TextProps): string => {
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

  const message = interpolate({
    message: rawMessage,
    locale,
    variables
  })

  return message as string
}
