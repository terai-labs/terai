export type MessageId = string
export type MessageValue = string
export type MessageVars = string | number | boolean | null | undefined | Date
export type Messages = Record<string, string>
export type ImportedMessages = Record<
  string,
  () => Promise<{ default: Messages }>
>
export type ExtractedMessage = {
  id: MessageId
  value?: string
  file?: string
}
export type ExtractedMessages = Map<MessageId, ExtractedMessage>
