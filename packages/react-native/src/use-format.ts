// Dependencies
import { useMemo } from 'react'
import {
	formatDate,
	formatDisplayName,
	formatList,
	formatNumber,
	formatRelativeTime
} from '@terai/formatter'

// Hooks
import { useLocale } from './use-locale'

// Types
import type { Locale } from '@terai/types'
import type {
	FormatDateProps,
	FormatDisplayNameProps,
	FormatListProps,
	FormatNumberProps,
	FormatRelativeTimeProps
} from '@terai/formatter'

/**
 * Hook to access locale-aware formatters.
 * Returns a memoized object that only changes when locale changes.
 */
export const useFormat = ({
	locale: overrideLocale
}: {
	locale?: Locale
} = {}) => {
	const storeLocale = useLocale()
	const currentLocale = overrideLocale || storeLocale

	return useMemo(
		() => ({
			number: (
				value: FormatNumberProps['value'],
				options?: FormatNumberProps['options']
			) => formatNumber({ locale: currentLocale, value, options }),
			date: (
				value: FormatDateProps['value'],
				options?: FormatDateProps['options']
			) => formatDate({ locale: currentLocale, value, options }),
			displayNames: (
				value: FormatDisplayNameProps['value'],
				options: FormatDisplayNameProps['options']
			) => formatDisplayName({ locale: currentLocale, value, options }),
			list: (
				value: FormatListProps['value'],
				options?: FormatListProps['options']
			) => formatList({ locale: currentLocale, value, options }),
			relativeTime: (
				value: FormatRelativeTimeProps['value'],
				options?: FormatRelativeTimeProps['options']
			) => formatRelativeTime({ locale: currentLocale, value, options })
		}),
		[currentLocale]
	)
}
