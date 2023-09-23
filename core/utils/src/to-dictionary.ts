import type { ExtractedMessages, Dictionary } from '@rewordlabs/types'

export function toDictionary(extractedMessages: ExtractedMessages): Dictionary {
  const dictionary: Dictionary = {}

  for (const id in extractedMessages) {
    const { value, chunkId } = extractedMessages[id]

    if (chunkId) {
      if (dictionary[chunkId]) {
        dictionary[chunkId] = {
          ...(dictionary[chunkId] as Record<string, string>),
          [id]: value
        }
      } else {
        dictionary[chunkId] = {
          [id]: value
        }
      }
    } else {
      dictionary[id] = value
    }
  }

  return dictionary
}
