// Dependencies
import { useState, useEffect, type ReactNode } from 'react'
import pkg from '../package.json'

// State
import { TeraiContext, getInitialState, type State } from './state'
import { setContextRef } from './set-locale'

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

type TeraiProviderProps = {
	children: ReactNode
	config: Config
}

export function TeraiProvider({ children, config }: TeraiProviderProps) {
	const storageKey = config.storageKey ?? `terai-${pkg.version}`

	// Initialize state with localStorage if persistence is enabled
	const [state, setState] = useState<State>(() => {
		if (config.persist && typeof window !== 'undefined') {
			try {
				const stored = localStorage.getItem(storageKey)
				if (stored) {
					const parsedState = JSON.parse(stored)
					return {
						...getInitialState(),
						...parsedState,
						started: true
					}
				}
			} catch (error) {
				console.error('Failed to load Terai state from localStorage:', error)
			}
		}

		const defaultLocale =
			typeof config.defaultLocale === 'function'
				? config.defaultLocale()
				: config.defaultLocale

		return {
			...getInitialState(),
			locale: defaultLocale,
			started: true
		}
	})

	// Persist state to localStorage whenever it changes
	useEffect(() => {
		if (config.persist && typeof window !== 'undefined') {
			try {
				localStorage.setItem(storageKey, JSON.stringify(state))
			} catch (error) {
				console.error('Failed to save Terai state to localStorage:', error)
			}
		}
	}, [state, config.persist, storageKey])

	// Set context ref for imperative setLocale function
	const contextValue = { state, setState }
	useEffect(() => {
		setContextRef(contextValue)
		return () => setContextRef(null)
	}, [contextValue])

	return (
		<TeraiContext.Provider value={contextValue}>
			{children}
		</TeraiContext.Provider>
	)
}

export function setupTerai(config: Config) {
	globalConfig = {
		persist: false,
		storageKey: `terai-${pkg.version}`,
		...config
	}

	return globalConfig
}
