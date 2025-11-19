// State
import { store, selectLocale } from './store'

// Types
import type { Locale } from '@terai/types'

/**
 * Get the current locale
 */
export const getLocale = (): Locale => {
	return selectLocale(store.getState())
}
