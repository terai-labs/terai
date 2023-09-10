// Utils
import { formatNumber } from './number'
import { formatDate } from './date'

// Types
import type { Locale } from '@rewordlabs/types'
import type { MessageExpression } from '../types'

export type InterpolateProps = {
  message: string
  variables: MessageExpression[]
  locale: Locale
}

export type InterpolateOptions = {
  plugins: ((a: unknown) => unknown)[]
}

export function interpolate(
  { message, variables, locale }: InterpolateProps,
  options?: InterpolateOptions
) {
  let index = 0

  const messageWithVars = message.replace(/\${(\w+)}/g, () => {
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

  if (options?.plugins) {
    let output: string | unknown = messageWithVars

    for (const plugin of options.plugins) {
      output = plugin(output)
    }

    return output
  }

  return messageWithVars
}
