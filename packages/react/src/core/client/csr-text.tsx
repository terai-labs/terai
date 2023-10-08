'use client'

// Dependencies
// import { use } from 'react'
import { useQuery } from './use-query'
import { interpolate } from '@koi18n/formatter'

// Types
import type { TextProps } from '../types'
import { useCanRender } from './use-can-render'

export function CsrText({
  id,
  loader,
  variables,
  format,
  rawMessage,
  getLocale
}: TextProps) {
  const canRender = useCanRender()
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

  if (!canRender) return null

  return <>{interpolatedMessage}</>
}
