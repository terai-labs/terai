'use client'

import 'client-only'

// Dependencies
import { useLocale } from './use-locale'
import { createReactInterpolate } from '@rewordlabs/react/core'
import { useQuery } from '@tanstack/react-query'

// Types
import type { TextProps } from '../types'
// import type { ReactNode } from 'react'

export function CSRText({
  id,
  loader,
  rawMessage,
  variables,
  components,
  format
}: TextProps<string>) {
  const locale = useLocale()
  const { data: json } = useQuery({
    queryKey: [locale],
    queryFn: async () => loader(locale, locale).then(mod => mod.default)
  })

  const interpolate = createReactInterpolate({
    locale,
    components,
    format
  })

  const message = interpolate({
    message: typeof json?.[id] === 'string' ? json?.[id] : rawMessage,
    locale,
    variables
  })

  return <>{message}</>
}
