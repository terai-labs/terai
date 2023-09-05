// Types
import type { Locale } from '@rewordlabs/types'
import type { MessageExpression } from '../types'

// Utils
import { formatNumber } from './number'
import { formatDate } from './date'

export type InterpolateOptions = {
  message: string
  variables: MessageExpression[]
  locale: Locale
}

export function interpolate({
  message,
  variables,
  locale
}: InterpolateOptions) {
  let index = 0

  return message.replace(/\${(\w+)}/g, () => {
    const variable = variables[index]
    index++

    if (!variable) return ''

    if (typeof variable === 'string') return variable
    if (typeof variable === 'number' || typeof variable === 'bigint')
      return formatNumber({ value: variable, locale })

    if (variable instanceof Date) return formatDate({ value: variable, locale })

    if (typeof variable === 'object') {
      if (variable.format === 'number') {
        const { value, ...options } = variable
        return formatNumber({ value, options, locale })
      }

      if (variable.format === 'date') {
        const { value, ...options } = variable
        return formatDate({ value, options, locale })
      }
    }

    return variable
  })
}
