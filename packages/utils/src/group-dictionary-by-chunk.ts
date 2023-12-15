import type {
  Dictionary,
  BuildManifest,
  Locale,
  Dictionaries
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
    const { chunksIds } = messages[id]

    for (let chunkId of chunksIds) {
      if (chunkId === 'default') chunkId = locale
      const chunk = dictionaries[chunkId] ?? {}

      dictionaries[chunkId] = {
        ...chunk,
        [id]: dictionary[id]
      }
    }
  }

  return dictionaries
}
