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

	// Try to load from AsyncStorage first for instant startup
	const cachedState = await loadFromStorage()

	if (cachedState && (cachedState.locale || cachedState.dictionaries)) {
		// We have cached data - use it immediately for fast startup
		store.setStateDirect({
			...getInitialState(),
			...cachedState
		})
	} else {
		// No cached data - initialize with default locale
		const locale =
			typeof config.defaultLocale === 'function'
				? config.defaultLocale()
				: config.defaultLocale
		store.setState((prev) => ({
			...prev,
			locale
		}))
	}

	// Subscribe to store changes and persist to AsyncStorage
	// saveToStorage is debounced internally for performance
	store.subscribe(() => {
		const state = store.getState()
		saveToStorage(state)
	})

	return globalConfig
}
