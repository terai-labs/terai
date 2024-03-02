import type { FormatDateProps, FormatDateOptions } from './date'
import type { FormatListOptions, FormatListProps } from './list'
import type { FormatNumberProps, FormatNumberOptions } from './number'
import type {
	FormatDisplayNameOptions,
	FormatDisplayNameProps
} from './display-names'
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

export type DynamicEl<A, B extends { value: unknown; options?: unknown }> =
	| [B['value'], A]
	| [B['value'], A, B['options']]

export type DynamicNumberValue = DynamicEl<'number', FormatNumberProps>
export type DynamicDateValue = DynamicEl<'date', FormatDateProps>
export type DynamicListValue = DynamicEl<'list', FormatListProps>
export type DynamicRelativeTimeValue = DynamicEl<
	'relative-time',
	FormatRelativeTimeProps
>
export type DynamicDisplayNameValue = DynamicEl<
	'display-name',
	FormatDisplayNameProps
>

export type DynamicValue =
	| string
	| number
	| Date
	| DynamicNumberValue
	| DynamicDateValue
	| DynamicDisplayNameValue
	| DynamicListValue
	| DynamicRelativeTimeValue
