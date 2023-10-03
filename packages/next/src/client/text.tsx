'use client'

import 'client-only'

// Dependencies
import { useLocale } from './use-locale'
import { interpolate } from '@rewordlabs/formatter'

// Types
import type { TextProps } from '../types'
import type { ReactNode } from 'react'

export function CsrText({
  id,
  loader,
  rawMessage,
  variables,
  useDictionary,
  format
}: TextProps<ReactNode> & { useDictionary: any }) {
  const locale = useLocale()
  const dictionary = useDictionary({
    queryKey: [locale],
    queryFn: async () => (await loader(locale, locale)).default
  })
  const message = dictionary?.[id] ?? rawMessage
  const interpolatedMessage = interpolate(
    {
      message,
      locale,
      variables
    },
    { format }
  )

  return <>{interpolatedMessage}</>
}
