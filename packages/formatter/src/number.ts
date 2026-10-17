// Types
import type { Locale } from '@terai/types'

export type FormatNumberOptions = Intl.NumberFormatOptions

export type FormatNumberProps = {
	value: Parameters<Intl.NumberFormat['format']>[0]
	locale: Locale
	options?: FormatNumberOptions
}

// Cache
import { getCachedIntl } from './intl-cache'

export function formatNumber({
	value,
	locale,
	options
}: FormatNumberProps): ReturnType<Intl.NumberFormat['format']> {
	const formatter = getCachedIntl(Intl.NumberFormat, locale, options)

	return formatter.format(value)
}
