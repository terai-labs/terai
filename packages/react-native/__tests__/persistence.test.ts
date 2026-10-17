import { afterEach, expect, test, vi } from 'vitest'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadFromStorage, saveToStorage } from '../src/persistence'

const platform = vi.hoisted(() => ({ OS: 'web' }))

vi.mock('@react-native-async-storage/async-storage', () => ({
	default: {
		getItem: vi.fn().mockResolvedValue(null),
		setItem: vi.fn().mockResolvedValue(undefined)
	}
}))
vi.mock('react-native', () => ({ Platform: platform }))

afterEach(() => {
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
