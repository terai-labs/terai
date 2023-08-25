import type { ExtractedMessages, Dictionary } from '@rosetta.js/types'

export function toPlainDictionary(
  extractedMessages: ExtractedMessages
): Dictionary {
  const dictionary: Dictionary = {}

  extractedMessages.forEach((msg, id) => {
    dictionary[id] = msg.value || ''
  })

  return dictionary
}
