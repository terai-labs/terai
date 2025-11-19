// Hooks
import { useSyncExternalStore } from 'react'

// State
import { store, selectDictionaries } from './store'

// Types
import type { Dictionaries } from '@terai/types'

/**
 * Hook to access all dictionaries
 */
export const useDictionaries = (): Dictionaries => {
	return useSyncExternalStore(
		store.subscribe,
		() => selectDictionaries(store.getSnapshot()),
		() => selectDictionaries(store.getSnapshot())
	)
}
