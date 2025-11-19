// Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage'
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

export async function loadFromStorage(): Promise<Partial<State> | null> {
	try {
		const stored: Partial<State> = {}

		const localeData = await AsyncStorage.getItem(STORAGE_KEYS.locale)
		if (localeData) {
			stored.locale = JSON.parse(localeData)
		}

		const dictionariesData = await AsyncStorage.getItem(
			STORAGE_KEYS.dictionaries
		)
		if (dictionariesData) {
			stored.dictionaries = JSON.parse(dictionariesData)
		}

		return Object.keys(stored).length > 0 ? stored : null
	} catch (error) {
		console.error('Failed to load Terai state from AsyncStorage:', error)
		return null
	}
}

export function saveToStorage(state: State): void {
	if (saveTimeoutId) clearTimeout(saveTimeoutId)

	saveTimeoutId = setTimeout(() => {
		Promise.all([
			AsyncStorage.setItem(STORAGE_KEYS.locale, JSON.stringify(state.locale)),
			AsyncStorage.setItem(
				STORAGE_KEYS.dictionaries,
				JSON.stringify(state.dictionaries)
			)
		]).catch((error) => {
			console.error('Failed to save Terai state to AsyncStorage:', error)
		})
	}, SAVE_DEBOUNCE_MS)
}
