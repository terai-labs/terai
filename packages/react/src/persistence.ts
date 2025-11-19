// Types
import type { State } from './state'
import pkg from '../package.json'

/**
 * Storage keys for persistence
 */
const STORAGE_KEYS = {
	locale: `terai-locale-${pkg.version}`,
	dictionaries: `terai-dictionaries-${pkg.version}`
} as const

/**
 * Load state from localStorage
 * Returns null if no data found or on error
 */
export function loadFromStorage(): Partial<State> | null {
	if (typeof window === 'undefined') {
		return null
	}

	try {
		const stored: Partial<State> = {}

		// Load locale
		const localeData = localStorage.getItem(STORAGE_KEYS.locale)
		if (localeData) {
			stored.locale = JSON.parse(localeData)
		}

		// Load dictionaries
		const dictionariesData = localStorage.getItem(STORAGE_KEYS.dictionaries)
		if (dictionariesData) {
			stored.dictionaries = JSON.parse(dictionariesData)
		}

		return Object.keys(stored).length > 0 ? stored : null
	} catch (error) {
		console.error('Failed to load Terai state from localStorage:', error)
		return null
	}
}

/**
 * Save state to localStorage
 * Saves locale and dictionaries separately for better control
 */
export function saveToStorage(state: State): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		// Save locale
		localStorage.setItem(STORAGE_KEYS.locale, JSON.stringify(state.locale))

		// Save dictionaries
		localStorage.setItem(
			STORAGE_KEYS.dictionaries,
			JSON.stringify(state.dictionaries)
		)
	} catch (error) {
		console.error('Failed to save Terai state to localStorage:', error)
	}
}

/**
 * Clear all persisted data
 */
export function clearStorage(): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.removeItem(STORAGE_KEYS.locale)
		localStorage.removeItem(STORAGE_KEYS.dictionaries)
	} catch (error) {
		console.error('Failed to clear Terai state from localStorage:', error)
	}
}
