// Dependencies
import { interpolate } from '@terai/formatter'

// Types
import type { Locale, Dictionary } from '@terai/types'
import type { TsRenderProps } from '@terai/ts'

export type TsOutputProps = TsRenderProps & {
	locale: Locale
	dictionary: Dictionary
}

export function tsRender({
	id,
	locale,
	rawMessage,
	variables,
	dictionary,
	format
}: TsOutputProps) {
	const message = dictionary?.[id] ?? rawMessage
	const interpolatedMessage = interpolate(
		{
			message,
			locale,
			variables
		},
		{ format }
	)

	return interpolatedMessage
}
