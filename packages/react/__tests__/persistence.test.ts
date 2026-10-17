import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { loadFromStorage, saveToStorage } from '../src/persistence'
import pkg from '../package.json'

const storage = new Map<string, string>()

beforeEach(() => {
	vi.stubGlobal('window', {})
	vi.stubGlobal('localStorage', {
		get length() {
			return storage.size
		},
		key: (index: number) => [...storage.keys()][index] ?? null,
		getItem: (key: string) => storage.get(key) ?? null,
		setItem: (key: string, value: string) => void storage.set(key, value),
		removeItem: (key: string) => void storage.delete(key)
	})
})

afterEach(() => {
	storage.clear()
	vi.unstubAllGlobals()
	vi.useRealTimers()
})

test('saves the locale under a key that survives upgrades', async () => {
	vi.useFakeTimers()
	saveToStorage({ locale: 'es-ES', dictionaries: {} })
	await vi.runAllTimersAsync()

	expect(storage.get('terai-locale')).toBe('"es-ES"')
	expect(storage.has(`terai-dictionaries-${pkg.version}`)).toBe(true)
})

test('moves the locale saved by an older version to the stable key', () => {
	storage.set('terai-locale-0.0.16', '"fr-FR"')
	storage.set('terai-locale-0.0.17', '"es-ES"')
	storage.set('terai-dictionaries-0.0.17', '{"es-ES":{}}')
	storage.set('other-app-key', 'keep')

	expect(loadFromStorage()).toEqual({ locale: 'es-ES' })
	expect([...storage.keys()].sort()).toEqual(['other-app-key', 'terai-locale'])
})

test('keeps a locale already saved under the stable key', () => {
	storage.set('terai-locale', '"de-DE"')
	storage.set('terai-locale-0.0.17', '"es-ES"')

	expect(loadFromStorage()).toEqual({ locale: 'de-DE' })
	expect(storage.has('terai-locale-0.0.17')).toBe(false)
})

test('keeps the dictionaries cached by this version', () => {
	const key = `terai-dictionaries-${pkg.version}`
	storage.set(key, '{"es-ES":{"a":"b"}}')

	expect(loadFromStorage()).toEqual({ dictionaries: { 'es-ES': { a: 'b' } } })
	expect(storage.has(key)).toBe(true)
})
