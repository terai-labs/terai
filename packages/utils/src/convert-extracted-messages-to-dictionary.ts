import type { ExtractedMessages, Dictionary } from '@terai/types'

export function convertExtractedMessagesToDictionary(
  extractedMessages: ExtractedMessages
): Dictionary {
  const dictionary: Dictionary = {}

  for (const id in extractedMessages) {
    const { value } = extractedMessages[id]
    dictionary[id] = value
  }

  return dictionary
}
