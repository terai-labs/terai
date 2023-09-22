import { formatNumber, type FormatNumberProps } from './number'
import { formatDate, type FormatDateProps } from './date'
import type { Locale } from '@rewordlabs/types'
import type { GlobalFormat, DynamicValue } from './types'
import { formatList, type FormatListProps } from './list'
import { formatDisplayName, type FormatDisplayNameProps } from './display-names'
import {
  formatRelativeTime,
  type FormatRelativeTimeProps
} from './relative-time'

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
      const [value, { format: type, ...options }] = variable

      switch (type) {
        case 'number': {
          return formatNumber({
            value: value as FormatNumberProps['value'],
            locale,
            options: (options as FormatNumberProps['options']) || format?.list
          })
        }

        case 'date': {
          return formatDate({
            value: value as FormatDateProps['value'],
            locale,
            options: (options as FormatDateProps['options']) || format?.date
          })
        }

        case 'list': {
          return formatList({
            value: value as FormatListProps['value'],
            locale,
            options: (options as FormatListProps['options']) || format?.list
          })
        }

        case 'display-name': {
          return formatDisplayName({
            value: value as FormatDisplayNameProps['value'],
            locale,
            options:
              (options as FormatDisplayNameProps['options']) ||
              format?.displayName
          }) as string
        }

        case 'relative-time': {
          return formatRelativeTime({
            value: value as FormatRelativeTimeProps['value'],
            locale,
            options:
              (options as FormatRelativeTimeProps['options']) ||
              format?.relativeTime
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
