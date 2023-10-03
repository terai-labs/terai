'use server'

import 'server-only'

// Dependencies
import { getLocale } from './get-locale'
import { interpolate } from '@rewordlabs/formatter'

// Types
import type { TextProps } from '../types'

export async function SsrText({
  id,
  loader,
  rawMessage,
  variables,
  // components,
  format
}: TextProps) {
  const locale = getLocale()
  const message = (await loader(locale, locale)).default[id] ?? rawMessage
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
