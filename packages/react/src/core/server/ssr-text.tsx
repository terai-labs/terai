'use server'

import 'server-only'

// Dependencies
import { interpolate } from '@koi18n/formatter'

// Types
import type { TextProps } from '../types'

export async function SsrText({
  id,
  loader,
  getLocale,
  rawMessage,
  variables,
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
