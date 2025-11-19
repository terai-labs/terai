// Dependencies
import pkg from '../package.json'

// Types
import type { State } from './store'

/**
 * Storage keys for persistence
 */
const STORAGE_KEYS = {
	locale: `terai-locale-${pkg.version}`,
	dictionaries: `terai-dictionaries-${pkg.version}`
} as const

let saveTimeoutId: ReturnType<typeof setTimeout> | null = null
const SAVE_DEBOUNCE_MS = 300

export function loadFromStorage(): Partial<State> | null {
	if (typeof window === 'undefined') {
		return null
	}

	try {
		const stored: Partial<State> = {}

		const localeData = localStorage.getItem(STORAGE_KEYS.locale)
		if (localeData) {
			stored.locale = JSON.parse(localeData)
		}

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

export function saveToStorage(state: State): void {
	if (typeof window === 'undefined') {
		return
	}

	if (saveTimeoutId) clearTimeout(saveTimeoutId)

	saveTimeoutId = setTimeout(() => {
		try {
			localStorage.setItem(STORAGE_KEYS.locale, JSON.stringify(state.locale))
			localStorage.setItem(
				STORAGE_KEYS.dictionaries,
				JSON.stringify(state.dictionaries)
			)
		} catch (error) {
			console.error('Failed to save Terai state to localStorage:', error)
		}
	}, SAVE_DEBOUNCE_MS)
}
