export type ExtractedMessage = {
  id: string
  value: string
  file: string
  context: string
  // group: string
}

export type ExtractedMessages = Record<string, ExtractedMessage>
