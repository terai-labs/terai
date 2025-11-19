// Dependencies
import { useEffect } from 'react'
import pkg from '../package.json'

// State
import { teraiStore, getInitialState } from './state'

// Types
import type { Loader, Locale } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

export type Config = {
	defaultLocale: Locale | (() => Locale)
	loader: Loader
	format?: GlobalFormat
	persist?: boolean
	storageKey?: string
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
 * This function sets up the global configuration and initializes the store
 */
export function setupTerai(config: Config) {
	globalConfig = {
		persist: false,
		storageKey: `terai-${pkg.version}`,
		...config
	}

	const storageKey = globalConfig.storageKey ?? `terai-${pkg.version}`

	// Initialize state from localStorage if persistence is enabled
	if (globalConfig.persist && typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem(storageKey)
			if (stored) {
				const parsedState = JSON.parse(stored)
				teraiStore.setStateDirect({
					...getInitialState(),
					...parsedState,
					started: true
				})
			} else {
				// No stored state, initialize with default locale
				initializeWithDefaultLocale(globalConfig.defaultLocale)
			}
		} catch (error) {
			console.error('Failed to load Terai state from localStorage:', error)
			// Fallback to default initialization
			initializeWithDefaultLocale(globalConfig.defaultLocale)
		}
	} else {
		// No persistence, just initialize with default locale
		initializeWithDefaultLocale(globalConfig.defaultLocale)
	}

	// Set up localStorage sync if persistence is enabled
	if (globalConfig.persist && typeof window !== 'undefined') {
		// Subscribe to store changes and persist to localStorage
		teraiStore.subscribe(() => {
			try {
				const state = teraiStore.getState()
				localStorage.setItem(storageKey, JSON.stringify(state))
			} catch (error) {
				console.error('Failed to save Terai state to localStorage:', error)
			}
		})
	}

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
