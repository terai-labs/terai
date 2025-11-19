import { useSyncExternalStore } from 'react'
import { teraiStore } from './state'

/**
 * Hook to access the current locale
 * Uses useSyncExternalStore for efficient subscriptions
 */
export const useLocale = () => {
	// Get locale from store using useSyncExternalStore
	const state = useSyncExternalStore(
		teraiStore.subscribe,
		teraiStore.getSnapshot,
		teraiStore.getSnapshot // Server snapshot is the same as client
	)

	return state.locale
}
