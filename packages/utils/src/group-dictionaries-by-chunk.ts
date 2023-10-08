import type {
  Dictionary,
  BuildManifest,
  Locale,
  Dictionaries
} from '@koi18n/types'

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
    const { chunksIds } = messages[id]
    const chnks = chunksIds.length ? chunksIds : [locale]

    for (const chunkId of chnks) {
      const chunk = dictionaries[chunkId] ?? {}

      dictionaries[chunkId] = {
        ...chunk,
        [id]: dictionary[id]
      }
    }
  }

  return dictionaries
}
