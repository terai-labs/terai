// Dependencies
import { interpolate } from '@koi18n/formatter'

// Types
import type { Locale, Dictionary } from '@koi18n/types'
import type { TsRenderProps } from '@koi18n/ts'

export type TsOutputProps = TsRenderProps & {
  locale: Locale
  dictionary: Dictionary
}

export function tsRender({
  id,
  locale,
  rawMessage,
  variables,
  dictionary,
  format
}: TsOutputProps) {
  const message = dictionary?.[id] ?? rawMessage
  const interpolatedMessage = interpolate(
    {
      message,
      locale,
      variables
    },
    { format }
  )

  return interpolatedMessage
}
