import type { FormatDateProps, FormatDateOptions } from './date'
import type {
  FormatDisplayNameOptions,
  FormatDisplayNameProps
} from './display-names'
import type { FormatListOptions, FormatListProps } from './list'
import type { FormatNumberProps, FormatNumberOptions } from './number'
import type {
  FormatRelativeTimeOptions,
  FormatRelativeTimeProps
} from './relative-time'

export type GlobalFormat = {
  number?: FormatNumberOptions
  date?: FormatDateOptions
  list?: FormatListOptions
  displayName?: FormatDisplayNameOptions
  relativeTime?: FormatRelativeTimeOptions
}

export type DynamicValue =
  | string
  | FormatNumberProps['value']
  | FormatDateProps['value']
  | [
      FormatNumberProps['value'],
      { format: 'number' } & FormatNumberProps['options']
    ]
  | [FormatDateProps['value'], { format: 'date' } & FormatDateProps['options']]
  | [FormatListProps['value'], { format: 'list' } & FormatListProps['options']]
  | [
      FormatDisplayNameProps['value'],
      { format: 'display-name' } & FormatDisplayNameProps['options']
    ]
  | [
      FormatRelativeTimeProps['value'],
      { format: 'relative-time' } & FormatRelativeTimeProps['options']
    ]
