// Types
import type { Locale } from '@terai/types'

export type FormatRelativeTimeOptions = Intl.RelativeTimeFormatOptions

export type FormatRelativeTimeProps = {
	value: Parameters<Intl.RelativeTimeFormat['format']>
	locale: Locale
	options?: FormatRelativeTimeOptions
}

export function formatRelativeTime({
	value,
	locale,
	options
}: FormatRelativeTimeProps): ReturnType<Intl.RelativeTimeFormat['format']> {
	const formatter = new Intl.RelativeTimeFormat(locale, options)

	return formatter.format(value[0], value[1])
}
