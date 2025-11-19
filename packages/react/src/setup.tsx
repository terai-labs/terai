// Dependencies
import { useEffect } from 'react'

// State
import { teraiStore, getInitialState } from './state'
import { loadFromStorage, saveToStorage } from './persistence'

// Types
import type { Loader, Locale } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

export type Config = {
	defaultLocale: Locale | (() => Locale)
	loader: Loader
	format?: GlobalFormat
}

// Global config storage (non-reactive, used for reference)
let globalConfig: Config | null = null

export const getConfig = (): Config => {
	if (!globalConfig) {
		throw new Error('Terai not initialized. Call setupTerai first.')
	}
	return globalConfig
}

/**
 * Initialize Terai with configuration
 * Persistence is always enabled for optimal performance
 *
 * On startup:
 * 1. Loads cached locale and dictionaries from localStorage
 * 2. Renders immediately with cached data (no suspension)
 * 3. User can navigate instantly
 */
export function setupTerai(config: Config) {
	globalConfig = config

	// Try to load from localStorage first for instant startup
	const cachedState = loadFromStorage()

	if (cachedState && (cachedState.locale || cachedState.dictionaries)) {
		// We have cached data - use it immediately for fast startup
		teraiStore.setStateDirect({
			...getInitialState(),
			...cachedState,
			started: true
		})
	} else {
		// No cached data - initialize with default locale
		initializeWithDefaultLocale(globalConfig.defaultLocale)
	}

	// Subscribe to store changes and persist to localStorage
	// This ensures locale and dictionaries are always saved
	teraiStore.subscribe(() => {
		const state = teraiStore.getState()
		saveToStorage(state)
	})

	return globalConfig
}

/**
 * Initialize store with default locale
 */
function initializeWithDefaultLocale(defaultLocale: Locale | (() => Locale)) {
	const currentState = teraiStore.getState()
	if (!currentState.started) {
		const locale =
			typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale
		teraiStore.setState((prev) => ({
			...prev,
			locale,
			started: true
		}))
	}
}

/**
 * Optional component for advanced use cases
 * This component ensures the store is initialized when mounted
 * Most users won't need this - just call setupTerai()
 */
export function TeraiInitializer({ config }: { config: Config }) {
	useEffect(() => {
		setupTerai(config)
	}, [config])

	return null
}
