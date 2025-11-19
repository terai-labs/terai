// State
import { store, selectDictionaries } from './store'

// Types
import type { Dictionaries } from '@terai/types'

/**
 * Get all loaded dictionaries
 */
export const getDictionaries = (): Dictionaries => {
	return selectDictionaries(store.getState())
}
