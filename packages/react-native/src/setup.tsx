// State
import { store, getInitialState } from './store'
import { loadFromStorage, saveToStorage } from './persistence'

// Types
import type { Loader, Locale } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

export type Config = {
	defaultLocale: Locale | (() => Locale)
	loader: Loader
	format?: GlobalFormat
	/**
	 * Enable React Suspense for dictionary loading
	 * When true: Component suspends while dictionary loads (requires Suspense boundary)
	 * When false: Returns empty dictionary while loading, re-renders when ready
	 * @default false
	 */
	suspense?: boolean
}

let globalConfig: Config | null = null

export const getConfig = (): Config => {
	if (!globalConfig) {
		throw new Error('Terai not initialized. Call "setupTerai" first.')
	}
	return globalConfig
}

export async function setupTerai(config: Config) {
	globalConfig = config

	const cachedState = await loadFromStorage()

	if (cachedState && (cachedState.locale || cachedState.dictionaries)) {
		store.setStateDirect({
			...getInitialState(),
			...cachedState
		})
	} else {
		const locale =
			typeof config.defaultLocale === 'function'
				? config.defaultLocale()
				: config.defaultLocale
		store.setState((prev) => ({
			...prev,
			locale
		}))
	}

	store.subscribe(() => {
		const state = store.getState()
		saveToStorage(state)
	})

	return globalConfig
}
