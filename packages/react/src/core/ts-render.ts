// Dependencies
import { interpolate } from '@koi18n/formatter'

// Types
import type { TsReactRenderProps } from './types'
import type { Locale, Dictionary } from '@koi18n/types'
import { interpolateComponents } from '.'

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
  format,
  components
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

  if (!isEmpty(components)) {
    return interpolateComponents({
      message: interpolatedMessage,
      locale,
      components
    })
  }

  return interpolatedMessage
}

const isEmpty = (obj: TsOutputProps['components']) => {
  return Object.keys(obj).length === 0
}
