import type { ExtractedMessages, Dictionary } from '@koi18n/types'

export function toDictionary(extractedMessages: ExtractedMessages): Dictionary {
  const dictionary: Dictionary = {}

  for (const id in extractedMessages) {
    const { value } = extractedMessages[id]
    dictionary[id] = value
  }

  return dictionary
}
