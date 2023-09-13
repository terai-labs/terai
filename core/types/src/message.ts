export type ExtractedMessage = {
  id: string
  value: string
  file: string
  context: string
  chunkId: string
}

export type ExtractedMessages = Record<string, ExtractedMessage>
