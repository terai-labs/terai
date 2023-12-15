// Dependencies
import {
  formatDate,
  formatDisplayName,
  formatList,
  formatNumber,
  formatRelativeTime
} from './index'

// Types
import type { Locale } from '@terai/types'
import type {
  FormatDateProps,
  FormatDisplayNameProps,
  FormatListProps,
  FormatNumberProps,
  FormatRelativeTimeProps
} from './index'

export function createFormat(getLocale: () => Locale) {
  return () => {
    const locale = getLocale()

    return {
      number: (
        value: FormatNumberProps['value'],
        options: FormatNumberProps['options']
      ) => formatNumber({ locale, value, options }),
      date: (
        value: FormatDateProps['value'],
        options: FormatDateProps['options']
      ) => formatDate({ locale, value, options }),
      displayName: (
        value: FormatDisplayNameProps['value'],
        options: FormatDisplayNameProps['options']
      ) => formatDisplayName({ locale, value, options }),
      list: (
        value: FormatListProps['value'],
        options: FormatListProps['options']
      ) => formatList({ locale, value, options }),
      relativeTime: (
        value: FormatRelativeTimeProps['value'],
        options: FormatRelativeTimeProps['options']
      ) => formatRelativeTime({ locale, value, options })
    }
  }
}
