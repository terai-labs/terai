// State
import { store } from './store'

// Types
import type { Locale } from '@terai/types'

/**
 * Imperative function to change the current locale
 */
export const setLocale = (locale: Locale) => {
	store.setState((prev) => ({
		...prev,
		locale
	}))
}
