// Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import pkg from '../package.json'

// Types
import type { State } from './store'

/**
 * Storage keys for persistence. The locale key is stable so a user's language
 * survives Terai upgrades; dictionaries stay per version because a cached
 * dictionary from another version may be stale.
 */
const STORAGE_KEYS = {
	locale: 'terai-locale',
	dictionaries: `terai-dictionaries-${pkg.version}`
} as const

// Before 0.0.19 the locale was saved under `terai-locale-<version>`
const LEGACY_LOCALE_KEY = /^terai-locale-(\d+)\.(\d+)\.(\d+)(?:-.+)?$/
const DICTIONARIES_KEY_PREFIX = 'terai-dictionaries-'

/**
 * Finds the keys other Terai versions left behind: the newest versioned locale
 * key, whose value moves to the stable key, and every legacy locale or other
 * version's dictionaries key, which can be removed.
 */
export function findLegacyKeys(keys: readonly string[]) {
	let newest: { key: string; version: number[] } | undefined
	const staleKeys: string[] = []

	for (const key of keys) {
		const match = LEGACY_LOCALE_KEY.exec(key)

		if (match) {
			staleKeys.push(key)
			const version = match.slice(1).map(Number)
			if (!newest || compareVersions(version, newest.version) > 0) {
				newest = { key, version }
			}
		} else if (
			key.startsWith(DICTIONARIES_KEY_PREFIX) &&
			key !== STORAGE_KEYS.dictionaries
		) {
			staleKeys.push(key)
		}
	}

	return { legacyLocaleKey: newest?.key, staleKeys }
}

function compareVersions(a: number[], b: number[]) {
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return a[i] - b[i]
	}
	return 0
}

let saveTimeoutId: ReturnType<typeof setTimeout> | null = null
const SAVE_DEBOUNCE_MS = 300

export async function loadFromStorage(): Promise<Partial<State> | null> {
	if (Platform.OS === 'web' && typeof window === 'undefined') return null
	try {
		await migrateLegacyKeys()
	} catch (error) {
		console.error('Failed to migrate Terai state in AsyncStorage:', error)
	}

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

async function migrateLegacyKeys() {
	const keys = await AsyncStorage.getAllKeys()
	const { legacyLocaleKey, staleKeys } = findLegacyKeys(keys)

	if (legacyLocaleKey && !keys.includes(STORAGE_KEYS.locale)) {
		const legacyLocale = await AsyncStorage.getItem(legacyLocaleKey)
		if (legacyLocale !== null) {
			await AsyncStorage.setItem(STORAGE_KEYS.locale, legacyLocale)
		}
	}

	if (staleKeys.length) await AsyncStorage.multiRemove(staleKeys)
}

export function saveToStorage(state: State): void {
	if (Platform.OS === 'web' && typeof window === 'undefined') return
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
