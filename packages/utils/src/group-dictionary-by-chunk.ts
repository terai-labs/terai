import type {
	BuildManifest,
	Dictionaries,
	Dictionary,
	DictionaryId,
	Locale
} from '@terai/types'

export function groupDictionaryByChunks(
	dictionary: Dictionary,
	manifest: BuildManifest,
	locale: Locale
) {
	const { messages } = manifest
	const dictionaries: Dictionaries = {
		[locale]: {}
	}

	for (const id in messages) {
		const value = dictionary[id]
		// Untranslated messages are left out so the runtime falls back to the
		// project locale and the next translate picks them up again.
		if (value === undefined) continue

		for (const chunkId of toLocaleChunkIds(messages[id].chunksIds, locale)) {
			const chunk = dictionaries[chunkId as DictionaryId] ?? {}
			chunk[id] = value
			dictionaries[chunkId as DictionaryId] = chunk
		}
	}

	return dictionaries
}

/**
 * Maps a message's manifest chunk ids to the files it lives in for `locale`:
 * the `default` chunk is the `<locale>.json` file, and duplicates are removed.
 */
export function toLocaleChunkIds(chunksIds: string[], locale: Locale) {
	if (!chunksIds.length) return [locale]

	return [
		...new Set(
			chunksIds.map((chunkId) => (chunkId === 'default' ? locale : chunkId))
		)
	]
}
