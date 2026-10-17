import { toLocaleChunkIds } from './group-dictionary-by-chunk'

// Types
import type { BuildManifest, Dictionary, Locale } from '@terai/types'

type ResolveLocaleDictionaryOptions = {
	manifest: BuildManifest
	locale: Locale
	cache: Dictionary
	readChunk: (chunkId: string) => Dictionary
}

/**
 * Splits the manifest messages into the ones that already have a translation
 * for `locale` and the ones that still need one.
 *
 * Values in the locale chunk files win over the cache, so translations edited
 * by hand are kept. When a message lives in several chunks, an edited value
 * (one that differs from the cache) wins over an untouched copy.
 */
export function resolveLocaleDictionary({
	manifest,
	locale,
	cache,
	readChunk
}: ResolveLocaleDictionaryOptions) {
	const translated: Dictionary = {}
	const untranslated: Dictionary = {}

	for (const id in manifest.messages) {
		const { value, chunksIds } = manifest.messages[id]
		const chunkValues = toLocaleChunkIds(chunksIds, locale)
			.map((chunkId) => readChunk(chunkId)[id])
			.filter(Boolean)
		const localeValue =
			chunkValues.find((chunkValue) => chunkValue !== cache[id]) ??
			chunkValues[0] ??
			cache[id]

		if (localeValue) {
			translated[id] = localeValue
		} else {
			untranslated[id] = value
		}
	}

	return { translated, untranslated }
}
