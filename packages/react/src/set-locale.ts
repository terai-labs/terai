// Dependencies
import { state$ } from './state'

// Types
import type { Locale } from '@terai/types'

export const setLocale = (locale: Locale) => {
	state$.locale.set(locale)
}
