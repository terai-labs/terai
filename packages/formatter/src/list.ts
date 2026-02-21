// Types
import type { Locale } from '@terai/types'

export type FormatListOptions = Intl.ListFormatOptions

export type FormatListProps = {
	value: Parameters<Intl.ListFormat['format']>[0]
	locale: Locale
	options?: FormatListOptions
}

// Cache
import { getCachedIntl } from './intl-cache'

export function formatList({
	value,
	locale,
	options
}: FormatListProps): ReturnType<Intl.ListFormat['format']> {
	const formatter = getCachedIntl(Intl.ListFormat, locale, options)

	return formatter.format(value)
}
