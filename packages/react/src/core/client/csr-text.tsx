'use client'

// Dependencies
// import { use } from 'react'
import { useQuery } from './use-query'
import { interpolate } from '@tsmu/formatter'

// Types
import type { TextProps } from '../types'

export function CsrText({
  id,
  loader,
  variables,
  format,
  rawMessage,
  getLocale
}: TextProps) {
  const locale = getLocale()
  // const dictionary = use(loader(locale, locale).then(mod => mod.default))
  const message =
    useQuery({
      id,
      locale,
      loader: () => loader(locale, locale)
    }) ?? rawMessage
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
