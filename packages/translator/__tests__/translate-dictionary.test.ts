import { describe, expect, test, vi } from 'vitest'
import { translateDictionary } from '../src'
import type { Translator } from '@terai/types'

const dictionary = { a: 'One', b: 'Two', c: 'Three', d: 'Four', e: 'Five' }

describe('translateDictionary', () => {
	test('sends everything in one call by default', async () => {
		const translator = vi.fn<Translator>(async ({ dictionary }) =>
			Object.fromEntries(
				Object.entries(dictionary).map(([id, value]) => [id, `t:${value}`])
			)
		)

		const result = await translateDictionary({
			dictionary,
			translator,
			projectLocale: 'en',
			locale: 'es'
		})

		expect(translator).toHaveBeenCalledTimes(1)
		expect(result).toEqual({
			dictionary: {
				a: 't:One',
				b: 't:Two',
				c: 't:Three',
				d: 't:Four',
				e: 't:Five'
			},
			missing: [],
			failed: [],
			errors: []
		})
	})

	test('keeps successful batches when another batch fails', async () => {
		const error = new Error('quota exceeded')
		const translator: Translator = async ({ dictionary }) => {
			if ('c' in dictionary) throw error
			return Object.fromEntries(
				Object.entries(dictionary).map(([id, value]) => [id, `t:${value}`])
			)
		}

		const result = await translateDictionary({
			dictionary,
			translator,
			batchSize: 2,
			projectLocale: 'en',
			locale: 'es'
		})

		expect(result).toEqual({
			dictionary: { a: 't:One', b: 't:Two', e: 't:Five' },
			missing: [],
			failed: ['c', 'd'],
			errors: [error]
		})
	})

	test('drops unrequested, empty and missing keys', async () => {
		const translator: Translator = async () => ({
			a: 'Uno',
			b: '  ',
			x: 'Invented'
		})

		const result = await translateDictionary({
			dictionary: { a: 'One', b: 'Two', c: 'Three' },
			translator,
			projectLocale: 'en',
			locale: 'es'
		})

		expect(result.dictionary).toEqual({ a: 'Uno' })
		expect(result.missing).toEqual(['b', 'c'])
	})
})
