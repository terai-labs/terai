// State
import { store, selectDictionary } from './store'

// Types
import type { Dictionary, Locale } from '@terai/types'

/**
 * Get a specific dictionary by locale
 */
export const getDictionary = (locale: Locale): Dictionary | undefined => {
	return selectDictionary(store.getState(), locale)
}
