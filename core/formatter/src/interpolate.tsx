// Dependencies
import { formatNumber } from './number'
import { formatDate } from './date'
import { formatList } from './list'
import { formatRelativeTime } from './relative-time'
import { formatDisplayName } from './display-names'

// Types
import type { FormatDisplayNameOptions } from './display-names'
import type { GlobalFormat, DynamicValue } from './types'
import type { Locale } from '@rewordlabs/types'

export type InterpolateProps = {
  message: string
  variables: DynamicValue[]
  locale: Locale
}

export type InterpolateOptions = {
  plugins?: ((a: unknown) => unknown)[]
  format?: GlobalFormat
}

export function interpolate(
  { message, variables, locale }: InterpolateProps,
  { plugins, format }: InterpolateOptions = {}
) {
  let index = 0

  const messageWithVars = message.replace(/\${(\w+)}/g, () => {
    const variable = variables[index]
    index++

    if (!variable) return ''

    if (typeof variable === 'string') {
      return variable
    }

    if (typeof variable === 'number' || typeof variable === 'bigint') {
      return formatNumber({
        value: variable,
        locale,
        options: format?.number
      })
    }

    if (variable instanceof Date) {
      return formatDate({
        value: variable,
        locale,
        options: format?.date
      })
    }

    if (Array.isArray(variable)) {
      const [value, type, options] = variable

      switch (type) {
        case 'number': {
          return formatNumber({
            value: value,
            locale,
            options: options || format?.list
          })
        }

        case 'date': {
          return formatDate({
            value: value,
            locale,
            options: options || format?.date
          })
        }

        case 'list': {
          return formatList({
            value: value,
            locale,
            options: options || format?.list
          })
        }

        case 'display-name': {
          return formatDisplayName({
            value: value,
            locale,
            options: (options ||
              format?.displayName) as FormatDisplayNameOptions
          }) as string
        }

        case 'relative-time': {
          return formatRelativeTime({
            value: value,
            locale,
            options: options || format?.relativeTime
          })
        }

        default: {
          return ''
        }
      }
    }

    return variable
  })

  if (plugins) {
    let output: string | unknown = messageWithVars

    for (const plugin of plugins) {
      output = plugin(output)
    }

    return output
  }

  return messageWithVars
}
