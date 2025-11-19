// Hooks
import { useSyncExternalStore } from 'react'

// State
import { store, selectLocale } from './store'

// Types
import type { Locale } from '@terai/types'

/**
 * Hook to access the current locale
 */
export const useLocale = (): Locale => {
	return useSyncExternalStore(
		store.subscribe,
		() => selectLocale(store.getSnapshot()),
		() => selectLocale(store.getSnapshot())
	)
}
