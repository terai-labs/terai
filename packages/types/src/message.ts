export type MessageId = string
export type MessageValue = string
export type MessageVariables = string | number | boolean | null | undefined | Date

export type ExtractedMessage = {
  id: MessageId
  value?: string
  file?: string
}
export type ExtractedMessages = Map<MessageId, ExtractedMessage>
