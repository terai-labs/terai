// Dependencies
import { use } from 'react'
import { interpolate } from '@rewordlabs/formatter'

// Types
import type { TextProps } from '../types'

export function CsrText({
  id,
  loader,
  rawMessage,
  variables,
  format,
  getLocale
}: TextProps) {
  const locale = getLocale()
  const dictionary = use(loader(locale, locale).then(mod => mod.default))
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
