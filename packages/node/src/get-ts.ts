// Dependencies
import { createTs, type TsRenderProps } from '@terai/ts'
import { interpolate } from '@terai/formatter'

// State
import { store, selectLocale } from './store'
import { getConfig } from './setup'

// Types
import type { Locale } from '@terai/types'

type GetTsOptions = {
	locale?: Locale
	chunkId?: string
}

/**
 * Get translation function for the specified locale
 * Loads dictionary if not already loaded
 */
export const getTs = async (options: GetTsOptions = {}) => {
	const config = getConfig()
	const state = store.getState()
	const locale = options.locale || selectLocale(state)
	const chunkId = options.chunkId || locale

	let dictionary = state.dictionaries[locale]

	if (!dictionary) {
		// Load dictionary using the loader
		const loadedDictionary = await config.loader(locale, chunkId)

		// Update store with loaded dictionary
		store.setState((prev) => ({
			...prev,
			dictionaries: {
				...prev.dictionaries,
				[locale]: {
					...(prev.dictionaries[locale] || {}),
					...loadedDictionary
				}
			}
		}))

		// Get updated dictionary from store
		dictionary = store.getState().dictionaries[locale]
	}

	return createTs<string, TsRenderProps>(({ id, variables, rawMessage }) => {
		const message = dictionary?.[id] ?? rawMessage

		return interpolate({
			message,
			variables
		})
	})
}
