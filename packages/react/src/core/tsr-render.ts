// Dependencies
import { interpolate } from '@koi18n/formatter'
import { interpolateComponents } from './interpolate'

// Types
import type { TsReactRenderProps } from './types'
import type { Locale, Dictionary } from '@koi18n/types'
import type { TsRenderProps } from '@koi18n/ts'

export type TsOutputProps = TsRenderProps &
  TsReactRenderProps & {
    locale: Locale
    dictionary: Dictionary
  }

export function tsrRender({
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
