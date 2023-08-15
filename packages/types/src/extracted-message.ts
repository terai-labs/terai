export interface ExtractedMessage {
  id: string
  description?: string | object
  defaultMessage?: string
  file?: string
  start?: number
  end?: number
}

export interface ExtractedMessages {
  [key: string]: ExtractedMessage
}
