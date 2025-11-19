// Types
import type { Locale } from '@terai/types'
import { teraiStore } from './state'

/**
 * Imperative function to change the current locale
 * This directly updates the store and notifies all subscribers
 */
export const setLocale = (locale: Locale) => {
	teraiStore.setState((prev) => ({
		...prev,
		locale
	}))
}
