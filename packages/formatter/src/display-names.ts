// Types
import type { Locale } from '@terai/types'

export type FormatDisplayNameOptions = Intl.DisplayNamesOptions

export type FormatDisplayNameProps = {
	value: Parameters<Intl.DisplayNames['of']>[0]
	locale: Locale
	options: FormatDisplayNameOptions
}

// Cache
import { getCachedIntl } from './intl-cache'

export function formatDisplayName({
	value,
	locale,
	options
}: FormatDisplayNameProps): ReturnType<Intl.DisplayNames['of']> {
	const formatter = getCachedIntl(Intl.DisplayNames, locale, options)

	return formatter.of(value)
}
