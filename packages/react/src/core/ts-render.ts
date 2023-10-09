// Dependencies
import { interpolate } from '@koi18n/formatter'

// Types
import type { TsReactRenderProps } from './types'
import type { Locale, Dictionary } from '@koi18n/types'

export type TsOutputProps = TsReactRenderProps & {
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
