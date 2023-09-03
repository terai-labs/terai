import type { ExtractedMessages, Dictionary } from '@rosetta.js/types'

export function toPlainDictionary(
  extractedMessages: ExtractedMessages
): Dictionary {
  const dictionary: Dictionary = {}

  for (const id in extractedMessages) {
    dictionary[id] = extractedMessages[id].value || ''
  }

  return dictionary
}
