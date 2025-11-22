import { useSyncExternalStore } from 'react'
import { store } from './store'
import type { Locale, Dictionary, DictionaryId } from '@terai/types'

/**
 * Hook to access a specific dictionary by locale and optional chunkId
 *
 * Performance optimization:
 * - Only re-renders when the specific dictionary changes
 * - More efficient than useDictionaries which re-renders on any dictionary change
 */
export const useDictionary = (
	locale: Locale,
	chunkId?: string
): Dictionary | undefined => {
	const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale

	return useSyncExternalStore(
		store.subscribe,
		() => store.getSnapshot().dictionaries[dictionaryId as DictionaryId],
		() => store.getSnapshot().dictionaries[dictionaryId as DictionaryId]
	)
}
