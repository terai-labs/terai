// Dependencies
import { use, useCallback, useEffect, useMemo } from 'react'
import { createTs } from '@terai/ts'
import { tsRender } from './ts-render'
import { teraiStore } from './state'
import { getConfig } from './setup'

// Hooks
import { useLocale } from './use-locale'
import { useDictionaries } from './use-dictionaries'

// Types
import type { Locale, Loader, Dictionary } from '@terai/types'

type UseTsProps = {
	chunkId?: string
}

/**
 * Cache for dictionary loading promises
 * This ensures stable Promise references across re-renders
 * which is critical for the React 19 "use" hook
 */
const dictionaryPromises = new Map<string, Promise<Dictionary>>()

/**
 * Main hook for using translations
 * Implements React 19's "use" hook for async dictionary loading
 */
export const useTs = ({ chunkId }: UseTsProps = {}) => {
	const locale = useLocale()
	const dictionaries = useDictionaries()
	const config = getConfig()

	const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale
	const dictionary = dictionaries[dictionaryId]
	const loaderId = chunkId ?? locale

	/**
	 * Create or retrieve a stable Promise for loading the dictionary
	 * This memo ensures the Promise reference stays stable across re-renders
	 * until the locale or chunkId changes
	 */
	const dictionaryPromise = useMemo(() => {
		// If dictionary already exists, return resolved promise
		if (dictionary) {
			return Promise.resolve(dictionary)
		}

		// Check if we already have a pending promise for this dictionary
		const cachedPromise = dictionaryPromises.get(dictionaryId)
		if (cachedPromise) {
			return cachedPromise
		}

		// Create new promise for loading the dictionary
		const promise = loadDictionary({
			locale,
			loaderId,
			dictionaryId,
			loader: config.loader
		})

		// Cache the promise to ensure stable reference
		dictionaryPromises.set(dictionaryId, promise)

		// Clean up the promise from cache once resolved
		// This prevents memory leaks and allows re-fetching if needed
		promise.finally(() => {
			dictionaryPromises.delete(dictionaryId)
		})

		return promise
	}, [locale, dictionaryId, dictionary, loaderId, config.loader])

	/**
	 * Use React 19's "use" hook to unwrap the Promise
	 * This will:
	 * 1. Suspend the component if the Promise is pending
	 * 2. Return the resolved value once ready
	 * 3. Throw the error if the Promise is rejected
	 * 4. Integrate seamlessly with Suspense and Error Boundaries
	 */
	const loadedDictionary = use(dictionaryPromise)

	/**
	 * Preload dictionary when locale changes if persistence is enabled
	 * This ensures dictionaries are cached for faster subsequent loads
	 */
	useEffect(() => {
		if (config.persist && !dictionaries[dictionaryId]) {
			loadDictionary({
				locale,
				loaderId,
				dictionaryId,
				loader: config.loader
			}).catch((error) => {
				// Silently catch errors in preload - the main "use" hook will handle them
				console.warn('Failed to preload dictionary:', error)
			})
		}
	}, [
		locale,
		dictionaryId,
		loaderId,
		config.loader,
		config.persist,
		dictionaries
	])

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
	teraiStore.setState((prev) => ({
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
