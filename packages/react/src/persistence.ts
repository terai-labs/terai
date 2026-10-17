// Dependencies
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

export function loadFromStorage(): Partial<State> | null {
	if (typeof window === 'undefined') {
		return null
	}

	try {
		migrateLegacyKeys()
	} catch (error) {
		console.error('Failed to migrate Terai state in localStorage:', error)
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

function migrateLegacyKeys() {
	const keys = Array.from({ length: localStorage.length }, (_, index) =>
		localStorage.key(index)
	).filter((key) => key !== null)
	const { legacyLocaleKey, staleKeys } = findLegacyKeys(keys)

	if (legacyLocaleKey && localStorage.getItem(STORAGE_KEYS.locale) === null) {
		const legacyLocale = localStorage.getItem(legacyLocaleKey)
		if (legacyLocale !== null) {
			localStorage.setItem(STORAGE_KEYS.locale, legacyLocale)
		}
	}

	for (const key of staleKeys) localStorage.removeItem(key)
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
