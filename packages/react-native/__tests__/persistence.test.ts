import { afterEach, expect, test, vi } from 'vitest'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
	findLegacyKeys,
	loadFromStorage,
	saveToStorage
} from '../src/persistence'
import pkg from '../package.json'

const platform = vi.hoisted(() => ({ OS: 'web' }))

const storage = vi.hoisted(() => new Map<string, string>())

vi.mock('@react-native-async-storage/async-storage', () => ({
	default: {
		getAllKeys: vi.fn(async () => [...storage.keys()]),
		getItem: vi.fn(async (key: string) => storage.get(key) ?? null),
		setItem: vi.fn(async (key: string, value: string) => {
			storage.set(key, value)
		}),
		multiRemove: vi.fn(async (keys: string[]) => {
			for (const key of keys) storage.delete(key)
		})
	}
}))
vi.mock('react-native', () => ({ Platform: platform }))

afterEach(() => {
	storage.clear()
	vi.clearAllMocks()
	vi.useRealTimers()
	platform.OS = 'web'
})

test('static web rendering does not access browser storage', async () => {
	vi.useFakeTimers()
	expect(await loadFromStorage()).toBeNull()
	saveToStorage({ locale: 'en', dictionaries: {} })
	await vi.runAllTimersAsync()
	expect(AsyncStorage.getItem).not.toHaveBeenCalled()
	expect(AsyncStorage.setItem).not.toHaveBeenCalled()
})

test('native persistence still works without a browser window', async () => {
	vi.useFakeTimers()
	platform.OS = 'ios'
	await loadFromStorage()
	saveToStorage({ locale: 'en', dictionaries: {} })
	await vi.runAllTimersAsync()
	expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2)
	expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2)
})

test('saves the locale under a key that survives upgrades', async () => {
	vi.useFakeTimers()
	platform.OS = 'ios'
	saveToStorage({ locale: 'es-ES', dictionaries: {} })
	await vi.runAllTimersAsync()
	expect(storage.get('terai-locale')).toBe('"es-ES"')
})

test('moves the locale saved by an older version to the stable key', async () => {
	platform.OS = 'ios'
	storage.set('terai-locale-0.0.16', '"fr-FR"')
	storage.set('terai-locale-0.0.17', '"es-ES"')
	storage.set('terai-dictionaries-0.0.17', '{"es-ES":{}}')

	expect(await loadFromStorage()).toEqual({ locale: 'es-ES' })
	expect([...storage.keys()]).toEqual(['terai-locale'])
})

test('keeps a locale already saved under the stable key', async () => {
	platform.OS = 'ios'
	storage.set('terai-locale', '"de-DE"')
	storage.set('terai-locale-0.0.17', '"es-ES"')

	expect(await loadFromStorage()).toEqual({ locale: 'de-DE' })
	expect(storage.has('terai-locale-0.0.17')).toBe(false)
})

test('finds the newest legacy locale key and the stale keys', () => {
	const current = `terai-dictionaries-${pkg.version}`

	expect(
		findLegacyKeys([
			'terai-locale-0.0.9',
			'terai-locale-0.0.17',
			'terai-locale-0.0.0-dev-20261017133302',
			'terai-dictionaries-0.0.16',
			current,
			'terai-locale',
			'other-app-key'
		])
	).toEqual({
		legacyLocaleKey: 'terai-locale-0.0.17',
		staleKeys: [
			'terai-locale-0.0.9',
			'terai-locale-0.0.17',
			'terai-locale-0.0.0-dev-20261017133302',
			'terai-dictionaries-0.0.16'
		]
	})
})
