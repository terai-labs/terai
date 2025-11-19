// Dependencies
import { use, useCallback, useContext, useEffect, useMemo } from 'react'
import { createTs } from '@terai/ts'
import { tsRender } from './ts-render'
import { TeraiContext } from './state'
import { getConfig } from './setup'

// Hooks
import { useLocale } from './use-locale'
import { useDictionaries } from './use-dictionaries'

// Types
import type { Locale, Loader, Dictionary } from '@terai/types'

type UseTsProps = {
	chunkId?: string
}

// Cache for dictionary loading promises
const dictionaryPromises = new Map<string, Promise<Dictionary>>()

export const useTs = ({ chunkId }: UseTsProps = {}) => {
	const locale = useLocale()
	const dictionaries = useDictionaries()
	const context = useContext(TeraiContext)
	const config = getConfig()

	if (!context) {
		throw new Error('useTs must be used within TeraiProvider')
	}

	const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale
	const dictionary = dictionaries[dictionaryId]
	const loaderId = chunkId ?? locale

	// Create or get cached promise for loading the dictionary
	const dictionaryPromise = useMemo(() => {
		if (dictionary) {
			return Promise.resolve(dictionary)
		}

		// Check if we already have a promise for this dictionary
		const cachedPromise = dictionaryPromises.get(dictionaryId)
		if (cachedPromise) {
			return cachedPromise
		}

		// Create new promise for loading
		const promise = loadDictionary({
			locale,
			loaderId,
			dictionaryId,
			loader: config.loader,
			setState: context.setState
		})

		dictionaryPromises.set(dictionaryId, promise)

		// Clean up the promise from cache once resolved
		promise.finally(() => {
			dictionaryPromises.delete(dictionaryId)
		})

		return promise
	}, [
		locale,
		dictionaryId,
		dictionary,
		loaderId,
		config.loader,
		context.setState
	])

	// Use React 19's "use" hook to unwrap the promise
	const loadedDictionary = use(dictionaryPromise)

	// Preload dictionary when locale changes if persistence is enabled
	useEffect(() => {
		if (config.persist && !dictionaries[dictionaryId]) {
			loadDictionary({
				locale,
				loaderId,
				dictionaryId,
				loader: config.loader,
				setState: context.setState
			})
		}
	}, [
		locale,
		dictionaryId,
		loaderId,
		config.loader,
		config.persist,
		dictionaries,
		context.setState
	])

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
	loader,
	setState
}: {
	locale: Locale
	loaderId: string
	dictionaryId: string
	loader: Loader
	setState: (updater: (prev: any) => any) => void
}): Promise<Dictionary> => {
	const dic = await loader(locale, loaderId)

	setState((prev) => ({
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
