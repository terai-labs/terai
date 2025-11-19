import { useSyncExternalStore } from 'react'
import { teraiStore } from './state'

/**
 * Hook to access all dictionaries
 * Uses useSyncExternalStore for efficient subscriptions
 */
export const useDictionaries = () => {
	// Get dictionaries from store using useSyncExternalStore
	const state = useSyncExternalStore(
		teraiStore.subscribe,
		teraiStore.getSnapshot,
		teraiStore.getSnapshot // Server snapshot is the same as client
	)

	return state.dictionaries
}
