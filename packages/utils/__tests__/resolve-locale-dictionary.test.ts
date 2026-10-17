import { describe, expect, test } from 'vitest'
import { resolveLocaleDictionary } from '../src'
import type { BuildManifest, Dictionary } from '@terai/types'

const message = (id: string, chunksIds: string[]) => ({
	id,
	value: `source ${id}`,
	files: [],
	context: '',
	chunksIds
})

const manifest: BuildManifest = {
	messages: {
		inDefault: message('inDefault', ['default']),
		inBoth: message('inBoth', ['default', 'metrics', 'metrics']),
		fresh: message('fresh', ['metrics'])
	}
}

const readFrom = (files: Record<string, Dictionary>) => (chunkId: string) =>
	files[chunkId] ?? {}

describe('resolveLocaleDictionary', () => {
	test('reads the default chunk from the <locale>.json file', () => {
		const result = resolveLocaleDictionary({
			manifest,
			locale: 'es',
			cache: { inDefault: 'cached', inBoth: 'cached' },
			readChunk: readFrom({ es: { inDefault: 'edited by hand' } })
		})

		expect(result.translated.inDefault).toBe('edited by hand')
	})

	test('prefers an edited copy over an untouched one', () => {
		const result = resolveLocaleDictionary({
			manifest,
			locale: 'es',
			cache: { inBoth: 'cached' },
			readChunk: readFrom({
				es: { inBoth: 'cached' },
				metrics: { inBoth: 'edited' }
			})
		})

		expect(result.translated.inBoth).toBe('edited')
	})

	test('falls back to the cache and lists each untranslated message once', () => {
		const result = resolveLocaleDictionary({
			manifest,
			locale: 'es',
			cache: { inDefault: 'cached default', inBoth: 'cached both' },
			readChunk: readFrom({})
		})

		expect(result).toEqual({
			translated: { inDefault: 'cached default', inBoth: 'cached both' },
			untranslated: { fresh: 'source fresh' }
		})
	})
})
