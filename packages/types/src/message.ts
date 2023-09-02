export type ExtractedMessage = {
  id: string
  value?: string
  file?: string
  context?: string
}

export type ExtractedMessages = Map<string, ExtractedMessage>
