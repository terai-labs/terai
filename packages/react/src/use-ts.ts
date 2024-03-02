// Dependencies
import { config$ } from './config'
import { state$ } from './state'
import { createTs } from '@terai/ts'
import { tsRender } from './ts-render'

// Hooks
import { useEffect, useCallback } from 'react'
import { useLocale } from './use-locale'
import { useSelector } from '@legendapp/state/react'
import { useDictionaries } from './use-dictionaries'

// Types
import type { Locale, Loader } from '@terai/types'

type UseTsProps = {
	chunkId?: string
}

export const useTs = ({ chunkId }: UseTsProps = {}) => {
	const locale = useLocale()
	const dictionaries = useDictionaries()
	const config = useSelector(config$)

	const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale
	const dictionary = dictionaries[dictionaryId]
	const loaderId = chunkId ?? locale

	if (!dictionary) {
		throw loadDictionary({
			locale,
			loaderId,
			dictionaryId,
			loader: config.loader
		})
	}

	if (config.persist) {
		useEffect(() => {
			loadDictionary({
				locale,
				loaderId,
				dictionaryId,
				loader: config.loader
			})
		}, [locale])
	}

	const ts = useCallback(
		createTs<string>((props) =>
			tsRender({
				...props,
				locale,
				dictionary
			})
		),
		[locale]
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
	dictionaryId: string
	loader: Loader
}) => {
	const dic = await loader(locale, loaderId)

	state$.dictionaries[dictionaryId].set((prev) => ({
		...prev,
		...dic
	}))
}
