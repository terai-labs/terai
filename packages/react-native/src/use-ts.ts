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
import type { Locale, Loader, Dictionary, DictionaryId } from '@terai/types'

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
		if (dictionary) return null

		let existingPromise = dictionaryPromises.get(dictionaryId)

		if (!existingPromise) {
			existingPromise = loadDictionary({
				locale,
				loaderId,
				dictionaryId: dictionaryId as DictionaryId,
				loader: config.loader
			})

			dictionaryPromises.set(dictionaryId, existingPromise)

			existingPromise.finally(() => {
				dictionaryPromises.delete(dictionaryId)
			})
		}

		return existingPromise
	}, [locale, dictionaryId, dictionary, loaderId, config.loader])

	let loadedDictionary: Dictionary

	if (dictionary) {
		loadedDictionary = dictionary
	} else if (config.suspense && promise) {
		loadedDictionary = use(promise)
	} else {
		loadedDictionary = {}
	}

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

const loadDictionary = async ({
	locale,
	loaderId,
	dictionaryId,
	loader
}: {
	locale: Locale
	loaderId: string
	dictionaryId: DictionaryId
	loader: Loader
}): Promise<Dictionary> => {
	const dic = await loader(locale, loaderId)

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
