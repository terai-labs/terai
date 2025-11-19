// Dependencies
import { use, useCallback, useMemo } from 'react'
import { createTs } from '@terai/ts'
import { tsRender } from './ts-render'
import { store } from './store'
import { getConfig } from './setup'

// Hooks
import { useLocale } from './use-locale'
import { useDictionary } from './use-dictionary'

// Types
import type { Locale, Loader, Dictionary } from '@terai/types'

/**
 * Cache for dictionary loading promises
 * This ensures stable Promise references across re-renders
 * which is critical for the React 19 "use" hook
 */
const dictionaryPromises = new Map<string, Promise<Dictionary>>()

/**
 * Main hook for using translations
 * Supports both Suspense and non-Suspense modes based on config
 *
 * Suspense mode (config.suspense = true):
 * - Uses React 19's "use" hook for async dictionary loading
 * - Component suspends while dictionary loads (requires Suspense boundary)
 * - If dictionary exists in store: NO SUSPENSION
 *
 * Non-Suspense mode (config.suspense = false, default):
 * - Loads dictionary in background without suspending
 * - Returns empty dictionary while loading
 * - Re-renders when dictionary is ready
 *
 * Performance optimization (both modes):
 * - If dictionary exists in store (from cache or previous load): instant return
 * - Only re-renders when the specific dictionary for this locale/chunk changes
 * - This ensures locale changes are instant when dictionaries are cached
 */
export const useTs = ({ chunkId }: { chunkId?: string } = {}) => {
	const locale = useLocale()
	const dictionary = useDictionary(locale, chunkId)
	const config = getConfig()

	const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale
	const loaderId = chunkId ?? locale

	/**
	 * Get or create the promise for loading the dictionary
	 * This needs to be done outside of the "use" hook call
	 * to avoid calling hooks inside useMemo
	 */
	const promise = useMemo(() => {
		// Dictionary already exists - no need for promise
		if (dictionary) {
			return null
		}

		// Check if we already have a pending promise for this dictionary
		let existingPromise = dictionaryPromises.get(dictionaryId)

		if (!existingPromise) {
			// Create new promise for loading the dictionary
			existingPromise = loadDictionary({
				locale,
				loaderId,
				dictionaryId,
				loader: config.loader
			})

			// Cache the promise to ensure stable reference
			dictionaryPromises.set(dictionaryId, existingPromise)

			// Clean up the promise from cache once resolved
			// This prevents memory leaks and allows re-fetching if needed
			existingPromise.finally(() => {
				dictionaryPromises.delete(dictionaryId)
			})
		}

		return existingPromise
	}, [locale, dictionaryId, dictionary, loaderId, config.loader])

	/**
	 * Get the dictionary - either from cache or by loading
	 *
	 * KEY OPTIMIZATION: Only use "use" hook when dictionary doesn't exist AND suspense is enabled
	 * This prevents suspension when switching to a locale that's already cached
	 *
	 * IMPORTANT: "use" hook must be called at top level, not inside useMemo
	 */
	let loadedDictionary: Dictionary

	if (dictionary) {
		// Dictionary already exists in store (from localStorage or previous load)
		// Return it immediately - NO SUSPENSION in either mode
		loadedDictionary = dictionary
	} else if (config.suspense && promise) {
		// Suspense mode: use the "use" hook to suspend
		// This is called at top level, not inside useMemo, to follow Rules of Hooks
		loadedDictionary = use(promise)
	} else {
		// Non-suspense mode: return empty dictionary
		// Component will re-render when dictionary loads via store update
		loadedDictionary = {}
	}

	/**
	 * Create the translation function
	 * Memoized to avoid unnecessary re-renders
	 */
	const ts = useCallback(
		createTs<string>((props) =>
			tsRender({
				...props,
				locale,
				dictionary: loadedDictionary
			})
		),
		[locale, loadedDictionary]
	)

	return { ts }
}

/**
 * Load a dictionary from the loader function
 * Updates the store with the loaded dictionary
 */
const loadDictionary = async ({
	locale,
	loaderId,
	dictionaryId,
	loader
}: {
	locale: Locale
	loaderId: string
	dictionaryId: string
	loader: Loader
}): Promise<Dictionary> => {
	// Call the user-provided loader function
	const dic = await loader(locale, loaderId)

	// Update the store with the loaded dictionary
	// This will trigger re-renders for components using useDictionary
	// and persist to localStorage automatically
	store.setState((prev) => ({
		...prev,
		dictionaries: {
			...prev.dictionaries,
			[dictionaryId]: {
				...prev.dictionaries[dictionaryId],
				...dic
			}
		}
	}))

	return dic
}
