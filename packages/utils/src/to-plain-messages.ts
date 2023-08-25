import type { ExtractedMessages, Messages } from '@rosetta.js/types'

export function toPlainMessages(extractedMessages: ExtractedMessages) {
  const messages: Messages = {}

  extractedMessages.forEach((msg, id) => {
    messages[id] = msg.value || ''
  })

  return messages
}
