import type { ExtractedMessages, Dictionary } from '@rosetta.js/types'

export function toPlainMessages(extractedMessages: ExtractedMessages) {
  const messages: Dictionary = {}

  extractedMessages.forEach((msg, id) => {
    messages[id] = msg.value || ''
  })

  return messages
}
